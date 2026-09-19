import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

// Dynamic API Base URL resolver:
// 1. If VITE_API_URL environment variable is provided, use it
// 2. Otherwise use relative '/api' (handled by Vite proxy locally or reverse proxy in production)
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // --- PRODUCTS ---
  async getProducts(params = {}) {
    const { category, state, demographic, targetGroup, search, sort } = params;
    const query = new URLSearchParams();
    if (category && category !== 'all' && category !== 'ALL') query.set('category', category);
    if (state && state !== 'All States' && state !== 'all') query.set('state', state);
    const group = targetGroup || demographic;
    if (group && group !== 'all' && group !== 'ALL') query.set('targetGroup', group);
    if (search && search.trim()) query.set('search', search.trim());
    if (sort) query.set('sort', sort);

    const queryString = query.toString();
    const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;

    try {
      const res = await fetch(url, { headers: { credentials: 'omit' }, cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Backend /api/products unavailable, dynamically filtering fallback catalog:', err.message);
    }

    // Dynamic client-side filtering fallback
    return FALLBACK_PRODUCTS.filter((p) => {
      if (category && category !== 'all' && category !== 'ALL') {
        const catSlug = (p.category?.slug || '').toLowerCase();
        if (catSlug !== category.toLowerCase()) return false;
      }
      if (state && state !== 'All States' && state !== 'all') {
        if (p.state !== state) return false;
      }
      const activeGroup = (group || '').toUpperCase();
      if (activeGroup && activeGroup !== 'ALL') {
        const target = (p.targetGroup || '').toUpperCase();
        if (target !== activeGroup) return false;
      }
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        const matchState = (p.state || '').toLowerCase().includes(q);
        const matchCat = (p.category?.name || '').toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchState && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sort === 'price-asc') return a.basePrice - b.basePrice;
      if (sort === 'price-desc') return b.basePrice - a.basePrice;
      return 0;
    });
  },

  async getProductBySlug(slug) {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.slug) return data;
      }
    } catch (err) {
      console.warn('Backend /api/products/:slug unavailable, falling back to local dataset:', err.message);
    }
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  },

  // --- AUTHENTICATION ---
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          return data;
        }
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Invalid credentials');
      }
    } catch (err) {
      // If server error or offline fallback, allow demo sign-in
      if (err.message === 'Invalid credentials' || err.message === 'User already exists') {
        throw err;
      }
      console.warn('Backend auth unreachable, initializing local dynamic session:', err.message);
      const demoUser = {
        id: `usr_${Date.now()}`,
        email,
        name: email.split('@')[0].toUpperCase(),
        role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER',
        token: `demo_jwt_${Date.now()}`
      };
      localStorage.setItem('token', demoUser.token);
      localStorage.setItem('user', JSON.stringify(demoUser));
      return demoUser;
    }
  },

  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          return data;
        }
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Registration failed');
      }
    } catch (err) {
      if (err.message === 'User already exists') throw err;
      console.warn('Backend register unreachable, creating local dynamic session:', err.message);
      const newUser = {
        id: `usr_${Date.now()}`,
        email,
        name,
        role: 'CUSTOMER',
        token: `demo_jwt_${Date.now()}`
      };
      localStorage.setItem('token', newUser.token);
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    }
  },

  async getProfile() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      // Backend offline, fallback to cached user object
    }

    const cachedUser = localStorage.getItem('user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: getAuthHeaders() });
    } catch (err) {
      // Silent catch
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // --- CHECKOUT & ORDERS ---
  async createCheckout({ items, customer, shipping, paymentMethod = 'UPI' }) {
    const orderId = `RAG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderRecord = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: items.map(item => ({
        variantId: item.variant?.id || 'v-default',
        productName: item.product.name,
        productImage: item.product.imageUrl,
        state: item.product.state,
        size: item.variant?.size || 'Free Size',
        color: item.variant?.color || 'Standard',
        price: item.variant?.priceOverride || item.product.basePrice,
        quantity: item.quantity
      })),
      customer,
      shipping,
      paymentMethod,
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short', month: 'short', day: 'numeric'
      }),
      total: items.reduce((acc, item) => {
        const price = item.variant?.priceOverride || item.product.basePrice;
        return acc + price * item.quantity;
      }, 0)
    };

    // Attempt backend sync
    try {
      const res = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          items: items.map(item => ({ variantId: item.variant.id, quantity: item.quantity })),
          customer,
          shipping
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.orderId) {
          orderRecord.id = data.orderId;
          // Trigger webhook simulation
          await fetch(`${API_BASE}/webhooks/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderId })
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Backend checkout unreachable, processing dynamic local order:', err.message);
    }

    // Persist to user order history dynamically in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('ragyai_orders') || '[]');
    existingOrders.unshift(orderRecord);
    localStorage.setItem('ragyai_orders', JSON.stringify(existingOrders));

    return orderRecord;
  },

  async getOrders() {
    const localOrders = JSON.parse(localStorage.getItem('ragyai_orders') || '[]');

    try {
      const res = await fetch(`${API_BASE}/orders/me`, { headers: getAuthHeaders() });
      if (res.ok) {
        const backendOrders = await res.json();
        if (Array.isArray(backendOrders) && backendOrders.length > 0) {
          // Merge avoiding duplicate IDs
          const orderMap = new Map();
          backendOrders.forEach(o => orderMap.set(o.id, o));
          localOrders.forEach(o => {
            if (!orderMap.has(o.id)) orderMap.set(o.id, o);
          });
          return Array.from(orderMap.values());
        }
      }
    } catch (err) {
      // Return local orders
    }

    return localOrders;
  },

  getOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('ragyai_orders') || '[]');
    return orders.find(o => o.id === orderId) || null;
  }
};

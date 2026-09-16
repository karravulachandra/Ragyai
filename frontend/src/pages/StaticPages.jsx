import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const ShopAll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3001/api/products', { cache: 'no-store' });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container" style={{padding: '6rem 0'}}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem', textAlign: 'center'}}>Shop All</h1>
      <p style={{color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem'}}>Browse our entire catalog of premium essentials.</p>
      
      {loading ? (
        <div className="loading">Loading catalog...</div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => {
            const hasInventory = product.variants?.some(v => v.inventory > 0) ?? true;
            return (
              <div key={product.id} className="product-card" style={{animationDelay: `${0.1 * index}s`}}>
                <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
                  <div className="product-image-placeholder" style={{ overflow: 'hidden', padding: 0, border: 'none', position: 'relative' }}>
                    <img 
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=500&q=80'}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: hasInventory ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                      {hasInventory ? 'Available' : 'Sold Out'}
                    </div>
                  </div>
                  <div className="product-category">{product.category?.name}</div>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">₹{product.basePrice.toFixed(2)}</div>
                </Link>
                <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <button className="btn">View Details</button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MensShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3001/api/products', { cache: 'no-store' });
        const data = await res.json();
        // Filter men's items
        const mensItems = data.filter(p => 
          p.name.toLowerCase().includes('sherwani') || 
          p.name.toLowerCase().includes('dhoti') ||
          p.name.toLowerCase().includes('jodhpuri')
        );
        setProducts(mensItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container" style={{padding: '6rem 0'}}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem', textAlign: 'center'}}>Men's Collection</h1>
      <p style={{color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem'}}>Traditional and formal menswear for every occasion.</p>
      
      {loading ? (
        <div className="loading">Loading catalog...</div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => {
            const hasInventory = product.variants?.some(v => v.inventory > 0) ?? true;
            return (
              <div key={product.id} className="product-card" style={{animationDelay: `${0.1 * index}s`}}>
                <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
                  <div className="product-image-placeholder" style={{ overflow: 'hidden', padding: 0, border: 'none', position: 'relative' }}>
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: hasInventory ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                      {hasInventory ? 'Available' : 'Sold Out'}
                    </div>
                  </div>
                  <div className="product-category">{product.category?.name}</div>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">₹{product.basePrice.toFixed(2)}</div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const KidsShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3001/api/products', { cache: 'no-store' });
        const data = await res.json();
        const kidsItems = data.filter(p => 
          p.category?.slug === 'kids-wear' || 
          p.name.toLowerCase().includes('kids') ||
          p.name.toLowerCase().includes('princess')
        );
        setProducts(kidsItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container" style={{padding: '6rem 0'}}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem', textAlign: 'center'}}>Kids Collection</h1>
      <p style={{color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem'}}>Cute, vibrant, and comfortable ethnic wear for children.</p>
      
      {loading ? (
        <div className="loading">Loading catalog...</div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => {
            const hasInventory = product.variants?.some(v => v.inventory > 0) ?? true;
            return (
              <div key={product.id} className="product-card" style={{animationDelay: `${0.1 * index}s`}}>
                <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
                  <div className="product-image-placeholder" style={{ overflow: 'hidden', padding: 0, border: 'none', position: 'relative' }}>
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: hasInventory ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                      {hasInventory ? 'Available' : 'Sold Out'}
                    </div>
                  </div>
                  <div className="product-category">{product.category?.name}</div>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">₹{product.basePrice.toFixed(2)}</div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SeniorsShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3001/api/products', { cache: 'no-store' });
        const data = await res.json();
        const seniorItems = data.filter(p => 
          p.category?.slug === 'senior-collection' || 
          p.name.toLowerCase().includes('senior') ||
          p.name.toLowerCase().includes('comfort') ||
          p.name.toLowerCase().includes('elders')
        );
        setProducts(seniorItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container" style={{padding: '6rem 0'}}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem', textAlign: 'center'}}>Senior Comfort Collection</h1>
      <p style={{color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4rem'}}>Soft fabrics, relaxed fits, and maximum warmth & comfort for elders.</p>
      
      {loading ? (
        <div className="loading">Loading catalog...</div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => {
            const hasInventory = product.variants?.some(v => v.inventory > 0) ?? true;
            return (
              <div key={product.id} className="product-card" style={{animationDelay: `${0.1 * index}s`}}>
                <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
                  <div className="product-image-placeholder" style={{ overflow: 'hidden', padding: 0, border: 'none', position: 'relative' }}>
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: hasInventory ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                      {hasInventory ? 'Available' : 'Sold Out'}
                    </div>
                  </div>
                  <div className="product-category">{product.category?.name}</div>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">₹{product.basePrice.toFixed(2)}</div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3001/api/products', { cache: 'no-store' });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mens') return p.name.toLowerCase().includes('sherwani') || p.name.toLowerCase().includes('dhoti') || p.name.toLowerCase().includes('jodhpuri');
    if (activeTab === 'kids') return p.category?.slug === 'kids-wear' || p.name.toLowerCase().includes('kids') || p.name.toLowerCase().includes('princess');
    if (activeTab === 'seniors') return p.category?.slug === 'senior-collection' || p.name.toLowerCase().includes('senior') || p.name.toLowerCase().includes('comfort') || p.name.toLowerCase().includes('elders');
    if (activeTab === 'western') return p.category?.slug === 'western-wear' || p.category?.name === 'Western Wear';
    return true;
  });

  return (
    <div className="container" style={{padding: '6rem 0'}}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem', textAlign: 'center'}}>Featured Collections</h1>
      <p style={{color: 'var(--text-muted)', textAlign: 'center', marginBottom: '3rem'}}>Curated outfits for Men, Kids, Elders, and Modern Wear.</p>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Collections' },
          { id: 'mens', label: "Men's Wear" },
          { id: 'kids', label: "Kids Wear" },
          { id: 'seniors', label: "Old Age / Seniors" },
          { id: 'western', label: "Western Wear" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '100px',
              border: '1px solid var(--card-border)',
              background: activeTab === tab.id ? 'var(--accent)' : 'var(--card-bg)',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="loading">Loading collections...</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product, index) => {
            const hasInventory = product.variants?.some(v => v.inventory > 0) ?? true;
            return (
              <div key={product.id} className="product-card" style={{animationDelay: `${0.1 * index}s`}}>
                <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
                  <div className="product-image-placeholder" style={{ overflow: 'hidden', padding: 0, border: 'none', position: 'relative' }}>
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: hasInventory ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                      {hasInventory ? 'Available' : 'Sold Out'}
                    </div>
                  </div>
                  <div className="product-category">{product.category?.name}</div>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">₹{product.basePrice.toFixed(2)}</div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const About = () => (
  <div className="container" style={{padding: '6rem 0', maxWidth: '800px'}}>
    <h1 style={{fontSize: '3.5rem', marginBottom: '2rem'}}>Our Story</h1>
    <div style={{fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      <p>Born from a desire to bridge the gap between high-end fashion and everyday comfort, we set out to create the perfect oversized silhouette.</p>
      <p>Every piece is crafted with 100% organic, heavyweight cotton sourced ethically from certified farms. Our manufacturing process ensures zero shrinkage and maximum durability.</p>
      <p>We don't believe in fast fashion. We believe in building a wardrobe of essentials that last a lifetime.</p>
    </div>
  </div>
);

export const SizeGuide = () => (
  <div className="container" style={{padding: '6rem 0', maxWidth: '800px'}}>
    <h1 style={{fontSize: '3rem', marginBottom: '2rem'}}>Size Guide</h1>
    <p style={{color: 'var(--text-muted)', marginBottom: '3rem'}}>Our garments are designed for an oversized, drop-shoulder fit. We recommend ordering your true size for the intended look.</p>
    <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
      <thead>
        <tr style={{borderBottom: '1px solid var(--card-border)'}}>
          <th style={{padding: '1rem 0'}}>Size</th>
          <th style={{padding: '1rem 0'}}>Chest (in)</th>
          <th style={{padding: '1rem 0'}}>Length (in)</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{borderBottom: '1px solid var(--card-border)'}}>
          <td style={{padding: '1rem 0'}}>S</td>
          <td>42 - 44</td>
          <td>28</td>
        </tr>
        <tr style={{borderBottom: '1px solid var(--card-border)'}}>
          <td style={{padding: '1rem 0'}}>M</td>
          <td>44 - 46</td>
          <td>29</td>
        </tr>
        <tr style={{borderBottom: '1px solid var(--card-border)'}}>
          <td style={{padding: '1rem 0'}}>L</td>
          <td>46 - 48</td>
          <td>30</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const Contact = () => (
  <div className="container" style={{padding: '6rem 0', textAlign: 'center'}}>
    <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>Help Center</h1>
    <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>We're here to help. Reach out to our support team.</p>
    <a href="mailto:support@ragyai.com" className="btn" style={{padding: '1rem 2rem', width: 'auto'}}>Email Support</a>
  </div>
);

export const ReturnPolicy = () => (
  <div className="container" style={{padding: '6rem 0', maxWidth: '800px'}}>
    <h1 style={{fontSize: '3rem', marginBottom: '2rem'}}>Returns & Refunds</h1>
    <p style={{color: 'var(--text-secondary)', lineHeight: '1.8'}}>We offer a 14-day hassle-free return policy. If you are not completely satisfied with your purchase, you may return the item in its original condition for a full refund.</p>
  </div>
);

export const OrderConfirmation = () => (
  <div className="container" style={{padding: '8rem 0', textAlign: 'center'}}>
    <h1 style={{fontSize: '3.5rem', marginBottom: '1rem'}}>Thank You!</h1>
    <p style={{color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem'}}>Your order has been confirmed and is being processed.</p>
    <Link to="/" className="btn" style={{padding: '1rem 2rem', width: 'auto'}}>Continue Shopping</Link>
  </div>
);

export const Dashboard = () => (
  <div className="container" style={{padding: '6rem 0'}}>
    <h1 style={{fontSize: '3rem', marginBottom: '2rem'}}>My Account</h1>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3rem'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <span style={{color: 'var(--accent)', fontWeight: 600}}>Order History</span>
        <span style={{color: 'var(--text-muted)'}}>Profile Settings</span>
        <span style={{color: 'var(--text-muted)'}}>Addresses</span>
      </div>
      <div>
        <h2 style={{marginBottom: '1.5rem'}}>Recent Orders</h2>
        <div style={{padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)'}}>
          No recent orders found.
        </div>
      </div>
    </div>
  </div>
);

export const Wishlist = () => (
  <div className="container" style={{padding: '6rem 0', textAlign: 'center'}}>
    <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>Wishlist</h1>
    <p style={{color: 'var(--text-muted)'}}>Save your favorite pieces for later.</p>
    <div style={{padding: '4rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', marginTop: '2rem'}}>
      Your wishlist is currently empty.
    </div>
  </div>
);

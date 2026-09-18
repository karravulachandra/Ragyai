import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Checkout() {
  const { cart, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = cartTotal >= 1999 || cartTotal === 0 ? 0 : 150;
  const finalTotal = cartTotal + shipping;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3001/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ variantId: item.variant.id, quantity: item.quantity })),
          customer: { name: formData.name, email: formData.email, phone: formData.phone },
          shipping: { 
            street: formData.street, city: formData.city, 
            state: formData.state, zip: formData.zip, country: formData.country 
          }
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        await fetch('http://localhost:3001/api/webhooks/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderId })
        });
      }
      
      localStorage.removeItem('cart');
      navigate('/order-confirmation');
      
    } catch (err) {
      // Standalone/static demo fallback
      localStorage.removeItem('cart');
      navigate('/order-confirmation');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#18181b', marginBottom: '1rem' }}>Your shopping bag is empty</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">
          Explore Traditional Wear
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '2rem', color: '#18181b' }}>
        Secure Express Checkout
      </h1>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        <div>
          <form onSubmit={handleSubmit} id="checkout-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Contact Info */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#18181b' }}>
                1. Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input required name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle} />
                <input required name="email" type="email" placeholder="Email Address" onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <input required name="phone" type="tel" placeholder="Mobile Number (for delivery updates)" onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            
            {/* Shipping Address */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#18181b' }}>
                2. Shipping Address
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input required name="street" placeholder="House / Flat No., Street, Landmark" onChange={handleChange} style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                  <input required name="city" placeholder="City" onChange={handleChange} style={inputStyle} />
                  <input required name="state" placeholder="State" onChange={handleChange} style={inputStyle} />
                  <input required name="zip" placeholder="PIN Code" onChange={handleChange} style={inputStyle} />
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Summary Card */}
        <div style={{ position: 'sticky', top: '6rem' }}>
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: '#18181b', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              Order Review
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {cart.map(item => (
                <div key={item.variant.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4b5563' }}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600, color: '#18181b' }}>
                    ₹{((item.variant.priceOverride || item.product.basePrice) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#4b5563' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#18181b' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#4b5563' }}>
                <span>Pan-India Delivery</span>
                <span>{shipping === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shipping}`}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#18181b' }}>Total to Pay</span>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#18181b' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Processing Order...' : 'Complete Payment (Demo UPI / Card) →'}
            </button>

            <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#6b7280', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>256-Bit SSL Encrypted. Certified Artisan Weaves.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem 1rem',
  background: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  color: '#18181b',
  fontSize: '0.92rem',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box'
};

export default Checkout;

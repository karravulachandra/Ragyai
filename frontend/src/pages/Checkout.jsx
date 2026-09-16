import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Checkout() {
  const { cart, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 0 ? 10.00 : 0;
  const finalTotal = cartTotal + tax + shipping;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 1. Call Backend Checkout API
      const res = await fetch('http://localhost:3001/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ variantId: item.variant.id, quantity: item.quantity })),
          customer: { name: formData.name, email: formData.email },
          shipping: { 
            street: formData.street, city: formData.city, 
            state: formData.state, zip: formData.zip, country: formData.country 
          }
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      
      // 2. Simulate Payment Completion (Demo Webhook call)
      const webhookRes = await fetch('http://localhost:3001/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderId })
      });
      
      if (!webhookRes.ok) throw new Error('Payment verification failed');
      
      // Clear Cart
      localStorage.removeItem('cart');
      
      alert(`Order successful! Transaction complete.`);
      window.location.href = '/'; 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div style={{textAlign: 'center', padding: '4rem'}}>Your cart is empty.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginTop: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Secure Checkout</h2>
        
        {error && <div style={{ padding: '1rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #f87171', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} id="checkout-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input required name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle} />
              <input required name="email" type="email" placeholder="Email Address" onChange={handleChange} style={inputStyle} />
            </div>
          </div>
          
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Shipping Address</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required name="street" placeholder="Street Address" onChange={handleChange} style={inputStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <input required name="city" placeholder="City" onChange={handleChange} style={inputStyle} />
                <input required name="state" placeholder="State" onChange={handleChange} style={inputStyle} />
                <input required name="zip" placeholder="ZIP Code" onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div>
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)', position: 'sticky', top: '2rem' }}>
           <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Summary</h3>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 700, fontSize: '1.25rem' }}>
             <span>Total to Pay</span>
             <span>₹{finalTotal.toFixed(2)}</span>
           </div>
           
           <button 
             type="submit" 
             form="checkout-form" 
             className="btn" 
             disabled={loading}
             style={{ padding: '1rem', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}
           >
             {loading ? 'Processing...' : 'Complete Payment (Demo)'}
           </button>
           <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
             This is a secure checkout. Payment processed via abstraction layer.
           </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '1rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  color: 'white',
  fontFamily: 'var(--font-family)',
  fontSize: '1rem',
  width: '100%',
  outline: 'none'
};

export default Checkout;

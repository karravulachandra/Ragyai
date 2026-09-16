import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 0 ? 10.00 : 0;
  const finalTotal = cartTotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/">
          <button className="btn" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Start Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginTop: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.map((item) => (
            <div key={item.variant.id} style={{ display: 'flex', gap: '1.5rem', background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                {item.product.category?.slug === 't-shirts' ? '👕' : '🧥'}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{item.product.name}</h3>
                  <div style={{ fontWeight: 600 }}>₹{((item.variant.priceOverride || item.product.basePrice) * item.quantity).toFixed(2)}</div>
                </div>
                
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {item.variant.size && `Size: ${item.variant.size}`} 
                  {item.variant.size && item.variant.color && ' | '}
                  {item.variant.color && `Color: ${item.variant.color}`}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
                    <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} style={{ padding: '0.25rem 0.75rem', background: 'transparent', color: 'white' }}>-</button>
                    <div style={{ padding: '0.25rem 0.75rem', fontWeight: 600 }}>{item.quantity}</div>
                    <button onClick={() => updateQuantity(item.variant.id, Math.min(item.variant.inventory, item.quantity + 1))} style={{ padding: '0.25rem 0.75rem', background: 'transparent', color: 'white' }}>+</button>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.variant.id)} style={{ background: 'transparent', color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline' }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)', position: 'sticky', top: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span style={{ color: 'var(--text-color)' }}>₹{cartTotal.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <span>Shipping</span>
            <span style={{ color: 'var(--text-color)' }}>₹{shipping.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem' }}>
            <span>Estimated Tax</span>
            <span style={{ color: 'var(--text-color)' }}>₹{tax.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 700, fontSize: '1.25rem' }}>
            <span>Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
          
          <Link to="/checkout" style={{ display: 'block' }}>
            <button className="btn" style={{ padding: '1rem', fontSize: '1.1rem' }}>Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;

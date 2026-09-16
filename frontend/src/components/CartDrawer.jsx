import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="close-btn">&times;</button>
        </div>
        
        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)'}}>
              Your cart is empty.
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {cart.map(item => (
                <div key={item.variant.id} className="cart-item-row">
                  <div className="cart-item-img" style={{overflow: 'hidden', padding: 0}}>
                    <img 
                      src={item.product.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=150&q=80'}
                      alt={item.product.name}
                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600, fontSize: '1.1rem'}}>{item.product.name}</div>
                    <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      {item.variant.size} | {item.variant.color}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variant.id, Math.min(item.variant.inventory, item.quantity + 1))}>+</button>
                      </div>
                      <div style={{fontWeight: 700}}>₹{((item.variant.priceOverride || item.product.basePrice) * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.variant.id)}
                    style={{background:'transparent', color:'var(--text-muted)', fontSize:'1.5rem', alignSelf:'flex-start'}}
                  >&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer">
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 700, fontSize: '1.2rem'}}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center'}}>
              Taxes and shipping calculated at checkout.
            </p>
            <button className="btn btn-primary" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;

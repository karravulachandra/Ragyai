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

  const handleViewFullCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  const freeShippingThreshold = 1999;
  const progressToFreeShipping = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-drawer">
        {/* Mobile Drag Pill */}
        <div className="cart-drag-handle"></div>
        
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h2 style={{ color: '#18181b', fontSize: '1.25rem', fontWeight: 700 }}>Your Bag</h2>
            <span style={{ 
              fontSize: '0.78rem', 
              color: '#18181b', 
              background: '#f4f4f5', 
              padding: '0.2rem 0.65rem', 
              borderRadius: '100px', 
              fontWeight: 600,
              border: '1px solid #e4e4e7'
            }}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="close-btn" aria-label="Close Cart">&times;</button>
        </div>

        {/* Free Shipping Progress Indicator (Tones Fashion standard) */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '0.85rem 1.5rem', 
          borderBottom: '1px solid var(--color-border)',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: 600 }}>
            <span>
              {cartTotal >= freeShippingThreshold ? (
                <span style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  You unlocked Free Express Pan-India Delivery!
                </span>
              ) : (
                <span>Add <strong>₹{remainingForFree.toLocaleString('en-IN')}</strong> more for Free Shipping</span>
              )}
            </span>
            <span style={{ color: '#ff9933', fontWeight: 700 }}>{progressToFreeShipping.toFixed(0)}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${progressToFreeShipping}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #ff9933, #16a34a)', 
              transition: 'width 0.3s ease' 
            }}></div>
          </div>
        </div>
        
        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#6b7280' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                margin: '0 auto 1.25rem', 
                background: '#f4f4f5', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#71717a'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h3 style={{ fontWeight: 700, color: '#18181b', fontSize: '1.2rem', marginBottom: '0.35rem' }}>
                Your shopping bag is empty
              </h3>
              <p style={{ fontSize: '0.88rem', maxWidth: '280px', margin: '0 auto 1.5rem', color: '#6b7280' }}>
                Discover authentic handloom attire from 13 Indian states for the whole family.
              </p>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.88rem' }}
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
              >
                Explore Traditional Attires &rarr;
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={item.variant.id} className="cart-item-row">
                  <div className="cart-item-img">
                    <img 
                      src={item.product.imageUrl || '/kanjeevaram_saree.png'}
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/kanjeevaram_saree.png';
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', lineHeight: 1.3, color: '#18181b', marginBottom: '0.2rem' }}>
                        {item.product.name}
                      </div>
                      {item.product.state && (
                        <div style={{ fontSize: '0.72rem', color: '#ff9933', fontWeight: 600, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{item.product.state}</span>
                        </div>
                      )}
                      <div style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.size && item.variant.color && ' | '}
                        {item.variant.color}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variant.id, Math.min(item.variant.inventory, item.quantity + 1))}>+</button>
                      </div>
                      <div style={{ fontWeight: 700, color: '#18181b', fontSize: '0.95rem' }}>
                        ₹{((item.variant.priceOverride || item.product.basePrice) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.variant.id)}
                    style={{ background: 'transparent', color: '#9ca3af', fontSize: '1.25rem', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', padding: '0 0.2rem' }}
                    title="Remove item"
                  >&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', fontWeight: 700, fontSize: '1.1rem', color: '#18181b' }}>
              <span>Estimated Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <button 
                className="btn" 
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.88rem' }} 
                onClick={handleViewFullCart}
              >
                View Full Cart
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.88rem' }} 
                onClick={handleCheckout}
              >
                Checkout &rarr;
              </button>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', margin: 0 }}>
              Taxes and shipping calculated at checkout • 7-day hassle-free exchange
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;

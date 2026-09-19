import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FESTIVE10') {
      const disc = cartTotal * 0.10;
      setDiscount(disc);
      setPromoMessage('10% Festive Handloom Discount applied!');
    } else if (promoCode.trim().toUpperCase() === 'RAGYAI') {
      const disc = Math.min(500, cartTotal * 0.15);
      setDiscount(disc);
      setPromoMessage('₹' + disc.toFixed(0) + ' Welcome Heritage Discount applied!');
    } else {
      setPromoMessage('Invalid coupon code. Try FESTIVE10');
    }
  };

  const freeShippingThreshold = 1999;
  const shipping = cartTotal >= freeShippingThreshold || cartTotal === 0 ? 0 : 150;
  const finalTotal = Math.max(0, cartTotal - discount + shipping);
  const progressToFreeShipping = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ 
          width: '72px', 
          height: '72px', 
          margin: '0 auto 1.5rem', 
          background: '#f4f4f5', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#71717a'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: '#18181b' }}>
          Your Bag is Empty
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Explore our handcrafted traditional attire from across all 13 Indian states for Men, Women, Girls, and Grandparents.
        </p>
        <Link to="/shop">
          <button className="btn btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '1rem' }}>
            Explore All Traditional Wear &rarr;
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Top Banner / Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, color: '#18181b' }}>
            Shopping Bag
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            {cart.reduce((sum, i) => sum + i.quantity, 0)} handcrafted traditional garments
          </p>
        </div>
        <Link to="/shop" style={{ color: '#18181b', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem' }}>
          &larr; Continue Shopping
        </Link>
      </div>

      {/* Free Shipping Progress (Tones Fashion Style) */}
      <div style={{ 
        background: '#ffffff', 
        border: '1px solid var(--color-border)', 
        borderRadius: '12px', 
        padding: '1.25rem 1.5rem', 
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>
          <span>
            {cartTotal >= freeShippingThreshold ? (
              <span style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                You have qualified for FREE Pan-India Express Delivery!
              </span>
            ) : (
              <span>Add <strong>₹{(freeShippingThreshold - cartTotal).toLocaleString('en-IN')}</strong> more for FREE Pan-India Delivery!</span>
            )}
          </span>
          <span style={{ color: '#ff9933', fontWeight: 700 }}>{progressToFreeShipping.toFixed(0)}%</span>
        </div>
        <div style={{ width: '100%', height: '7px', background: '#e5e7eb', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${progressToFreeShipping}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #ff9933, #16a34a)', 
            transition: 'width 0.4s ease' 
          }}></div>
        </div>
      </div>

      {/* 2-Column Desktop Grid / Responsive Mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.map((item) => {
            const itemPrice = item.variant.priceOverride || item.product.basePrice;
            return (
              <div 
                key={item.variant.id} 
                style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  background: '#ffffff', 
                  padding: '1.5rem', 
                  borderRadius: '16px', 
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ width: '100px', height: '125px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#f8f9fa' }}>
                  <img 
                    src={item.product.imageUrl || '/kanjeevaram_saree.png'}
                    alt={item.product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/kanjeevaram_saree.png';
                    }}
                  />
                  {item.product.state && (
                    <span style={{ 
                      position: 'absolute', 
                      bottom: '4px', 
                      left: '4px', 
                      background: 'rgba(255,255,255,0.92)', 
                      color: '#18181b', 
                      fontSize: '0.65rem', 
                      padding: '2px 6px', 
                      borderRadius: '100px', 
                      fontWeight: 600,
                      border: '1px solid #e5e7eb',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {item.product.state}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Link to={`/product/${item.product.slug}`} style={{ color: '#18181b', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.3 }}>
                        {item.product.name}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.variant.id)}
                        style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.25rem', padding: '0 4px', lineHeight: 1 }}
                        title="Remove item"
                      >
                        &times;
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {item.product.targetGroup && (
                        <span style={{ fontSize: '0.7rem', background: '#f4f4f5', color: '#18181b', padding: '0.15rem 0.55rem', borderRadius: '100px', fontWeight: 600, border: '1px solid #e4e4e7' }}>
                          {item.product.targetGroup}
                        </span>
                      )}
                      {item.variant.size && (
                        <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                          Size: <strong style={{ color: '#18181b' }}>{item.variant.size}</strong>
                        </span>
                      )}
                      {item.variant.color && (
                        <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                          Color: <strong style={{ color: '#18181b' }}>{item.variant.color}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}>-</button>
                      <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variant.id, Math.min(item.variant.inventory || 50, item.quantity + 1))}>+</button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#18181b' }}>
                        ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                      </div>
                      {item.quantity > 1 && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          (₹{itemPrice.toLocaleString('en-IN')} each)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary (Full Page Desktop) */}
        <div style={{ position: 'sticky', top: '6rem' }}>
          <div style={{ 
            background: '#ffffff', 
            padding: '2rem', 
            borderRadius: '16px', 
            border: '1px solid var(--color-border)', 
            boxShadow: 'var(--shadow-sm)' 
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', color: '#18181b' }}>
              Order Summary
            </h3>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.95rem' }}>
                <span>Items Subtotal</span>
                <span style={{ color: '#18181b', fontWeight: 600 }}>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontSize: '0.95rem' }}>
                  <span>Coupon Discount</span>
                  <span style={{ fontWeight: 600 }}>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.95rem' }}>
                <span>Pan-India Delivery</span>
                <span>
                  {shipping === 0 ? (
                    <strong style={{ color: '#16a34a' }}>FREE</strong>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.82rem' }}>
                <span>Estimated GST & Handloom Taxes</span>
                <span>Included</span>
              </div>
            </div>

            {/* Total */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderTop: '1px solid var(--color-border)', 
              paddingTop: '1.25rem', 
              marginBottom: '1.75rem' 
            }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#18181b' }}>Total Amount</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Includes all regional taxes</div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#18181b' }}>
                ₹{finalTotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Promo Code Input & 1-Tap Chips */}
            <form onSubmit={handleApplyPromo} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Coupon (e.g. FESTIVE10)" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ 
                    flex: 1, 
                    padding: '0.65rem 1rem', 
                    borderRadius: '25px', 
                    border: '1px solid var(--color-border)', 
                    background: '#ffffff', 
                    color: '#18181b', 
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
                  Apply
                </button>
              </div>

              {/* 1-Tap Clickable Coupon Chips */}
              <div className="coupon-chips-row">
                <span 
                  className="coupon-chip"
                  onClick={() => {
                    setPromoCode('FESTIVE10');
                    const disc = cartTotal * 0.10;
                    setDiscount(disc);
                    setPromoMessage('10% Festive Handloom Discount applied!');
                  }}
                >
                  <span>🏷️</span> FESTIVE10 (10% Off)
                </span>
                <span 
                  className="coupon-chip"
                  onClick={() => {
                    setPromoCode('RAGYAI');
                    const disc = Math.min(500, cartTotal * 0.15);
                    setDiscount(disc);
                    setPromoMessage('₹' + disc.toFixed(0) + ' Welcome Heritage Discount applied!');
                  }}
                >
                  <span>✨</span> RAGYAI (₹500 Off)
                </span>
              </div>

              {promoMessage && (
                <div style={{ 
                  marginTop: '0.65rem', 
                  fontSize: '0.82rem', 
                  color: discount > 0 ? '#15803d' : '#dc2626', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span>{discount > 0 ? '✓' : '⚠️'}</span>
                  <span>{promoMessage}</span>
                </div>
              )}
            </form>

            {/* Checkout Action Button */}
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginBottom: '1rem' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Secure Checkout &rarr;
            </button>

            {/* Trust Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', fontSize: '0.8rem', color: '#6b7280' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>256-Bit Bank-Grade Encrypted Payment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
                <span>Authentic Silk & Handloom Mark Certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                <span>7-Day Easy Exchange Across India</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;

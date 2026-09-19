import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(() => {
    return product?.variants?.[0]?.size || null;
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    return product?.variants?.[0]?.color || null;
  });
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const sizes = [...new Set((product.variants || []).map(v => v.size).filter(Boolean))];
  const colors = [...new Set((product.variants || []).map(v => v.color).filter(Boolean))];

  const selectedVariant = product.variants?.find(
    v => (v.size === selectedSize || !v.size) && (v.color === selectedColor || !v.color)
  ) || product.variants?.[0];

  const price = selectedVariant?.priceOverride || product.basePrice;
  const mrp = Math.round(price * 1.25);
  const discountPercent = Math.round(((mrp - price) / mrp) * 100);
  const isOutOfStock = selectedVariant && selectedVariant.inventory <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setIsCartOpen(true);
      onClose();
    }, 450);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    onClose();
    navigate('/checkout');
  };

  const getDemographicBadgeColor = (group) => {
    switch ((group || '').toUpperCase()) {
      case 'WOMEN': return '#db2777';
      case 'MEN': return '#2563eb';
      case 'GIRLS': return '#d97706';
      case 'GRANDPARENTS': return '#059669';
      default: return '#c28b24';
    }
  };

  return (
    <div className="quick-modal-overlay" onClick={onClose}>
      <div className="quick-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="quick-modal-close" onClick={onClose} aria-label="Close preview">
          &times;
        </button>

        <div className="quick-modal-grid">
          {/* Visual Column */}
          <div className="quick-modal-media">
            <img
              src={product.imageUrl || '/kanjeevaram_saree.png'}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/kanjeevaram_saree.png';
              }}
            />
            {product.state && (
              <span className="badge-state">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {product.state}
              </span>
            )}
            {product.targetGroup && (
              <span 
                className="badge-demographic" 
                style={{ background: getDemographicBadgeColor(product.targetGroup) }}
              >
                {product.targetGroup === 'GRANDPARENTS' ? 'ELDERS' : product.targetGroup}
              </span>
            )}

            <button
              className={`quick-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
              title="Save to Wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "#dc2626" : "none"} stroke={isInWishlist(product.id) ? "#dc2626" : "currentColor"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Details Column */}
          <div className="quick-modal-body">
            <div className="quick-state-subtitle">
              <span>{product.state} Heritage Weave</span>
              <span>•</span>
              <span>{product.category?.name}</span>
            </div>

            <h2 className="quick-modal-title">{product.name}</h2>

            <div className="quick-rating-row">
              <span className="star-pill">★ 4.9</span>
              <span className="review-count">(38 Masterpiece reviews)</span>
              <span className="silk-mark-tag">✓ Silk Mark Certified</span>
            </div>

            <div className="quick-price-box">
              <span className="quick-price-main">₹{price.toLocaleString('en-IN')}</span>
              <span className="quick-price-mrp">₹{mrp.toLocaleString('en-IN')}</span>
              <span className="quick-discount-badge">{discountPercent}% OFF</span>
            </div>

            <p className="quick-desc">
              {product.description}
            </p>

            {/* Size selection */}
            {sizes.length > 0 && (
              <div className="quick-option-group">
                <div className="quick-option-label">
                  <span>Select Size:</span>
                  <Link to="/size-guide" onClick={onClose} className="quick-size-link">
                    Size Guide
                  </Link>
                </div>
                <div className="quick-option-pills">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`quick-pill ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selection */}
            {colors.length > 0 && (
              <div className="quick-option-group">
                <div className="quick-option-label">Tone / Hue:</div>
                <div className="quick-option-pills">
                  {colors.map(col => (
                    <button
                      key={col}
                      className={`quick-pill ${selectedColor === col ? 'active' : ''}`}
                      onClick={() => setSelectedColor(col)}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="quick-qty-row">
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-heading)' }}>Quantity:</span>
              <div className="qty-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <span style={{ fontSize: '0.82rem', color: isOutOfStock ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                {isOutOfStock ? 'Sold Out' : '✓ In Stock (Ready to dispatch)'}
              </span>
            </div>

            {/* Actions */}
            <div className="quick-action-btns">
              <button
                className="btn btn-primary"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                style={{ flex: 1, padding: '0.85rem 1rem' }}
              >
                {addedNotice ? '✓ Added to Bag!' : '+ Add to Bag'}
              </button>
              <button
                className="btn btn-accent"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                style={{ flex: 1, padding: '0.85rem 1rem' }}
              >
                Buy Now &rarr;
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}
              >
                View Full Weaver Heritage Details & Sizing &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

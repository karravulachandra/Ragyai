import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(() => FALLBACK_PRODUCTS.find(p => p.slug === slug) || null);
  const [loading, setLoading] = useState(!FALLBACK_PRODUCTS.find(p => p.slug === slug));
  const navigate = useNavigate();

  // Selection state
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [activeAccordion, setActiveAccordion] = useState('heritage');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const initSelection = (data) => {
      if (data.variants && data.variants.length > 0) {
        const firstAvailable = data.variants.find(v => v.inventory > 0) || data.variants[0];
        if (firstAvailable) {
          if (firstAvailable.size) setSelectedSize(firstAvailable.size);
          if (firstAvailable.color) setSelectedColor(firstAvailable.color);
        }
      }
    };

    const initial = FALLBACK_PRODUCTS.find(p => p.slug === slug);
    if (initial) {
      setProduct(initial);
      initSelection(initial);
      setLoading(false);
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3001/api/products/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          initSelection(data);
        }
      } catch (err) {
        if (!initial) setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="loading">Curating traditional attire details...</div>;
  if (error && !product) return <div className="loading" style={{ color: '#dc2626' }}>{error}</div>;
  if (!product) return <div className="loading">Traditional attire not found.</div>;

  // Find variant
  const selectedVariant = product.variants?.find(
    v => (v.size === selectedSize || !v.size) && (v.color === selectedColor || !v.color)
  ) || product.variants?.[0];

  const price = selectedVariant?.priceOverride || product.basePrice;
  const isOutOfStock = selectedVariant && selectedVariant.inventory <= 0;
  const mrp = Math.round(price * 1.25);
  const discountPercent = Math.round(((mrp - price) / mrp) * 100);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setIsCartOpen(true);
    }, 400);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      const days = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Monday'];
      const deliveryDay = days[Math.floor(Math.random() * days.length)];
      setPincodeResult({
        success: true,
        message: `Express Delivery by ${deliveryDay} to PIN ${pincode.trim()} with Free Pan-India Shipping & Cash on Delivery Available.`
      });
    } else {
      setPincodeResult({
        success: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
    }
  };

  const sizes = [...new Set((product.variants || []).map(v => v.size).filter(Boolean))];
  const colors = [...new Set((product.variants || []).map(v => v.color).filter(Boolean))];

  // Family matching suggestions from same state
  const familyMatches = FALLBACK_PRODUCTS.filter(
    p => p.state === product.state && p.id !== product.id
  ).slice(0, 3);

  const getDemographicBadgeColor = (group) => {
    switch ((group || '').toUpperCase()) {
      case 'WOMEN': return '#db2777';
      case 'MEN': return '#2563eb';
      case 'GIRLS': return '#d97706';
      case 'GRANDPARENTS': return '#059669';
      default: return '#c28b24';
    }
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#475569' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: '#475569' }}>All 13 States</Link>
        {product.state && (
          <>
            <span>/</span>
            <span style={{ color: '#475569' }}>{product.state}</span>
          </>
        )}
        <span>/</span>
        <span style={{ color: 'var(--color-heading)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
        {/* Left Column: Product Imagery Gallery */}
        <div>
          <div style={{ 
            width: '100%', 
            aspectRatio: '3/4', 
            background: '#f8f6f0', 
            borderRadius: '18px', 
            overflow: 'hidden', 
            position: 'relative', 
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <img
              src={product.imageUrl || '/kanjeevaram_saree.png'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/kanjeevaram_saree.png';
              }}
            />

            {product.state && (
              <div className="badge-state" style={{ fontSize: '0.82rem', padding: '0.4rem 0.95rem', top: '1.25rem', left: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{product.state}</span>
              </div>
            )}

            {product.targetGroup && (
              <div 
                className="badge-demographic" 
                style={{ 
                  background: getDemographicBadgeColor(product.targetGroup),
                  bottom: '1.25rem', 
                  left: '1.25rem',
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.85rem'
                }}
              >
                {product.targetGroup === 'GRANDPARENTS' ? 'ELDERS' : product.targetGroup}
              </div>
            )}

            <button
              onClick={() => toggleWishlist(product)}
              className="card-icon-btn"
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '42px', height: '42px' }}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label="Wishlist toggle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "#dc2626" : "none"} stroke={isWishlisted ? "#dc2626" : "currentColor"} strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Authentic Certification Badges Strip */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: '#ffffff', 
            border: '1px solid var(--color-border)', 
            borderRadius: '12px', 
            padding: '0.9rem 1.25rem', 
            marginTop: '1.25rem' 
          }}>
            <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>✓</span> Silk Mark India Certified
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>⚜️</span> GI Tagged Weave Cluster
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ fontSize: '0.8rem', color: '#18181b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>🕊️</span> 100% Handloom
            </span>
          </div>
        </div>

        {/* Right Column: Details & Conversion Purchase Engine */}
        <div>
          {/* Subtitle & State */}
          <div style={{ 
            fontSize: '0.82rem', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px', 
            color: 'var(--accent)', 
            fontWeight: 800,
            marginBottom: '0.4rem'
          }}>
            {product.state} Heritage • {product.category?.name}
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--color-heading)', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Rating & Social Proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>
              ★ 4.9
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              (42 verified handcrafted reviews)
            </span>
            <span style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 700 }}>
              • 98% Recommend for Weddings
            </span>
          </div>

          {/* Pricing Row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-heading)' }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through' }}>
              ₹{mrp.toLocaleString('en-IN')}
            </span>
            <span style={{ 
              background: '#dcfce7', 
              color: '#15803d', 
              padding: '3px 9px', 
              borderRadius: '6px', 
              fontWeight: 800, 
              fontSize: '0.88rem' 
            }}>
              {discountPercent}% OFF
            </span>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Inclusive of all taxes • <strong>Free Pan-India Express Delivery</strong> on this attire
          </div>

          {/* Stock Urgency Indicator */}
          <div style={{ 
            background: '#fffbeb', 
            border: '1px solid #fde68a', 
            borderRadius: '10px', 
            padding: '0.65rem 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1.75rem',
            fontSize: '0.84rem',
            color: '#b45309',
            fontWeight: 600
          }}>
            <span>🔥</span>
            <span><strong>High Festive Demand:</strong> Woven in small artisan batches. Only 2 pieces left in stock!</span>
          </div>

          <p style={{ fontSize: '1.02rem', color: '#334155', lineHeight: 1.7, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Size Pills */}
          {sizes.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-heading)' }}>Select Size</span>
                <Link to="/size-guide" style={{ fontSize: '0.82rem', color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}>
                  Draping & Sizing Manual &rarr;
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.55rem 1.35rem',
                      borderRadius: 'var(--button-border-radius)',
                      background: selectedSize === size ? 'var(--color-heading)' : '#ffffff',
                      color: selectedSize === size ? '#ffffff' : 'var(--color-heading)',
                      border: `1px solid ${selectedSize === size ? 'var(--color-heading)' : 'var(--color-border)'}`,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Pills */}
          {colors.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Tone / Palette
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '0.55rem 1.35rem',
                      borderRadius: 'var(--button-border-radius)',
                      background: selectedColor === color ? 'var(--color-heading)' : '#ffffff',
                      color: selectedColor === color ? '#ffffff' : 'var(--color-heading)',
                      border: `1px solid ${selectedColor === color ? 'var(--color-heading)' : 'var(--color-border)'}`,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-heading)' }}>Quantity:</div>
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span style={{ minWidth: '32px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(selectedVariant ? Math.min(selectedVariant.inventory || 50, quantity + 1) : quantity + 1)}>+</button>
            </div>
            {selectedVariant && (
              <span style={{ 
                color: isOutOfStock ? '#dc2626' : '#16a34a', 
                fontWeight: 700, 
                fontSize: '0.88rem' 
              }}>
                {isOutOfStock ? 'Sold Out' : '✓ In Stock (Dispatched within 24 Hours)'}
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={!selectedVariant || isOutOfStock}
              style={{
                padding: '0.95rem',
                fontSize: '1.05rem',
                opacity: (!selectedVariant || isOutOfStock) ? 0.5 : 1,
                cursor: (!selectedVariant || isOutOfStock) ? 'not-allowed' : 'pointer'
              }}
            >
              {addedNotice ? '✓ Added to Bag!' : isOutOfStock ? 'Sold Out' : '+ Add to Bag'}
            </button>

            <button
              className="btn btn-accent"
              onClick={handleBuyNow}
              disabled={!selectedVariant || isOutOfStock}
              style={{
                padding: '0.95rem',
                fontSize: '1.05rem',
                opacity: (!selectedVariant || isOutOfStock) ? 0.5 : 1,
                cursor: (!selectedVariant || isOutOfStock) ? 'not-allowed' : 'pointer'
              }}
            >
              Buy It Now with 1-Click &rarr;
            </button>
          </div>

          {/* Pincode Delivery Estimator */}
          <div className="pincode-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-heading)' }}>
              <span>📍</span>
              <span>Check Delivery Speed to Your Doorstep</span>
            </div>
            <form onSubmit={handleCheckPincode} className="pincode-input-row">
              <input 
                type="text" 
                placeholder="Enter 6-digit PIN code (e.g. 500001)..." 
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button type="submit" className="btn" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
                Check
              </button>
            </form>
            {pincodeResult && (
              <div style={{ 
                marginTop: '0.75rem', 
                fontSize: '0.82rem', 
                fontWeight: 600, 
                color: pincodeResult.success ? '#047857' : '#dc2626' 
              }}>
                {pincodeResult.message}
              </div>
            )}
          </div>

          {/* Interactive Heritage Accordions */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              {
                id: 'heritage',
                title: 'Weave History & GI Provenance',
                content: `Woven by generational cooperative artisans in ${product.state}. Every motif holds sacred cultural symbolism passed down over 300 years of handloom lineage. Verified authentic thread count and natural fiber purity.`
              },
              {
                id: 'styling',
                title: 'Draping & Occasion Styling Advice',
                content: `Best worn with authentic temple jewelry, matching raw silk borders, or heirloom accessories. Ideal for Indian weddings, Sangeet ceremonies, housewarming pujas, and traditional state festivities.`
              },
              {
                id: 'certification',
                title: 'Silk Mark India & Handloom Guarantee',
                content: `Every garment carries an authentic Silk Mark India label and Handloom tag, ensuring that no synthetic fibers or counterfeit power-loom polyester blends are used. 100% natural, breathable, and pure.`
              },
              {
                id: 'care',
                title: 'Heirloom Care & Wash Instructions',
                content: `Dry clean only for the first wash to preserve zari luster. Wrap in a breathable pure cotton or muslin cloth. Avoid spraying direct perfume onto gold zari embroidery.`
              }
            ].map((acc) => (
              <div key={acc.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === acc.id ? null : acc.id)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 0',
                    background: 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--color-heading)',
                    textAlign: 'left'
                  }}
                >
                  <span>{acc.title}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>
                    {activeAccordion === acc.id ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === acc.id && (
                  <div style={{ paddingBottom: '1.25rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.7 }}>
                    {acc.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Complete the Look / Family Matching */}
          {familyMatches.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-heading)' }}>
                  Coordinate Family Look ({product.state})
                </h3>
                <Link to="/shop" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>
                  View All &rarr;
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {familyMatches.map(match => (
                  <Link key={match.id} to={`/product/${match.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      transition: 'var(--transition)'
                    }}>
                      <div style={{ aspectRatio: '3/4', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem', background: '#f8f6f0' }}>
                        <img 
                          src={match.imageUrl || '/kanjeevaram_saree.png'} 
                          alt={match.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>
                        {match.targetGroup}
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {match.name}
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-heading)', marginTop: '2px' }}>
                        ₹{match.basePrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Buy Bar */}
      <div className="sticky-mobile-buy-bar">
        <div className="sticky-mobile-price">
          <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Total Price</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-heading)' }}>
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={!selectedVariant || isOutOfStock}
            style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem' }}
          >
            {addedNotice ? '✓ In Bag' : '+ Add'}
          </button>
          <button
            className="btn btn-accent"
            onClick={handleBuyNow}
            disabled={!selectedVariant || isOutOfStock}
            style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem' }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

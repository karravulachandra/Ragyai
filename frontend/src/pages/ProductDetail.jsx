import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const [product, setProduct] = useState(() => FALLBACK_PRODUCTS.find(p => p.slug === slug) || null);
  const [loading, setLoading] = useState(!FALLBACK_PRODUCTS.find(p => p.slug === slug));
  const navigate = useNavigate();

  // Selection state
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('craft');

  useEffect(() => {
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
        // Already using local data
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

  // Find the exact variant based on selections
  const selectedVariant = product.variants?.find(
    v => (v.size === selectedSize || !v.size) && (v.color === selectedColor || !v.color)
  ) || product.variants?.[0];

  const price = selectedVariant?.priceOverride || product.basePrice;
  const isOutOfStock = selectedVariant && selectedVariant.inventory <= 0;
  const mrp = Math.round(price * 1.25);
  const discountPercent = Math.round(((mrp - price) / mrp) * 100);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select available options.");
      return;
    }
    addToCart(product, selectedVariant, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  // Unique sizes and colors
  const sizes = [...new Set((product.variants || []).map(v => v.size).filter(Boolean))];
  const colors = [...new Set((product.variants || []).map(v => v.color).filter(Boolean))];

  const getDemographicBadgeColor = (group) => {
    switch ((group || '').toUpperCase()) {
      case 'WOMEN': return '#db2777';
      case 'MEN': return '#2563eb';
      case 'GIRLS': return '#d97706';
      case 'GRANDPARENTS': return '#059669';
      default: return '#ff9933';
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6b7280', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#4b5563' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: '#4b5563' }}>All States</Link>
        {product.state && (
          <>
            <span>/</span>
            <span style={{ color: '#4b5563' }}>{product.state}</span>
          </>
        )}
        <span>/</span>
        <span style={{ color: '#18181b', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
        {/* Left Column: Product Image Gallery (Tones Fashion Clean Look) */}
        <div>
          <div style={{ 
            width: '100%', 
            aspectRatio: '3/4', 
            background: '#f8f9fa', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            position: 'relative', 
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
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
              <div className="badge-state" style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem', top: '1rem', left: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  bottom: '1rem', 
                  left: '1rem',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.75rem'
                }}
              >
                {product.targetGroup === 'GRANDPARENTS' ? 'ELDERS' : product.targetGroup}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ 
              width: '72px', 
              height: '90px', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              border: '2px solid #18181b',
              cursor: 'pointer' 
            }}>
              <img 
                src={product.imageUrl || '/kanjeevaram_saree.png'} 
                alt="Thumbnail" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Product Detail & Purchase Flow */}
        <div>
          <div style={{ 
            fontSize: '0.78rem', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px', 
            color: '#ff9933', 
            fontWeight: 700,
            marginBottom: '0.4rem'
          }}>
            {product.state} Heritage • {product.category?.name}
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: '#18181b', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Pricing Row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181b' }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '1.1rem', color: '#9ca3af', textDecoration: 'line-through' }}>
              ₹{mrp.toLocaleString('en-IN')}
            </span>
            <span style={{ 
              background: '#dcfce7', 
              color: '#15803d', 
              padding: '2px 8px', 
              borderRadius: '6px', 
              fontWeight: 700, 
              fontSize: '0.85rem' 
            }}>
              {discountPercent}% OFF
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.75rem' }}>
            Inclusive of all taxes • <strong>Free Pan-India Express Delivery</strong> on this item
          </div>

          <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            {product.description}
          </p>

          {/* Handloom Provenance Card */}
          <div style={{ 
            background: '#f8f9fa', 
            border: '1px solid var(--color-border)', 
            borderRadius: '12px', 
            padding: '1.25rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#18181b', marginBottom: '0.5rem' }}>
              Handloom Provenance & Weave Authenticity
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.84rem', color: '#4b5563' }}>
              <div>• <strong>State:</strong> {product.state}</div>
              <div>• <strong>Wearer:</strong> {product.targetGroup}</div>
              <div>• <strong>Certification:</strong> Silk Mark / Handloom</div>
              <div>• <strong>Origin:</strong> Cooperative Artisans</div>
            </div>
          </div>

          {/* Size Pills */}
          {sizes.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#18181b' }}>Select Size</span>
                <Link to="/size-guide" style={{ fontSize: '0.8rem', color: '#ff9933', textDecoration: 'underline' }}>
                  Size & Drape Guide
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.55rem 1.25rem',
                      borderRadius: 'var(--button-border-radius)',
                      background: selectedSize === size ? '#18181b' : '#ffffff',
                      color: selectedSize === size ? '#ffffff' : '#18181b',
                      border: `1px solid ${selectedSize === size ? '#18181b' : '#d1d5db'}`,
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
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
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#18181b', marginBottom: '0.5rem' }}>
                Color / Weave Tone
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '0.55rem 1.25rem',
                      borderRadius: 'var(--button-border-radius)',
                      background: selectedColor === color ? '#18181b' : '#ffffff',
                      color: selectedColor === color ? '#ffffff' : '#18181b',
                      border: `1px solid ${selectedColor === color ? '#18181b' : '#d1d5db'}`,
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Inventory */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#18181b' }}>Quantity</div>
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span style={{ minWidth: '28px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(selectedVariant ? Math.min(selectedVariant.inventory || 50, quantity + 1) : quantity + 1)}>+</button>
            </div>
            {selectedVariant && (
              <span style={{ 
                color: isOutOfStock ? '#dc2626' : '#16a34a', 
                fontWeight: 600, 
                fontSize: '0.85rem' 
              }}>
                {isOutOfStock ? 'Sold Out' : '✓ In Stock (Ready to Ship)'}
              </span>
            )}
          </div>

          {/* Action CTAs (Tones Fashion Pill Style) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={!selectedVariant || isOutOfStock}
              style={{
                padding: '0.9rem',
                fontSize: '1rem',
                opacity: (!selectedVariant || isOutOfStock) ? 0.5 : 1,
                cursor: (!selectedVariant || isOutOfStock) ? 'not-allowed' : 'pointer'
              }}
            >
              {isOutOfStock ? 'Sold Out' : '+ Add to Bag'}
            </button>

            <button
              className="btn btn-accent"
              onClick={handleBuyNow}
              disabled={!selectedVariant || isOutOfStock}
              style={{
                padding: '0.9rem',
                fontSize: '1rem',
                opacity: (!selectedVariant || isOutOfStock) ? 0.5 : 1,
                cursor: (!selectedVariant || isOutOfStock) ? 'not-allowed' : 'pointer'
              }}
            >
              Buy It Now &rarr;
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={{ 
            borderTop: '1px solid var(--color-border)', 
            paddingTop: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: '#4b5563'
          }}>
            <div>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                margin: '0 auto 0.5rem', 
                background: '#f4f4f5', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#18181b' 
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <strong style={{ color: '#18181b' }}>Free Express</strong><br />Pan-India Delivery
            </div>
            <div>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                margin: '0 auto 0.5rem', 
                background: '#f4f4f5', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#18181b' 
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <strong style={{ color: '#18181b' }}>Silk Mark</strong><br />100% Certified
            </div>
            <div>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                margin: '0 auto 0.5rem', 
                background: '#f4f4f5', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#18181b' 
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </div>
              <strong style={{ color: '#18181b' }}>7-Day Exchange</strong><br />Hassle-Free
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

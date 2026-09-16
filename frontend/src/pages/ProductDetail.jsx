import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3001/api/products/${slug}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);

        // Auto-select first available options if possible
        if (data.variants && data.variants.length > 0) {
          const firstAvailable = data.variants.find(v => v.inventory > 0);
          if (firstAvailable) {
            if (firstAvailable.size) setSelectedSize(firstAvailable.size);
            if (firstAvailable.color) setSelectedColor(firstAvailable.color);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="loading" style={{ color: '#ef4444' }}>{error}</div>;
  if (!product) return <div className="loading">Product not found.</div>;

  // Find the exact variant based on selections
  const selectedVariant = product.variants?.find(
    v => (v.size === selectedSize || !v.size) && (v.color === selectedColor || !v.color)
  );

  const price = selectedVariant?.priceOverride || product.basePrice;
  const isOutOfStock = selectedVariant && selectedVariant.inventory <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select available options.");
      return;
    }
    addToCart(product, selectedVariant, quantity);
    alert("Added to cart!");
  };

  // Get unique sizes and colors
  const sizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map(v => v.color).filter(Boolean))];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ width: '100%', aspectRatio: '4/5', background: 'var(--card-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', overflow: 'hidden' }}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=800&q=80'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-block', marginBottom: '1rem' }}>
          &larr; Back to Shop
        </Link>
        <div className="product-category">{product.category?.name}</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{product.name}</h1>
        <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2rem' }}>
          ₹{price.toFixed(2)}
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', marginBottom: '3rem', opacity: 0.9 }}>
          {product.description}
        </p>

        {/* Dummy Details added for Phase 6 */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--accent)' }}>Fabric & Fit Details</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>• 100% Organic Heavyweight Cotton (400GSM)</li>
            <li>• Drop-shoulder oversized fit</li>
            <li>• Pre-shrunk for zero shrinkage after washing</li>
            <li>• Ethically manufactured in Portugal</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)' }}>
          <div title="Machine Wash Cold" style={{ fontSize: '1.5rem', cursor: 'help' }}>🌊</div>
          <div title="Do Not Bleach" style={{ fontSize: '1.5rem', cursor: 'help' }}>🚫</div>
          <div title="Tumble Dry Low" style={{ fontSize: '1.5rem', cursor: 'help' }}>🌥️</div>
          <div title="Iron Low Heat" style={{ fontSize: '1.5rem', cursor: 'help' }}>👔</div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <button style={{ background: 'transparent', color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline', fontSize: '0.9rem' }}>
            📏 Open Interactive Size Predictor
          </button>
        </div>

        {sizes.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Size</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedSize === size ? 'var(--primary)' : 'var(--card-bg)',
                    border: `1px solid ${selectedSize === size ? 'var(--primary)' : 'var(--card-border)'}`,
                    color: 'white',
                    borderRadius: '8px',
                    fontWeight: 600
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Color</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedColor === color ? 'var(--primary)' : 'var(--card-bg)',
                    border: `1px solid ${selectedColor === color ? 'var(--primary)' : 'var(--card-border)'}`,
                    color: 'white',
                    borderRadius: '8px',
                    fontWeight: 600
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h4 style={{ fontWeight: 600 }}>Quantity</h4>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'white' }}>-</button>
            <div style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>{quantity}</div>
            <button
              onClick={() => setQuantity(selectedVariant ? Math.min(selectedVariant.inventory, quantity + 1) : quantity + 1)}
              style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'white' }}
            >
              +
            </button>
          </div>

          {selectedVariant && (
            <span style={{ color: isOutOfStock ? '#ef4444' : '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
              {isOutOfStock ? 'Out of Stock' : `${selectedVariant.inventory} available`}
            </span>
          )}
        </div>

        <button
          className="btn"
          onClick={handleAddToCart}
          disabled={!selectedVariant || isOutOfStock}
          style={{
            opacity: (!selectedVariant || isOutOfStock) ? 0.5 : 1,
            cursor: (!selectedVariant || isOutOfStock) ? 'not-allowed' : 'pointer',
            padding: '1rem',
            fontSize: '1.1rem'
          }}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3001/api/products', { cache: 'no-store' });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <main>
      <section className="hero">
        <h1>Timeless Elegance</h1>
        <p>Discover our curated collection of premium handwoven Sarees, intricate Kurtas, and regal Lehengas crafted for the modern festive season.</p>
        <Link to="/shop" className="btn btn-primary" style={{display: 'inline-block', width: 'auto', padding: '1rem 3rem'}}>
          Explore Collection
        </Link>
      </section>

      {/* Core Pillars */}
      <section style={{display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', padding: '4rem 0', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', marginBottom: '5rem', background: 'var(--card-bg)'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent)'}}>✨</div>
          <h3 style={{fontSize: '1.2rem', marginBottom: '0.25rem'}}>Handwoven Textiles</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Authentic weaves from Varanasi & Kanchipuram</p>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent)'}}>🧵</div>
          <h3 style={{fontSize: '1.2rem', marginBottom: '0.25rem'}}>Zari & Zardosi</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Exquisite hand embroidery</p>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent)'}}>👑</div>
          <h3 style={{fontSize: '1.2rem', marginBottom: '0.25rem'}}>Festive Ready</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Perfect for weddings and grand celebrations</p>
        </div>
      </section>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', maxWidth: '1200px', margin: '0 auto 3rem'}}>
        <h2 style={{fontSize: '2.5rem', fontWeight: 600}}>Curated For You</h2>
        <Link to="/shop" style={{color: 'var(--accent)', fontWeight: 600}}>View All →</Link>
      </div>

      {loading ? (
        <div className="loading">Curating collection...</div>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => (
            <div key={product.id} className="product-card" style={{animationDelay: `${0.1 * index}s`}}>
              <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
                <div className="product-image-placeholder" style={{ overflow: 'hidden', padding: 0, border: 'none' }}>
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d615ef?w=500&q=80'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="product-category">{product.category?.name}</div>
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">₹{product.basePrice.toFixed(2)}</div>
              </Link>
              <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                <button className="btn">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Home;

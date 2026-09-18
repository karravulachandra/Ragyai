import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const [addedSlug, setAddedSlug] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3001/api/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setProducts(data);
        }
      } catch (error) {
        // Silently use FALLBACK_PRODUCTS for offline / static CDN hosting
      }
    };
    
    fetchProducts();
  }, []);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.variants || product.variants.length === 0) {
      navigate(`/product/${product.slug}`);
      return;
    }
    const variant = product.variants[0];
    addToCart(product, variant, 1);
    setAddedSlug(product.slug);
    setIsCartOpen(true);
    setTimeout(() => setAddedSlug(null), 2000);
  };

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
    <main>
      {/* Modern Luxury Hero Section (Tones Fashion Aesthetic) */}
      <section style={{ 
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)', 
        padding: '5rem 1.5rem 4rem',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: '#ffffff', 
            border: '1px solid #e5e7eb', 
            color: '#18181b', 
            padding: '0.45rem 1.25rem', 
            borderRadius: '100px', 
            fontSize: '0.82rem', 
            fontWeight: 600, 
            letterSpacing: '0.5px', 
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff9933', display: 'inline-block' }}></span>
            <span>AUTHENTIC INDIAN REGIONAL WEAVES FOR ALL GENERATIONS</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', 
            fontWeight: 800, 
            marginBottom: '1.25rem', 
            letterSpacing: '-1px', 
            lineHeight: 1.15,
            color: '#18181b'
          }}>
            Timeless Traditional Attire Across Indian States
          </h1>

          <p style={{ 
            color: '#4b5563', 
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
            lineHeight: 1.65, 
            marginBottom: '2.5rem',
            maxWidth: '720px',
            margin: '0 auto 2.5rem'
          }}>
            Curated pure silks, khadi cottons, and heirloom handlooms crafted by master weavers across 13 Indian states. Tailored collections for <strong>Men</strong>, <strong>Women</strong>, <strong>Kids</strong>, and <strong>Grandparents</strong>.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '0.98rem' }}>
              Explore All 52 State Attires →
            </Link>
            <Link to="/womens" className="btn" style={{ padding: '0.9rem 2rem', fontSize: '0.98rem' }}>
              Women's Sarees
            </Link>
            <Link to="/mens" className="btn" style={{ padding: '0.9rem 2rem', fontSize: '0.98rem' }}>
              Men's Dhotis & Kurta
            </Link>
          </div>
        </div>
      </section>

      {/* Demographic Quick Navigation Cards */}
      <section className="container" style={{ marginTop: '3.5rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff9933', fontWeight: 700 }}>
            Curated Generations
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem' }}>
            Shop Traditional Wear by Demographic
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            { 
              title: "Men's Traditional", 
              desc: "Sherwanis, Veshtis, Angavastram & Kurta Dhotis", 
              link: "/mens", 
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2L2 14v2h20v-2l-7.8-7c.5-.5.8-1.2.8-2a3 3 0 0 0-3-3z"></path>
                </svg>
              ),
              tag: "13 State Ensembles",
              accent: "#2563eb"
            },
            { 
              title: "Women's Sarees & Sets", 
              desc: "Kanjeevaram, Nauvari, Patola & Mekhela Chador", 
              link: "/womens", 
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M12 8a4 4 0 0 1 4 4c0 2-4 6-4 6s-4-4-4-6a4 4 0 0 1 4-4z"></path>
                </svg>
              ),
              tag: "Pure Mulberry Silk",
              accent: "#db2777"
            },
            { 
              title: "Girls & Kids Ethnic", 
              desc: "Pattu Pavadai, Langa Voni, Ghagra Choli & Frocks", 
              link: "/kids", 
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ),
              tag: "Festive Kids Ensembles",
              accent: "#d97706"
            },
            { 
              title: "Grandparents / Elders", 
              desc: "Pure Khadi Dhotis, Madisar, Puneri Topi & Eri Silk", 
              link: "/seniors", 
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              ),
              tag: "Featherlight Handloom",
              accent: "#059669"
            }
          ].map((cat, idx) => (
            <Link key={idx} to={cat.link} style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: '#ffffff', 
                border: '1px solid var(--color-border)', 
                borderRadius: '16px', 
                padding: '2rem 1.5rem',
                transition: 'var(--transition)',
                boxShadow: 'var(--shadow-sm)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-4px)'; 
                e.currentTarget.style.borderColor = '#94a3b8';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'none'; 
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              >
                <div>
                  <div style={{ 
                    marginBottom: '1.25rem',
                    background: '#f8f9fa',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {cat.icon}
                  </div>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    color: cat.accent, 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px' 
                  }}>
                    {cat.tag}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#18181b', margin: '0.35rem 0 0.5rem' }}>
                    {cat.title}
                  </h3>
                  <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                    {cat.desc}
                  </p>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#18181b' }}>
                  <span>View Collections</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Craftsmanship Value Props */}
      <section style={{ 
        background: '#f8f9fa', 
        borderTop: '1px solid var(--color-border)', 
        borderBottom: '1px solid var(--color-border)',
        padding: '3.5rem 1.5rem',
        marginBottom: '5rem'
      }}>
        <div className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '2.5rem', 
          textAlign: 'center' 
        }}>
          <div>
            <div style={{ 
              width: '54px', 
              height: '54px', 
              margin: '0 auto 1rem', 
              background: '#ffffff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem', color: '#18181b' }}>
              Free Pan-India Express Delivery
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
              Zero shipping fee on all handloom orders above ₹1,999.
            </p>
          </div>

          <div>
            <div style={{ 
              width: '54px', 
              height: '54px', 
              margin: '0 auto 1rem', 
              background: '#ffffff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem', color: '#18181b' }}>
              Silk & Handloom Mark Certified
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
              100% pure authentic regional weaves directly from master artisans.
            </p>
          </div>

          <div>
            <div style={{ 
              width: '54px', 
              height: '54px', 
              margin: '0 auto 1rem', 
              background: '#ffffff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem', color: '#18181b' }}>
              Whole Family Regional Attires
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
              Matching traditional festival ensembles for all 4 family generations.
            </p>
          </div>

          <div>
            <div style={{ 
              width: '54px', 
              height: '54px', 
              margin: '0 auto 1rem', 
              background: '#ffffff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem', color: '#18181b' }}>
              7-Day Easy Exchange
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
              Hassle-free size and drape exchange support across India.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Grid (Tones Fashion Clean White Style) */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff9933', fontWeight: 700 }}>
              Master Crafts
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.25rem' }}>
              Featured Traditional Attires
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0.25rem 0 0' }}>
              Iconic state-wise ethnic dresses handpicked for celebrations and weddings.
            </p>
          </div>
          
          <Link to="/shop" className="btn" style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}>
            View All 52 Attires &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="loading">Curating authentic state collection...</div>
        ) : (
          <div className="product-grid">
            {products.slice(0, 8).map((product, index) => {
              const mrp = Math.round(product.basePrice * 1.25);
              const discountPercent = Math.round(((mrp - product.basePrice) / mrp) * 100);

              return (
                <div key={product.id} className="product-card" style={{ animationDelay: `${0.05 * index}s` }}>
                  <Link to={`/product/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="product-image-placeholder">
                      <img 
                        src={product.imageUrl || '/kanjeevaram_saree.png'}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/kanjeevaram_saree.png';
                        }}
                      />
                      {product.state && (
                        <div className="badge-state">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{product.state}</span>
                        </div>
                      )}
                      {product.targetGroup && (
                        <div 
                          className="badge-demographic"
                          style={{ background: getDemographicBadgeColor(product.targetGroup) }}
                        >
                          {product.targetGroup === 'GRANDPARENTS' ? 'ELDERS' : product.targetGroup}
                        </div>
                      )}
                    </div>

                    <div className="product-category">{product.category?.name}</div>
                    
                    <h3 className="product-title" style={{ minHeight: '2.8rem' }}>
                      {product.name}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <span className="product-price" style={{ margin: 0 }}>
                        ₹{product.basePrice.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                        ₹{mrp.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                        {discountPercent}% OFF
                      </span>
                    </div>
                  </Link>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button 
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.88rem' }}
                      onClick={(e) => handleQuickAdd(e, product)}
                    >
                      {addedSlug === product.slug ? '✓ In Bag!' : '+ Add to Bag'}
                    </button>
                    <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                      <button className="btn" style={{ padding: '0.65rem 1rem', fontSize: '0.88rem', width: 'auto' }}>
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Explore Indian States Banner */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', 
          borderRadius: '20px', 
          padding: '4rem 2rem', 
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff9933', fontWeight: 700 }}>
            Pan-India Weaving Map
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', margin: '0.5rem 0 1rem' }}>
            52 Traditional Attires From 13 States
          </h2>
          <p style={{ color: '#d4d4d8', maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every state of India has an unforgettable sartorial heritage. Discover handcrafted attire with verified regional motifs and silk purity.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-accent" style={{ padding: '0.85rem 2.25rem', fontSize: '0.98rem' }}>
              Explore State Catalog &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

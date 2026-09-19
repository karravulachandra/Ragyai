import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import QuickViewModal from '../components/QuickViewModal';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';
import { api } from '../services/api';

const STATE_RIBBON = [
  { name: 'Tamil Nadu', weave: 'Kanjeevaram Silk', color: '#991b1b', icon: '🥻' },
  { name: 'Rajasthan', weave: 'Bandhani & Gota Patti', color: '#c2410c', icon: '👑' },
  { name: 'Jammu & Kashmir', weave: 'Pashmina & Tilla', color: '#1e3a8a', icon: '❄️' },
  { name: 'Kerala', weave: 'Kasavu Handloom', color: '#854d0e', icon: '🌴' },
  { name: 'Gujarat', weave: 'Patan Patola & Kutch', color: '#065f46', icon: '✨' },
  { name: 'Maharashtra', weave: 'Nauvari Paithani', color: '#831843', icon: '🦚' },
  { name: 'Telangana', weave: 'Pochampally Ikkat', color: '#b45309', icon: '🪡' },
  { name: 'West Bengal', weave: 'Baluchari & Taant', color: '#9f1239', icon: '🏮' },
  { name: 'Punjab', weave: 'Phulkari Heritage', color: '#b91c1c', icon: '🌸' },
  { name: 'Karnataka', weave: 'Mysore Crepe Silk', color: '#4338ca', icon: '⚜️' },
  { name: 'Andhra Pradesh', weave: 'Dharmavaram & Mangalagiri', color: '#047857', icon: '🪔' },
  { name: 'Assam', weave: 'Golden Muga & Eri Silk', color: '#ca8a04', icon: '🍃' },
  { name: 'Odisha', weave: 'Sambalpuri Bandha', color: '#be123c', icon: '🧵' }
];

const CUSTOMER_REVIEWS = [
  {
    name: 'Dr. Radhika Krishnan',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 5,
    date: 'Verified Buyer • 3 days ago',
    title: 'Breathtaking Kanjeevaram Silk Purity',
    text: 'Ordered the Kanjeevaram Bridal Silk Saree for my niece’s wedding. The weight of the pure mulberry silk and the luster of the authentic zari are second to none. Silk Mark tag was verified. Exceptional craftsmanship!',
    attire: 'Kanjeevaram Bridal Silk Saree'
  },
  {
    name: 'Arjun & Simran Mehta',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 5,
    date: 'Verified Buyer • 1 week ago',
    title: 'Perfect Matching Attires for Entire Family',
    text: 'We bought the Peshwai Dhoti Kurta for myself, the Nauvari Paithani for my wife, and the Parkar Polka for our 6-year-old daughter. The colors matched so harmoniously during Ganesh Chaturthi pujas!',
    attire: 'Peshwai Dhoti & Nauvari Saree'
  },
  {
    name: 'Major General (Retd.) B. Sharma',
    city: 'Dehradun',
    state: 'Uttarakhand',
    rating: 5,
    date: 'Verified Buyer • 2 weeks ago',
    title: 'Lightweight & Incredibly Comfortable Khadi',
    text: 'At 76, rough synthetic fabrics irritate my skin. Ragyai’s Mangalagiri pure handspun Khadi Dhoti and Kurta is the most breathable, comfortable garment I have worn in decades. Bless the weavers.',
    attire: 'Mangalagiri Khadi Dhoti & Kurta'
  },
  {
    name: 'Gurpreet Kaur',
    city: 'Amritsar',
    state: 'Punjab',
    rating: 5,
    date: 'Verified Buyer • 3 weeks ago',
    title: 'Intricate Handcrafted Phulkari Stitching',
    text: 'The needlework on the Patiala Salwar Suit with Phulkari Dupatta is authentic Punjabi artisan work, not cheap digital prints. I received endless compliments at my brother’s Anand Karaj.',
    attire: 'Patiala Salwar with Phulkari'
  }
];

function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState('ALL');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedSlug, setAddedSlug] = useState(null);

  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      } catch (error) {
        // Fallback already pre-loaded
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
      default: return '#c28b24';
    }
  };

  // Filter products by occasion tabs
  const filteredProducts = products.filter(p => {
    if (activeOccasion === 'ALL') return true;
    if (activeOccasion === 'BRIDAL') {
      return (p.basePrice >= 6500) || (p.name.toLowerCase().includes('bridal') || p.name.toLowerCase().includes('sherwani') || p.name.toLowerCase().includes('poshaak'));
    }
    if (activeOccasion === 'MEN') return p.targetGroup === 'MEN';
    if (activeOccasion === 'WOMEN') return p.targetGroup === 'WOMEN';
    if (activeOccasion === 'KIDS') return p.targetGroup === 'GIRLS';
    if (activeOccasion === 'ELDERS') return p.targetGroup === 'GRANDPARENTS';
    return true;
  });

  return (
    <main>
      {/* 1. CINEMATIC LUXURY HERO SECTION */}
      <section style={{ 
        background: 'linear-gradient(180deg, #f7f3eb 0%, #fcfaf6 100%)', 
        padding: '4.5rem 1.5rem 3.5rem',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative heritage mandala watermark */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          border: '1px dashed rgba(217, 119, 6, 0.12)',
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ textAlign: 'center', maxWidth: '920px', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.65rem', 
            background: '#ffffff', 
            border: '1px solid rgba(217, 119, 6, 0.25)', 
            color: '#92400e', 
            padding: '0.45rem 1.25rem', 
            borderRadius: '100px', 
            fontSize: '0.82rem', 
            fontWeight: 700, 
            letterSpacing: '0.6px', 
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ color: '#d97706' }}>✨</span>
            <span>PURE WEAVES ACROSS 13 INDIAN STATES • FOR ALL 4 GENERATIONS</span>
          </div>

          <h1 style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)', 
            fontWeight: 800, 
            marginBottom: '1.25rem', 
            letterSpacing: '-0.5px', 
            lineHeight: 1.14,
            color: '#141416'
          }}>
            Living Handloom Heritage for the Whole Family
          </h1>

          <p style={{ 
            color: '#475569', 
            fontSize: 'clamp(1.05rem, 2vw, 1.22rem)', 
            lineHeight: 1.65, 
            marginBottom: '2.5rem',
            maxWidth: '740px',
            margin: '0 auto 2.5rem'
          }}>
            Handcrafted pure silks, royal sherwanis, festive kids pattu, and featherlight elders khadi directly from master cooperative weavers across 13 Indian states. Certified Silk Mark authenticity.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '0.95rem 2.5rem', fontSize: '1rem', boxShadow: 'var(--shadow-md)' }}>
              Explore All 13 States &rarr;
            </Link>
            <Link to="/womens" className="btn" style={{ padding: '0.95rem 2rem', fontSize: '1rem', background: '#ffffff' }}>
              Women's Pure Sarees
            </Link>
            <Link to="/mens" className="btn" style={{ padding: '0.95rem 2rem', fontSize: '1rem', background: '#ffffff' }}>
              Men's Royal Dhotis
            </Link>
          </div>

          {/* Quick Heritage Stats Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.25rem',
            background: '#ffffff',
            padding: '1.25rem 2rem',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-heading)', fontFamily: 'var(--font-display)' }}>13 States</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Regional Diversity</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>52 Ensembles</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Masterpiece Crafts</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065f46', fontFamily: 'var(--font-display)' }}>100% Certified</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Silk & Handloom Mark</div>
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-heading)', fontFamily: 'var(--font-display)' }}>4 Generations</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>Family Coordinated</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE STATE CAROUSEL / VISUAL WEAVING RIBBON */}
      <section style={{ 
        padding: '2.5rem 0', 
        background: '#ffffff', 
        borderBottom: '1px solid var(--color-border)' 
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Pan-India Weave Map
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-heading)', marginTop: '2px' }}>
                Explore by State Craft
              </h2>
            </div>
            <Link to="/shop" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
              View All 13 States &rarr;
            </Link>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.85rem', 
            overflowX: 'auto', 
            paddingBottom: '0.75rem',
            scrollbarWidth: 'thin'
          }}>
            {STATE_RIBBON.map((st) => (
              <Link 
                key={st.name} 
                to={`/shop?state=${encodeURIComponent(st.name)}`} 
                style={{ textDecoration: 'none', flexShrink: 0 }}
              >
                <div style={{
                  background: 'var(--bg-body)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'var(--transition)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{st.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-heading)' }}>{st.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{st.weave}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FOUR GENERATIONS OF HERITAGE (HIGH RETENTION & FAMILY SHOPPING) */}
      <section className="container" style={{ marginTop: '4.5rem', marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', fontWeight: 700 }}>
            Generational Cohesion
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--color-heading)' }}>
            Traditional Attire for the Whole Family
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.98rem', maxWidth: '640px', margin: '0.35rem auto 0' }}>
            Coordinate regional wedding and festival ensembles across 4 generations with guaranteed fabric purity.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {[
            { 
              title: "Women's Sarees & Poshaaks", 
              desc: "Kanjeevaram, Nauvari, Patola, Kasavu & Muga Silks", 
              link: "/womens", 
              badge: "Pure Mulberry Silk",
              accent: "#db2777",
              bgGradient: "linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%)",
              icon: "🥻"
            },
            { 
              title: "Men's Royal Kurtas & Dhotis", 
              desc: "Silk Veshtis, Angrakhas, Peshwai & Sherwani Sets", 
              link: "/mens", 
              badge: "13 State Ensembles",
              accent: "#2563eb",
              bgGradient: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
              icon: "🤴"
            },
            { 
              title: "Girls & Kids Ethnic Pattu", 
              desc: "Pattu Pavadai, Langa Voni, Ghagra Cholis & Frocks", 
              link: "/kids", 
              badge: "Soft Featherlight Cotton-Silk",
              accent: "#d97706",
              bgGradient: "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)",
              icon: "🌸"
            },
            { 
              title: "Grandparents & Elders Handlooms", 
              desc: "Pure Khadi Dhotis, Madisar, Dhabla & Pashmina Shawls", 
              link: "/seniors", 
              badge: "Gentle Organic Drape",
              accent: "#059669",
              bgGradient: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)",
              icon: "🕊️"
            }
          ].map((cat, idx) => (
            <Link key={idx} to={cat.link} style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: cat.bgGradient, 
                border: '1px solid var(--color-border)', 
                borderRadius: '16px', 
                padding: '2rem 1.6rem',
                transition: 'var(--transition)',
                boxShadow: 'var(--shadow-sm)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-5px)'; 
                e.currentTarget.style.borderColor = cat.accent;
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'none'; 
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: cat.accent, 
                      background: '#ffffff',
                      border: `1px solid ${cat.accent}40`,
                      padding: '2px 8px',
                      borderRadius: '100px',
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px' 
                    }}>
                      {cat.badge}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                    {cat.title}
                  </h3>
                  <p style={{ color: 'var(--color-body)', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
                    {cat.desc}
                  </p>
                </div>

                <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: cat.accent }}>
                  <span>Explore Collection</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED ICONIC ATTIRES WITH QUICK VIEW & OCCASION TABS */}
      <section className="container" style={{ marginBottom: '5.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', fontWeight: 700 }}>
              Artisan Masterpieces
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--color-heading)' }}>
              Curated Traditional Attires
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: '0.25rem 0 0' }}>
              Handpicked heirloom attires for weddings, family ceremonies, and festive celebrations.
            </p>
          </div>
          
          <Link to="/shop" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem' }}>
            View All 52 Attires &rarr;
          </Link>
        </div>

        {/* Occasion Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
          {[
            { id: 'ALL', label: 'All Handlooms' },
            { id: 'BRIDAL', label: 'Royal Wedding & Bridal' },
            { id: 'WOMEN', label: "Women's Silks" },
            { id: 'MEN', label: "Men's Dhotis & Kurtas" },
            { id: 'KIDS', label: 'Girls Festive Pattu' },
            { id: 'ELDERS', label: 'Elders Pure Khadi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveOccasion(tab.id)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: 'var(--button-border-radius)',
                fontSize: '0.86rem',
                fontWeight: 600,
                background: activeOccasion === tab.id ? 'var(--color-heading)' : '#ffffff',
                color: activeOccasion === tab.id ? '#ffffff' : 'var(--color-body)',
                border: `1px solid ${activeOccasion === tab.id ? 'var(--color-heading)' : 'var(--color-border)'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="loading">Curating authentic state collection...</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.slice(0, 8).map((product, index) => {
              const mrp = Math.round(product.basePrice * 1.25);
              const discountPercent = Math.round(((mrp - product.basePrice) / mrp) * 100);
              const isWishlisted = isInWishlist(product.id);

              return (
                <div key={product.id} className="product-card" style={{ animationDelay: `${0.04 * index}s` }}>
                  {/* Floating Actions (Wishlist & Quick View) */}
                  <div className="card-action-overlay">
                    <button
                      className={`card-icon-btn ${isWishlisted ? 'wishlist-active' : ''}`}
                      onClick={() => toggleWishlist(product)}
                      title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                      aria-label="Wishlist toggle"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill={isWishlisted ? "#dc2626" : "none"} stroke={isWishlisted ? "#dc2626" : "currentColor"} strokeWidth="2.2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                    <button
                      className="card-icon-btn"
                      onClick={() => setQuickViewProduct(product)}
                      title="Quick Drape & Size Preview"
                      aria-label="Quick View"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>

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
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

                    <div className="product-category" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{product.category?.name}</span>
                      <span style={{ color: '#b45309', fontSize: '0.72rem', fontWeight: 700 }}>★ 4.9 (38)</span>
                    </div>
                    
                    <h3 className="product-title" style={{ minHeight: '2.8rem' }}>
                      {product.name}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <span className="product-price" style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 800 }}>
                        ₹{product.basePrice.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
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
                    <button 
                      className="btn" 
                      style={{ padding: '0.65rem 0.95rem', fontSize: '0.88rem', width: 'auto' }}
                      onClick={() => setQuickViewProduct(product)}
                      title="Quick Preview"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. ARTISAN VALUES & PROVENANCE SECTION */}
      <section style={{ 
        background: '#ffffff', 
        borderTop: '1px solid var(--color-border)', 
        borderBottom: '1px solid var(--color-border)',
        padding: '4rem 1.5rem',
        marginBottom: '5rem'
      }}>
        <div className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '2.5rem', 
          textAlign: 'center' 
        }}>
          <div>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              margin: '0 auto 1.25rem', 
              background: '#fef3c7', 
              border: '1px solid #fde68a', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              📦
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--color-heading)' }}>
              Free Pan-India Express Delivery
            </h4>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', margin: 0 }}>
              Zero shipping fee on all handloom orders above ₹1,999. Fast tracked dispatch.
            </p>
          </div>

          <div>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              margin: '0 auto 1.25rem', 
              background: '#dcfce7', 
              border: '1px solid #bbf7d0', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🪡
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--color-heading)' }}>
              100% Silk Mark Certified
            </h4>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', margin: 0 }}>
              Genuine certified silk & GI handlooms sourced straight from weaver clusters.
            </p>
          </div>

          <div>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              margin: '0 auto 1.25rem', 
              background: '#eff6ff', 
              border: '1px solid #bfdbfe', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              👨‍👩‍👧‍👦
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--color-heading)' }}>
              Matching Family Ensembles
            </h4>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', margin: 0 }}>
              Coordinated colors & motifs for Men, Women, Children, and Grandparents.
            </p>
          </div>

          <div>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              margin: '0 auto 1.25rem', 
              background: '#fdf2f4', 
              border: '1px solid #fecdd3', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🛡️
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--color-heading)' }}>
              7-Day Easy Exchange
            </h4>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', margin: 0 }}>
              Hassle-free size, length, and drape exchange support across India.
            </p>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED BUYER TESTIMONIALS & REVIEWS (SOCIAL PROOF) */}
      <section className="container" style={{ marginBottom: '5.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', fontWeight: 700 }}>
            Patron Love
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--color-heading)' }}>
            Loved by Families Across India
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.98rem', maxWidth: '640px', margin: '0.35rem auto 0' }}>
            Read genuine reflections from families who wore Ragyai weaves to their most cherished celebrations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
          {CUSTOMER_REVIEWS.map((rev, i) => (
            <div 
              key={i} 
              style={{ 
                background: '#ffffff', 
                border: '1px solid var(--color-border)', 
                borderRadius: '16px', 
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ color: '#d97706', fontSize: '1rem', letterSpacing: '2px' }}>
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', background: '#dcfce7', padding: '2px 7px', borderRadius: '100px', fontWeight: 700 }}>
                    Verified
                  </span>
                </div>
                
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                  "{rev.title}"
                </h4>
                
                <p style={{ color: 'var(--color-body)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  {rev.text}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-heading)' }}>{rev.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{rev.city}, {rev.state}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 600, marginTop: '2px' }}>Attire: {rev.attire}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PAN-INDIA WEAVERS BANNER */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #141416 0%, #27272a 100%)', 
          borderRadius: '24px', 
          padding: '4.5rem 2rem', 
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(217, 119, 6, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }}></div>

          <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#f59e0b', fontWeight: 800 }}>
            Preserving Living Artisan Legacies
          </span>
          
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#ffffff', margin: '0.65rem 0 1.25rem' }}>
            52 Authentic Attires Across 13 States
          </h2>
          
          <p style={{ color: '#d4d4d8', maxWidth: '680px', margin: '0 auto 2.25rem', fontSize: '1.05rem', lineHeight: 1.65 }}>
            Every weave has a soul and a lineage. When you choose Ragyai, you directly support master generational artisans in Kanchipuram, Patan, Pochampally, and Varanasi.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-accent" style={{ padding: '0.95rem 2.5rem', fontSize: '1rem' }}>
              Explore State Catalog &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal Popup */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </main>
  );
}

export default Home;

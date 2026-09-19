import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { api } from './services/api';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import CartDrawer from './components/CartDrawer';
import { 
  ShopAll, 
  Collections, 
  About, 
  SizeGuide, 
  Contact, 
  ReturnPolicy, 
  OrderConfirmation, 
  Dashboard, 
  Wishlist, 
  MensShop, 
  WomensShop, 
  KidsShop, 
  SeniorsShop 
} from './pages/StaticPages';
import { Login, Signup } from './pages/Auth';
import { CartProvider, CartContext } from './context/CartContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { WishlistProvider, WishlistContext } from './context/WishlistContext';
import SocialProofToast from './components/SocialProofToast';
import MobileBottomBar from './components/MobileBottomBar';
import './index.css';

// Top Announcement Bar (Luxury Indian Handloom Style)
const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <span>✨ <strong>Free Pan-India Express Delivery</strong> on Handloom Orders Over ₹1,999</span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span>100% Silk Mark & Handloom Certified</span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span style={{ color: '#f59e0b', fontWeight: 600 }}>Festival Code: FESTIVE10 (10% Off)</span>
    </div>
  );
};

// Sleek Luxury Sticky Header with Live Search & Dynamic Account
const Header = () => {
  const { cartCount, setIsCartOpen } = useContext(CartContext);
  const { wishlistCount, toastMessage } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Real-time live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await api.getProducts({ search: searchQuery.trim() });
      setSearchResults(results.slice(0, 6));
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {toastMessage && (
        <div className="wishlist-toast-banner">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
      <header className="header" style={{ position: 'relative' }}>
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '2px', color: '#141416' }}>RAGYAI</span>
          <span className="logo-sub" style={{ background: '#fffbeb', borderColor: '#fcd34d', color: '#b45309' }}>HERITAGE</span>
        </Link>
        
        <nav style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>13 States</Link>
          <Link to="/womens" className={`nav-link ${isActive('/womens') ? 'active' : ''}`}>Women</Link>
          <Link to="/mens" className={`nav-link ${isActive('/mens') ? 'active' : ''}`}>Men</Link>
          <Link to="/kids" className={`nav-link ${isActive('/kids') ? 'active' : ''}`}>Girls & Kids</Link>
          <Link to="/seniors" className={`nav-link ${isActive('/seniors') ? 'active' : ''}`}>Grandparents</Link>
          <Link to="/collections" className={`nav-link ${isActive('/collections') ? 'active' : ''}`}>Collections</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Live Search Trigger Button */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            style={{ 
              color: isSearchOpen ? 'var(--accent)' : 'var(--color-heading)', 
              fontSize: '1.1rem', 
              padding: '0.45rem', 
              display: 'flex', 
              alignItems: 'center',
              background: isSearchOpen ? 'var(--accent-light)' : 'transparent',
              borderRadius: '50%',
              transition: 'var(--transition)'
            }} 
            title="Search Traditional Handlooms"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          <Link to="/wishlist" style={{ color: 'var(--color-heading)', fontSize: '1.1rem', padding: '0.35rem', display: 'flex', alignItems: 'center', position: 'relative' }} title="My Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistCount > 0 ? "rgba(220, 38, 38, 0.15)" : "none"} stroke={wishlistCount > 0 ? "#dc2626" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {wishlistCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-2px', 
                right: '-4px', 
                background: '#dc2626', 
                color: '#ffffff', 
                borderRadius: '50%', 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                width: '16px', 
                height: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Dynamic Account Link */}
          {user ? (
            <Link 
              to="/dashboard" 
              style={{ 
                color: 'var(--color-heading)', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                padding: '0.35rem 0.65rem', 
                borderRadius: '100px', 
                background: 'var(--bg-body)', 
                border: '1px solid var(--color-border)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.45rem', 
                textDecoration: 'none' 
              }} 
              title="My Account Dashboard"
            >
              <span style={{ maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || user.email.split('@')[0]}
              </span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          ) : (
            <Link to="/login" style={{ color: 'var(--color-heading)', fontSize: '1.1rem', padding: '0.35rem', display: 'flex', alignItems: 'center' }} title="Sign In">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="cart-pill"
            title="Open Bag"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Bag ({cartCount})</span>
          </button>
        </div>

        {/* Live Interactive Search Dropdown Bar */}
        {isSearchOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 100,
            padding: '1.25rem 2rem',
            animation: 'fadeInUp 0.2s ease-out'
          }}>
            <div className="container" style={{ maxWidth: '850px' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 52 authentic ensembles: 'Kanjeevaram', 'Patan Patola', 'Pashmina', 'Dhoti'..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem 0.85rem 2.85rem',
                      borderRadius: '12px',
                      border: '1.5px solid var(--accent)',
                      fontSize: '0.98rem',
                      fontFamily: 'var(--font-family)',
                      outline: 'none',
                      background: 'var(--bg-body)'
                    }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)' }}>
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '0.9rem' }}>
                  Search
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#64748b', cursor: 'pointer', padding: '0.5rem' }}
                  title="Close Search"
                >
                  ✕
                </button>
              </form>

              {/* Quick Search Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: searchResults.length > 0 ? '1rem' : '0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>Trending Weaves:</span>
                {['Kanjeevaram', 'Patola', 'Kasavu', 'Bandhani', 'Pashmina', 'Nauvari'].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setSearchQuery(chip);
                      navigate(`/shop?search=${encodeURIComponent(chip)}`);
                      setIsSearchOpen(false);
                    }}
                    style={{
                      background: 'var(--bg-body)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '100px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.78rem',
                      color: 'var(--color-heading)',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Live Search Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted)', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
                    Matching Traditional Ensembles ({searchResults.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {searchResults.map((item) => (
                      <div
                        key={item.slug}
                        onClick={() => {
                          navigate(`/product/${item.slug}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.6rem 0.85rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--bg-body)',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent)';
                          e.currentTarget.style.background = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.background = 'var(--bg-body)';
                        }}
                      >
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                            {item.state} • ₹{item.basePrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      View all results for "{searchQuery}" &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

// Premium E-Commerce Footer (Tones Fashion Aesthetic)
const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  return (
    <footer style={{ background: '#111827', color: '#f3f4f6', paddingTop: '5rem', paddingBottom: '3rem', marginTop: '6rem' }}>
      <div className="container">
        {/* Newsletter Section */}
        <div style={{ 
          background: '#1f2937', 
          borderRadius: '16px', 
          padding: '2.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '2rem',
          marginBottom: '4.5rem',
          border: '1px solid #374151'
        }}>
          <div style={{ maxWidth: '500px' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 700 }}>
              Join the Ragyai Heritage Circle
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0 }}>
              Be first to discover rare regional handloom drops, artisan stories, and exclusive festival discounts.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '450px' }}>
            {subscribed ? (
              <div style={{ background: '#065f46', color: '#a7f3d0', padding: '0.75rem 1.25rem', borderRadius: '25px', fontWeight: 600, width: '100%', textAlign: 'center' }}>
                ✓ Welcome! You're subscribed to Ragyai Heritage updates.
              </div>
            ) : (
              <>
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.8rem 1.25rem',
                    borderRadius: '25px',
                    border: '1px solid #4b5563',
                    background: '#111827',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-accent" style={{ padding: '0.8rem 1.5rem', whiteSpace: 'nowrap' }}>
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#ffffff', marginBottom: '1rem' }}>
              RAGYAI
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Preserving and celebrating India's heirloom weaves and traditional attires across all 28 states and Union Territories. Crafted by master cooperative artisans.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ background: '#1f2937', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', color: '#ff9933', border: '1px solid #374151' }}>
                Silk Mark Certified
              </span>
              <span style={{ background: '#1f2937', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', color: '#10b981', border: '1px solid #374151' }}>
                Handloom Mark
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
              Traditional Attire
            </h4>
            <Link to="/shop" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>All Indian States (52 Attires)</Link>
            <Link to="/mens" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Men's Dhotis & Sherwanis</Link>
            <Link to="/womens" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Women's Sarees & Poshaaks</Link>
            <Link to="/kids" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Girls & Kids Pattu Pavadai</Link>
            <Link to="/seniors" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Grandparents / Elders Weaves</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
              Explore & Heritage
            </h4>
            <Link to="/collections" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Festival Collections</Link>
            <Link to="/about" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Our Weavers & Clusters</Link>
            <Link to="/size-guide" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Draping & Sizing Guide</Link>
            <Link to="/cart" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Shopping Bag</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
              Customer Assistance
            </h4>
            <Link to="/contact" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Weaver Helpdesk</Link>
            <Link to="/returns" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>7-Day Easy Exchange</Link>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
              Need styling assistance?<br />
              <strong style={{ color: '#ffffff' }}>support@ragyai.com</strong><br />
              Mon - Sat (9am - 7pm IST)
            </p>
          </div>
        </div>

        {/* Bottom Trust & Copyright Row */}
        <div style={{ 
          borderTop: '1px solid #1f2937', 
          paddingTop: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#6b7280'
        }}>
          <div>
            &copy; {new Date().getFullYear()} RAGYAI. All rights reserved. Celebrating Pan-India Weave Heritage.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              256-Bit SSL Encrypted Checkout
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              UPI / Cards / Net Banking / COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Store Layout Wrapper (Allows open browsing of all store pages)
const StoreLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <SocialProofToast />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <MobileBottomBar />
      <Footer />
    </div>
  );
};

// Protected Route for personal user account data
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading">Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return <StoreLayout>{children}</StoreLayout>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              {/* Public Storefront Routes with Full Open Browsing */}
              <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
              <Route path="/shop" element={<StoreLayout><ShopAll /></StoreLayout>} />
              <Route path="/mens" element={<StoreLayout><MensShop /></StoreLayout>} />
              <Route path="/womens" element={<StoreLayout><WomensShop /></StoreLayout>} />
              <Route path="/kids" element={<StoreLayout><KidsShop /></StoreLayout>} />
              <Route path="/seniors" element={<StoreLayout><SeniorsShop /></StoreLayout>} />
              <Route path="/collections" element={<StoreLayout><Collections /></StoreLayout>} />
              <Route path="/product/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
              <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
              <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
              <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
              <Route path="/size-guide" element={<StoreLayout><SizeGuide /></StoreLayout>} />
              <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
              <Route path="/returns" element={<StoreLayout><ReturnPolicy /></StoreLayout>} />
              <Route path="/wishlist" element={<StoreLayout><Wishlist /></StoreLayout>} />
              
              {/* Authentication Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Authenticated User Pages */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/order-confirmation" element={<StoreLayout><OrderConfirmation /></StoreLayout>} />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

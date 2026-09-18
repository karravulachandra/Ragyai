import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
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
import './index.css';

// Top Announcement Bar (Tones Fashion Style)
const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <span><strong>Free Pan-India Express Delivery</strong> on Handloom Orders Over ₹1,999</span>
      <span style={{ opacity: 0.5 }}>|</span>
      <span>100% Authentic State Heritage Weaves</span>
      <span style={{ opacity: 0.5 }}>|</span>
      <span style={{ color: '#ff9933' }}>Use Code: FESTIVE10 for 10% Off</span>
    </div>
  );
};

// Sleek Sticky Header (Tones Fashion Style)
const Header = () => {
  const { cartCount, setIsCartOpen } = useContext(CartContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <Link to="/" className="logo">
        <span>RAGYAI</span>
        <span className="logo-sub">TRADITIONAL</span>
      </Link>
      
      <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>All States</Link>
        <Link to="/mens" className={`nav-link ${isActive('/mens') ? 'active' : ''}`}>Men</Link>
        <Link to="/womens" className={`nav-link ${isActive('/womens') ? 'active' : ''}`}>Women</Link>
        <Link to="/kids" className={`nav-link ${isActive('/kids') ? 'active' : ''}`}>Girls & Kids</Link>
        <Link to="/seniors" className={`nav-link ${isActive('/seniors') ? 'active' : ''}`}>Grandparents</Link>
        <Link to="/collections" className={`nav-link ${isActive('/collections') ? 'active' : ''}`}>Collections</Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/shop" style={{ color: 'var(--color-heading)', fontSize: '1.1rem', padding: '0.3rem' }} title="Search Attires">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </Link>
        
        <Link to="/login" style={{ color: 'var(--color-heading)', fontSize: '1.1rem', padding: '0.3rem' }} title="My Account">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>

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
    </header>
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
      <div style={{ flex: 1 }}>
        {children}
      </div>
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
            
            {/* Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Authenticated User Pages */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

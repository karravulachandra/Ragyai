import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import { ShopAll, Collections, About, SizeGuide, Contact, ReturnPolicy, OrderConfirmation, Dashboard, Wishlist, MensShop, KidsShop, SeniorsShop } from './pages/StaticPages';
import { Login, Signup } from './pages/Auth';
import { CartProvider, CartContext } from './context/CartContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './index.css';

const Header = () => {
  const { cartCount, setIsCartOpen } = useContext(CartContext);
  return (
    <header className="header">
      <Link to="/" className="logo">RAGYAI</Link>
      <nav style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
        <Link to="/shop" className="nav-link">All Products</Link>
        <Link to="/mens" className="nav-link">Men</Link>
        <Link to="/kids" className="nav-link">Kids</Link>
        <Link to="/seniors" className="nav-link">Elders</Link>
        <Link to="/collections" className="nav-link">Collections</Link>
        <Link to="/login" className="nav-link" style={{fontSize: '1.2rem'}} title="Account">👤</Link>
        <button onClick={() => setIsCartOpen(true)} className="cart-pill" style={{cursor: 'pointer'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {cartCount}
        </button>
      </nav>
    </header>
  );
};

// Footer component
const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--card-border)', padding: '4rem 2rem', marginTop: '6rem', background: 'var(--bg-dark)' }}>
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
      <div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>RAGYAI</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>The new standard in premium streetwear essentials.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Shop</h4>
        <Link to="/shop" style={{ color: 'var(--text-secondary)' }}>All Products</Link>
        <Link to="/mens" style={{ color: 'var(--text-secondary)' }}>Men's Wear</Link>
        <Link to="/kids" style={{ color: 'var(--text-secondary)' }}>Kids Wear</Link>
        <Link to="/seniors" style={{ color: 'var(--text-secondary)' }}>Elders Collection</Link>
        <Link to="/collections" style={{ color: 'var(--text-secondary)' }}>Collections</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Brand</h4>
        <Link to="/about" style={{ color: 'var(--text-secondary)' }}>Our Story</Link>
        <Link to="/size-guide" style={{ color: 'var(--text-secondary)' }}>Size Guide</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Support</h4>
        <Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Help Center</Link>
        <Link to="/returns" style={{ color: 'var(--text-secondary)' }}>Returns & Refunds</Link>
      </div>
    </div>
  </footer>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'}}>Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="container" style={{ flex: 1 }}>
        <Header />
        <CartDrawer />
        {children}
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes (Header, Footer, and Cart exist inside ProtectedRoute) */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><ShopAll /></ProtectedRoute>} />
            <Route path="/mens" element={<ProtectedRoute><MensShop /></ProtectedRoute>} />
            <Route path="/kids" element={<ProtectedRoute><KidsShop /></ProtectedRoute>} />
            <Route path="/seniors" element={<ProtectedRoute><SeniorsShop /></ProtectedRoute>} />
            <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
            <Route path="/product/:slug" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/size-guide" element={<ProtectedRoute><SizeGuide /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/returns" element={<ProtectedRoute><ReturnPolicy /></ProtectedRoute>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

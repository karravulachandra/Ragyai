import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import QuickViewModal from '../components/QuickViewModal';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts';

const INDIAN_STATES = [
  'All States',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Kerala',
  'Karnataka',
  'Maharashtra',
  'Gujarat',
  'Rajasthan',
  'Punjab',
  'West Bengal',
  'Jammu & Kashmir',
  'Assam',
  'Odisha'
];

const DEMOGRAPHICS = [
  { id: 'ALL', label: 'All Attires' },
  { id: 'MEN', label: "Men's Wear" },
  { id: 'WOMEN', label: "Women's Wear" },
  { id: 'GIRLS', label: 'Kids & Girls' },
  { id: 'GRANDPARENTS', label: 'Grandparents' }
];

export const TraditionalCatalog = ({ 
  initialDemographic = 'ALL', 
  pageTitle = 'Indian States Traditional Dresses', 
  pageSubtitle = 'Explore authentic state-wise handwoven traditional attire for Men, Women, Kids, and Grandparents across India.' 
}) => {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedDemographic, setSelectedDemographic] = useState(initialDemographic);
  const [selectedState, setSelectedState] = useState('All States');
  const [priceRange, setPriceRange] = useState('ALL'); // 'ALL', 'UNDER_5000', '5000_10000', 'ABOVE_10000'
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('state-wise'); // 'state-wise' or 'grid'
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [addedSlug, setAddedSlug] = useState(null);

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

  // Filter products locally for instant, zero-latency responsiveness
  const filteredProducts = products.filter(p => {
    // Demographic filter
    if (selectedDemographic !== 'ALL') {
      const target = (p.targetGroup || '').toUpperCase();
      if (selectedDemographic === 'MEN' && target !== 'MEN') return false;
      if (selectedDemographic === 'WOMEN' && target !== 'WOMEN') return false;
      if (selectedDemographic === 'GIRLS' && target !== 'GIRLS') return false;
      if (selectedDemographic === 'GRANDPARENTS' && target !== 'GRANDPARENTS') return false;
    }

    // State filter
    if (selectedState !== 'All States') {
      if (p.state !== selectedState) return false;
    }

    // Price range filter
    if (priceRange === 'UNDER_5000' && p.basePrice >= 5000) return false;
    if (priceRange === '5000_10000' && (p.basePrice < 5000 || p.basePrice > 10000)) return false;
    if (priceRange === 'ABOVE_10000' && p.basePrice <= 10000) return false;

    // Stock availability
    if (onlyInStock) {
      const hasStock = p.variants?.some(v => v.inventory > 0) ?? true;
      if (!hasStock) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchState = (p.state || '').toLowerCase().includes(q);
      const matchCat = (p.category?.name || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchState && !matchCat) return false;
    }

    return true;
  });

  // Calculate active filter count
  const activeFilterCount = (selectedDemographic !== 'ALL' ? 1 : 0) +
    (selectedState !== 'All States' ? 1 : 0) +
    (priceRange !== 'ALL' ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedDemographic('ALL');
    setSelectedState('All States');
    setPriceRange('ALL');
    setOnlyInStock(false);
    setSearchQuery('');
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
    if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Group by State for State-Wise placement
  const stateGroups = INDIAN_STATES.filter(s => s !== 'All States').map(stateName => {
    const stateProducts = sortedProducts.filter(p => p.state === stateName);
    return {
      state: stateName,
      products: stateProducts,
      region: stateProducts[0]?.region || 'Heritage'
    };
  }).filter(group => group.products.length > 0);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.variants || product.variants.length === 0) return;
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

  const renderProductCard = (product, index) => {
    const hasInventory = product.variants?.some(v => v.inventory > 0) ?? true;
    const mrp = Math.round(product.basePrice * 1.25);
    const discountPercent = Math.round(((mrp - product.basePrice) / mrp) * 100);
    const isWishlisted = isInWishlist(product.id);

    return (
      <div 
        key={product.id} 
        className="product-card" 
        style={{ animationDelay: `${Math.min(0.8, 0.04 * index)}s` }}
      >
        {/* Floating Quick Action Overlay (Wishlist & Quick View) */}
        <div className="card-action-overlay">
          <button
            className={`card-icon-btn ${isWishlisted ? 'wishlist-active' : ''}`}
            onClick={() => toggleWishlist(product)}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label="Wishlist toggle"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill={isWishlisted ? "#dc2626" : "none"} stroke={isWishlisted ? "#dc2626" : "currentColor"} strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          <button
            className="card-icon-btn"
            onClick={() => setQuickViewProduct(product)}
            title="Quick Preview"
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

            {/* State Badge with Clean Pin SVG */}
            {product.state && (
              <div className="badge-state">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{product.state}</span>
              </div>
            )}

            {/* Demographic Tag */}
            {product.targetGroup && (
              <div 
                className="badge-demographic"
                style={{ background: getDemographicBadgeColor(product.targetGroup) }}
              >
                {product.targetGroup === 'GRANDPARENTS' ? 'ELDERS' : product.targetGroup}
              </div>
            )}

            {/* Stock Urgency Badge */}
            <div style={{ 
              position: 'absolute', 
              top: '0.75rem', 
              left: product.state ? 'auto' : '0.75rem',
              right: '3.25rem', 
              background: hasInventory ? '#dcfce7' : '#fee2e2', 
              color: hasInventory ? '#15803d' : '#b91c1c', 
              padding: '0.2rem 0.55rem', 
              borderRadius: '100px', 
              fontSize: '0.68rem', 
              fontWeight: 700, 
              border: `1px solid ${hasInventory ? '#bbf7d0' : '#fecaca'}`,
              zIndex: 2
            }}>
              {hasInventory ? 'In Stock' : 'Sold Out'}
            </div>
          </div>

          <div className="product-category" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{product.category?.name}</span>
            <span style={{ color: '#b45309', fontSize: '0.72rem', fontWeight: 700 }}>★ 4.9 (38)</span>
          </div>

          <h3 className="product-title" style={{ minHeight: '2.8rem' }}>
            {product.name}
          </h3>

          <p style={{ 
            color: '#64748b', 
            fontSize: '0.84rem', 
            lineHeight: 1.5, 
            marginBottom: '0.85rem', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="product-price" style={{ margin: 0, fontWeight: 800 }}>
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
            style={{ flex: 1, padding: '0.65rem', fontSize: '0.88rem' }}
            onClick={(e) => handleQuickAdd(e, product)}
          >
            {addedSlug === product.slug ? '✓ In Bag!' : '+ Add to Bag'}
          </button>
          <button 
            className="btn" 
            style={{ padding: '0.65rem 0.95rem', fontSize: '0.88rem', width: 'auto' }}
            onClick={() => setQuickViewProduct(product)}
            title="Quick Drape Preview"
          >
            Preview
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Catalog Header */}
      <div className="catalog-header">
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: '#fff7ed', 
          border: '1px solid #fed7aa', 
          color: '#c2410c', 
          padding: '0.35rem 1rem', 
          borderRadius: '100px', 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          letterSpacing: '1px', 
          textTransform: 'uppercase',
          marginBottom: '1rem' 
        }}>
          <span>AUTHENTIC WEAVES & HERITAGE ENSEMBLES</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '0.75rem', color: '#18181b' }}>
          {pageTitle}
        </h1>
        <p style={{ color: '#4b5563', maxWidth: '780px', margin: '0 auto 2rem', fontSize: '1.02rem', lineHeight: 1.6 }}>
          {pageSubtitle}
        </p>
      </div>

      {/* 1. Sleek Demographic Tabs (No Emojis, Pure Luxury Typography) */}
      <div className="demographic-tabs">
        {DEMOGRAPHICS.map(tab => {
          const count = tab.id === 'ALL' 
            ? products.length 
            : products.filter(p => (p.targetGroup || '').toUpperCase() === tab.id).length;
          return (
            <button
              key={tab.id}
              className={`demo-tab-btn ${selectedDemographic === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedDemographic(tab.id)}
            >
              <span>{tab.label}</span>
              <span style={{ 
                fontSize: '0.72rem', 
                fontWeight: 700,
                background: selectedDemographic === tab.id ? 'rgba(255,255,255,0.22)' : '#f4f4f5', 
                color: selectedDemographic === tab.id ? '#ffffff' : '#4b5563',
                padding: '1px 7px', 
                borderRadius: '10px' 
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Modern E-Commerce Filter & Utility Toolbar */}
      <div className="filter-toolbar">
        {/* Left Side: Filter Drawer Trigger, State & Price Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button 
            className="filter-trigger-btn"
            onClick={() => setIsFilterDrawerOpen(true)}
            title="Open comprehensive filters"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge-count">{activeFilterCount}</span>
            )}
          </button>

          {/* Quick State Dropdown */}
          <select 
            value={selectedState} 
            onChange={(e) => setSelectedState(e.target.value)}
            className="sort-select"
            title="Filter by State"
          >
            {INDIAN_STATES.map(st => (
              <option key={st} value={st}>
                {st === 'All States' ? 'State: All States' : `State: ${st}`}
              </option>
            ))}
          </select>

          {/* Price Range Dropdown */}
          <select 
            value={priceRange} 
            onChange={(e) => setPriceRange(e.target.value)}
            className="sort-select"
            title="Filter by Price"
          >
            <option value="ALL">Price: All</option>
            <option value="UNDER_5000">Under ₹5,000</option>
            <option value="5000_10000">₹5,000 - ₹10,000</option>
            <option value="ABOVE_10000">Above ₹10,000</option>
          </select>
        </div>

        {/* Center: Search Box with Modern SVG Icon */}
        <div className="search-input-box">
          <span className="search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Search weaves, dhotis, sarees..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>&times;</button>
          )}
        </div>

        {/* Right Side: View Mode Toggle & Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div className="view-mode-toggle">
            <button 
              className={`view-mode-btn ${viewMode === 'state-wise' ? 'active' : ''}`}
              onClick={() => setViewMode('state-wise')}
              title="Group attires state by state"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>By State</span>
            </button>
            <button 
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="View all in unified grid"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Grid View</span>
            </button>
          </div>

          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 3. Horizontal State Pill Ribbon */}
      <div className="quick-state-bar">
        {INDIAN_STATES.map(state => (
          <button
            key={state}
            className={`quick-state-pill ${selectedState === state ? 'active' : ''}`}
            onClick={() => setSelectedState(state)}
          >
            {state === 'All States' ? 'All States (13)' : state}
          </button>
        ))}
      </div>

      {/* 4. Active Filters Removable Chips */}
      {activeFilterCount > 0 && (
        <div className="active-filters-row">
          <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Active Filters:</span>
          
          {selectedDemographic !== 'ALL' && (
            <span className="active-filter-tag">
              Family: <strong>{selectedDemographic}</strong>
              <button onClick={() => setSelectedDemographic('ALL')}>&times;</button>
            </span>
          )}

          {selectedState !== 'All States' && (
            <span className="active-filter-tag">
              State: <strong>{selectedState}</strong>
              <button onClick={() => setSelectedState('All States')}>&times;</button>
            </span>
          )}

          {priceRange !== 'ALL' && (
            <span className="active-filter-tag">
              Price: <strong>{priceRange === 'UNDER_5000' ? 'Under ₹5,000' : priceRange === '5000_10000' ? '₹5k-₹10k' : 'Above ₹10k'}</strong>
              <button onClick={() => setPriceRange('ALL')}>&times;</button>
            </span>
          )}

          {onlyInStock && (
            <span className="active-filter-tag">
              <strong>In Stock Only</strong>
              <button onClick={() => setOnlyInStock(false)}>&times;</button>
            </span>
          )}

          {searchQuery && (
            <span className="active-filter-tag">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')}>&times;</button>
            </span>
          )}

          <button className="clear-all-filters-btn" onClick={resetAllFilters}>
            Clear All
          </button>
        </div>
      )}

      {/* Slide-Over Filter Drawer */}
      {isFilterDrawerOpen && (
        <>
          <div className="filter-drawer-overlay" onClick={() => setIsFilterDrawerOpen(false)}></div>
          <div className="filter-drawer">
            <div className="filter-drawer-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181b', margin: 0 }}>Filter Attires</h3>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  {sortedProducts.length} authentic outfits found
                </span>
              </div>
              <button onClick={() => setIsFilterDrawerOpen(false)} className="close-btn" style={{ fontSize: '1.75rem' }}>&times;</button>
            </div>

            <div className="filter-drawer-body">
              {/* Section 1: Demographics */}
              <div>
                <div className="filter-section-title">Demographic / Wearer</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {DEMOGRAPHICS.map(d => {
                    const isSelected = selectedDemographic === d.id;
                    const count = d.id === 'ALL' 
                      ? products.length 
                      : products.filter(p => (p.targetGroup || '').toUpperCase() === d.id).length;
                    return (
                      <div 
                        key={d.id} 
                        className={`filter-option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedDemographic(d.id)}
                      >
                        <span>{d.label}</span>
                        <span style={{ fontSize: '0.78rem', color: isSelected ? '#c2410c' : '#9ca3af' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Indian State */}
              <div>
                <div className="filter-section-title">Indian State of Origin</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {INDIAN_STATES.map(st => {
                    const isSelected = selectedState === st;
                    const count = st === 'All States' 
                      ? products.length 
                      : products.filter(p => p.state === st).length;
                    return (
                      <div 
                        key={st}
                        className={`filter-option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedState(st)}
                      >
                        <span>{st}</span>
                        <span style={{ fontSize: '0.78rem', color: isSelected ? '#c2410c' : '#9ca3af' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Price Range */}
              <div>
                <div className="filter-section-title">Price Range</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {[
                    { id: 'ALL', label: 'All Price Tiers' },
                    { id: 'UNDER_5000', label: 'Under ₹5,000' },
                    { id: '5000_10000', label: '₹5,000 - ₹10,000' },
                    { id: 'ABOVE_10000', label: 'Above ₹10,000' }
                  ].map(tier => (
                    <div 
                      key={tier.id}
                      className={`filter-option-item ${priceRange === tier.id ? 'selected' : ''}`}
                      onClick={() => setPriceRange(tier.id)}
                    >
                      <span>{tier.label}</span>
                      {priceRange === tier.id && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff9933" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Availability */}
              <div>
                <div className="filter-section-title">Availability</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.9rem', color: '#18181b', padding: '0.5rem 0.75rem' }}>
                  <input 
                    type="checkbox" 
                    checked={onlyInStock} 
                    onChange={e => setOnlyInStock(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#18181b', cursor: 'pointer' }}
                  />
                  <span>Show In Stock Items Only</span>
                </label>
              </div>
            </div>

            <div className="filter-drawer-footer">
              <button 
                className="btn" 
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={resetAllFilters}
              >
                Reset All
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => setIsFilterDrawerOpen(false)}
              >
                Apply ({sortedProducts.length})
              </button>
            </div>
          </div>
        </>
      )}

      {/* Results Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: 500 }}>
          Showing <strong style={{ color: '#18181b', fontSize: '1.1rem' }}>{sortedProducts.length}</strong> of {products.length} Traditional Attires
        </span>
        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Authentic Regional Weaves Direct from Artisans
        </span>
      </div>

      {/* Product Display */}
      {loading ? (
        <div className="loading">Loading state traditional outfits...</div>
      ) : sortedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ width: '56px', height: '56px', margin: '0 auto 1rem', background: '#f4f4f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: '#18181b' }}>
            No traditional attires match your filters
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Try resetting your filters or clearing search terms to explore all 52 regional attires.
          </p>
          <button 
            className="btn btn-primary"
            onClick={resetAllFilters}
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'state-wise' ? (
        /* STATE-WISE SECTIONS */
        <div>
          {stateGroups.map((group) => (
            <div key={group.state} className="state-group-section">
              <div className="state-group-header">
                <div className="state-group-title">
                  <div className="state-flag-icon" style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <div>
                    <h2 className="state-group-name">{group.state}</h2>
                    <div className="state-group-subtitle">
                      {group.products.length} Attires • {group.region} India Traditional Collection
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="state-region-badge">{group.region} India</span>
                  <button 
                    onClick={() => { setSelectedState(group.state); setViewMode('grid'); }}
                    className="btn"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                  >
                    View Only {group.state} &rarr;
                  </button>
                </div>
              </div>

              <div className="state-grid-4col">
                {group.products.map((product, pIdx) => renderProductCard(product, pIdx))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* UNIFIED GRID VIEW */
        <div className="product-grid">
          {sortedProducts.map((product, idx) => renderProductCard(product, idx))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
};

// Specialized Storefront Pages
export const ShopAll = () => (
  <TraditionalCatalog 
    initialDemographic="ALL" 
    pageTitle="All Indian States Traditional Dresses"
    pageSubtitle="Explore iconic regional weaves and ethnic garments from Andhra Pradesh, Telangana, Tamil Nadu, Kerala, Karnataka, Maharashtra, Gujarat, Rajasthan, Punjab, Bengal, Kashmir, Assam, and Odisha for Men, Women, Kids, and Grandparents."
  />
);

export const MensShop = () => (
  <TraditionalCatalog 
    initialDemographic="MEN" 
    pageTitle="Men's Traditional Indian Wear"
    pageSubtitle="State-wise Royal Sherwanis, pure silk Veshtis, Angrakhas, Dhoti Kurtas, and Bandhgalas representing authentic traditions across all Indian states."
  />
);

export const WomensShop = () => (
  <TraditionalCatalog 
    initialDemographic="WOMEN" 
    pageTitle="Women's Traditional Indian Wear"
    pageSubtitle="State-wise Opulent Kanjeevaram silks, Nauvari sarees, Kasavu set mundus, Bandhani poshaaks, Patola, and Sambalpuri Ikkat weaves."
  />
);

export const KidsShop = () => (
  <TraditionalCatalog 
    initialDemographic="GIRLS" 
    pageTitle="Girls & Kids Traditional Ethnic Wear"
    pageSubtitle="State-wise Vibrant Pattu Pavadais, Langa Vonis, Chaniya Cholis, and Punjabi Salwar Suits crafted gently for little girls."
  />
);

export const SeniorsShop = () => (
  <TraditionalCatalog 
    initialDemographic="GRANDPARENTS" 
    pageTitle="Grandparents & Elders Handloom Collection"
    pageSubtitle="State-wise Ultra-breathable handspun Khadi Dhotis, pure cotton Mangalagiri kurtas, Madisar 9-yard sarees, and thermal Pashmina shawls tailored for elders' comfort."
  />
);

export const Collections = () => (
  <TraditionalCatalog 
    initialDemographic="ALL" 
    pageTitle="State & Cultural Heritage Collections"
    pageSubtitle="Browse the pan-Indian traditional wardrobe curated by state and generation."
  />
);

export const About = () => (
  <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '800px' }}>
    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff9933', fontWeight: 700 }}>
      Artisan Roots
    </span>
    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0.25rem 0 2rem', color: '#18181b' }}>Our Heritage & Weavers</h1>
    <div style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <p>Ragyai is dedicated to celebrating the peerless textile diversity of India. From the temple borders of Tamil Nadu to the snow peaks of Kashmir, our collections preserve and honor indigenous handlooms.</p>
      <p>We work directly with master weavers in Kanchipuram, Pochampally, Varanasi, Patan, and Sualkuchi to bring heirloom-quality traditional attire for the entire family: Men, Women, Children, and Grandparents.</p>
      <p>Every purchase directly empowers generational weavers and keeps India's living cultural legacy vibrant.</p>
    </div>
  </div>
);

export const SizeGuide = () => (
  <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '860px' }}>
    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff9933', fontWeight: 700 }}>
      Measurement Manual
    </span>
    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0.25rem 0 1rem', color: '#18181b' }}>Traditional Wear Size Guide</h1>
    <p style={{ color: '#6b7280', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
      Our sarees and dhotis come in standard traditional lengths (Free Size / 6 Yards / 9 Yards / 4 Meters). For stitched kurtas, sherwanis, and blouses, refer to our sizing chart below:
    </p>
    <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #e5e7eb' }}>
          <tr>
            <th style={{ padding: '1rem 1.25rem', color: '#18181b', fontWeight: 700 }}>Size</th>
            <th style={{ padding: '1rem 1.25rem', color: '#18181b', fontWeight: 700 }}>Chest / Bust (in)</th>
            <th style={{ padding: '1rem 1.25rem', color: '#18181b', fontWeight: 700 }}>Waist (in)</th>
            <th style={{ padding: '1rem 1.25rem', color: '#18181b', fontWeight: 700 }}>Length (in)</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>S (38)</td>
            <td style={{ padding: '1rem 1.25rem' }}>38</td>
            <td style={{ padding: '1rem 1.25rem' }}>32 - 34</td>
            <td style={{ padding: '1rem 1.25rem' }}>40</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>M (40)</td>
            <td style={{ padding: '1rem 1.25rem' }}>40</td>
            <td style={{ padding: '1rem 1.25rem' }}>34 - 36</td>
            <td style={{ padding: '1rem 1.25rem' }}>42</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>L (42)</td>
            <td style={{ padding: '1rem 1.25rem' }}>42</td>
            <td style={{ padding: '1rem 1.25rem' }}>36 - 38</td>
            <td style={{ padding: '1rem 1.25rem' }}>44</td>
          </tr>
          <tr>
            <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>XL (44)</td>
            <td style={{ padding: '1rem 1.25rem' }}>44</td>
            <td style={{ padding: '1rem 1.25rem' }}>38 - 42</td>
            <td style={{ padding: '1rem 1.25rem' }}>45</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const Contact = () => (
  <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '640px' }}>
    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff9933', fontWeight: 700 }}>
      Weaver Support
    </span>
    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0.25rem 0 1rem', color: '#18181b' }}>Handloom Concierge</h1>
    <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
      Have questions regarding authentic weaves, customized bridal bridal sets, or regional draping styles? Our cultural stylists are here to assist.
    </p>
    <a href="mailto:support@ragyai.com" className="btn btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '1rem' }}>
      Email Handloom Stylist &rarr;
    </a>
  </div>
);

export const ReturnPolicy = () => (
  <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '800px' }}>
    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#ff9933', fontWeight: 700 }}>
      Authenticity Promise
    </span>
    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0.25rem 0 1.5rem', color: '#18181b' }}>Handloom Authenticity & Returns</h1>
    <p style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1.05rem' }}>
      All our traditional sarees and dhotis come with Silk Mark / Handloom Mark certification. We offer a 7-day hassle-free inspection and exchange guarantee on unworn garments with original tags intact.
    </p>
  </div>
);

export const OrderConfirmation = () => (
  <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '600px' }}>
    <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.75rem', color: '#18181b' }}>Order Confirmed!</h1>
    <p style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
      Your traditional attire order has been received and is being carefully prepared by our master weavers.
    </p>
    <Link to="/shop" className="btn btn-primary" style={{ padding: '0.9rem 2.25rem' }}>
      Continue Exploring &rarr;
    </Link>
  </div>
);

export const Dashboard = () => (
  <div className="container" style={{ padding: '5rem 1.5rem' }}>
    <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '2rem', color: '#18181b' }}>My Account</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <span style={{ color: '#18181b', fontWeight: 700, padding: '0.5rem 0', borderBottom: '2px solid #18181b' }}>Order History</span>
        <span style={{ color: '#6b7280', padding: '0.5rem 0' }}>Profile Settings</span>
        <span style={{ color: '#6b7280', padding: '0.5rem 0' }}>Shipping Addresses</span>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#18181b' }}>Recent Orders</h2>
        <div style={{ padding: '3rem', background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '12px', textAlign: 'center', color: '#6b7280' }}>
          No recent orders found. Discover handloom collections across all states.
        </div>
      </div>
    </div>
  </div>
);

export const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart, setIsCartOpen } = useContext(CartContext);
  const [movingId, setMovingId] = useState(null);

  const handleMoveToBag = (product) => {
    if (!product.variants || product.variants.length === 0) return;
    const variant = product.variants[0];
    addToCart(product, variant, 1);
    setMovingId(product.id);
    setIsCartOpen(true);
    setTimeout(() => {
      setMovingId(null);
      removeFromWishlist(product.id);
    }, 450);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '640px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 1.5rem',
          background: '#fef2f2',
          color: '#dc2626',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-heading)' }}>
          Your Wishlist is Empty
        </h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Save your favorite traditional sarees, royal sherwanis, and kids pattu outfits from across India for upcoming weddings and festivals.
        </p>
        <Link to="/shop" className="btn btn-primary" style={{ padding: '0.9rem 2.25rem', fontSize: '1rem' }}>
          Explore 13 State Collections &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent)', fontWeight: 700 }}>
            Saved Curations
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-heading)', margin: '0.25rem 0 0' }}>
            My Wishlist ({wishlist.length})
          </h1>
        </div>
        <Link to="/shop" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.92rem' }}>
          + Browse More Attires
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
        {wishlist.map(product => {
          const mrp = Math.round(product.basePrice * 1.25);
          return (
            <div 
              key={product.id} 
              className="product-card" 
              style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
            >
              <button
                onClick={() => removeFromWishlist(product.id)}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#dc2626',
                  zIndex: 3
                }}
                title="Remove from Wishlist"
              >
                &times;
              </button>

              <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="product-image-placeholder">
                  <img 
                    src={product.imageUrl || '/kanjeevaram_saree.png'} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {product.state && (
                    <div className="badge-state">
                      <span>{product.state}</span>
                    </div>
                  )}
                </div>

                <div className="product-category">{product.category?.name}</div>
                <h3 className="product-title" style={{ minHeight: '2.8rem' }}>{product.name}</h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <span className="product-price" style={{ margin: 0, fontWeight: 800 }}>
                    ₹{product.basePrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{mrp.toLocaleString('en-IN')}
                  </span>
                </div>
              </Link>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.65rem', fontSize: '0.86rem' }}
                  onClick={() => handleMoveToBag(product)}
                >
                  {movingId === product.id ? '✓ Moved!' : '+ Move to Bag'}
                </button>
                <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <button className="btn" style={{ padding: '0.65rem 0.85rem', fontSize: '0.86rem' }}>
                    Details
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

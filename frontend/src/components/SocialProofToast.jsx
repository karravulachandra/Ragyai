import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RECENT_ORDERS = [
  {
    name: 'Sowmya R.',
    city: 'Hyderabad',
    attire: 'Kanjeevaram Bridal Silk Saree',
    state: 'Tamil Nadu',
    time: '2 minutes ago',
    image: '/kanjeevaram_saree.png',
    slug: 'kanjeevaram-bridal-silk-saree-tamilnadu'
  },
  {
    name: 'Vikramaditya S.',
    city: 'Jaipur',
    attire: 'Royal Rajputana Angrakha Dhoti with Safa',
    state: 'Rajasthan',
    time: '5 minutes ago',
    image: '/sherwani_suit.png',
    slug: 'rajputana-angrakha-dhoti-safa-men'
  },
  {
    name: 'Ananya & Family',
    city: 'Bengaluru',
    attire: 'Andhra Pattu Langa Voni Half Saree',
    state: 'Andhra Pradesh',
    time: '11 minutes ago',
    image: '/girls_pattu_pavadai.jpg',
    slug: 'andhra-pattu-langa-voni-girls'
  },
  {
    name: 'Devika Nair',
    city: 'Kochi',
    attire: 'Kerala Kasavu Set Mundu Saree',
    state: 'Kerala',
    time: '14 minutes ago',
    image: '/kasavu_saree.png',
    slug: 'kerala-kasavu-set-mundu-kerala'
  },
  {
    name: 'Subhashish B.',
    city: 'Kolkata',
    attire: 'Bengali Tussar Silk Dhuti-Panjabi Set',
    state: 'West Bengal',
    time: '18 minutes ago',
    image: '/dhoti_kurta.png',
    slug: 'bengali-tussar-silk-dhuti-panjabi-men'
  },
  {
    name: 'Meera Patel',
    city: 'Ahmedabad',
    attire: 'Patan Patola Double Ikkat Silk Saree',
    state: 'Gujarat',
    time: '22 minutes ago',
    image: '/bandhani_lehenga.png',
    slug: 'patan-patola-double-ikkat-saree-gujarat'
  },
  {
    name: 'Gurpreet Singh',
    city: 'Chandigarh',
    attire: 'Punjabi Kurta Pajama with Phulkari Jacket',
    state: 'Punjab',
    time: '27 minutes ago',
    image: '/phulkari_kurta.png',
    slug: 'punjabi-kurta-pajama-phulkari-jacket-men'
  }
];

export default function SocialProofToast() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show first toast after 4 seconds
    const firstTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Auto-cycle through notifications every 14 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx(prev => (prev + 1) % RECENT_ORDERS.length);
        setVisible(true);
      }, 1000);
    }, 14000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const current = RECENT_ORDERS[currentIdx];

  return (
    <div className="social-proof-toast" role="alert" aria-live="polite">
      <button 
        className="social-toast-close" 
        onClick={() => setDismissed(true)} 
        title="Dismiss notifications"
        aria-label="Close notifications"
      >
        &times;
      </button>

      <div className="social-toast-media">
        <img 
          src={current.image} 
          alt={current.attire} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/kanjeevaram_saree.png';
          }} 
        />
        <span className="social-toast-ping"></span>
      </div>

      <div className="social-toast-content">
        <div className="social-toast-header">
          <strong className="social-toast-user">{current.name}</strong>
          <span className="social-toast-city">from {current.city}</span>
        </div>
        <Link to={`/product/${current.slug}`} className="social-toast-title">
          Purchased {current.attire}
        </Link>
        <div className="social-toast-meta">
          <span className="social-toast-badge">{current.state} Handloom</span>
          <span className="social-toast-time">• {current.time}</span>
        </div>
      </div>
    </div>
  );
}

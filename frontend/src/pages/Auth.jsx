import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('testuser@ragyai.com');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('122345678');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loginId = loginMethod === 'email' ? email : `${phone}@phone.ragyai.com`;
      await login(loginId, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('Google OAuth is not configured yet. Please use email or phone.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '2rem 1rem' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '2.5rem', 
        background: '#ffffff', 
        border: '1px solid var(--color-border)', 
        borderRadius: '16px', 
        boxShadow: 'var(--shadow-md)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#18181b', letterSpacing: '-0.5px' }}>
              RAGYAI
            </span>
          </Link>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your saved weaves and orders
          </p>
        </div>
        
        {error && (
          <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fecaca', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f4f4f5', padding: '3px', borderRadius: '25px' }}>
          <button 
            type="button" 
            onClick={() => setLoginMethod('email')}
            style={{
              flex: 1, 
              padding: '0.5rem', 
              background: loginMethod === 'email' ? '#ffffff' : 'transparent', 
              color: loginMethod === 'email' ? '#18181b' : '#6b7280', 
              borderRadius: '25px', 
              fontWeight: 600, 
              fontSize: '0.85rem',
              boxShadow: loginMethod === 'email' ? 'var(--shadow-sm)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
            Email
          </button>
          <button 
            type="button"
            onClick={() => setLoginMethod('phone')} 
            style={{
              flex: 1, 
              padding: '0.5rem', 
              background: loginMethod === 'phone' ? '#ffffff' : 'transparent', 
              color: loginMethod === 'phone' ? '#18181b' : '#6b7280', 
              borderRadius: '25px', 
              fontWeight: 600, 
              fontSize: '0.85rem',
              boxShadow: loginMethod === 'phone' ? 'var(--shadow-sm)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {loginMethod === 'email' ? (
            <input 
              type="email" required placeholder="Email Address" 
              value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle} 
            />
          ) : (
            <input 
              type="tel" required placeholder="Mobile Number" 
              value={phone} onChange={e => setPhone(e.target.value)}
              style={inputStyle} 
            />
          )}
          <input 
            type="password" required placeholder="Password" 
            value={password} onChange={e => setPassword(e.target.value)}
            style={inputStyle} 
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem', fontSize: '0.95rem' }}>
            {loading ? 'Authenticating...' : 'Sign In &rarr;'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          style={{
            width: '100%', 
            padding: '0.75rem', 
            background: '#ffffff', 
            color: '#18181b', 
            border: '1px solid #d1d5db', 
            borderRadius: '25px', 
            fontWeight: 600, 
            fontSize: '0.9rem',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            cursor: 'pointer'
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
          Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280', fontSize: '0.88rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#ff9933', fontWeight: 600 }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '2rem 1rem' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '2.5rem', 
        background: '#ffffff', 
        border: '1px solid var(--color-border)', 
        borderRadius: '16px', 
        boxShadow: 'var(--shadow-md)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#18181b', letterSpacing: '-0.5px' }}>
              RAGYAI
            </span>
          </Link>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Create an account to join our artisan heritage community
          </p>
        </div>
        
        {error && (
          <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fecaca', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" required placeholder="Full Name" 
            value={name} onChange={e => setName(e.target.value)}
            style={inputStyle} 
          />
          <input 
            type="email" required placeholder="Email Address" 
            value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle} 
          />
          <input 
            type="password" required placeholder="Password" 
            value={password} onChange={e => setPassword(e.target.value)}
            style={inputStyle} 
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem', fontSize: '0.95rem' }}>
            {loading ? 'Creating Account...' : 'Join Ragyai &rarr;'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280', fontSize: '0.88rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#ff9933', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '0.75rem 1rem',
  background: '#ffffff',
  border: '1px solid #d1d5db',
  color: '#18181b',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '0.92rem',
  width: '100%',
  boxSizing: 'border-box'
};

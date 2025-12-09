import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function SignInPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/products" replace />;

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/products');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 460, margin: '3rem auto' }}>
      <div className="page-header">
        <h1 className="page-title">TrustinSecond</h1>
        <p className="page-subtitle">Welcome back to your account</p>
      </div>
      <div className="card card-auth">
        <h2 className="section-title">Sign In</h2>
        <p className="helper-subtitle">Enter your email and password to access your account</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="label">Email Address</label>
            <div className="input-group">
              <span className="input-icon material-symbols-outlined">email</span>
              <input
                className="input"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="input-group">
              <span className="input-icon material-symbols-outlined">lock</span>
              <input
                className="input"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <label className="checkbox">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
              Remember me
            </label>
            <Link to="#" className="link">Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-dark">Sign In</button>
          {error && <p className="text-muted">{error}</p>}
          <p className="legal">
            By signing in, you agree to our <Link to="#" className="muted-link">Terms of Service</Link> and <Link to="#" className="muted-link">Privacy Policy</Link>
          </p>
        </form>
        <div className="divider" />
        <p className="text-muted">
          Don't have an account? <Link to="/auth/signup" className="link">Create one here</Link>
        </p>
      </div>
    </div>
  );
}

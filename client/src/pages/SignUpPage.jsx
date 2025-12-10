import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function SignUpPage() {
  const { user, register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/products" replace />;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      // optionally auto-login after successful registration
      await login(form.email, form.password);
      navigate('/products');
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="page-header">
        <h1 className="page-title">⬡ TrustinSecond</h1>
        <p className="page-subtitle">Join and start shopping</p>
      </div>
      <div className="card card-auth">
        <h2 className="section-title">Sign Up</h2>
        <p className="helper-subtitle">Create your account to start shopping</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="label">Full Name</label>
            <div className="input-group">
              <span className="input-icon material-symbols-outlined">person</span>
              <input
                className="input"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
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
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-dark btn-full" disabled={loading}>
            {loading ? 'Signing Up…' : 'Sign Up'}
          </button>
          {error && <p className="text-muted">{error}</p>}
        </form>
        <div className="divider" />
        <p className="text-muted auth-footer">
          Already have an account? <Link to="/auth/signin" className="link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

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
    <div style={{ maxWidth: 480, margin: '3rem auto' }}>
      <div className="page-header">
        <h1 className="page-title">Create Account</h1>
        <p className="page-subtitle">Join and start shopping</p>
      </div>
      <div className="card">
        <h2 className="section-title">Sign Up</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="label">Full Name</label>
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
          <div>
            <label className="label">Email Address</label>
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
          <div>
            <label className="label">Password</label>
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing Up…' : 'Sign Up'}
          </button>
          {error && <p className="text-muted">{error}</p>}
        </form>
        <p className="text-muted" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/auth/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

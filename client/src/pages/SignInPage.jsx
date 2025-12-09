import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function SignInPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/products" replace />;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
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
    <div style={{ maxWidth: 420, margin: '3rem auto' }}>
      <div className="page-header">
        <h1 className="page-title">E-Commerce</h1>
        <p className="page-subtitle">Welcome back to your account</p>
      </div>
      <div className="card">
        <h2 className="section-title">Sign In</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Sign In</button>
          {error && <p className="text-muted">{error}</p>}
        </form>
        <p className="text-muted" style={{ marginTop: '1rem' }}>
          New here? <Link to="/auth/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

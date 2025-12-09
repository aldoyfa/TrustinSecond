import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/signin');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/products" className="brand">
            <span style={{ fontSize: 20 }}>⬡</span>
            <span>TrustinSecond</span>
          </Link>
          <nav className="nav-links">
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/inventory">Inventory</NavLink>
            <NavLink to="/invoices">Invoices</NavLink>
            {user && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <div className="nav-right">
            {user ? (
              <>
                <span>Halo, {user.email}</span>
                <button className="btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <NavLink to="/auth/signin">Sign In</NavLink>
            )}
            <button className="btn btn-primary" onClick={() => navigate('/cart')}>
              Cart{cartCount > 0 && ` (${cartCount})`}
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="app-main-inner">{children}</div>
      </main>
    </div>
  );
}

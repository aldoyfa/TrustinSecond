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
            <NavLink to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>house</span>
              Products
            </NavLink>
            <NavLink to="/inventory" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>package_2</span>
              Inventory
            </NavLink>
            <NavLink to="/invoices" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>receipt_long</span>
              Invoices
            </NavLink>
            <NavLink to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>person</span>
              Admin
            </NavLink>
          </nav>
          <div className="nav-right">
            {user ? (
              <>
                <span>Halo, {user.email}</span>
                <button className="btn" onClick={handleLogout}style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>logout</span>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/auth/signin">Sign In</NavLink>
            )}
            <button className="btn btn-primary" onClick={() => navigate('/cart')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>shopping_cart</span>
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

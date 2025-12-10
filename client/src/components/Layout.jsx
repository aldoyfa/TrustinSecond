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
            <span className="brand-icon">⬡</span>
            <span>TrustinSecond</span>
          </Link>
          <nav className="nav-links">
            <NavLink to="/products">
              <span className="material-symbols-outlined icon-md">house</span>
              Products
            </NavLink>
            <NavLink to="/inventory">
              <span className="material-symbols-outlined icon-md">package_2</span>
              Inventory
            </NavLink>
            <NavLink to="/invoices">
              <span className="material-symbols-outlined icon-md">receipt_long</span>
              Invoices
            </NavLink>
            <NavLink to="/admin">
              <span className="material-symbols-outlined icon-md">person</span>
              Admin
            </NavLink>
          </nav>
          <div className="nav-right">
            {user ? (
              <>
                <span>Halo, {user.email}</span>
                <button className="btn btn-icon" onClick={handleLogout}>
                  <span className="material-symbols-outlined icon-md">logout</span>
                  Sign Out
                </button>
              </>
            ) : (
              <button className="btn btn-icon" onClick={() => navigate('/auth/signin')}>
              <span className="material-symbols-outlined icon-md">login</span>
              Sign In
              </button>
            )}
            <button className="btn btn-primary btn-icon" onClick={() => navigate('/cart')}>
              <span className="material-symbols-outlined icon-md">shopping_cart</span>
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

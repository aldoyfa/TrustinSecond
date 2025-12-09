import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');

  const authConfig = user
    ? { headers: { Authorization: `Bearer ${user.token}` }, withCredentials: true }
    : {};

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) {
          setError('Sign in as admin to access dashboard');
          return;
        }
        const [pRes, iRes, invRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/invoice', authConfig),
          axios.get('/api/inventory', authConfig),
        ]);
        setProducts(pRes.data?.data ?? []);
        setInvoices(iRes.data?.data ?? []);
        setInventories(invRes.data?.data ?? []);
      } catch (e) {
        setError('Failed to load admin data');
      }
    };
    load();
  }, [user]);

  if (!user) {
    return <p className="text-muted">Please sign in to access admin.</p>;
  }

  return (
    <div>
      <header className="page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="page-title">Admin Dashboard</h1>
      </header>
      {error && <p className="text-muted">{error}</p>}
      <div className="tabs">
        <button className={`tab ${tab === 'products' ? 'tab-active' : ''}`} onClick={() => setTab('products')}>
          Products
        </button>
        <button className={`tab ${tab === 'inventory' ? 'tab-active' : ''}`} onClick={() => setTab('inventory')}>
          Inventory
        </button>
        <button className={`tab ${tab === 'invoices' ? 'tab-active' : ''}`} onClick={() => setTab('invoices')}>
          Invoices
        </button>
      </div>

      {tab === 'products' && (
        <section className="section">
          <h2 className="section-title">Manage Products</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Inventory</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id.slice(0, 8)}...</td>
                  <td>{p.name}</td>
                  <td>Rp {p.price?.toLocaleString('id-ID')}</td>
                  <td>{p.stock}</td>
                  <td>{p.inventory?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'inventory' && (
        <section className="section">
          <h2 className="section-title">Manage Inventory</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id.slice(0, 8)}...</td>
                  <td>{inv.name}</td>
                  <td>{inv.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'invoices' && (
        <section className="section">
          <h2 className="section-title">Manage Invoices</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id.slice(0, 8)}...</td>
                  <td>{inv.userId?.slice ? inv.userId.slice(0, 8) + '...' : inv.userId}</td>
                  <td>Rp {inv.total?.toLocaleString('id-ID')}</td>
                  <td>{new Date(inv.date).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

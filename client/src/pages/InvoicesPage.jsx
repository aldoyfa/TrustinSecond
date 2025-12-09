import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function InvoicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) throw new Error('Auth required');
        const res = await axios.get('/api/invoice', {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        });
        setItems(res.data?.data ?? []);
      } catch (e) {
        setError('Need to sign in to see invoices');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Invoice Data</h1>
        <p className="page-subtitle">View and manage all customer invoices.</p>
      </header>
      {loading && <p>Loading...</p>}
      {error && <p className="text-muted">{error}</p>}
      {!loading && !error && (
        <div className="grid">
          {items.map((inv) => (
            <article key={inv.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-title">{inv.id}</div>
                  <p className="text-muted">Customer: {inv.name}</p>
                  <p className="text-muted">{inv.email}</p>
                  <p className="text-muted">{new Date(inv.date).toLocaleString('id-ID')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="card-price">Rp {inv.total?.toLocaleString('id-ID')}</div>
                </div>
              </div>
              <p className="text-muted" style={{ marginTop: '0.5rem' }}>Items: {inv.items}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function InventoryListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) throw new Error('Auth required');
        const res = await axios.get('/api/inventory', {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        });
        setItems(res.data?.data ?? []);
      } catch (e) {
        setError('Need to sign in to see inventory data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Inventory Data</h1>
        <p className="page-subtitle">Explore all available inventories categorized in our system.</p>
      </header>
      {loading && <p>Loading inventory...</p>}
      {error && <p className="text-muted">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-3">
          {items.map((inv) => (
            <article key={inv.id} className="card">
              <h3 className="card-title">{inv.name}</h3>
              <p className="text-muted">{inv.description}</p>
              <div style={{ marginTop: '0.75rem' }}>
                <Link to={`/inventory/${inv.id}`}>
                  <button className="btn btn-primary">View Products</button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

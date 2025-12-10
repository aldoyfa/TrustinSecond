import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function InvoicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredItems = items.filter((inv) => {
    const query = searchQuery.toLowerCase();
    return (
      inv.name?.toLowerCase().includes(query) ||
      inv.email?.toLowerCase().includes(query) ||
      inv.id?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Invoice Data</h1>
        <p className="page-subtitle">View and manage all customer invoices.</p>
      </header>
      
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-container invoice-search-container">
          <span className="material-symbols-outlined search-icon">
            search
          </span>
          <input
            type="text"
            className="input search-input invoice-search-input"
            placeholder="Search by Invoice ID or Name or Gmail"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <p className="search-result-text">
            Found {filteredItems.length} invoice{filteredItems.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-muted">{error}</p>}
      {!loading && !error && (
        <>
          {filteredItems.length === 0 ? (
            <p className="text-muted text-center invoice-empty">
              {searchQuery ? `No invoices found matching "${searchQuery}"` : 'No invoices available'}
            </p>
          ) : (
            <div className="grid invoice-grid">
              {filteredItems.map((inv) => (
                <article key={inv.id} className="card invoice-card">
                  <div className="invoice-header">
                    <span className="material-symbols-outlined">
                      receipt_long
                    </span>
                    <div className="invoice-id">
                      {inv.id}
                    </div>
                  </div>
                  
                  <div className="invoice-info">
                    <div className="invoice-row">
                      <span className="invoice-customer-label">Customer:</span>
                      <span className="invoice-customer-value">{inv.name}</span>
                    </div>
                    <div className="invoice-row">
                      <span className="material-symbols-outlined">mail</span>
                      <span className="invoice-meta-text">{inv.email}</span>
                    </div>
                    <div className="invoice-row">
                      <span className="material-symbols-outlined">schedule</span>
                      <span className="invoice-meta-text">
                        {new Date(inv.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul {new Date(inv.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="invoice-footer">
                    <div>
                      <div className="invoice-items-label">Items:</div>
                      <div className="invoice-items-value">{inv.items}</div>
                    </div>
                    <div className="invoice-total-container">
                      <div className="invoice-total-label">Total:</div>
                      <div className="invoice-total-value">
                        Rp {inv.total?.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

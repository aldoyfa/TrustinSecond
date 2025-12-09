import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function CartPage() {
  const { items, fetchCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '' });
  const [status, setStatus] = useState('');

  const total = useMemo(() => items.reduce((sum, item) => sum + item.total, 0), [items]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      setStatus('Please sign in before checkout');
      return;
    }
    try {
      await axios.post(
        '/api/invoice/checkout',
        { ...form },
        { headers: { Authorization: `Bearer ${user.token}` }, withCredentials: true }
      );
      setStatus('Checkout successful');
      setForm({ name: '', email: '', phone: '', date: '' });
      await fetchCart();
    } catch (err) {
      setStatus('Checkout failed');
    }
  };
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr', gap: '1.5rem' }}>
      <div>
        <h1 className="page-title" style={{ textAlign: 'left' }}>Cart</h1>
        {!user && (
          <p className="text-muted">Need to sign in to see cart data</p>
        )}
        {user && (
          <div className="section">
            {items.map((item) => (
              <div key={item.id} className="card" style={{ marginBottom: '0.75rem', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-title">{item.product?.name}</div>
                  <div className="text-muted">Qty: {item.quantity}</div>
                </div>
                <div className="card-price">Rp {item.total?.toLocaleString('id-ID')}</div>
              </div>
            ))}
            {items.length === 0 && <p className="text-muted">Your cart is empty.</p>}
          </div>
        )}
      </div>
      {user && (
        <div>
          <h2 className="section-title">Ringkasan Pesanan</h2>
          <div className="card">
            <p className="text-muted">Total Item: {items.length}</p>
            <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Total: Rp {total.toLocaleString('id-ID')}</p>
            <form className="form-grid" onSubmit={handleCheckout}>
              <div>
                <label className="label">Name</label>
                <input className="input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Date</label>
                <input className="input" name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Checkout Sekarang</button>
            </form>
            {status && <p className="text-muted" style={{ marginTop: '0.5rem' }}>{status}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

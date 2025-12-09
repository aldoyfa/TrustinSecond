import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function CartPage() {
  const { items, fetchCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) {
        return;
      }
      await fetchCart();
    };
    load();
  }, [user, fetchCart]);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.total, 0), [items]);

  const updateQuantity = async (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    try {
      await axios.put(
        `/api/cart/${itemId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${user.token}` }, withCredentials: true }
      );
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity');
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(
        `/api/cart/${itemId}`,
        { headers: { Authorization: `Bearer ${user.token}` }, withCredentials: true }
      );
      await fetchCart();
    } catch (err) {
      console.error('Failed to delete item');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    try {
      const deletePromises = items.map(item => 
        axios.delete(
          `/api/cart/${item.id}`,
          { headers: { Authorization: `Bearer ${user.token}` }, withCredentials: true }
        )
      );
      await Promise.all(deletePromises);
      await fetchCart();
      setStatus('Cart cleared successfully');
    } catch (err) {
      setStatus('Failed to clear cart');
    }
  };

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
      setForm({ name: '', email: '', phone: '' });
      await fetchCart();
    } catch (err) {
      setStatus('Checkout failed');
    }
  };
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn" onClick={() => window.history.back()} style={{ padding: '0.5rem' }}>← Kembali Belanja</button>
        <h1 className="page-title" style={{ textAlign: 'left', margin: 0 }}>Keranjang Belanja</h1>
      </div>
      {!user && (
        <p className="text-muted">Need to sign in to see cart data</p>
      )}
      {user && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
          <div>
            {items.map((item) => (
              <div key={item.id} className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {item.product?.image && (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} 
                    referrerPolicy="no-referrer"
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{item.product?.name}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button 
                    className="btn" 
                    onClick={() => updateQuantity(item.id, item.quantity, -1)}
                    style={{ padding: '0.25rem 0.6rem', fontSize: '1rem' }}
                  >−</button>
                  <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 500 }}>{item.quantity}</span>
                  <button 
                    className="btn" 
                    onClick={() => updateQuantity(item.id, item.quantity, 1)}
                    style={{ padding: '0.25rem 0.6rem', fontSize: '1rem' }}
                  >+</button>
                </div>
                <div className="card-price" style={{ fontSize: '1.1rem', fontWeight: 600, minWidth: '120px', textAlign: 'right' }}>Rp {item.total?.toLocaleString('id-ID')}</div>
                <button 
                  className="btn btn-danger" 
                  onClick={() => deleteItem(item.id)}
                  style={{ padding: '0.25rem 0.5rem' }}
                  title="Delete"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
                </button>
              </div>
            ))}
            {items.length === 0 && <p className="text-muted">Your cart is empty.</p>}
          </div>
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
                <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>Checkout Sekarang</button>
                <button type="button" className="btn" style={{ width: '100%' }} onClick={clearCart}>Kosongkan Keranjang</button>
              </form>
              {status && <p className="text-muted" style={{ marginTop: '0.5rem' }}>{status}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

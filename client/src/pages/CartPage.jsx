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
    <div className="cart-container">
      <div className="cart-header">
        <button className="btn cart-btn-back" onClick={() => window.history.back()}>← Kembali Belanja</button>
        <h1 className="page-title cart-title">Keranjang Belanja</h1>
      </div>
      {!user && (
        <p className="text-muted">Need to sign in to see cart data</p>
      )}
      {user && (
        <div className="cart-grid">
          <div>
            {items.map((item) => (
              <div key={item.id} className="card cart-item">
                {item.product?.image && (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="cart-item-image"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product?.name}</h3>
                </div>
                <div className="cart-item-controls">
                  <button 
                    className="btn cart-qty-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity, -1)}
                  >−</button>
                  <span className="cart-item-qty">{item.quantity}</span>
                  <button 
                    className="btn cart-qty-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity, 1)}
                  >+</button>
                </div>
                <div className="cart-item-price">Rp {item.total?.toLocaleString('id-ID')}</div>
                <button 
                  className="btn btn-danger cart-delete-btn" 
                  onClick={() => deleteItem(item.id)}
                  title="Delete"
                >
                  <span className="material-symbols-outlined cart-delete-icon">delete</span>
                </button>
              </div>
            ))}
            {items.length === 0 && <p className="text-muted">Your cart is empty.</p>}
          </div>
          <div>
            <h2 className="section-title">Ringkasan Pesanan</h2>
            <div className="card">
              <p className="text-muted">Total Item: {items.length}</p>
              <p className="cart-summary-total">Total: Rp {total.toLocaleString('id-ID')}</p>
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
                <button type="submit" className="btn btn-dark cart-checkout-btn">Checkout Sekarang</button>
                <button type="button" className="btn cart-checkout-btn" onClick={clearCart}>Kosongkan Keranjang</button>
              </form>
              {status && <p className="text-muted cart-status">{status}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

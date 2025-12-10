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
  const [modal, setModal] = useState({ open: false, type: null, editingId: null });
  const [form, setForm] = useState({
    product: { name: '', price: '', stock: '', inventoryId: '', image: '', description: '' },
    inventory: { name: '', description: '' },
    invoice: { email: '', name: '', phone: '', items: '', total: '', date: '' },
  });
  const [imageFile, setImageFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);


  useEffect(() => {
    const load = async () => {
      try {
        if (!user) {
          setError('Sign in as admin to access dashboard');
          return;
        }
        const [pRes, invRes, iRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/inventory', authConfig),
          axios.get('/api/invoice', authConfig),
        ]);
        setProducts(pRes.data?.data ?? []);
        setInventories(invRes.data?.data ?? []);
        setInvoices(iRes.data?.data ?? []);
      } catch (e) {
        setError('Failed to load admin data');
      }
    };
    load();
  }, [user]);

  const handleOpen = (type) => {
    setModal({ open: true, type, editingId: null });
    setImageFile(null);
    setForm((f) => ({
      ...f,
      [type]: type === 'product' 
        ? { name: '', price: '', stock: '', inventoryId: '', image: '', description: '' }
        : type === 'inventory'
        ? { name: '', description: '' }
        : { email: '', name: '', phone: '', items: '', total: '', date: '' }
    }));
  };

  const handleEdit = (type, item) => {
    setModal({ open: true, type, editingId: item.id });
    if (type === 'product') {
      // Strip localhost prefix from image if present (for clean editing)
      let cleanImage = item.image || '';
      if (cleanImage.startsWith('http://localhost:') || cleanImage.startsWith('https://localhost:')) {
        // Extract just the path or external URL
        const match = cleanImage.match(/https?:\/\/localhost:\d+(\/.*)/);
        if (match && match[1].startsWith('/uploads')) {
          cleanImage = match[1]; // Keep local path
        } else {
          // It's a double-prefixed external URL, extract the actual URL
          const externalMatch = cleanImage.match(/https?:\/\/localhost:\d+\/(https?:\/\/.+)/);
          if (externalMatch) {
            cleanImage = externalMatch[1];
          }
        }
      }
      setForm((f) => ({
        ...f,
        product: {
          name: item.name || '',
          price: item.price || '',
          stock: item.stock || '',
          inventoryId: item.inventoryId || '',
          image: cleanImage,
          description: item.description || '',
        },
      }));
    } else if (type === 'inventory') {
      setForm((f) => ({ ...f, inventory: { name: item.name || '', description: item.description || '' } }));
    } else if (type === 'invoice') {
      setForm((f) => ({
        ...f,
        invoice: {
          email: item.email || '',
          name: item.name || '',
          phone: item.phone || '',
          items: item.items || '',
          total: item.total || '',
          date: item.date || '',
        },
      }));
    }
  };

  const handleClose = () => {
    setModal({ open: false, type: null, editingId: null });
    setImageFile(null);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [modal.type]: { ...f[modal.type], [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Clear the URL input when file is selected
      setForm((f) => ({
        ...f,
        product: { ...f.product, image: '' },
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      // Clear the URL input when file is dropped
      setForm((f) => ({
        ...f,
        product: { ...f.product, image: '' },
      }));
    }
  };

  const authConfig = user
    ? { headers: { Authorization: `Bearer ${user.token}` }, withCredentials: true }
    : {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!modal.editingId;
      if (modal.type === 'product') {
        let payload;
        let config = { ...authConfig };
        
        // Use FormData if file is uploaded, otherwise use JSON
        if (imageFile) {
          payload = new FormData();
          payload.append('name', form.product.name);
          payload.append('price', Number(form.product.price));
          payload.append('stock', Number(form.product.stock));
          payload.append('description', form.product.description);
          payload.append('inventoryId', form.product.inventoryId);
          payload.append('image', imageFile);
          config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' };
        } else {
          payload = { ...form.product, price: Number(form.product.price), stock: Number(form.product.stock) };
        }
        
        if (isEditing) {
          await axios.put(`/api/products/${modal.editingId}`, payload, config);
        } else {
          await axios.post('/api/products', payload, config);
        }
        const pRes = await axios.get('/api/products');
        setProducts(pRes.data?.data ?? []);
      } else if (modal.type === 'inventory') {
        if (isEditing) {
          await axios.put(`/api/inventory/${modal.editingId}`, form.inventory, authConfig);
        } else {
          await axios.post('/api/inventory', form.inventory, authConfig);
        }
        const invRes = await axios.get('/api/inventory', authConfig);
        setInventories(invRes.data?.data ?? []);
      } else if (modal.type === 'invoice') {
        const payload = { ...form.invoice, total: Number(form.invoice.total) };
        if (isEditing) {
          await axios.put(`/api/invoice/${modal.editingId}`, payload, authConfig);
        } else {
          await axios.post('/api/invoice', payload, authConfig);
        }
        const iRes = await axios.get('/api/invoice', authConfig);
        setInvoices(iRes.data?.data ?? []);
      }
      handleClose();
    } catch (err) {
      setError(isEditing ? 'Update failed' : 'Creation failed');
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'product') {
        await axios.delete(`/api/products/${id}`, authConfig);
        const pRes = await axios.get('/api/products');
        setProducts(pRes.data?.data ?? []);
      } else if (type === 'inventory') {
        await axios.delete(`/api/inventory/${id}`, authConfig);
        const invRes = await axios.get('/api/inventory', authConfig);
        setInventories(invRes.data?.data ?? []);
      } else if (type === 'invoice') {
        await axios.delete(`/api/invoice/${id}`, authConfig);
        const iRes = await axios.get('/api/invoice', authConfig);
        setInvoices(iRes.data?.data ?? []);
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  if (!user) {
    return <p className="text-muted">Please sign in to access admin.</p>;
  }

  return (
    <div>
      <header className="page-header">
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
          <div className="admin-header">
            <h2 className="section-title">Manage Products</h2>
            <button className="btn btn-primary" onClick={() => handleOpen('product')}>+ Add New</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>IMAGE</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>INVENTORY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id.slice(0, 8)}...</td>
                  <td>
                    {p.image ? (
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="table-image"
                        onError={(e) => { 
                          e.target.style.display = 'none'; 
                          e.target.nextSibling.style.display = 'inline-block'; 
                        }}
                      />
                    ) : null}
                    <span className="table-no-image">🖼️ No image</span>
                  </td>
                  <td>{p.name}</td>
                  <td>Rp {p.price?.toLocaleString('id-ID')}</td>
                  <td>{p.stock}</td>
                  <td>{p.inventory?.name}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-table" onClick={() => handleEdit('product', p)} title="Edit">
                        <span className="material-symbols-outlined icon-sm">edit</span>
                      </button>
                      <button className="btn btn-danger btn-table" onClick={() => handleDelete('product', p.id)} title="Delete">
                        <span className="material-symbols-outlined icon-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'inventory' && (
        <section className="section">
          <div className="admin-header">
            <h2 className="section-title">Manage Inventory</h2>
            <button className="btn btn-primary" onClick={() => handleOpen('inventory')}>+ Add New</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id.slice(0, 8)}...</td>
                  <td>{inv.name}</td>
                  <td>{inv.description}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-table" onClick={() => handleEdit('inventory', inv)} title="Edit">
                        <span className="material-symbols-outlined icon-sm">edit</span>
                      </button>
                      <button className="btn btn-danger btn-table" onClick={() => handleDelete('inventory', inv.id)} title="Delete">
                        <span className="material-symbols-outlined icon-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'invoices' && (
        <section className="section">
          <div className="admin-header">
            <h2 className="section-title">Manage Invoices</h2>
            <button className="btn btn-primary" onClick={() => handleOpen('invoice')}>+ Add New</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Total</th>
                <th>Date</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id.slice(0, 8)}...</td>
                  <td>{inv.userId?.slice ? inv.userId.slice(0, 8) + '...' : inv.userId}</td>
                  <td>Rp {inv.total?.toLocaleString('id-ID')}</td>
                  <td>{new Date(inv.date).toLocaleString('id-ID')}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-table" onClick={() => handleEdit('invoice', inv)} title="Edit">
                        <span className="material-symbols-outlined icon-sm">edit</span>
                      </button>
                      <button className="btn btn-danger btn-table" onClick={() => handleDelete('invoice', inv.id)} title="Delete">
                        <span className="material-symbols-outlined icon-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {/* Simple modal */}
      {modal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="section-title modal-title">
                {modal.editingId 
                  ? (modal.type === 'product' ? 'Edit Product' : modal.type === 'inventory' ? 'Edit Inventory' : 'Edit Invoice')
                  : (modal.type === 'product' ? 'Add New Product' : modal.type === 'inventory' ? 'Add Inventory' : 'Add Invoice')
                }
              </h3>
              <button className="btn modal-close" onClick={handleClose}>×</button>
            </div>
            <form className="form-grid" onSubmit={handleSubmit}>
              {modal.type === 'product' && (
                <>
                  <div>
                    <label className="label">Name</label>
                    <input className="input" name="name" value={form.product.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Image</label>
                    <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('fileInput').click()}
                      className={`dropzone ${dragActive ? 'active' : ''}`}
                    >
                      {imageFile ? (
                        <>
                          <div className="dropzone-icon">✓</div>
                          <p className="dropzone-text-success">{imageFile.name}</p>
                          <p className="dropzone-subtext">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <div className="dropzone-icon">📤</div>
                          <p className="dropzone-text">Click to upload image or drag and drop</p>
                          <p className="dropzone-subtext">PNG, JPG, GIF, WebP up to 5MB</p>
                        </>
                      )}
                      <input 
                        id="fileInput"
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{ display: 'none' }} 
                      />
                    </div>
                    <input className="input" name="image" placeholder="Or enter image URL" value={form.product.image} onChange={handleChange} disabled={!!imageFile} />
                  </div>
                  <div>
                    <label className="label">Price</label>
                    <input className="input" name="price" type="number" value={form.product.price} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input" name="description" rows="3" value={form.product.description} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Stock</label>
                    <input className="input" name="stock" type="number" value={form.product.stock} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Inventory</label>
                    <select className="input" name="inventoryId" value={form.product.inventoryId} onChange={handleChange} required>
                      <option value="">Select Inventory</option>
                      {inventories.map((inv) => (
                        <option key={inv.id} value={inv.id}>{inv.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {modal.type === 'inventory' && (
                <>
                  <div>
                    <label className="label">Name</label>
                    <input className="input" name="name" value={form.inventory.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input" name="description" value={form.inventory.description} onChange={handleChange} />
                  </div>
                </>
              )}

              {modal.type === 'invoice' && (
                <>
                  <div>
                    <label className="label">Email</label>
                    <input className="input" name="email" type="email" value={form.invoice.email} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Name</label>
                    <input className="input" name="name" value={form.invoice.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" name="phone" value={form.invoice.phone} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Items (JSON)</label>
                    <textarea className="input" name="items" value={form.invoice.items} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Total</label>
                    <input className="input" name="total" type="number" value={form.invoice.total} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input className="input" name="date" type="datetime-local" value={form.invoice.date} onChange={handleChange} />
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button type="button" className="btn" onClick={handleClose}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-icon">
                  <span className="material-symbols-outlined icon-md">save</span>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

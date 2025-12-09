import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data?.data ?? null);
      } catch (e) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <button className="btn" onClick={() => navigate(-1)}>
        ← Back to Products
      </button>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', alignItems: 'flex-start' }}>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '380px', maxHeight: '340px', borderRadius: '0.75rem', objectFit: 'cover' }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 className="page-title" style={{ textAlign: 'left' }}>{product.name}</h1>
          <p className="text-muted" style={{ marginBottom: '0.75rem' }}>{product.description}</p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="card-price" style={{ fontSize: '1.4rem' }}>
              Rp {product.price?.toLocaleString('id-ID')}
            </div>
            <span className="badge">{product.stock} in stock</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
            <Link to="/inventory"><button className="btn">View Inventory</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

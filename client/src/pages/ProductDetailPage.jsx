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

  const isOutOfStock = product.stock === 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
        <button 
          className="btn" 
          onClick={() => navigate('/products')}
          style={{ padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
          Back to Products
        </button>
        <span>/</span>
        <Link to="/products" style={{ color: '#6b7280' }}>Products</Link>
        <span>/</span>
        <span style={{ color: '#111827' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Column - Image and Product Details */}
        <div>
          {/* Product Image */}
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{ 
                width: '100%', 
                height: 'auto',
                aspectRatio: '1',
                borderRadius: '0.75rem', 
                objectFit: 'cover',
                background: '#f5f5f5',
                filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                opacity: isOutOfStock ? 0.7 : 1,
                marginBottom: '1.5rem'
              }}
              referrerPolicy="no-referrer"
            />
          )}

          {/* Product Details Section */}
          <div style={{ 
            background: '#f9fafb', 
            borderRadius: '0.75rem', 
            padding: '1.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Product Details</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {/* Specifications */}
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Specifications</h3>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem' }}>
                  <span style={{ color: '#6b7280' }}>Product ID:</span>
                  <span style={{ color: '#111827', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>{product.id}</span>
                  
                  <span style={{ color: '#6b7280' }}>Category:</span>
                  <span style={{ color: '#111827' }}>{product.inventory?.name || 'N/A'}</span>
                  
                  <span style={{ color: '#6b7280' }}>Stock:</span>
                  <span style={{ color: '#111827' }}>{product.stock} units</span>
                  
                  <span style={{ color: '#6b7280' }}>Inventory ID:</span>
                  <span style={{ color: '#111827', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>{product.inventoryId || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>Description</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.7', color: '#6b7280' }}>
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{product.name}</h1>
          <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>{product.description}</p>
          
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            color: '#1d4ed8', 
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            Rp {product.price?.toLocaleString('id-ID')}
            <span 
              className="badge" 
              style={{ 
                backgroundColor: isOutOfStock ? '#ef4444' : '#111827',
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem'
              }}
            >
              {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
            </span>
          </div>

          {/* Inventory and Date Info */}
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>inventory_2</span>
              <span>Inventory: {product.inventoryId || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>calendar_today</span>
              <span>Added: Invalid Date</span>
            </div>
          </div>

          {/* Out of Stock Warning */}
          {isOutOfStock && (
            <div style={{ 
              padding: '0.75rem 1rem', 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              color: '#991b1b',
              fontSize: '0.9rem'
            }}>
              This product is currently out of stock and cannot be added to cart.
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              style={{
                opacity: isOutOfStock ? 0.5 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.7rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>shopping_cart</span>
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            {product.inventoryId && (
              <Link to={`/inventory/${product.inventoryId}`}>
                <button className="btn" style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}>
                  View Inventory
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

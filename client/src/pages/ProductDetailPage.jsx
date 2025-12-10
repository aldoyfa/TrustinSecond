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
      <div className="breadcrumb">
        <button 
          className="btn breadcrumb-back" 
          onClick={() => navigate('/products')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Products
        </button>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail-grid">
        {/* Left Column - Image */}
        <div>
          {/* Product Image */}
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className={`product-detail-image ${isOutOfStock ? 'out-of-stock' : ''}`}
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Right Column - Product Info */}
        <div>
          <h1 className="product-title">{product.name}</h1>
          <p className="text-muted product-description">{product.description}</p>
          
          <div className="product-price-container">
            Rp {product.price?.toLocaleString('id-ID')}
            <span className={`badge product-stock-badge ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
            </span>
          </div>

          {/* Inventory and Date Info */}
          <div className="product-meta">
            <div className="product-meta-row">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>Inventory: {product.inventoryId || 'N/A'}</span>
            </div>
            <div className="product-meta-row">
              <span className="material-symbols-outlined">calendar_today</span>
              <span>Added: {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
            </div>
          </div>

          {/* Out of Stock Warning */}
          {isOutOfStock && (
            <div className="product-out-of-stock-warning">
              This product is currently out of stock and cannot be added to cart.
            </div>
          )}

          {/* Action Buttons */}
          <div className="product-actions">
            <button 
              className="btn btn-primary product-add-to-cart" 
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            {product.inventoryId && (
              <Link to={`/inventory/${product.inventoryId}`}>
                <button className="btn product-view-inventory">
                  View Inventory
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Section - Full Width */}
      <div className="product-detail-specs">
        <h2 className="product-specs-title">Product Details</h2>
        
        <div className="product-specs-section">
          {/* Specifications */}
          <h3 className="product-specs-subtitle">Specifications</h3>
          <div className="product-specs-content">
            <div className="product-specs-grid">
              <span className="product-specs-label">Product ID:</span>
              <span className="product-specs-value monospace">{product.id}</span>
              
              <span className="product-specs-label">Category:</span>
              <span className="product-specs-value">{product.inventory?.name || 'N/A'}</span>
              
              <span className="product-specs-label">Stock:</span>
              <span className="product-specs-value">{product.stock} units</span>
              
              <span className="product-specs-label">Inventory ID:</span>
              <span className="product-specs-value monospace">{product.inventoryId || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="product-specs-subtitle">Description</h3>
          <p className="product-specs-description">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stock === 0;
  
  return (
    <article className="card" style={{ opacity: isOutOfStock ? 0.6 : 1, position: 'relative' }}>
      {isOutOfStock && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: '#ef4444',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.25rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          zIndex: 1
        }}>
          Out of Stock
        </div>
      )}
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          className="card-image"
          referrerPolicy="no-referrer"
          style={{ filter: isOutOfStock ? 'grayscale(100%)' : 'none' }}
          onError={(e) => {
            e.target.style.display = 'none';
            console.error('Failed to load image:', product.image);
          }}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div>
          <h3 className="card-title">{product.name}</h3>
          <p className="text-muted" style={{ marginTop: 4 }}>{product.description}</p>
        </div>
        <span className="badge" style={{ backgroundColor: isOutOfStock ? '#ef4444' : undefined }}>
          {product.stock} stock
        </span>
      </div>
      <div className="card-price">Rp {product.price?.toLocaleString('id-ID')}</div>
      <div className="card-footer">
        <Link to={`/products/${product.id}`}>
          <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>visibility</span>
            View Details
          </button>
        </Link>
        <button 
          className="btn btn-primary" 
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          style={{ 
            opacity: isOutOfStock ? 0.5 : 1,
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>shopping_cart</span>
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>

      </div>
    </article>
  );
}

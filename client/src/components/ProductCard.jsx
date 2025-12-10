import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stock === 0;
  
  return (
    <article className={`card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {isOutOfStock && (
        <div className="out-of-stock-badge">
          Out of Stock
        </div>
      )}
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          className={`card-image ${isOutOfStock ? 'grayscale' : ''}`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.style.display = 'none';
            console.error('Failed to load image:', product.image);
          }}
        />
      )}
      <div className="card-header">
        <div>
          <h3 className="card-title">{product.name}</h3>
          <p className="text-muted card-description">{product.description}</p>
        </div>
        <span className={`badge ${isOutOfStock ? 'badge-danger' : ''}`}>
          {product.stock} stock
        </span>
      </div>
      <div className="card-price">Rp {product.price?.toLocaleString('id-ID')}</div>
      <div className="card-footer">
        <Link to={`/products/${product.id}`}>
          <button className="btn">
            <span className="material-symbols-outlined icon-sm">visibility</span>
            View Details
          </button>
        </Link>
        <button 
          className="btn btn-primary" 
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
        >
          <span className="material-symbols-outlined icon-sm">shopping_cart</span>
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}

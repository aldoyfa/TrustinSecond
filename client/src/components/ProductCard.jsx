import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="card">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          className="card-image"
          referrerPolicy="no-referrer"
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
        <span className="badge">{product.stock} stock</span>
      </div>
      <div className="card-price">Rp {product.price?.toLocaleString('id-ID')}</div>
      <div className="card-footer">
        <Link to={`/products/${product.id}`}><button className="btn">View Details</button></Link>
        <button className="btn btn-primary" onClick={() => onAddToCart(product)}>Add to Cart</button>
      </div>
    </article>
  );
}

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../contexts/CartContext.jsx';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data?.data ?? []);
      } catch (e) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Welcome to E-Commerce</h1>
        <p className="page-subtitle">Discover amazing products with our modern e-commerce platform</p>
      </header>
      {loading && <p>Loading products...</p>}
      {error && <p className="text-muted">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

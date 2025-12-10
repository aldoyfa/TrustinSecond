import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../contexts/CartContext.jsx';

export default function InventoryProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/products/inventory/${id}`);
        setProducts(res.data?.data ?? []);
      } catch (e) {
        setError('Failed to load products for this inventory');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.id?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Products from this Inventory</h1>
        <p className="page-subtitle">Products found in this inventory.</p>
      </header>
      
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-container">
          <span className="material-symbols-outlined search-icon">
            search
          </span>
          <input
            type="text"
            className="input search-input"
            placeholder="Search products by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <p className="search-result-text">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <p className="text-muted text-center" style={{ padding: '2rem' }}>
              {searchQuery ? `No products found matching "${searchQuery}"` : 'No products in this inventory'}
            </p>
          ) : (
            <div className="grid grid-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import InventoryListPage from './pages/InventoryListPage.jsx';
import InventoryProductsPage from './pages/InventoryProductsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import InvoicesPage from './pages/InvoicesPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/inventory" element={<InventoryListPage />} />
            <Route path="/inventory/:id" element={<InventoryProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

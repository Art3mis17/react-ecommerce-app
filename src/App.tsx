import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminRoute from './components/shared/AdminRoute';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import ProductFormPage from './pages/products/ProductFormPage';
import CartPage from './pages/cart/CartPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header and Footer wrap all routes so they persist on every page */}
      <Header />

      <main className="flex-1">
        <Routes>
          {/* ── Public routes ──────────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* ── Admin-only routes ───────────────────────────────────────
              ProtectedRoute checks isAuthenticated → redirects to /login
              AdminRoute      checks isAdmin        → redirects to /products
              Both guards must pass for the page to render. */}
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <ProductFormPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <ProductFormPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* ── Fallback routes ─────────────────────────────────────── */}
          {/* Root redirects to catalog so '/' is never a dead end */}
          <Route path="/" element={<Navigate to="/products" replace />} />
          {/* Catch-all — any unknown URL renders the 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

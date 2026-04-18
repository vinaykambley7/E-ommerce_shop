import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/hooks/useAppContext';
import { PageLayout } from '@/components/PageLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <PageLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

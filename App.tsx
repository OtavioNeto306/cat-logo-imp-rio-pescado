
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const location = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Do not render Header/Footer on the admin page for a cleaner interface
    if (location.pathname.startsWith('/admin')) {
        return <div className="bg-neutral min-h-screen font-sans text-primary">{children}</div>;
    }

    return (
        <div className="bg-neutral min-h-screen flex flex-col font-sans text-primary">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/catalogo/:categorySlug" element={<CatalogPage />} />
          <Route path="/catalogo/:categorySlug/:productCode" element={<ProductDetailPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;

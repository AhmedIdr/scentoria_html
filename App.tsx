import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer, CartDrawer } from './components/Layout';
import { ToastContainer } from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartCheckout from './pages/CartCheckout';
import { About, Rituals, Spas, Contact } from './pages/StaticPages';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NoiseOverlay = () => <div className="noise-overlay"></div>;

const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center px-6">
    <div className="text-center">
      <h1 className="text-6xl font-serif text-midnight mb-4">404</h1>
      <p className="text-xl text-cedar mb-8">Page not found</p>
      <a href="/" className="text-gold hover:text-midnight underline">Return Home</a>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-sand font-sans text-midnight selection:bg-clay selection:text-midnight relative">
        <NoiseOverlay />
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <ToastContainer />

        <main id="main-content" className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<CartCheckout />} />
            <Route path="/about" element={<About />} />
            <Route path="/rituals" element={<Rituals />} />
            <Route path="/spas" element={<Spas />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
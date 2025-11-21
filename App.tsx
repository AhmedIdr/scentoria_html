import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer, CartDrawer } from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartCheckout from './pages/CartCheckout';
import { About, Rituals, Spas, Contact } from './pages/StaticPages';
import { CustomCursor } from './components/UI';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NoiseOverlay = () => <div className="noise-overlay"></div>;

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-sand font-sans text-midnight selection:bg-clay selection:text-midnight relative">
        <NoiseOverlay />
        <CustomCursor />
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<CartCheckout />} />
            <Route path="/about" element={<About />} />
            <Route path="/rituals" element={<Rituals />} />
            <Route path="/spas" element={<Spas />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
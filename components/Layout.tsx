import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Instagram, Facebook, Mail } from 'lucide-react';
import { useCartStore } from '../store';
import { NAV_LINKS } from '../constants';
import { Button } from './UI';
import { GeneratedImage } from './GeneratedImage';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, toggleDrawer } = useCartStore();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `fixed w-full z-50 transition-all duration-700 ease-[0.22,1,0.36,1] ${
    isScrolled || !isHome
      ? 'bg-sand/80 backdrop-blur-lg py-4 text-midnight border-b border-midnight/5'
      : 'bg-transparent py-8 text-sand'
  }`;

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-midnight focus:text-sand focus:rounded"
      >
        Skip to main content
      </a>

      <nav className={navClasses} role="navigation" aria-label="Main navigation">
        <div className="max-w-full mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={24} />
          </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-10">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase tracking-[0.15em] font-medium transition-opacity relative group ${
                  isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-px bg-current transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            );
          })}
        </div>

        {/* Logo */}
        <Link to="/" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl md:text-3xl font-serif tracking-wider font-semibold">
          SCENTORIA
        </Link>

        {/* Cart Icon */}
        <div className="flex items-center space-x-4">
          <button
            className="relative group"
            onClick={() => toggleDrawer(true)}
            aria-label={`Shopping cart with ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          >
            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-300" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-clay text-midnight text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-midnight z-50 flex flex-col items-center justify-center space-y-10 text-sand transition-transform duration-500 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <button
          className="absolute top-6 right-6"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close mobile menu"
        >
          <X size={32} />
        </button>
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`text-4xl font-serif italic transition-colors ${
                isActive ? 'text-gold' : 'text-sand hover:text-gold'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
    </>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-midnight text-sand pt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <h4 className="text-xs uppercase tracking-widest text-gold font-bold">Newsletter</h4>
          <p className="text-sand/60 font-serif italic text-lg">Join our inner circle for early access to new scents.</p>
          <div className="flex border-b border-sand/20 pb-2">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email address"
              className="bg-transparent w-full outline-none text-sm placeholder-sand/30"
              aria-label="Email address for newsletter"
            />
            <button className="uppercase text-xs font-bold text-gold" aria-label="Subscribe to newsletter">Join</button>
          </div>
        </div>

        <div className="col-span-1 md:col-span-1">
           <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-6">Explore</h4>
           <ul className="space-y-4 text-sm text-sand/70">
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
            <li><Link to="/rituals" className="hover:text-white transition-colors">Rituals Journal</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
           </ul>
        </div>

        <div className="col-span-1 md:col-span-1">
           <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-6">Support</h4>
           <ul className="space-y-4 text-sm text-sand/70">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/spas" className="hover:text-white transition-colors">B2B / Spas</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Shipping</Link></li>
           </ul>
        </div>

        <div className="col-span-1 md:col-span-1">
           <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-6">Social</h4>
           <div className="flex space-x-6 text-sand/70">
             <a href="#" aria-label="Follow us on Instagram" className="hover:text-white transition-colors">
               <Instagram size={20} />
             </a>
             <a href="#" aria-label="Follow us on Facebook" className="hover:text-white transition-colors">
               <Facebook size={20} />
             </a>
             <a href="mailto:hello@scentoria.ma" aria-label="Email us" className="hover:text-white transition-colors">
               <Mail size={20} />
             </a>
           </div>
        </div>
      </div>

      {/* Massive Footer Logo */}
      <div className="border-t border-white/5 pt-4">
        <h1 className="text-[12vw] md:text-[14vw] leading-none font-serif text-center text-sand/5 select-none pointer-events-none">
          SCENTORIA
        </h1>
        <div className="flex justify-between px-6 pb-6 text-[10px] text-sand/30 uppercase tracking-wider">
          <span>&copy; 2024 Scentoria</span>
          <span>Made in Morocco</span>
        </div>
      </div>
    </footer>
  );
};

export const CartDrawer: React.FC = () => {
  const { items, isDrawerOpen, toggleDrawer, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        toggleDrawer(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen, toggleDrawer]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-midnight/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => toggleDrawer(false)}
        aria-hidden="true"
      />
      
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-sand z-[70] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.22, 1, 0.36, 1) flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="p-8 flex justify-between items-center border-b border-cedar/10">
          <h2 className="text-2xl font-serif text-midnight italic">Your Rituals</h2>
          <button
            onClick={() => toggleDrawer(false)}
            className="text-cedar hover:text-midnight transition-transform hover:rotate-90 duration-300"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <ShoppingBag size={48} className="text-clay/50" />
              <p className="text-cedar/60 font-serif text-lg">Your cart is empty.</p>
              <Link to="/shop" onClick={() => toggleDrawer(false)}>
                <Button variant="outline">Browse Collection</Button>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex space-x-6 group">
                <div className="w-24 h-32 bg-gray-100 overflow-hidden shrink-0">
                  <GeneratedImage 
                    prompt={item.imagePrompt} 
                    alt={item.name} 
                    aspectRatio="3:4"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg text-midnight">{item.name}</h3>
                      <p className="font-medium text-midnight">{item.price * item.quantity} MAD</p>
                    </div>
                    <p className="text-xs text-cedar/60 uppercase tracking-wide">{item.size}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-cedar/20" role="group" aria-label="Quantity controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-cedar/10 transition-colors"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-cedar/10 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-cedar/40 hover:text-red-500 underline decoration-1 underline-offset-2 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-cedar/10 bg-white/30">
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-xl">Subtotal</span>
              <span className="font-serif text-2xl font-medium">{getTotalPrice()} MAD</span>
            </div>
            <Link to="/checkout" onClick={() => toggleDrawer(false)} className="block w-full">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
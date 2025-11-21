import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Instagram, Facebook, Mail } from 'lucide-react';
import { useCartStore } from '../store';
import { useToastStore } from './Toast';
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
          className={`absolute top-6 right-6 transition-all duration-300 ${
            mobileMenuOpen
              ? 'opacity-100 rotate-0 delay-300'
              : 'opacity-0 rotate-90'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close mobile menu"
        >
          <X size={32} />
        </button>
        {NAV_LINKS.map((link, index) => {
          const isActive = location.pathname === link.path;
          const delay = mobileMenuOpen ? index * 80 : 0;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`text-4xl font-serif italic transition-all duration-500 ${
                isActive ? 'text-gold' : 'text-sand hover:text-gold'
              } ${
                mobileMenuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${delay}ms`
              }}
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
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToastStore();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      addToast('Please enter your email address', 'error');
      return;
    }

    if (!validateEmail(email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - in production, replace with actual API endpoint
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success
      addToast('Successfully subscribed! Welcome to Scentoria.', 'success');
      setEmail('');
    } catch (error) {
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-midnight text-sand pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section: Newsletter Highlight */}
        <div className="max-w-2xl mb-20">
          <h4 className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-4">Newsletter</h4>
          <p className="text-sand/80 font-serif italic text-2xl md:text-3xl mb-8 leading-relaxed">
            Join our inner circle for early access to new scents and exclusive rituals.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex items-center border-b-2 border-sand/30 pb-3 hover:border-gold transition-colors">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="bg-transparent w-full outline-none text-base placeholder-sand/40 disabled:opacity-50"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="uppercase text-xs font-bold text-gold hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4"
              aria-label="Subscribe to newsletter"
            >
              {isSubmitting ? 'Sending...' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Bottom Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-5">Explore</h4>
            <ul className="space-y-3 text-sm text-sand/70">
              <li><Link to="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-all">Shop All</Link></li>
              <li><Link to="/rituals" className="hover:text-white hover:translate-x-1 inline-block transition-all">Rituals Journal</Link></li>
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-5">Support</h4>
            <ul className="space-y-3 text-sm text-sand/70">
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">Contact</Link></li>
              <li><Link to="/spas" className="hover:text-white hover:translate-x-1 inline-block transition-all">B2B / Spas</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">Shipping</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-5">Connect</h4>
            <div className="flex gap-4 text-sand/70">
              <a href="#" aria-label="Follow us on Instagram" className="hover:text-gold hover:scale-110 transition-all">
                <Instagram size={22} />
              </a>
              <a href="#" aria-label="Follow us on Facebook" className="hover:text-gold hover:scale-110 transition-all">
                <Facebook size={22} />
              </a>
              <a href="mailto:hello@scentoria.ma" aria-label="Email us" className="hover:text-gold hover:scale-110 transition-all">
                <Mail size={22} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-5">Legal</h4>
            <ul className="space-y-3 text-sm text-sand/70">
              <li><Link to="/terms" className="hover:text-white hover:translate-x-1 inline-block transition-all">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-white hover:translate-x-1 inline-block transition-all">Privacy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Logo */}
      <div className="border-t border-white/5 pt-4">
        <h1 className="text-[8vw] md:text-[10vw] leading-none font-serif text-center text-sand/5 select-none pointer-events-none">
          SCENTORIA
        </h1>
        <div className="flex justify-between px-6 pb-6 text-[10px] text-sand/40 uppercase tracking-wider">
          <span>&copy; 2024 Scentoria</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-gold rounded-full"></span>
            Handcrafted in Morocco
          </span>
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
        className={`fixed inset-y-0 right-0 w-[90%] max-w-lg bg-gradient-to-br from-sand via-sand to-sand/95 z-[70] shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-transform duration-500 cubic-bezier(0.22, 1, 0.36, 1) flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="p-8 flex justify-between items-center border-b border-cedar/20 bg-white/40 backdrop-blur-sm">
          <div>
            <h2 className="text-3xl font-serif text-midnight italic mb-1">Your Rituals</h2>
            <p className="text-xs text-cedar/60 uppercase tracking-wider">Curated selection</p>
          </div>
          <button
            onClick={() => toggleDrawer(false)}
            className="text-cedar hover:text-midnight transition-all hover:rotate-90 duration-300 p-2 hover:bg-cedar/10 rounded-full"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
              <div className="relative">
                <ShoppingBag size={64} className="text-clay/40" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-midnight font-serif text-2xl mb-2 italic">Your next ritual awaits</p>
                <p className="text-cedar text-sm max-w-xs mx-auto leading-relaxed">
                  Discover hand-poured candles crafted to transform your space into sanctuary
                </p>
              </div>
              <Link to="/shop" onClick={() => toggleDrawer(false)} className="w-full max-w-xs">
                <Button variant="primary" className="w-full">Explore Collection</Button>
              </Link>
              <div className="pt-4 border-t border-cedar/10 w-full max-w-xs">
                <p className="text-xs text-cedar/80 mb-3 font-medium">Popular Choices:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-xs px-3 py-1 bg-sand rounded-full text-cedar hover:bg-clay/20 transition-colors cursor-pointer">Atlas Cedar</span>
                  <span className="text-xs px-3 py-1 bg-sand rounded-full text-cedar hover:bg-clay/20 transition-colors cursor-pointer">Sahara Dune</span>
                  <span className="text-xs px-3 py-1 bg-sand rounded-full text-cedar hover:bg-clay/20 transition-colors cursor-pointer">Riad Courtyard</span>
                </div>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex space-x-5 group bg-white/60 backdrop-blur-sm p-5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-cedar/10">
                <div className="w-28 h-36 bg-sand/30 overflow-hidden shrink-0 rounded-md shadow-inner">
                  <GeneratedImage
                    prompt={item.imagePrompt}
                    alt={item.name}
                    aspectRatio="3:4"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-midnight leading-tight">{item.name}</h3>
                      <p className="font-bold text-midnight text-lg ml-2">{item.price * item.quantity} <span className="text-sm font-normal text-cedar/70">MAD</span></p>
                    </div>
                    <p className="text-xs text-cedar uppercase tracking-wider">{item.size}</p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border-2 border-cedar/30 rounded-md overflow-hidden shadow-sm bg-white" role="group" aria-label="Quantity controls">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-cedar/20 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gold focus:ring-inset"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-semibold border-x-2 border-cedar/20 h-9 flex items-center justify-center" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-cedar/20 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gold focus:ring-inset"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-cedar hover:text-red-600 font-medium underline decoration-1 underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded"
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
          <div className="p-8 border-t-2 border-cedar/20 bg-gradient-to-t from-white/70 to-white/40 backdrop-blur-md">
            <div className="bg-white/80 p-6 rounded-lg shadow-inner mb-6 border border-cedar/20">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm text-cedar/70 uppercase tracking-wider">Subtotal</span>
                <span className="text-sm text-cedar/60">{getTotalPrice()} MAD</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-cedar/10">
                <span className="font-serif text-xl text-midnight">Total</span>
                <span className="font-serif text-3xl font-bold text-midnight">{getTotalPrice()} <span className="text-base font-normal text-cedar/70">MAD</span></span>
              </div>
            </div>
            <Link to="/checkout" onClick={() => toggleDrawer(false)} className="block w-full">
              <Button className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-midnight hover:bg-gold hover:text-midnight border-none">
                Proceed to Checkout →
              </Button>
            </Link>
            <p className="text-center text-xs text-cedar/50 mt-4">Free shipping on orders over 500 MAD</p>
          </div>
        )}
      </div>
    </>
  );
};
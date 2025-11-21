import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Button, FadeIn } from '../components/UI';
import { GeneratedImage } from '../components/GeneratedImage';
import { useCartStore } from '../store';
import { SEO } from '../components/SEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { ArrowLeft, Clock, Star, ZoomIn, X } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = React.useState(1);
  const [isZoomed, setIsZoomed] = React.useState(false);

  // Close zoom on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isZoomed]);

  // Prevent body scroll when zoomed
  React.useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  const product = PRODUCTS.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  // Get related products (same scent family, excluding current product)
  const relatedProducts = PRODUCTS.filter(
    p => p.id !== product.id && p.scentFamily === product.scentFamily
  ).slice(0, 3);

  // If not enough in same scent family, add others
  if (relatedProducts.length < 3) {
    const additionalProducts = PRODUCTS.filter(
      p => p.id !== product.id && !relatedProducts.includes(p)
    ).slice(0, 3 - relatedProducts.length);
    relatedProducts.push(...additionalProducts);
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <SEO
        title={`${product.name} - ${product.tagline} | Scentoria`}
        description={product.description}
        type="product"
      />

      <button onClick={() => navigate(-1)} className="flex items-center text-cedar/60 hover:text-midnight mb-4 text-sm">
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>

      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Shop', path: '/shop' },
          { label: product.name, path: `/product/${product.slug}` }
        ]}
        className="mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <FadeIn direction="right">
          <div
            className="bg-white p-2 shadow-lg rotate-1 cursor-zoom-in group relative"
            onClick={() => setIsZoomed(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsZoomed(true);
              }
            }}
            aria-label="Click to zoom image"
          >
             <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
               <GeneratedImage
                 prompt={product.imagePrompt}
                 alt={product.name}
                 aspectRatio="3:4"
                 className="w-full h-full transition-transform duration-700 group-hover:scale-105"
               />
             </div>
             <div className="absolute top-4 right-4 bg-midnight/70 text-sand p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
               <ZoomIn size={20} />
             </div>
          </div>
        </FadeIn>

        {/* Info */}
        <div className="lg:sticky lg:top-32">
          <FadeIn delay={200} direction="left">
            <div className="mb-2 text-gold uppercase text-xs tracking-widest font-bold">{product.scentFamily} Family</div>
            <h1 className="text-4xl md:text-5xl font-serif text-midnight mb-4">{product.name}</h1>
            <p className="text-xl text-cedar mb-6">{product.price} MAD</p>

            <p className="text-cedar/80 leading-relaxed mb-8 text-lg font-light">
              {product.description}
            </p>

            {/* Notes Visualizer */}
            <div className="bg-white/50 border border-cedar/10 p-6 mb-8 rounded-sm">
              <h3 className="font-serif text-lg mb-4">Olfactory Notes</h3>
              <div className="space-y-3">
                <div className="flex items-baseline">
                  <span className="w-16 text-xs uppercase tracking-wide text-cedar/50">Top</span>
                  <span className="text-midnight font-medium">{product.notes.top}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-16 text-xs uppercase tracking-wide text-cedar/50">Heart</span>
                  <span className="text-midnight font-medium">{product.notes.heart}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-16 text-xs uppercase tracking-wide text-cedar/50">Base</span>
                  <span className="text-midnight font-medium">{product.notes.base}</span>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="flex space-x-8 mb-8 text-sm text-cedar/70">
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>40+ Hour Burn Time</span>
              </div>
              <div className="flex items-center">
                <Star size={16} className="mr-2" />
                <span>100% Vegetable Wax</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-sm text-cedar/60 uppercase tracking-wide mb-2 block">Quantity</label>
              <div className="flex items-center border border-cedar/20 w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cedar/10 transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="flex-1 text-center text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cedar/10 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
               <Button
                 onClick={() => {
                   for (let i = 0; i < quantity; i++) {
                     addItem(product);
                   }
                   setQuantity(1);
                 }}
                 size="lg"
                 className="flex-1"
               >
                 Add to Cart — {product.price * quantity} MAD
               </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-cedar/10 pt-16">
          <FadeIn>
            <h2 className="text-3xl font-serif text-midnight mb-8">You May Also Like</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct, idx) => (
              <FadeIn key={relatedProduct.id} delay={idx * 100}>
                <Link to={`/product/${relatedProduct.slug}`} className="group block">
                  <div className="relative overflow-hidden bg-white aspect-[4/5] mb-4">
                    <div className="w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                      <GeneratedImage
                        prompt={relatedProduct.imagePrompt}
                        alt={relatedProduct.name}
                        aspectRatio="3:4"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-cedar/10 pb-2 mb-2">
                    <h3 className="text-xl font-serif text-midnight group-hover:text-gold transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <span className="text-sm font-medium">{relatedProduct.price} MAD</span>
                  </div>
                  <p className="text-cedar/60 text-xs uppercase tracking-wide">
                    {relatedProduct.scentFamily} • {relatedProduct.size}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] bg-midnight/95 flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
        >
          <button
            className="absolute top-6 right-6 text-sand hover:text-gold transition-colors z-10"
            onClick={() => setIsZoomed(false)}
            aria-label="Close zoom"
          >
            <X size={32} />
          </button>
          <div
            className="max-w-5xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-4 shadow-2xl max-h-full overflow-auto">
              <GeneratedImage
                prompt={product.imagePrompt}
                alt={product.name}
                aspectRatio="3:4"
                className="w-full h-auto"
              />
            </div>
          </div>
          <p className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sand/60 text-sm">
            Click anywhere to close
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
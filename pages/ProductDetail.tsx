import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Button, FadeIn } from '../components/UI';
import { GeneratedImage } from '../components/GeneratedImage';
import { useCartStore } from '../store';
import { ArrowLeft, Clock, Star } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const product = PRODUCTS.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center text-cedar/60 hover:text-midnight mb-8 text-sm">
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <FadeIn direction="right">
          <div className="bg-white p-2 shadow-lg rotate-1">
             <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
               <GeneratedImage 
                 prompt={product.imagePrompt} 
                 alt={product.name} 
                 aspectRatio="3:4"
                 className="w-full h-full"
               />
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

            {/* Actions */}
            <div className="flex space-x-4">
               <Button onClick={() => addItem(product)} size="lg" className="flex-1">
                 Add to Cart
               </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
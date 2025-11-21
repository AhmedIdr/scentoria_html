import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { FadeIn } from '../components/UI';
import { GeneratedImage } from '../components/GeneratedImage';
import { useCartStore } from '../store';

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Candle' | 'Set'>('All');
  const [activeScent, setActiveScent] = useState<'All' | 'Woody' | 'Floral' | 'Warm' | 'Fresh'>('All');
  const { addItem } = useCartStore();

  const filteredProducts = PRODUCTS.filter(p => {
    const catMatch = activeCategory === 'All' || p.category === activeCategory;
    const scentMatch = activeScent === 'All' || p.scentFamily === activeScent;
    return catMatch && scentMatch;
  });

  return (
    <div className="pt-32 pb-20 min-h-screen px-6 max-w-7xl mx-auto">
      <FadeIn>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-midnight mb-4">The Collection</h1>
          <p className="text-cedar/60 max-w-2xl mx-auto">
            Explore our range of hand-poured candles, designed to bring the essence of Moroccan serenity into your space.
          </p>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={200}>
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-cedar/10 pb-6 mb-12 gap-6">
          <div className="flex space-x-6">
            {(['All', 'Candle', 'Set'] as const).map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm uppercase tracking-widest transition-colors ${activeCategory === cat ? 'text-midnight font-bold border-b border-gold' : 'text-cedar/50 hover:text-cedar'}`}
              >
                {cat === 'All' ? 'All Products' : cat + 's'}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-cedar/40 uppercase">Scent:</span>
            <select 
              className="bg-transparent border-none text-sm text-midnight font-medium focus:ring-0 cursor-pointer outline-none"
              value={activeScent}
              onChange={(e) => setActiveScent(e.target.value as any)}
            >
              <option value="All">All Scents</option>
              <option value="Woody">Woody</option>
              <option value="Floral">Floral</option>
              <option value="Warm">Warm</option>
              <option value="Fresh">Fresh</option>
            </select>
          </div>
        </div>
      </FadeIn>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map((product, idx) => (
          <FadeIn key={product.id} delay={(idx % 3) * 100}>
            <div className="group">
              <div className="relative overflow-hidden bg-white aspect-[4/5] mb-4">
                 <Link to={`/product/${product.slug}`}>
                   <div className="w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                    <GeneratedImage 
                        prompt={product.imagePrompt} 
                        alt={product.name} 
                        aspectRatio="3:4"
                        className="w-full h-full"
                    />
                   </div>
                 </Link>
                 {/* Quick Add Button appearing on hover */}
                 <button 
                  onClick={() => addItem(product)}
                  className="absolute bottom-0 left-0 right-0 bg-midnight text-white py-4 text-sm uppercase tracking-widest font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center items-center hover:bg-cedar z-10"
                 >
                   Add to Cart — {product.price} MAD
                 </button>
              </div>
              <div>
                <div className="flex justify-between items-start mb-1">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-serif text-xl text-midnight hover:text-gold transition-colors">{product.name}</h3>
                  </Link>
                  <span className="text-sm font-medium text-midnight">{product.price} MAD</span>
                </div>
                <p className="text-cedar/60 text-xs uppercase tracking-wide mb-2">{product.size} • {product.scentFamily}</p>
                <p className="text-sm text-cedar/70 line-clamp-2">{product.tagline}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl font-serif text-cedar/50">No products found matching your selection.</p>
          <button onClick={() => { setActiveCategory('All'); setActiveScent('All'); }} className="mt-4 text-gold hover:underline">Clear Filters</button>
        </div>
      )}
    </div>
  );
};

export default Shop;
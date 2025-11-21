import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { FadeIn } from '../components/UI';
import { GeneratedImage } from '../components/GeneratedImage';
import { useCartStore } from '../store';
import { SEO } from '../components/SEO';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Candle' | 'Set'>('All');
  const [activeScent, setActiveScent] = useState<'All' | 'Woody' | 'Floral' | 'Warm' | 'Fresh'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const { addItem } = useCartStore();

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = PRODUCTS.filter(p => {
      const catMatch = activeCategory === 'All' || p.category === activeCategory;
      const scentMatch = activeScent === 'All' || p.scentFamily === activeScent;
      const searchMatch = searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return catMatch && scentMatch && searchMatch;
    });

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-az':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-za':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'featured':
      default:
        return sorted;
    }
  }, [activeCategory, activeScent, searchQuery, sortBy]);

  return (
    <div className="pt-32 pb-20 min-h-screen px-6 max-w-7xl mx-auto">
      <SEO
        title="Shop Luxury Candles | Scentoria"
        description="Browse our collection of hand-poured Moroccan candles. Woody, floral, warm, and fresh scents. 100% vegetable wax, 40+ hour burn time."
        type="website"
      />

      <FadeIn>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-midnight mb-4">The Collection</h1>
          <p className="text-cedar/60 max-w-2xl mx-auto mb-8">
            Explore our range of hand-poured candles, designed to bring the essence of Moroccan serenity into your space.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cedar/40" size={20} />
            <input
              type="text"
              placeholder="Search candles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-cedar/20 rounded-full bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cedar/20 focus:border-cedar transition-all"
              aria-label="Search products"
            />
          </div>
        </div>
      </FadeIn>

      {/* Filters & Sort */}
      <FadeIn delay={200}>
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-cedar/10 pb-6 mb-12 gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {(['All', 'Candle', 'Set'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm uppercase tracking-widest transition-colors pb-1 ${activeCategory === cat ? 'text-midnight font-bold border-b-2 border-gold' : 'text-cedar/50 hover:text-cedar'}`}
                aria-label={`Filter by ${cat}`}
              >
                {cat === 'All' ? 'All Products' : cat + 's'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <label htmlFor="scent-filter" className="text-xs text-cedar/40 uppercase">Scent:</label>
              <select
                id="scent-filter"
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

            <div className="flex items-center space-x-2">
              <label htmlFor="sort-by" className="text-xs text-cedar/40 uppercase">Sort:</label>
              <select
                id="sort-by"
                className="bg-transparent border-none text-sm text-midnight font-medium focus:ring-0 cursor-pointer outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A-Z</option>
                <option value="name-za">Name: Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-cedar/60">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
          </p>
          {(searchQuery || activeCategory !== 'All' || activeScent !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setActiveScent('All');
              }}
              className="text-sm text-gold hover:text-midnight underline transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </FadeIn>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredAndSortedProducts.map((product, idx) => (
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

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl font-serif text-cedar/50 mb-4">No products found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
              setActiveScent('All');
            }}
            className="text-gold hover:text-midnight underline transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
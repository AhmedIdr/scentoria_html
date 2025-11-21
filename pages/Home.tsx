import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, STATIC_PROMPTS } from '../constants';
import { Button, FadeIn, Marquee } from '../components/UI';
import { GeneratedImage } from '../components/GeneratedImage';

const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      
      {/* --- Hero Section --- */}
      <section className="relative h-screen w-full flex items-end pb-20 md:pb-32 px-6 md:px-12 overflow-hidden bg-midnight">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 w-full h-[120%] will-change-transform bg-midnight z-0"
          style={{ 
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        >
          <GeneratedImage 
            prompt={STATIC_PROMPTS.HERO}
            alt="Atmospheric Scentoria Spa"
            aspectRatio="16:9"
            className="w-full h-full"
          />
        </div>

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-midnight/30 mix-blend-multiply z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent z-10 pointer-events-none"></div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-6xl w-full">
          <FadeIn delay={200}>
            <h1 className="text-sand font-serif text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight mb-8 drop-shadow-2xl">
              <span className="block italic font-light opacity-90">The art of</span>
              <span className="block font-medium ml-4 md:ml-20">memory & scent</span>
            </h1>
          </FadeIn>
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-12 border-t border-sand/30 pt-8">
             <FadeIn delay={400}>
               <p className="text-sand/90 max-w-md text-lg font-light leading-relaxed drop-shadow-md">
                 Boutique home fragrances inspired by the quiet moments of the medina and the vast silence of the Atlas.
               </p>
             </FadeIn>
             
             <FadeIn delay={600} className="mt-8 md:mt-0">
               <Link to="/shop">
                 <Button variant="secondary" size="lg" className="rounded-full bg-sand text-midnight hover:bg-white border-none">
                   Explore Collection
                 </Button>
               </Link>
             </FadeIn>
          </div>
        </div>
      </section>

      {/* --- Marquee --- */}
      <Marquee text="Handcrafted in Morocco • 100% Vegetable Wax • Inspired by Rituals" />

      {/* --- Editorial Collection Preview --- */}
      <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <FadeIn>
             <span className="text-xs font-bold tracking-[0.2em] uppercase text-cedar/60 block mb-2">The Collection</span>
             <h2 className="text-4xl md:text-6xl font-serif text-midnight">
               Curated <span className="italic text-cedar/80">Ambience</span>
             </h2>
          </FadeIn>
          <FadeIn delay={200} className="mt-6 md:mt-0">
            <Link to="/shop" className="group flex items-center text-cedar hover:text-midnight transition-colors uppercase text-xs font-bold tracking-widest">
              View All <span className="w-8 h-px bg-cedar ml-4 group-hover:w-12 transition-all duration-300"></span>
            </Link>
          </FadeIn>
        </div>

        {/* Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* Large Feature */}
          <div className="md:col-span-7">
             <Link to={`/product/${PRODUCTS[0].slug}`} className="group block">
               <GeneratedImage 
                  prompt={PRODUCTS[0].imagePrompt} 
                  alt={PRODUCTS[0].name} 
                  aspectRatio="3:4"
                  className="aspect-[4/5] w-full mb-6"
               />
               <div className="flex justify-between items-baseline border-b border-cedar/10 pb-4">
                 <h3 className="text-3xl font-serif text-midnight group-hover:italic transition-all duration-300">{PRODUCTS[0].name}</h3>
                 <span className="text-lg">{PRODUCTS[0].price} MAD</span>
               </div>
               <p className="text-cedar/60 mt-2 text-sm uppercase tracking-wide">{PRODUCTS[0].scentFamily} • {PRODUCTS[0].size}</p>
             </Link>
          </div>

          {/* Small Features Column */}
          <div className="md:col-span-5 flex flex-col gap-16 md:mt-32">
            {PRODUCTS.slice(1, 3).map((product, idx) => (
              <Link key={product.id} to={`/product/${product.slug}`} className="group block">
                <GeneratedImage 
                   prompt={product.imagePrompt} 
                   alt={product.name}
                   aspectRatio="3:4"
                   className="aspect-square w-full mb-6"
                />
                <div className="flex justify-between items-baseline border-b border-cedar/10 pb-2">
                  <h3 className="text-2xl font-serif text-midnight group-hover:italic transition-all duration-300">{product.name}</h3>
                  <span className="text-sm">{product.price} MAD</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* --- Immersive Story Section --- */}
      <section className="relative py-32 bg-midnight text-sand overflow-hidden">
         {/* Background Texture */}
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <GeneratedImage 
                prompt="Abstract macro texture of beeswax and linen, minimalist, beige tones." 
                alt="Texture" 
                aspectRatio="3:4"
                className="w-full h-full object-cover" 
            />
         </div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
               <FadeIn>
                 <div className="w-20 h-px bg-gold mb-8"></div>
                 <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
                   Crafted for the <br/> <span className="italic text-gold">slow moments</span>
                 </h2>
               </FadeIn>
               <FadeIn delay={200}>
                 <p className="text-sand/70 text-lg leading-relaxed mb-10 max-w-md">
                   We believe that scent is the strongest anchor to memory. Our candles are hand-poured in small batches, using 100% vegetable wax and oils that tell the story of Morocco's diverse landscapes.
                 </p>
                 <Link to="/about">
                   <Button variant="outline" className="border-sand text-sand hover:bg-sand hover:text-midnight">
                     Read Our Story
                   </Button>
                 </Link>
               </FadeIn>
            </div>

            <div className="relative">
               <FadeIn direction="right" delay={300}>
                  <div className="relative z-10">
                    <GeneratedImage 
                      prompt={STATIC_PROMPTS.STORY}
                      alt="Candle Texture" 
                      aspectRatio="3:4"
                      className="w-full aspect-[3/4] shadow-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-full h-full border border-white/10 z-0 hidden md:block"></div>
               </FadeIn>
            </div>
         </div>
      </section>

      {/* --- Rituals Teaser --- */}
      <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
         <FadeIn className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-midnight">Rituals Journal</h2>
         </FadeIn>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/rituals" className="group relative overflow-hidden block aspect-[16/9]">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
               <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-1000">
                <GeneratedImage 
                    prompt={STATIC_PROMPTS.RITUAL_EVENING}
                    alt="Evening Ritual"
                    aspectRatio="16:9"
                    className="w-full h-full"
                />
               </div>
               <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20">
                  <span className="text-xs uppercase tracking-widest text-sand mb-2 block">Guide</span>
                  <h3 className="text-3xl font-serif text-white italic">Evening Wind-Down</h3>
               </div>
            </Link>
            <Link to="/rituals" className="group relative overflow-hidden block aspect-[16/9]">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
               <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-1000">
                 <GeneratedImage 
                    prompt={STATIC_PROMPTS.RITUAL_SPA}
                    alt="Hammam Ritual"
                    aspectRatio="16:9"
                    className="w-full h-full"
                 />
               </div>
               <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20">
                  <span className="text-xs uppercase tracking-widest text-sand mb-2 block">Lifestyle</span>
                  <h3 className="text-3xl font-serif text-white italic">Hammam at Home</h3>
               </div>
            </Link>
         </div>
      </section>

    </div>
  );
};

export default Home;
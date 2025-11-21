import React from 'react';
import { SectionTitle, Button, FadeIn } from '../components/UI';
import { STATIC_PROMPTS } from '../constants';
import { GeneratedImage } from '../components/GeneratedImage';

// --- About Page ---
export const About: React.FC = () => (
  <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
    <FadeIn>
      <SectionTitle title="Our Story" subtitle="Crafting Memories" />
    </FadeIn>
    <div className="prose prose-lg mx-auto text-cedar/80 font-light">
      <FadeIn delay={200}>
        <p className="mb-6 text-xl leading-relaxed">
          Scentoria was born from the idea that some moments deserve their own scent. Blending carefully chosen waxes, refined fragrance compositions, and a warm, minimal aesthetic, we create candles that feel both modern and timeless.
        </p>
      </FadeIn>
      <FadeIn delay={400}>
        <div className="w-full h-64 md:h-96 my-12 shadow-lg rounded-sm overflow-hidden">
            <GeneratedImage 
                prompt={STATIC_PROMPTS.STORY} 
                alt="Crafting Process" 
                aspectRatio="16:9"
                className="w-full h-full"
            />
        </div>
      </FadeIn>
      <FadeIn delay={600}>
        <p className="mb-6">
          From spa-like serenity to intimate evening ambience, every product is designed to transform spaces into atmospheres. Small-batch production ensures attention to detail, quality, and a deeply personal touch.
        </p>
      </FadeIn>
      <FadeIn delay={800}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
          <div className="p-4">
              <h3 className="font-serif text-lg text-midnight mb-2">Clean Ingredients</h3>
              <p className="text-sm">100% Vegetable wax and lead-free cotton wicks.</p>
          </div>
          <div className="p-4">
              <h3 className="font-serif text-lg text-midnight mb-2">Hand Poured</h3>
              <p className="text-sm">Made in small batches in our Moroccan workshop.</p>
          </div>
          <div className="p-4">
              <h3 className="font-serif text-lg text-midnight mb-2">Sustainable</h3>
              <p className="text-sm">Recyclable glass vessels and minimal packaging.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  </div>
);

// --- Rituals Page ---
export const Rituals: React.FC = () => (
  <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <FadeIn>
        <SectionTitle title="The Journal" subtitle="Rituals & Stories" />
      </FadeIn>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <FadeIn delay={200}>
        <div className="group cursor-pointer">
          <div className="overflow-hidden aspect-video mb-4">
              <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                <GeneratedImage 
                    prompt={STATIC_PROMPTS.RITUAL_EVENING} 
                    alt="Evening Ritual" 
                    aspectRatio="16:9"
                    className="w-full h-full"
                />
              </div>
          </div>
          <span className="text-xs text-gold uppercase tracking-widest">Guides</span>
          <h2 className="text-2xl font-serif text-midnight mt-2 mb-3 group-hover:text-cedar transition-colors">Designing the Perfect Evening Down-Time</h2>
          <p className="text-cedar/70">Techniques to disconnect from the digital world and reconnect with your senses using scent anchors.</p>
        </div>
      </FadeIn>
      <FadeIn delay={400}>
        <div className="group cursor-pointer">
          <div className="overflow-hidden aspect-video mb-4">
              <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                <GeneratedImage 
                    prompt={STATIC_PROMPTS.RITUAL_SPA} 
                    alt="Spa at Home" 
                    aspectRatio="16:9"
                    className="w-full h-full"
                />
              </div>
          </div>
          <span className="text-xs text-gold uppercase tracking-widest">Lifestyle</span>
          <h2 className="text-2xl font-serif text-midnight mt-2 mb-3 group-hover:text-cedar transition-colors">Bringing the Hammam Home</h2>
          <p className="text-cedar/70">Using Eucalyptus and Black Soap scents to recreate the purification ritual of the Moroccan Hammam in your own bathroom.</p>
        </div>
      </FadeIn>
    </div>
  </div>
);

// --- Spas B2B Page ---
export const Spas: React.FC = () => (
  <div className="pt-32 pb-20 w-full">
     <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <FadeIn direction="right">
          <div>
              <SectionTitle title="For Spas & Riads" subtitle="B2B Partnerships" center={false} />
              <p className="text-lg text-cedar/80 mb-6">
                  Elevate your guest experience with a signature scent. Scentoria partners with boutique hotels, riads, and spas to create immersive olfactory atmospheres.
              </p>
              <ul className="space-y-4 mb-8 text-cedar/70">
                  <li className="flex items-center"><span className="w-2 h-2 bg-gold rounded-full mr-3"></span>Wholesale pricing for bulk orders</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-gold rounded-full mr-3"></span>Custom scent development</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-gold rounded-full mr-3"></span>White-labeling options available</li>
              </ul>
              <Button>Request Catalog</Button>
          </div>
        </FadeIn>
        <FadeIn direction="left">
          <div className="relative h-[500px] bg-midnight p-4">
              <div className="absolute inset-0 border border-gold m-4 z-10 pointer-events-none"></div>
              <GeneratedImage 
                prompt={STATIC_PROMPTS.SPA_B2B} 
                alt="Spa Interior" 
                aspectRatio="3:4"
                className="w-full h-full opacity-80"
              />
          </div>
        </FadeIn>
     </div>
  </div>
);

// --- Contact Page ---
export const Contact: React.FC = () => (
  <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
     <FadeIn>
       <SectionTitle title="Contact Us" subtitle="We'd love to hear from you" />
       <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-cedar/60">First Name</label>
                  <input type="text" className="w-full p-3 bg-white border border-cedar/20 focus:outline-none focus:border-cedar" />
              </div>
              <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-cedar/60">Last Name</label>
                  <input type="text" className="w-full p-3 bg-white border border-cedar/20 focus:outline-none focus:border-cedar" />
              </div>
          </div>
          <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-cedar/60">Email</label>
              <input type="email" className="w-full p-3 bg-white border border-cedar/20 focus:outline-none focus:border-cedar" />
          </div>
          <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-cedar/60">Message</label>
              <textarea rows={5} className="w-full p-3 bg-white border border-cedar/20 focus:outline-none focus:border-cedar resize-none"></textarea>
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
       </form>
     </FadeIn>
  </div>
);
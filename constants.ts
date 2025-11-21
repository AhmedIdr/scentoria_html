import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Atlas Retreat',
    slug: 'atlas-retreat',
    tagline: 'Cedarwood & Crisp Mountain Air',
    price: 279,
    size: '320g',
    category: 'Candle',
    scentFamily: 'Woody',
    description: 'Inspired by the silence of the high Atlas mountains. A grounding blend of ancient cedar and cold mountain air that brings stillness to any room.',
    notes: { top: 'Bergamot', heart: 'Cedarwood', base: 'Amber' },
    imagePrompt: 'Professional product photography of a luxury scented candle named "Atlas Retreat" in a dark amber glass jar, sitting on a rustic weathered wood table. Background is a blurred view of the Atlas mountains at dusk. Moody, cinematic lighting, 8k resolution, photorealistic, minimalist style.'
  },
  {
    id: '2',
    name: 'Riad at Night',
    slug: 'riad-at-night',
    tagline: 'Jasmine, Orange Blossom & Warm Stone',
    price: 189,
    size: '180g',
    category: 'Candle',
    scentFamily: 'Floral',
    description: 'The scent of a hidden courtyard after dusk. Sweet jasmine climbs the walls while the warmth of the day radiates from the tadelakt.',
    notes: { top: 'Petitgrain', heart: 'Jasmine Sambac', base: 'Musk' },
    imagePrompt: 'Professional product photography of a luxury scented candle named "Riad at Night" in a sleek dark glass vessel. Placed on a beige tadelakt surface with jasmine flowers scattered nearby. Background is a dimly lit Moroccan riad courtyard with a fountain and warm lantern light. Atmospheric, elegant, 8k.'
  },
  {
    id: '3',
    name: 'Sahara Gold',
    slug: 'sahara-gold',
    tagline: 'Spiced Amber & Dry Sand',
    price: 279,
    size: '320g',
    category: 'Candle',
    scentFamily: 'Warm',
    description: 'Golden hour over the dunes. A rich, spicy warmth that fills the room with the glow of the setting sun.',
    notes: { top: 'Saffron', heart: 'Amber', base: 'Sandalwood' },
    imagePrompt: 'Professional product photography of a luxury scented candle named "Sahara Gold" in a warm amber glass. Sitting on soft golden sand with a dune ridge in the background during golden hour. Warm sunlight, sharp focus on product, bokeh background, high-end editorial style.'
  },
  {
    id: '4',
    name: 'Midnight Hammam',
    slug: 'midnight-hammam',
    tagline: 'Eucalyptus & Black Soap',
    price: 189,
    size: '180g',
    category: 'Candle',
    scentFamily: 'Fresh',
    description: 'Purifying and steamy. The scent of a traditional spa ritual, cleansing the mind and body.',
    notes: { top: 'Eucalyptus', heart: 'Rosemary', base: 'Olive Wood' },
    imagePrompt: 'Professional product photography of a luxury scented candle named "Midnight Hammam" in a black glass jar. Placed on dark marble in a steamy spa environment. Eucalyptus leaves as props. Moody, dark green and black tones, wet textures, serene atmosphere, 8k.'
  },
  {
    id: '5',
    name: 'Kasbah Rose',
    slug: 'kasbah-rose',
    tagline: 'Damask Rose & Oud',
    price: 320,
    size: '320g',
    category: 'Candle',
    scentFamily: 'Floral',
    description: 'A sophisticated take on the classic rose. Deep, velvety petals mixed with the smoky mystery of oud.',
    notes: { top: 'Pink Pepper', heart: 'Damask Rose', base: 'Oud' },
    imagePrompt: 'Professional product photography of a luxury scented candle named "Kasbah Rose" in a dark glass. Surrounded by dried deep red rose petals on an intricate vintage moroccan tray. Soft moody lighting, romantic and mysterious, high contrast, photorealistic.'
  },
  {
    id: '6',
    name: 'Mint Tea Ritual',
    slug: 'mint-tea-ritual',
    tagline: 'Fresh Mint & Green Tea',
    price: 189,
    size: '180g',
    category: 'Candle',
    scentFamily: 'Fresh',
    description: 'The ultimate sign of hospitality. Sweet, invigorating mint blended with the earthiness of green tea leaves.',
    notes: { top: 'Spearmint', heart: 'Green Tea', base: 'Sugar Cane' },
    imagePrompt: 'Professional product photography of a luxury scented candle named "Mint Tea Ritual". Bright and airy setting, placed on a mosaic tile table with fresh mint leaves and a silver teapot in the blurred background. Natural daylight, crisp, refreshing vibe, 8k.'
  }
];

export const STATIC_PROMPTS = {
  HERO: "Cinematic wide shot of a luxurious, dimly lit room in a Moroccan riad. Multiple lit scented candles on low wooden tables, casting warm flickering glow. Deep shadows, rich textures of rugs and tadelakt walls. Tranquil, spa-like atmosphere, 4k, photorealistic, 16:9 aspect ratio.",
  STORY: "Close up artistic shot of hand-pouring candle wax into glass jars in an artisanal workshop. Warm lighting, focus on the craftsmanship and texture of the wax. Aesthetic, moody, craftsman vibe.",
  RITUAL_EVENING: "Cozy evening scene in a living room, a person reading a book by candlelight. Soft blanket, warm cup of tea, dark ambient lighting. Relaxing, peaceful, hygge atmosphere.",
  RITUAL_SPA: "Interior of a beautiful traditional hammam spa. Geometric tiles, steam in the air, copper bowls, soft light filtering through star-shaped ceiling vents. Serene, cleansing, architectural photography.",
  SPA_B2B: "Luxury hotel spa reception area with moroccan design elements. Clean, minimal, elegant. Candles displayed on a shelf. Professional architectural photography."
};

export const NAV_LINKS = [
  { name: 'Shop', path: '/shop' },
  { name: 'Rituals', path: '/rituals' },
  { name: 'For Spas', path: '/spas' },
  { name: 'About', path: '/about' },
];
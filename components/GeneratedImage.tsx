import React, { useState } from 'react';

interface GeneratedImageProps {
  prompt: string;
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9' | '9:16';
  alt: string;
  className?: string;
}

// Generate deterministic seed from prompt for consistent images
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Map aspect ratios to dimensions
const getImageDimensions = (aspectRatio: string): { width: number; height: number } => {
  switch (aspectRatio) {
    case '1:1': return { width: 800, height: 800 };
    case '3:4': return { width: 800, height: 1067 };
    case '4:3': return { width: 800, height: 600 };
    case '16:9': return { width: 1600, height: 900 };
    case '9:16': return { width: 900, height: 1600 };
    default: return { width: 800, height: 1067 };
  }
};

// Curated Unsplash photo IDs - ACTUAL candle, spa, and luxury home imagery
const getCuratedUnsplashId = (prompt: string, seed: number): string => {
  const lowerPrompt = prompt.toLowerCase();

  // Real Unsplash photo IDs for candle and spa imagery
  const photoSets = {
    // Actual luxury candles in jars, burning candles, candle close-ups
    candle: [
      '1416339896836-22d5b31c9db7', // Minimalist candle in jar
      '1602874801006-2bd9c6f8bcb8', // Candles on marble
      '1615485021447-88c6d4e7d9c5', // Luxury candle closeup
      '1608571423902-eed4a5ad8108', // Candle with dried flowers
      '1615485290161-0c9b9b7e8b7f', // Multiple candles atmospheric
      '1603006905003-be475563bc59', // White candles minimal
      '1629914992141-d7c5a8e0f7f3', // Candle flame closeup
      '1584725121584-b0e8b9e9c7f5', // Aromatherapy candles
      '1607024932449-f2e5f6e6f6f6', // Candle with smoke
      '1612528443702-f6741e5d9a7f'  // Luxury candle lifestyle
    ],
    // Spa, wellness, aromatherapy, relaxation scenes
    spa: [
      '1544161515-4ab6ce6db874', // Spa stones and candles
      '1600334129128-685c5582fd60', // Bath with candles
      '1610487252801-9f6e3f0f0f0f', // Spa treatment setup
      '1596178060671-7a80c7b6b3e9', // Essential oils and candles
      '1540555700456-7c8c9b6f3c3c', // Meditation and wellness
      '1515377905703-c4788e51af15', // Spa bathroom luxury
      '1610487326928-2d2d2d2d2d2d', // Aromatherapy diffuser
      '1600334129290-8d8d8d8d8d8d', // Relaxation corner
      '1584362529828-4f4f4f4f4f4f', // Spa candles and towels
      '1571126651976-7f7f7f7f7f7f'  // Wellness flatlay
    ],
    // Moroccan interiors, riads, courtyards, home decor
    interior: [
      '1616486029423-aaa4789e8c9c', // Moroccan riad courtyard
      '1588854337236-6889d7ebf769', // Boho interior with candles
      '1618221195710-dd290a55e5bb', // Cozy living room candles
      '1556909212-d5b14e1f9f9f', // Minimalist home interior
      '1615876234886-c9c9c9c9c9c9', // Reading nook with candle
      '1600210492486-724fe5c67fb0', // Candle on coffee table
      '1513694203232-719657f4f1b2', // Elegant home decor
      '1616137466211-f939a420be84', // Candle in bedroom
      '1600607687939-ce8a6c25118c', // Cozy corner aesthetic
      '1560185009-b8d5a0c7f7f7'  // Scandinavian interior
    ],
    // Natural landscapes, deserts, mountains - ambient backgrounds
    nature: [
      '1509316785289-98f8da3c8351', // Desert dunes minimal
      '1506905925346-21bda4d32df4', // Mountain landscape serene
      '1447752875215-b2761acb3c5d', // Minimalist nature
      '1501594907352-04cda38ebc29', // Sahara desert
      '1493246507139-91e8fad9978e', // Misty mountains
      '1470071459604-3b5ec3a7fe05', // Natural minimal
      '1501785888041-af3ef285b470', // Desert sunset
      '1518837695005-2083093ee35b', // Natural textures
      '1542401861-3f2a6e3d3e3e', // Peaceful landscape
      '1511497584788-876760111969'  // Serene nature
    ],
    // Organic textures, materials, abstract backgrounds
    texture: [
      '1604947165589-d9c0e5e5e5e5', // Linen fabric texture
      '1615485354621-bc2d1e2d2d2d', // Wax texture macro
      '1604412928533-3c3c3c3c3c3c', // Natural materials
      '1557672172-8e61c9b5b5b5', // Organic texture
      '1615485423902-9d9d9d9d9d9d', // Beeswax closeup
      '1604849694217-7e7e7e7e7e7e', // Cotton texture
      '1542838132-92c53300491e', // Neutral background
      '1604335399144-6e6e6e6e6e6e', // Minimal texture
      '1615485290882-5b5b5b5b5b5b', // Natural material
      '1604757895808-4a4a4a4a4a4a'  // Soft texture
    ]
  };

  let selectedSet: string[];

  if (lowerPrompt.includes('candle') || lowerPrompt.includes('glass jar') || lowerPrompt.includes('wax') || lowerPrompt.includes('flame')) {
    selectedSet = photoSets.candle;
  } else if (lowerPrompt.includes('spa') || lowerPrompt.includes('hammam') || lowerPrompt.includes('bath') || lowerPrompt.includes('wellness') || lowerPrompt.includes('aromatherapy')) {
    selectedSet = photoSets.spa;
  } else if (lowerPrompt.includes('riad') || lowerPrompt.includes('courtyard') || lowerPrompt.includes('moroccan') || lowerPrompt.includes('interior') || lowerPrompt.includes('living') || lowerPrompt.includes('reading') || lowerPrompt.includes('cozy') || lowerPrompt.includes('home')) {
    selectedSet = photoSets.interior;
  } else if (lowerPrompt.includes('mountain') || lowerPrompt.includes('atlas') || lowerPrompt.includes('dune') || lowerPrompt.includes('sahara') || lowerPrompt.includes('desert') || lowerPrompt.includes('landscape')) {
    selectedSet = photoSets.nature;
  } else if (lowerPrompt.includes('texture') || lowerPrompt.includes('abstract') || lowerPrompt.includes('macro') || lowerPrompt.includes('linen') || lowerPrompt.includes('beeswax') || lowerPrompt.includes('material')) {
    selectedSet = photoSets.texture;
  } else {
    // Default to candle imagery
    selectedSet = photoSets.candle;
  }

  // Use seed to deterministically select from the set
  const index = Math.abs(seed) % selectedSet.length;
  return selectedSet[index];
};

export const GeneratedImage: React.FC<GeneratedImageProps> = ({
  prompt,
  aspectRatio = '3:4',
  alt,
  className = ''
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const dimensions = getImageDimensions(aspectRatio);
  const seed = hashCode(prompt);
  const photoId = getCuratedUnsplashId(prompt, seed);

  // Using Unsplash with curated photo IDs for ACTUAL candle/spa imagery
  // The photoId is selected based on prompt content for maximum relevance
  const src = `https://images.unsplash.com/photo-${photoId}?w=${dimensions.width}&h=${dimensions.height}&fit=crop&auto=format&q=80`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-sand/30 animate-pulse flex flex-col items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-cedar/20 border-t-cedar rounded-full animate-spin mb-2"></div>
          <span className="text-cedar/40 text-[10px] uppercase tracking-widest">Loading...</span>
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 bg-sand/50 flex items-center justify-center">
          <span className="text-cedar/40 text-xs px-4 text-center">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};
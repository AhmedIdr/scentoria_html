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

// Extract search keywords from prompt for Unsplash
const getSearchTermsFromPrompt = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();

  // Map prompt content to relevant search terms
  if (lowerPrompt.includes('candle') || lowerPrompt.includes('glass jar')) {
    return 'luxury,candle,home,fragrance,minimal';
  }
  if (lowerPrompt.includes('spa') || lowerPrompt.includes('hammam') || lowerPrompt.includes('bath')) {
    return 'spa,wellness,candle,aromatherapy,luxury';
  }
  if (lowerPrompt.includes('riad') || lowerPrompt.includes('courtyard') || lowerPrompt.includes('moroccan')) {
    return 'moroccan,interior,design,candle,home';
  }
  if (lowerPrompt.includes('mountain') || lowerPrompt.includes('atlas')) {
    return 'mountain,nature,minimal,landscape,serene';
  }
  if (lowerPrompt.includes('dune') || lowerPrompt.includes('sahara') || lowerPrompt.includes('desert')) {
    return 'desert,sand,dune,minimal,nature';
  }
  if (lowerPrompt.includes('workshop') || lowerPrompt.includes('artisan') || lowerPrompt.includes('craftsman')) {
    return 'artisan,craft,handmade,workshop,candle';
  }
  if (lowerPrompt.includes('reading') || lowerPrompt.includes('living room') || lowerPrompt.includes('cozy')) {
    return 'cozy,home,candle,lifestyle,interior';
  }
  if (lowerPrompt.includes('evening') || lowerPrompt.includes('night') || lowerPrompt.includes('wind-down')) {
    return 'evening,candle,calm,atmosphere,cozy';
  }
  if (lowerPrompt.includes('texture') || lowerPrompt.includes('abstract') || lowerPrompt.includes('macro')) {
    return 'texture,minimal,abstract,natural,organic';
  }

  // Default to candle-related imagery
  return 'candle,home,fragrance,minimal,luxury';
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
  const searchTerms = getSearchTermsFromPrompt(prompt);

  // Using Unsplash Source API with relevant search terms for candle/spa imagery
  // The seed ensures consistent images across page loads
  const src = `https://source.unsplash.com/${dimensions.width}x${dimensions.height}/?${searchTerms}&sig=${seed}`;

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
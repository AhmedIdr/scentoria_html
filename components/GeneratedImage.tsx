import React, { useState } from 'react';
import { RevealImage } from './UI';

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

// Determine category from prompt
const getCategoryFromPrompt = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('candle') || lowerPrompt.includes('glass jar')) return 'candle';
  if (lowerPrompt.includes('spa') || lowerPrompt.includes('hammam')) return 'spa';
  if (lowerPrompt.includes('riad') || lowerPrompt.includes('courtyard')) return 'architecture';
  if (lowerPrompt.includes('mountain') || lowerPrompt.includes('dune') || lowerPrompt.includes('sahara')) return 'nature';
  if (lowerPrompt.includes('workshop') || lowerPrompt.includes('artisan')) return 'craft';
  if (lowerPrompt.includes('reading') || lowerPrompt.includes('living room')) return 'lifestyle';
  if (lowerPrompt.includes('texture') || lowerPrompt.includes('abstract')) return 'texture';

  return 'nature';
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
  const category = getCategoryFromPrompt(prompt);

  // Using Unsplash Source API with deterministic seed for consistent images
  const src = `https://source.unsplash.com/${dimensions.width}x${dimensions.height}/?${category},luxury,minimalist&sig=${seed}`;

  return (
    <>
      {loading && (
        <div className={`bg-sand/20 animate-pulse flex flex-col items-center justify-center ${className} absolute inset-0 z-10`}>
          <div className="w-8 h-8 border-2 border-cedar/20 border-t-cedar rounded-full animate-spin mb-2"></div>
          <span className="text-cedar/40 text-[10px] uppercase tracking-widest">Loading...</span>
        </div>
      )}

      {error && (
        <div className={`bg-sand/50 flex items-center justify-center ${className}`}>
          <span className="text-cedar/40 text-xs px-4 text-center">Image unavailable</span>
        </div>
      )}

      {!error && (
        <div className="relative">
          <RevealImage
            src={src}
            alt={alt}
            className={className}
          />
          <img
            src={src}
            alt={alt}
            className="hidden"
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
        </div>
      )}
    </>
  );
};
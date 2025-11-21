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

// Map prompts to curated Picsum photo IDs (aesthetic, minimal images)
const getImageIdFromPrompt = (prompt: string, seed: number): number => {
  const lowerPrompt = prompt.toLowerCase();

  // Curated photo IDs from Picsum that have aesthetic, minimal quality
  const photoSets = {
    // Minimalist, clean aesthetics for candles
    candle: [1011, 1015, 1018, 1025, 1035, 1040, 1043, 1047, 1048, 1051],
    // Nature, spa-like imagery
    spa: [1074, 1080, 1081, 1082, 1084, 1087, 1088, 1089, 1093, 1096],
    // Architectural, interior
    interior: [1060, 1061, 1062, 1063, 1064, 1065, 1067, 1068, 1070, 1071],
    // Natural landscapes
    nature: [1000, 1001, 1003, 1004, 1005, 1006, 1008, 1009, 1010, 1012],
    // Textures and abstract
    texture: [1020, 1022, 1024, 1026, 1027, 1028, 1029, 1031, 1032, 1033],
  };

  let selectedSet: number[];

  if (lowerPrompt.includes('candle') || lowerPrompt.includes('glass jar') || lowerPrompt.includes('wax')) {
    selectedSet = photoSets.candle;
  } else if (lowerPrompt.includes('spa') || lowerPrompt.includes('hammam') || lowerPrompt.includes('bath')) {
    selectedSet = photoSets.spa;
  } else if (lowerPrompt.includes('riad') || lowerPrompt.includes('courtyard') || lowerPrompt.includes('moroccan') || lowerPrompt.includes('interior') || lowerPrompt.includes('living') || lowerPrompt.includes('reading')) {
    selectedSet = photoSets.interior;
  } else if (lowerPrompt.includes('mountain') || lowerPrompt.includes('atlas') || lowerPrompt.includes('dune') || lowerPrompt.includes('sahara') || lowerPrompt.includes('desert') || lowerPrompt.includes('landscape')) {
    selectedSet = photoSets.nature;
  } else if (lowerPrompt.includes('texture') || lowerPrompt.includes('abstract') || lowerPrompt.includes('macro') || lowerPrompt.includes('linen') || lowerPrompt.includes('beeswax')) {
    selectedSet = photoSets.texture;
  } else {
    // Default to candle set
    selectedSet = photoSets.candle;
  }

  // Use seed to deterministically select from the set
  const index = seed % selectedSet.length;
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
  const imageId = getImageIdFromPrompt(prompt, seed);

  // Using Picsum Photos with curated photo IDs for aesthetic, minimal imagery
  // The imageId is selected based on prompt content for relevance
  const src = `https://picsum.photos/id/${imageId}/${dimensions.width}/${dimensions.height}?grayscale&blur=1`;

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
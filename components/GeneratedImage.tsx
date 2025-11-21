import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RevealImage } from './UI';

// Global cache to prevent regeneration during session
const imageCache = new Map<string, string>();

interface GeneratedImageProps {
  prompt: string;
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9' | '9:16';
  alt: string;
  className?: string;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ 
  prompt, 
  aspectRatio = '3:4', 
  alt, 
  className = '' 
}) => {
  const [src, setSrc] = useState<string | null>(imageCache.get(prompt) || null);
  const [loading, setLoading] = useState(!src);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src) return;

    let isMounted = true;

    const generate = async () => {
      try {
        // Check cache again to be safe
        if (imageCache.has(prompt)) {
            if (isMounted) {
                setSrc(imageCache.get(prompt)!);
                setLoading(false);
            }
            return;
        }

        if (!process.env.API_KEY) {
            console.error("API Key missing");
            setError(true);
            setLoading(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: { aspectRatio: aspectRatio }
          }
        });

        let base64Data = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              base64Data = part.inlineData.data;
              break;
            }
          }
        }

        if (base64Data && isMounted) {
          const fullSrc = `data:image/png;base64,${base64Data}`;
          imageCache.set(prompt, fullSrc);
          setSrc(fullSrc);
        } else if (isMounted) {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to generate image for prompt:", prompt, err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    generate();

    return () => { isMounted = false; };
  }, [prompt, aspectRatio, src]);

  if (loading) {
    return (
        <div className={`bg-sand/20 animate-pulse flex flex-col items-center justify-center ${className}`}>
            <div className="w-8 h-8 border-2 border-cedar/20 border-t-cedar rounded-full animate-spin mb-2"></div>
            <span className="text-cedar/40 text-[10px] uppercase tracking-widest">Generating...</span>
        </div>
    );
  }

  if (error || !src) {
      return (
        <div className={`bg-sand/50 flex items-center justify-center ${className}`}>
            <span className="text-cedar/40 text-xs px-4 text-center">Image unavailable</span>
        </div>
      );
  }

  return <RevealImage src={src} alt={alt} className={className} />;
};
import React, { useEffect, useRef, useState } from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-medium transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group";
  
  const variants = {
    primary: "bg-cedar text-white border border-cedar",
    secondary: "bg-clay text-midnight hover:bg-sand",
    outline: "border border-cedar text-cedar hover:text-white",
    ghost: "text-cedar hover:text-gold"
  };

  const sizes = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-8 py-4",
    lg: "text-base px-10 py-5"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
    </button>
  );
};

// --- Section Title ---
export const SectionTitle: React.FC<{ title: string, subtitle?: string, center?: boolean, light?: boolean }> = ({ title, subtitle, center = true, light = false }) => (
  <div className={`mb-16 ${center ? 'text-center' : ''}`}>
    {subtitle && <span className="text-gold text-xs uppercase tracking-[0.2em] font-semibold mb-4 block">{subtitle}</span>}
    <h2 className={`text-4xl md:text-5xl font-serif ${light ? 'text-sand' : 'text-midnight'}`}>{title}</h2>
  </div>
);

// --- Fade In Animation ---
export const FadeIn: React.FC<{ 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
  direction?: 'up' | 'none' | 'left' | 'right';
  fullWidth?: boolean;
}> = ({ children, delay = 0, className = '', direction = 'up', fullWidth = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  const getTransform = () => {
    if (!direction || direction === 'none') return '';
    if (isVisible) return 'translate-x-0 translate-y-0';
    switch (direction) {
      case 'up': return 'translate-y-12';
      case 'left': return '-translate-x-12';
      case 'right': return 'translate-x-12';
      default: return '';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1) ${fullWidth ? 'w-full' : ''} ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Reveal Image (Curtain Effect) ---
export const RevealImage: React.FC<{ src: string, alt: string, className?: string }> = ({ src, alt, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-midnight/10 ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out ${isVisible ? 'scale-100' : 'scale-110'}`}
      />
      <div 
        className={`absolute inset-0 bg-sand transition-transform duration-[1.2s] ease-in-out origin-top ${isVisible ? 'scale-y-0' : 'scale-y-100'}`}
        style={{ zIndex: 2 }}
      ></div>
    </div>
  );
};

// --- Marquee ---
export const Marquee: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="overflow-hidden py-6 bg-midnight text-sand border-y border-white/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-lg md:text-xl uppercase tracking-widest font-light mx-8">
            {text} <span className="text-gold mx-4">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};


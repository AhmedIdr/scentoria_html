export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  size: string;
  category: 'Candle' | 'Diffuser' | 'Set';
  scentFamily: 'Floral' | 'Woody' | 'Warm' | 'Fresh';
  description: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  imagePrompt: string; // Added for Gemini generation
  image?: string; // Optional fallback
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  name: string;
  city: string;
  deliveryTime: string;
  notes: string;
}

export enum SortOption {
  RECOMMENDED,
  PRICE_LOW_HIGH,
  PRICE_HIGH_LOW,
}
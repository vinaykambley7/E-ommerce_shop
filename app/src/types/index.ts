export type ProductCategory = 'electronics' | 'clothing' | 'home';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: 'Sale' | 'New' | 'Bestseller';
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestions?: string[];
}

export type CategoryFilter = 'all' | ProductCategory;

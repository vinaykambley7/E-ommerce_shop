import type { Product } from '@/types';

// Import images as assets
import wirelessHeadphonesImg from '/images/wireless-headphones.jpg';
import smartHomeHubImg from '/images/smart-home-hub.jpg';
import monitorImg from '/images/4k-monitor.jpg';
import cottonTeeImg from '/images/organic-cotton-tee.jpg';
import runningJacketImg from '/images/running-jacket.jpg';
import woolSocksImg from '/images/merino-wool-socks.jpg';
import vaseSetImg from '/images/ceramic-vase-set.jpg';
import deskLampImg from '/images/smart-desk-lamp.jpg';
import electronicsCatImg from '/images/category-electronics.jpg';
import clothingCatImg from '/images/category-clothing.jpg';
import homeCatImg from '/images/category-home.jpg';

export const products: Product[] = [
  {
    id: 'wireless-headphones',
    name: 'Wireless Noise-Canceling Headphones',
    category: 'electronics',
    price: 149.99,
    originalPrice: 199.99,
    badge: 'Sale',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    image: wirelessHeadphonesImg,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 'smart-home-hub',
    name: 'Smart Home Hub',
    category: 'electronics',
    price: 89.99,
    badge: 'New',
    description: 'Control your entire home with voice commands. Compatible with 1000+ devices.',
    image: smartHomeHubImg,
    rating: 4.2,
    reviews: 64,
  },
  {
    id: '4k-monitor',
    name: '4K Ultra HD Monitor',
    category: 'electronics',
    price: 349.99,
    badge: 'Bestseller',
    description: '27-inch 4K display with HDR support and USB-C connectivity.',
    image: monitorImg,
    rating: 4.7,
    reviews: 256,
  },
  {
    id: 'organic-cotton-tee',
    name: 'Organic Cotton T-Shirt',
    category: 'clothing',
    price: 34.99,
    description: 'Soft, breathable organic cotton tee in a modern slim fit. Available in 6 colors.',
    image: cottonTeeImg,
    rating: 4.3,
    reviews: 89,
  },
  {
    id: 'running-jacket',
    name: 'Lightweight Running Jacket',
    category: 'clothing',
    price: 79.99,
    originalPrice: 99.99,
    badge: 'Sale',
    description: 'Water-resistant running jacket with reflective details and zip pockets.',
    image: runningJacketImg,
    rating: 4.6,
    reviews: 45,
  },
  {
    id: 'merino-wool-socks',
    name: 'Merino Wool Socks (3-Pack)',
    category: 'clothing',
    price: 24.99,
    badge: 'New',
    description: 'Temperature-regulating merino wool socks for all-day comfort.',
    image: woolSocksImg,
    rating: 4.4,
    reviews: 112,
  },
  {
    id: 'ceramic-vase-set',
    name: 'Minimalist Ceramic Vase Set',
    category: 'home',
    price: 45.99,
    description: 'Handcrafted ceramic vases in matte white finish. Set of 3 varying heights.',
    image: vaseSetImg,
    rating: 4.8,
    reviews: 37,
  },
  {
    id: 'smart-desk-lamp',
    name: 'Smart LED Desk Lamp',
    category: 'home',
    price: 59.99,
    originalPrice: 79.99,
    badge: 'Sale',
    description: 'Adjustable color temperature and brightness with app control and wireless charging base.',
    image: deskLampImg,
    rating: 4.5,
    reviews: 73,
  },
];

export const categories = [
  {
    id: 'electronics' as const,
    name: 'Electronics',
    count: 3,
    image: electronicsCatImg,
  },
  {
    id: 'clothing' as const,
    name: 'Clothing',
    count: 3,
    image: clothingCatImg,
  },
  {
    id: 'home' as const,
    name: 'Home & Living',
    count: 2,
    image: homeCatImg,
  },
];

import type { Product, ProductCategory } from '@/types';
import { products } from '@/data/products';

export function getRecommendations(productId: string, allProducts: Product[] = products): Product[] {
  const currentProduct = allProducts.find(p => p.id === productId);
  if (!currentProduct) return [];
  return allProducts
    .filter(p => p.category === currentProduct.category && p.id !== productId)
    .slice(0, 4);
}

const descriptionTemplates: Record<ProductCategory, string[]> = {
  electronics: [
    'Discover the ultimate in electronic innovation with {name}. Engineered for performance and designed for modern living, this device delivers exceptional quality that transforms your everyday experience. Featuring cutting-edge technology and a sleek design, it is the perfect companion for those who demand the best from their tech.',
    'Elevate your digital lifestyle with {name}. Built with precision engineering and premium materials, this device offers unparalleled performance and reliability. Whether you are working, creating, or simply enjoying entertainment, it delivers an experience that exceeds expectations.',
    'Experience next-level technology with {name}. Meticulously crafted for the modern consumer, this device combines powerful performance with an intuitive design. Its advanced features and robust build quality make it an essential addition to any tech-savvy home or office.',
  ],
  clothing: [
    'Elevate your style with {name}. Crafted with premium materials and attention to every detail, this piece combines comfort with contemporary fashion. The thoughtfully chosen fabrics ensure all-day wearability while the modern silhouette keeps you looking effortlessly polished.',
    'Redefine your wardrobe with {name}. Made from the finest sustainable materials, this garment offers a perfect blend of comfort, durability, and style. Its versatile design transitions seamlessly from casual outings to more formal settings, making it a true wardrobe essential.',
    'Discover everyday luxury with {name}. Each stitch reflects a commitment to quality craftsmanship, while the premium fabric delivers exceptional comfort. Designed for the modern individual who values both aesthetics and functionality in their clothing choices.',
  ],
  home: [
    'Transform your living space with {name}. Designed for both beauty and function, this piece brings warmth and sophistication to any room. Its timeless aesthetic complements a variety of interior styles, while the quality construction ensures it will be a cherished part of your home for years to come.',
    'Create a sanctuary of style with {name}. This thoughtfully designed piece blends artisanal craftsmanship with modern sensibility, adding a touch of elegance to your everyday environment. Perfect for those who appreciate the finer details in home decor.',
    'Bring refined simplicity to your home with {name}. Meticulously crafted to balance form and function, this piece serves as both a practical addition and a statement of your personal style. Its clean lines and quality materials make it a versatile choice for any living space.',
  ],
};

export function generateProductDescription(_productId: string, name: string, category: ProductCategory): string {
  const templates = descriptionTemplates[category];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace('{name}', name);
}

interface ChatResponse {
  content: string;
  suggestions?: string[];
}

export function getChatbotResponse(userMessage: string): ChatResponse {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
    return {
      content: 'Our return policy is simple: you have 30 days from delivery to return any item for a full refund. Items must be in original condition with tags attached. We provide free return shipping labels for all orders. Would you like help with a specific return?',
      suggestions: ['Start a return', 'How long do refunds take?'],
    };
  }

  if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery') || lowerMsg.includes('track')) {
    return {
      content: 'We offer free standard shipping on orders over $50 (3-5 business days). Express shipping (1-2 days) is available for $9.99. All orders are tracked — you\'ll receive a tracking number via email once your order ships.',
      suggestions: ['Track my order', 'Express shipping cost?'],
    };
  }

  if (lowerMsg.includes('recommend') || lowerMsg.includes('suggest') || lowerMsg.includes('product') || lowerMsg.includes('looking for') || lowerMsg.includes('find')) {
    const shuffled = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
    const productList = shuffled.map(p => `- ${p.name} (${p.category}) — $${p.price.toFixed(2)}`).join('\n');
    return {
      content: `I'd be happy to recommend products! Based on what's popular, here are some great options:\n${productList}\n\nWould you like more details about any of these?`,
      suggestions: ['Tell me more', 'Show different products', "What's on sale?"],
    };
  }

  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('discount') || lowerMsg.includes('sale') || lowerMsg.includes('deal') || lowerMsg.includes('coupon')) {
    return {
      content: 'We regularly run promotions! Check our sale items for up to 30% off. New customers can use code WELCOME10 for 10% off their first order. Sign up for our newsletter to get exclusive deals.',
      suggestions: ['Apply coupon', 'Newsletter signup'],
    };
  }

  if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('contact')) {
    return {
      content: 'I can help with most questions right here! For anything I can\'t handle, you can reach our support team at support@shopsmart.ai or call 1-800-SHOPSMART (Mon-Fri, 9am-6pm EST).',
      suggestions: ['Return policy', 'Shipping info'],
    };
  }

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return {
      content: "Hello! Welcome to ShopSmart AI. I'm here to help you find the perfect products, answer questions about shipping and returns, and make your shopping experience as smooth as possible. What can I do for you?",
      suggestions: ['Recommend products', 'Shipping info', 'Return policy'],
    };
  }

  return {
    content: "That's a great question! I can help you with product recommendations, shipping and delivery info, returns and refunds, pricing and deals, or general support. What would you like to know more about?",
    suggestions: ['Recommend products', 'Shipping info', 'Return policy'],
  };
}

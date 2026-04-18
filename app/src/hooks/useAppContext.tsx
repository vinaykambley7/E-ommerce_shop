import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, ChatMessage, CategoryFilter, Product } from '@/types';
import { products as allProducts } from '@/data/products';
import { generateProductDescription, getChatbotResponse } from '@/lib/ai-mock';

/* ─── Theme State ─── */
type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
}

type ThemeAction = { type: 'SET_THEME'; theme: Theme };

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return { theme: action.theme };
    default:
      return state;
  }
};

/* ─── Cart State ─── */
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; productId: string }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; open: boolean };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isOpen: true,
        };
      }
      return { ...state, items: [...state.items, { productId: action.productId, quantity: 1 }], isOpen: true };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.productId !== action.productId) };
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.productId !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.open };
    default:
      return state;
  }
};

/* ─── Chatbot State ─── */
interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  hasBeenOpened: boolean;
}

type ChatbotAction =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_CHAT_OPEN'; open: boolean }
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_TYPING'; typing: boolean }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'LOAD_MESSAGES'; messages: ChatMessage[] };

const chatbotReducer = (state: ChatbotState, action: ChatbotAction): ChatbotState => {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen, hasBeenOpened: true };
    case 'SET_CHAT_OPEN':
      return { ...state, isOpen: action.open, hasBeenOpened: true };
    case 'ADD_MESSAGE': {
      const newMessages = [...state.messages, action.message];
      if (newMessages.length > 50) newMessages.shift();
      return { ...state, messages: newMessages };
    }
    case 'SET_TYPING':
      return { ...state, isTyping: action.typing };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'LOAD_MESSAGES':
      return { ...state, messages: action.messages };
    default:
      return state;
  }
};

/* ─── Products State ─── */
interface ProductsState {
  products: Product[];
  generatedDescriptions: Record<string, string>;
  activeCategory: CategoryFilter;
  searchQuery: string;
}

type ProductsAction =
  | { type: 'SET_CATEGORY'; category: CategoryFilter }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_DESCRIPTION'; productId: string; description: string };

const productsReducer = (state: ProductsState, action: ProductsAction): ProductsState => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'SET_DESCRIPTION':
      return {
        ...state,
        generatedDescriptions: { ...state.generatedDescriptions, [action.productId]: action.description },
      };
    default:
      return state;
  }
};

/* ─── Context ─── */
interface AppContextValue {
  // Theme
  theme: ThemeState;
  setTheme: (theme: Theme) => void;
  // Cart
  cart: CartState;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
  // Chatbot
  chatbot: ChatbotState;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  sendMessage: (content: string) => void;
  clearChatMessages: () => void;
  // Products
  products: ProductsState;
  setCategory: (category: CategoryFilter) => void;
  setSearchQuery: (query: string) => void;
  generateDescription: (productId: string) => Promise<string>;
  filteredProducts: Product[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, themeDispatch] = useReducer(themeReducer, { theme: 'dark' }, () => {
    try {
      const saved = localStorage.getItem('shopsmart_theme');
      return saved ? { theme: saved as Theme } : { theme: 'dark' as Theme };
    } catch {
      return { theme: 'dark' as Theme };
    }
  });

  const [cart, cartDispatch] = useReducer(cartReducer, { items: [], isOpen: false }, () => {
    try {
      const saved = localStorage.getItem('shopsmart_cart');
      return saved ? { ...JSON.parse(saved), isOpen: false } : { items: [], isOpen: false };
    } catch {
      return { items: [], isOpen: false };
    }
  });

  const [chatbot, chatbotDispatch] = useReducer(chatbotReducer, {
    isOpen: false,
    messages: [],
    isTyping: false,
    hasBeenOpened: false,
  }, () => {
    try {
      const saved = localStorage.getItem('shopsmart_chat_history');
      const messages = saved ? JSON.parse(saved) : [];
      return { isOpen: false, messages, isTyping: false, hasBeenOpened: false };
    } catch {
      return { isOpen: false, messages: [], isTyping: false, hasBeenOpened: false };
    }
  });

  const [productsState, productsDispatch] = useReducer(productsReducer, {
    products: allProducts,
    generatedDescriptions: {},
    activeCategory: 'all',
    searchQuery: '',
  });

  // Persist theme
  useEffect(() => {
    const root = document.documentElement;
    if (root) {
      root.classList.remove('light', 'dark');

      if (theme.theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme.theme);
      }
    }
    localStorage.setItem('shopsmart_theme', theme.theme);
  }, [theme.theme]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('shopsmart_cart', JSON.stringify({ items: cart.items }));
  }, [cart.items]);

  // Persist chat
  useEffect(() => {
    localStorage.setItem('shopsmart_chat_history', JSON.stringify(chatbot.messages));
  }, [chatbot.messages]);

  // Theme actions
  const setTheme = useCallback((theme: Theme) => themeDispatch({ type: 'SET_THEME', theme }), []);

  // Cart actions
  const addItem = useCallback((productId: string) => cartDispatch({ type: 'ADD_ITEM', productId }), []);
  const removeItem = useCallback((productId: string) => cartDispatch({ type: 'REMOVE_ITEM', productId }), []);
  const updateQuantity = useCallback((productId: string, quantity: number) =>
    cartDispatch({ type: 'UPDATE_QTY', productId, quantity }), []);
  const clearCart = useCallback(() => cartDispatch({ type: 'CLEAR_CART' }), []);
  const toggleCart = useCallback(() => cartDispatch({ type: 'TOGGLE_CART' }), []);
  const setCartOpen = useCallback((open: boolean) => cartDispatch({ type: 'SET_CART_OPEN', open }), []);

  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.items.reduce((sum, i) => {
    const p = allProducts.find(pr => pr.id === i.productId);
    return sum + (p ? p.price * i.quantity : 0);
  }, 0);

  // Chatbot actions
  const toggleChat = useCallback(() => chatbotDispatch({ type: 'TOGGLE_CHAT' }), []);
  const setChatOpen = useCallback((open: boolean) => chatbotDispatch({ type: 'SET_CHAT_OPEN', open }), []);
  const clearChatMessages = useCallback(() => chatbotDispatch({ type: 'CLEAR_MESSAGES' }), []);

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    chatbotDispatch({ type: 'ADD_MESSAGE', message: userMsg });
    chatbotDispatch({ type: 'SET_TYPING', typing: true });

    setTimeout(() => {
      const response = getChatbotResponse(content);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        suggestions: response.suggestions,
      };
      chatbotDispatch({ type: 'SET_TYPING', typing: false });
      chatbotDispatch({ type: 'ADD_MESSAGE', message: aiMsg });
    }, 800);
  }, []);

  // Products actions
  const setCategory = useCallback((category: CategoryFilter) =>
    productsDispatch({ type: 'SET_CATEGORY', category }), []);
  const setSearchQuery = useCallback((query: string) =>
    productsDispatch({ type: 'SET_SEARCH', query }), []);

  const generateDescription = useCallback(async (productId: string): Promise<string> => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return '';
    if (productsState.generatedDescriptions[productId]) {
      return productsState.generatedDescriptions[productId];
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    const desc = generateProductDescription(product.id, product.name, product.category);
    productsDispatch({ type: 'SET_DESCRIPTION', productId, description: desc });
    return desc;
  }, [productsState.generatedDescriptions]);

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = productsState.activeCategory === 'all' || p.category === productsState.activeCategory;
    const matchesSearch = !productsState.searchQuery ||
      p.name.toLowerCase().includes(productsState.searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(productsState.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const value: AppContextValue = {
    theme, setTheme,
    cart, addItem, removeItem, updateQuantity, clearCart, toggleCart, setCartOpen, cartTotal, cartCount,
    chatbot, toggleChat, setChatOpen, sendMessage, clearChatMessages,
    products: productsState, setCategory, setSearchQuery, generateDescription, filteredProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

# ShopSmart AI — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| react-router-dom | ^7 | Client-side routing (4 routes) |
| framer-motion | ^12 | Scroll-reveal animations, page transitions, drawer/panel animations, AI processing dots |
| lucide-react | ^0.468 | Icons (ShoppingCart, Sparkles, MessageCircle, Search, Star, etc.) |
| @fontsource/inter | ^5 | Heading + Body font |
| @fontsource/dm-serif-display | ^5 | Accent/italic font |

No additional shadcn/ui components needed beyond the pre-installed 40+. The app uses custom components styled with Tailwind.

---

## Component Inventory

### Layout

| Component | Source | Notes |
|---|---|---|
| Navigation | Custom | Fixed top bar. Logo + desktop nav links (hidden mobile) + cart icon + "Ask AI" button. Mobile: hamburger → full-screen overlay |
| Footer | Custom | 3-column grid (desktop), centered copyright |
| PageLayout | Custom | Wraps all pages. Includes Nav + Footer. Main content area with proper padding for fixed nav |

### Pages

| Page | Route | Key Sections |
|---|---|---|
| HomePage | `/` | Hero, FeaturedProducts, CategoryShowcase, AIFeaturesHighlight, Footer |
| ProductsPage | `/products` | PageHeader, FilterBar, ProductGrid, Footer |
| ProductDetailPage | `/product/:id` | Breadcrumb, ProductInfo, AIDescriptionPanel, AIRecommendations, Footer |
| CartPage | `/cart` | PageHeader, CartItemsList, OrderSummary, EmptyCart, Footer |

### Reusable Components

| Component | Used By | Notes |
|---|---|---|
| ProductCard | HomePage, ProductsPage, AIRecommendations | Image + badge + category + name + price + rating + Add to Cart + AI sparkle button |
| AIGenerator | ProductCard, ProductDetailPage | Expandable panel with loading dots → generated description |
| CartDrawer | Navigation (global) | Slide-out drawer overlay. Shared cart state via Context |
| ChatbotPanel | Navigation (global FAB) | Slide-up/panel with messages, typing indicator, quick-replies |
| ScrollRevealGrid | HomePage, ProductsPage, AIFeaturesHighlight | Framer Motion IntersectionObserver-based staggered reveal. Replaces CSS scroll-driven animations |
| CategoryCard | HomePage | Image + name + count + explore link |
| QuantityStepper | ProductDetailPage, CartDrawer, CartPage | Minus/count/plus controls |
| Toast | CartDrawer, CartPage | "Coming Soon" toast on checkout click |

### Hooks

| Hook | Purpose |
|---|---|
| useScrollReveal | IntersectionObserver wrapper for scroll-reveal animation trigger |
| useLocalStorage | Persist chat messages to localStorage |

---

## Animation Implementation

| Animation | Library | Implementation | Complexity |
|---|---|---|---|
| Scroll-reveal grid | Framer Motion | `useInView` hook on container + `staggerChildren` variant on items. Alternating slide direction per row via `custom` prop | Medium |
| AI processing dots | Framer Motion | 3 `motion.span` elements with `animate={{ y: [0, -8, 0] }}`, staggered `transition.delay` | Low |
| Cart drawer slide | Framer Motion | `AnimatePresence` + `motion.div` with `x: '100%'` → `x: 0`, overlay fade | Low |
| Chatbot panel | Framer Motion | `AnimatePresence` + slide-up (mobile) / slide-from-right (desktop) | Low |
| AI description expand | Framer Motion | `AnimatePresence` + `motion.div` with `height: 'auto'` animation | Low |
| Card hover lift | CSS/Tailwind | `hover:-translate-y-1 hover:shadow-lg transition-all duration-300` | Low |
| FAB pulse | CSS | `@keyframes` ring pulse, `animation: pulse 2s infinite` | Low |
| Toast appear/dismiss | Framer Motion | `AnimatePresence` + fade/slide up, auto-dismiss via `setTimeout` | Low |
| Page transitions | Framer Motion | `AnimatePresence` on route outlet with opacity fade | Low |
| Image hover zoom | CSS/Tailwind | `group-hover:scale-105 transition-transform duration-400` on image inside `overflow-hidden` container | Low |

No GSAP/ScrollTrigger needed — all animations are achievable with Framer Motion's built-in primitives. The scroll-reveal system is simplified from CSS scroll-driven to IntersectionObserver + Framer Motion variants for broader compatibility and cleaner implementation.

---

## State & Logic Plan

### React Context Structure

```
AppContext (single context, 3 reducers)
├── cart: { items: CartItem[], isOpen: boolean }
│   ├── addItem(productId) — increments or adds new
│   ├── removeItem(productId)
│   ├── updateQuantity(productId, quantity) — removes if quantity ≤ 0
│   ├── clearCart()
│   └── toggleCart()
├── chatbot: { isOpen: boolean, messages: ChatMessage[], isTyping: boolean, hasBeenOpened: boolean }
│   ├── toggleChat()
│   ├── sendMessage(content) — adds user msg, triggers mock AI response after 0.8s typing
│   └── clearMessages()
└── products: { products: Product[], generatedDescriptions: Map<string, string>, activeCategory, searchQuery }
    ├── generateDescription(productId) — 1.5s delay, stores result in map
    ├── setCategory(category)
    └── setSearchQuery(query)
```

### Mock AI Functions (pure utility module)

- `getRecommendations(productId, products)` — filters same category, excludes self, returns up to 4
- `generateProductDescription(productId, name, category)` — category template lookup + name insertion, returns string
- `getChatbotResponse(userMessage)` — keyword regex matching → response string + optional suggestions array

### Routing

React Router v7 with `BrowserRouter`. Four routes as specified. Unknown routes redirect to `/`.

### Data Flow

- Products: static data array imported from `data/products.ts`
- Cart: context + localStorage persistence (key: `shopsmart_cart`)
- Chat: context + localStorage persistence (key: `shopsmart_chat_history`, max 50 messages)
- AI descriptions: context only (not persisted, regenerated on page load)

---

## Other Key Decisions

- **Fonts**: Inter via `@fontsource/inter`. Archivo Black loaded via Google Fonts CDN link in `index.html` (not available on fontsource). DM Serif Display via `@fontsource/dm-serif-display`.
- **Images**: Product images from picsum.photos with seeded IDs for consistency. Category images similarly sourced.
- **No backend**: All AI features are client-side mock functions. No API calls.
- **Responsive approach**: Mobile-first Tailwind with `md:` (768px) and `lg:` (1024px) breakpoints as specified in design.

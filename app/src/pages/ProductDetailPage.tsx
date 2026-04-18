import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Sparkles,
  Copy,
  X,
} from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { AIProcessingDots } from '@/components/AIProcessingDots';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useApp } from '@/hooks/useAppContext';
import { getRecommendations } from '@/lib/ai-mock';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem, generateDescription } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [copied, setCopied] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 text-center">
        <h2 className="text-2xl font-semibold text-[#1E293B] mb-2">Product not found</h2>
        <Link to="/products" className="text-royalBlue font-medium hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const recommendations = getRecommendations(product.id, products);
  const filledStars = Math.floor(product.rating);
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  const badgeColors = {
    Sale: 'bg-red-50 text-red-600',
    New: 'bg-royalBlue/10 text-royalBlue',
    Bestseller: 'bg-green-50 text-green-600',
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product.id);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleGenerateAI = async () => {
    if (aiOpen && aiDescription) {
      setAiOpen(false);
      return;
    }
    setAiOpen(true);
    if (!aiDescription) {
      setAiLoading(true);
      const desc = await generateDescription(product.id);
      setAiDescription(desc);
      setAiLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setAiLoading(true);
    const desc = await generateDescription(product.id);
    setAiDescription(desc);
    setAiLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="px-6 md:px-10 py-4 border-b border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2 text-sm flex-wrap">
          <Link to="/" className="text-royalBlue hover:underline">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          <Link to="/products" className="text-royalBlue hover:underline">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          <Link to="/products" className="text-royalBlue hover:underline capitalize">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span className="text-[#1E293B]">{product.name}</span>
        </div>
      </div>

      {/* Product Info */}
      <section className="py-8 md:py-12 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-12">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-[#F1F5F9] aspect-[4/3] lg:aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.05em] text-[#94A3B8]">
                {product.category}
              </span>
              {product.badge && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColors[product.badge]}`}>
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1E293B]">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < filledStars ? 'text-amber-400 fill-amber-400' : 'text-[#CBD5E1]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#1E293B]">{product.rating}</span>
              <span className="text-sm text-[#64748B]">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#1E293B]">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-[#94A3B8] line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  {savings > 0 && (
                    <span className="px-3 py-1 bg-mint text-navy rounded-full text-xs font-medium">
                      Save ${savings.toFixed(2)}
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="text-[#64748B] leading-relaxed">{product.description}</p>

            <hr className="border-[#E2E8F0]" />

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#1E293B]">Quantity</span>
              <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-mint transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-10 flex items-center justify-center font-semibold border-x border-[#E2E8F0]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-mint transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full h-13 py-3.5 bg-navy text-white rounded-full font-semibold text-base hover:bg-navy-dark transition-colors flex items-center justify-center gap-2"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
            {added && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-green-600 text-center -mt-2"
              >
                Added to Cart!
              </motion.p>
            )}

            {/* AI Description Button */}
            <button
              onClick={handleGenerateAI}
              className="w-full h-11 bg-mint text-navy rounded-full font-medium text-sm hover:bg-mint-dark transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {aiOpen && aiDescription ? 'Hide AI Description' : 'Generate AI Description'}
            </button>
          </div>
        </div>
      </section>

      {/* AI Description Panel */}
      <AnimatePresence>
        {aiOpen && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-10 pb-8 md:pb-12">
              <div className="max-w-[1280px] mx-auto">
                <div className="bg-[#F8FAFC] rounded-xl p-6 relative">
                  <button
                    onClick={() => setAiOpen(false)}
                    className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#1E293B]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-royalBlue">AI-Generated Description</h3>
                    <span className="text-xs text-[#94A3B8]">Powered by ShopSmart AI</span>
                  </div>
                  {aiLoading ? (
                    <AIProcessingDots />
                  ) : (
                    <>
                      <p className="text-base text-[#1E293B] leading-[1.7] max-w-2xl">
                        {aiDescription}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={handleRegenerate}
                          className="text-sm font-medium text-royalBlue hover:underline"
                        >
                          Regenerate
                        </button>
                        <button
                          onClick={handleCopy}
                          className="text-sm text-[#64748B] hover:text-[#1E293B] flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* AI Recommendations */}
      {recommendations.length >= 2 && (
        <section className="bg-mint py-12 md:py-16 px-6 md:px-10">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-royalBlue" />
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1E293B]">You May Also Like</h2>
            </div>
            <p className="text-sm text-[#64748B] mb-6 -mt-5">
              AI-powered recommendations based on this product
            </p>
            <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
              {recommendations.map(p => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
}

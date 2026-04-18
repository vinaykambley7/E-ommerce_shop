import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useApp } from '@/hooks/useAppContext';
import { AIProcessingDots } from './AIProcessingDots';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useApp();
  const [added, setAdded] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const { generateDescription } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleGenerateAI = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (aiExpanded && aiDescription) {
      setAiExpanded(false);
      return;
    }
    setAiExpanded(true);
    if (!aiDescription) {
      setAiLoading(true);
      const desc = await generateDescription(product.id);
      setAiDescription(desc);
      setAiLoading(false);
    }
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAiLoading(true);
    const desc = await generateDescription(product.id);
    setAiDescription(desc);
    setAiLoading(false);
  };

  const filledStars = Math.floor(product.rating);

  const badgeColors = {
    Sale: 'bg-red-50 text-red-600',
    New: 'bg-royalBlue/10 text-royalBlue',
    Bestseller: 'bg-green-50 text-green-600',
  };

  return (
    <div className="group">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F1F5F9]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400"
          />
          {product.badge && (
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${badgeColors[product.badge]}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[11px] uppercase tracking-[0.05em] text-[#94A3B8] mb-1">
            {product.category}
          </p>
          <h3 className={`font-medium text-[#1E293B] truncate ${compact ? 'text-sm' : 'text-base'}`}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <span className={`font-semibold text-[#1E293B] ${compact ? 'text-sm' : 'text-lg'}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#94A3B8] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < filledStars ? 'text-amber-400 fill-amber-400' : 'text-[#CBD5E1]'
                }`}
              />
            ))}
            <span className="text-xs text-[#64748B] ml-1">({product.reviews})</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 h-10 bg-navy text-white rounded-full text-sm font-medium hover:bg-navy-dark transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
          {!compact && (
            <button
              onClick={handleGenerateAI}
              className="w-10 h-10 bg-mint text-navy rounded-full flex items-center justify-center hover:bg-mint-dark transition-colors duration-200"
              title="Generate AI Description"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* AI Description Expandable */}
      <AnimatePresence>
        {aiExpanded && !compact && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-[#F8FAFC] rounded-xl p-4 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAiExpanded(false);
                }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#1E293B]"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>
              <p className="text-xs font-medium text-royalBlue mb-2">AI-Generated Description</p>
              {aiLoading ? (
                <AIProcessingDots />
              ) : (
                <>
                  <p className="text-sm text-[#1E293B] leading-relaxed line-clamp-3">
                    {aiDescription}
                  </p>
                  <button
                    onClick={handleRegenerate}
                    className="text-xs font-medium text-royalBlue hover:underline mt-2"
                  >
                    Regenerate
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

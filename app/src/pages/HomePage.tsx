import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, MessageCircle, ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useApp } from '@/hooks/useAppContext';

export function HomePage() {
  const { toggleChat } = useApp();
  const featuredProducts = products.slice(0, 4);

  const aiFeatures = [
    {
      icon: Sparkles,
      title: 'AI Recommendations',
      description:
        'Get personalized product suggestions based on your interests and browsing patterns.',
    },
    {
      icon: FileText,
      title: 'AI Descriptions',
      description:
        'Generate compelling, detailed product descriptions with a single click.',
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description:
        'Ask our smart chatbot about products, shipping, returns, and get instant answers.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-20 md:pt-28 lg:pt-40 pb-16 md:pb-24 px-6 md:px-10">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-royalBlue uppercase tracking-[0.05em] mb-4"
          >
            AI-Powered Shopping
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-navy leading-tight"
          >
            SHOP SMARTER
            <br />
            <span className="text-royalBlue">WITH AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base md:text-lg text-[#64748B] max-w-[560px] mx-auto"
          >
            Discover curated products with intelligent recommendations, AI-enhanced descriptions,
            and a personal shopping assistant.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/products"
              className="px-7 py-3 bg-navy text-white rounded-full font-medium text-base hover:bg-navy-dark transition-colors duration-200"
            >
              Shop Products
            </Link>
            <button
              onClick={toggleChat}
              className="px-7 py-3 bg-mint text-navy rounded-full font-medium text-base hover:bg-mint-dark transition-colors duration-200"
            >
              Try AI Assistant
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 px-6 md:px-10 border-t border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1E293B]">Featured Products</h2>
            <p className="text-[#64748B] mt-1">Curated just for you</p>
          </div>
          <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ScrollReveal>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="text-royalBlue font-medium text-sm hover:underline inline-flex items-center gap-1"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-mint">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1E293B] text-center mb-10">
            Shop by Category
          </h2>
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to="/products"
                onClick={() => {}}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-400"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-[#1E293B]">{cat.name}</h3>
                  <p className="text-sm text-[#64748B] mt-1">{cat.count} products</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-royalBlue mt-3 group-hover:underline">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl text-navy">Powered by AI</h2>
            <p className="text-[#64748B] mt-3 max-w-xl mx-auto">
              Three intelligent features to enhance your shopping experience
            </p>
          </div>
          <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {aiFeatures.map(feature => (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 text-royalBlue">
                  <feature.icon className="w-12 h-12" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-lg text-[#1E293B] mb-2">{feature.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

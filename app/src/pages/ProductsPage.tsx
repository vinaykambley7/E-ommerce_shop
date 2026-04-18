import { useEffect } from 'react';
import { Search, Package } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useApp } from '@/hooks/useAppContext';
import type { CategoryFilter } from '@/types';

const categoryOptions: { label: string; value: CategoryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Home', value: 'home' },
];

export function ProductsPage() {
  const { products, setCategory, setSearchQuery, filteredProducts } = useApp();

  // Reset filters on mount
  useEffect(() => {
    setCategory('all');
    setSearchQuery('');
  }, []);

  return (
    <div>
      {/* Page Header */}
      <section className="bg-mint py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="font-display text-4xl md:text-5xl text-navy">Our Products</h1>
          <p className="text-[#64748B] mt-2 max-w-xl text-base">
            Explore our curated collection across electronics, clothing, and home goods.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-14 md:top-16 z-40 bg-white border-b border-[#E2E8F0] px-6 md:px-10 py-4">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-hide">
            {categoryOptions.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  products.activeCategory === cat.value
                    ? 'bg-navy text-white'
                    : 'bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-mint'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60 sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94A3B8]" />
            <input
              type="text"
              value={products.searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-royalBlue focus:ring-1 focus:ring-royalBlue/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 md:py-12 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package className="w-12 h-12 text-[#CBD5E1] mb-4" />
              <h3 className="font-semibold text-lg text-[#1E293B] mb-1">No products found</h3>
              <p className="text-sm text-[#64748B] mb-4">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setCategory('all');
                  setSearchQuery('');
                }}
                className="text-royalBlue font-medium text-sm hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" staggerDelay={0.08}>
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
}

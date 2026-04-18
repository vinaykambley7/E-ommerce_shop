import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Trash2, Clock } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import { products } from '@/data/products';

export function CartPage() {
  const { cart, removeItem, updateQuantity, cartTotal, cartCount } = useApp();
  const [showToast, setShowToast] = useState(false);

  const handleCheckout = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (cart.items.length === 0) {
    return (
      <div>
        <section className="bg-mint py-12 md:py-16 px-6 md:px-10">
          <div className="max-w-[1280px] mx-auto">
            <h1 className="font-display text-4xl md:text-5xl text-navy">Shopping Cart</h1>
            <p className="text-[#64748B] mt-2">Review your items and proceed to checkout</p>
          </div>
        </section>
        <section className="py-24 md:py-32 px-6 md:px-10">
          <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center">
            <ShoppingCart className="w-16 h-16 text-[#CBD5E1] mb-6" />
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-2">Your cart is empty</h2>
            <p className="text-[#64748B] mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/products"
              className="px-7 py-3 bg-navy text-white rounded-full font-medium hover:bg-navy-dark transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-mint py-12 md:py-16 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="font-display text-4xl md:text-5xl text-navy">Shopping Cart</h1>
          <p className="text-[#64748B] mt-2">Review your items and proceed to checkout</p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8 md:py-12 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items.map(item => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;
              return (
                <motion.div
                  layout
                  key={item.productId}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-[#1E293B]">{product.name}</h3>
                        <p className="text-xs text-[#94A3B8] uppercase mt-0.5">{product.category}</p>
                        <p className="text-sm text-[#64748B] mt-1">
                          ${product.price.toFixed(2)} per unit
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 text-[#94A3B8] hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-mint transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 h-8 flex items-center justify-center text-sm font-semibold border-x border-[#E2E8F0]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-mint transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-bold text-lg text-[#1E293B]">
                        ${(product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-[#F8FAFC] rounded-xl p-6">
              <h3 className="font-semibold text-lg text-[#1E293B] mb-4">Order Summary</h3>

              <div className="flex justify-between items-center mb-3">
                <span className="text-[#1E293B]">Subtotal ({cartCount} items)</span>
                <span className="text-[#1E293B]">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#1E293B]">Shipping</span>
                <span className="text-[#64748B] text-sm">Calculated at checkout</span>
              </div>

              <hr className="border-[#E2E8F0] mb-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg text-[#1E293B]">Estimated Total</span>
                <span className="font-bold text-xl text-[#1E293B]">${cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full h-13 py-3.5 bg-navy text-white rounded-full font-semibold text-base hover:bg-navy-dark transition-colors"
              >
                Checkout
              </button>

              <Link
                to="/products"
                className="block text-center mt-3 text-royalBlue font-medium text-sm hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-[#1E293B] text-white rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Checkout coming soon!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

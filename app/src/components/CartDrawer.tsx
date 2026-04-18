import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingCart, Clock } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import { products } from '@/data/products';

export function CartDrawer() {
  const { cart, setCartOpen, removeItem, updateQuantity, cartTotal, cartCount } = useApp();
  const [showToast, setShowToast] = useState(false);

  const handleCheckout = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[420px] bg-white z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <div>
                <h2 className="font-semibold text-lg text-[#1E293B]">Your Cart</h2>
                <span className="text-sm text-[#64748B]">({cartCount} items)</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-mint transition-colors"
              >
                <X className="w-5 h-5 text-[#1E293B]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-12 h-12 text-[#CBD5E1] mb-4" />
                  <p className="font-semibold text-base text-[#1E293B] mb-1">Your cart is empty</p>
                  <p className="text-sm text-[#64748B] mb-4">
                    Browse our products and add items to get started
                  </p>
                  <Link
                    to="/products"
                    onClick={() => setCartOpen(false)}
                    className="text-royalBlue font-medium text-sm hover:underline"
                  >
                    Shop Products
                  </Link>
                </div>
              ) : (
                cart.items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={item.productId} className="flex gap-4 items-start">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[72px] h-[72px] rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1E293B] truncate">{product.name}</p>
                        <p className="text-xs text-[#94A3B8] uppercase">{product.category}</p>
                        <p className="text-sm font-semibold text-[#1E293B] mt-1">
                          ${product.price.toFixed(2)}
                        </p>

                        {/* Quantity Stepper */}
                        <div className="flex items-center mt-2 border border-[#E2E8F0] rounded-lg overflow-hidden w-fit">
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
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 text-[#94A3B8] hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="p-5 border-t border-[#E2E8F0]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-base text-[#1E293B]">Subtotal</span>
                  <span className="font-bold text-xl text-[#1E293B]">${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[#94A3B8] mb-3">Shipping calculated at checkout</p>
                <button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-navy text-white rounded-full font-semibold text-base hover:bg-navy-dark transition-colors"
                >
                  Checkout
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-center mt-3 text-royalBlue font-medium text-sm hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>

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
        </>
      )}
    </AnimatePresence>
  );
}

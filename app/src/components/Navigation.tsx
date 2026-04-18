import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navigation() {
  const { toggleCart, cartCount, toggleChat } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Products', href: '/products' },
    { label: 'Cart', href: '/cart' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-14 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-heading font-bold text-xl text-foreground">
              ShopSmart <span className="text-royalBlue">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href) ? 'text-royalBlue' : 'text-foreground hover:text-royalBlue'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors duration-200"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-navy text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Ask AI Button (Desktop) */}
            <button
              onClick={toggleChat}
              className="hidden md:flex items-center gap-2 bg-mint text-navy rounded-full px-5 py-2 text-sm font-medium hover:bg-mint-dark transition-colors duration-200"
            >
              Ask AI
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-mint transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#1E293B]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-12">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <span className="font-heading font-bold text-xl text-foreground">
                    ShopSmart <span className="text-royalBlue">AI</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-mint"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-8 flex-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-2xl font-semibold ${
                      isActive(link.href) ? 'text-royalBlue' : 'text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    toggleChat();
                  }}
                  className="text-2xl font-semibold text-navy bg-mint rounded-full px-8 py-3"
                >
                  Ask AI
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

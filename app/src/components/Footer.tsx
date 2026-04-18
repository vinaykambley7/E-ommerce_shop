import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  const linkClass = 'text-sm text-muted-foreground hover:text-royalBlue transition-colors duration-200';

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-3">
              <span className="font-heading font-bold text-xl text-foreground">
                ShopSmart <span className="text-royalBlue">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered shopping for a smarter experience.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-royalBlue transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-royalBlue transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-royalBlue transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-foreground mb-1">Shop</h4>
            <Link to="/products" className={linkClass}>Products</Link>
            <Link to="/cart" className={linkClass}>Cart</Link>
            <button
              onClick={() => {}}
              className={`${linkClass} text-left`}
            >
              Ask AI
            </button>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm text-foreground mb-1">Support</h4>
            <span className={linkClass}>Terms</span>
            <span className={linkClass}>Privacy</span>
            <span className={linkClass}>Help Center</span>
            <span className={linkClass}>Contact</span>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E2E8F0] text-center">
          <p className="text-xs text-[#94A3B8]">
            &copy; 2025 ShopSmart AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { ChatbotPanel } from './ChatbotPanel';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navigation />
      <CartDrawer />
      <ChatbotPanel />
      <main className="flex-1 pt-14 md:pt-16">{children}</main>
      <Footer />
    </div>
  );
}

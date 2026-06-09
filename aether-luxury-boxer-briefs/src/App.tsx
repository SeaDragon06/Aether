/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, Compass, HelpCircle } from 'lucide-react';
import { PageId } from './types';
import AetherNavbar from './components/AetherNavbar';
import HomeView from './components/HomeView';
import FabricView from './components/FabricView';
import CraftView from './components/CraftView';
import CollectionView from './components/CollectionView';
import SensingView from './components/SensingView';
import InteractiveTrunk, { CartItem } from './components/InteractiveTrunk';
import CustomCursor from './components/CustomCursor';
import HelpOverlay from './components/HelpOverlay';
import { 
  playSuccessSound, 
  playHapticFeedback, 
  startBGM, 
  isBGMEnabled, 
  getMuteState 
} from './utils/audio';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scrolling progress globally for whatever active page we are on
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const totalHeight = docHeight - winHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const position = window.scrollY;
      const progress = (position / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    // Re-check scroll height dynamic sizes
    const timer = setTimeout(() => {
      handleScroll();
    }, 150);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [activePage]);

  // Start the warm generative ambient BGM loop on the first user interaction (browser constraints)
  useEffect(() => {
    const handleInteraction = () => {
      if (!getMuteState() && isBGMEnabled()) {
        startBGM();
      }
      // Remove listeners right away once running
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  // Sync scroll on tab transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [activePage]);

  // Keep trunk drawer visible during sensing/unboxing sequence
  useEffect(() => {
    if (activePage === 'sensing' && cartItems.length > 0) {
      setIsCartOpen(true);
    }
  }, [activePage, cartItems.length]);

  // Cart operations
  const handleAddToCart = (item: {
    model: any;
    color: string;
    size: string;
    isPack: boolean;
    quantity: number;
    price: number;
  }) => {
    const existingIndex = cartItems.findIndex(
      (c) => c.name === item.model.name && c.color === item.color && c.size === item.size && c.isPack === item.isPack
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += item.quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${item.model.id}-${item.color}-${item.size}-${item.isPack ? 'pack' : 'single'}-${Date.now()}`,
        name: item.model.name,
        color: item.color,
        size: item.size,
        isPack: item.isPack,
        quantity: item.quantity,
        price: item.price,
      };
      setCartItems([...cartItems, newItem]);
    }

    // Play luxurious synthesized success sound + haptic tap feedback
    playSuccessSound();
    playHapticFeedback();

    setIsCartOpen(true); // Auto-open cart to show seamless addition feedback
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 font-sans selection:bg-neutral-100 selection:text-neutral-950 text-neutral-200 antialiased overflow-x-hidden flex flex-col justify-between">
      
      {/* Top Navbar */}
      <AetherNavbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        openHelp={() => setIsHelpOpen(true)}
        scrollProgress={scrollProgress}
      />

      {/* Main Container Layer with Elegant Cross-Fade Transition */}
      <main className="flex-1 w-full bg-neutral-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, scale: 0.992 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.008 }}
            transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
            className="w-full h-full"
          >
            {activePage === 'home' && (
              <HomeView onExplore={() => setActivePage('collection')} />
            )}
            {activePage === 'fabric' && (
              <FabricView />
            )}
            {activePage === 'craft' && (
              <CraftView />
            )}
            {activePage === 'collection' && (
              <CollectionView onAddToCart={handleAddToCart} />
            )}
            {activePage === 'sensing' && (
              <SensingView cartItems={cartItems} onExplore={() => setActivePage('collection')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Interactive Cursor Follower */}
      <CustomCursor />

      {/* Left/Right Subtle Interactive Margins (Railing Graphics - Luxury Minimalist signature) */}
      <div className="fixed bottom-12 left-6 z-40 hidden xl:flex flex-col space-y-2 text-[8px] font-mono tracking-[0.25em] text-neutral-500 hover:text-white transition-colors cursor-default">
        <span>© 2026 AETHER</span>
        <span>ALL EXPERIMENTS RESTRAINED</span>
        <AnimatePresence>
          {scrollProgress > 0 && (
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-white mt-1 font-mono tracking-widest text-[7.5px]"
            >
              SCAN DEPTH // [ {Math.round(scrollProgress)}% ]
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-12 right-6 z-40 hidden xl:flex flex-col space-y-2 text-right text-[8px] font-mono tracking-[0.25em] text-neutral-500 hover:text-white transition-colors cursor-default">
        <span>ISO 9001 SYSTEM</span>
        <span>LATITUDE 31.23° N / SHANGHAINESE</span>
      </div>

      {/* Exquisite minimal drawer cart slide-out */}
      <InteractiveTrunk
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        activePage={activePage}
      />

      {/* Elegant Symmetrical Sideliner Scrollbar Grid Decoration */}
      <div className="fixed top-0 left-0 w-1 h-full bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.03] z-50 pointer-events-none" />
      <div className="fixed top-0 right-0 w-1 h-full bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.03] z-50 pointer-events-none" />
      
      {/* FAQ Assistance Overlay Panel */}
      <HelpOverlay
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

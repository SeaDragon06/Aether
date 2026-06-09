/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Smooth spring physics for lag-free luxury organic movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 350, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if the device points coarse (Touchscreen like Smartphone/Tablet)
    const checkCoarsePointer = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(isTouch);
    };

    checkCoarsePointer();
    window.addEventListener('resize', checkCoarsePointer);

    if (isMobile) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      // Update mouse values directly for real-time tracking
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    const handleGlobalHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if target or ancestor is interactive
      const isInteractive = 
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer') ||
        target.closest('.interactive-item') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mouseover', handleGlobalHover, { passive: true });

    return () => {
      window.removeEventListener('resize', checkCoarsePointer);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleGlobalHover);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile, isVisible]);

  // Render absolutely nothing on Touch/Mobile Screens to maintain tactile fidelity
  if (isMobile) return null;

  return (
    <>
      {/* 1. Miniature core Obsidian gemstone (glowing diamond) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] bg-neutral-950 border border-white/85"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 11 : 7,
          height: isHovered ? 11 : 7,
          borderRadius: '1px', // Sharper facet-cut corners
          rotate: 45, // Rotated square = pristine diamond
          opacity: isVisible ? 1 : 0,
          boxShadow: '0 0 12px rgba(255,255,255,0.45), inset 0 0 3px rgba(255,255,255,0.9)',
        }}
        animate={{
          rotate: isHovered ? 225 : 45,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          rotate: { type: 'spring', stiffness: 220, damping: 14 },
          scale: { duration: 0.15 },
          width: { duration: 0.15 },
          height: { duration: 0.15 }
        }}
      />

      {/* 2. Faceted Obsidian outer crystalline aura */}
      <motion.div
        className="fixed top-0 left-0 border border-white/20 pointer-events-none z-[9998] bg-black/50 backdrop-blur-[1.5px] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.85)]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 46 : 22,
          height: isHovered ? 46 : 22,
          borderRadius: '2px', // Crystalline geometric layout
          rotate: -45, // Opposing diagonal angle
          opacity: isVisible ? 0.9 : 0,
        }}
        animate={{
          rotate: isHovered ? 45 : -45,
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.2)',
        }}
        transition={{
          width: { type: 'spring', stiffness: 220, damping: 22 },
          height: { type: 'spring', stiffness: 220, damping: 22 },
          rotate: { type: 'spring', stiffness: 180, damping: 16 },
          borderColor: { duration: 0.2 },
          opacity: { duration: 0.15 },
        }}
      />
    </>
  );
}

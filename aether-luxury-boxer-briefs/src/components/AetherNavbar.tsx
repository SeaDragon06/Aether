/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Compass, HelpCircle, Volume2, VolumeX, Music } from 'lucide-react';
import { PageId } from '../types';
import { 
  getMuteState, 
  toggleMute, 
  playClickSound, 
  playSwitchSound, 
  playHapticFeedback,
  isBGMEnabled,
  toggleBGM
} from '../utils/audio';

interface NavbarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  cartCount: number;
  openCart: () => void;
  openHelp: () => void;
  scrollProgress: number;
}

export default function AetherNavbar({ 
  activePage, 
  setActivePage, 
  cartCount, 
  openCart, 
  openHelp,
  scrollProgress 
}: NavbarProps) {
  const [isMuted, setIsMuted] = useState(getMuteState());
  const [isBgmOn, setIsBgmOn] = useState(isBGMEnabled());

  const navItems: { id: PageId; label: string; labelEn: string }[] = [
    { id: 'home', label: '曜石首展', labelEn: 'EXHIBIT' },
    { id: 'fabric', label: '臻奇材质', labelEn: 'FABRICS' },
    { id: 'craft', label: '匠艺解构', labelEn: 'CRAFT' },
    { id: 'collection', label: '雅致奢选', labelEn: 'ATELIER' },
    { id: 'sensing', label: '感官洗礼', labelEn: 'RITUAL' },
  ];

  const handlePageChange = (page: PageId) => {
    setActivePage(page);
    playSwitchSound();
    playHapticFeedback();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = toggleMute();
    setIsMuted(muted);
    playHapticFeedback();
    if (!muted) {
      setTimeout(() => playClickSound(), 50);
    }
  };

  const handleToggleBgm = (e: React.MouseEvent) => {
    e.stopPropagation();
    const enabled = toggleBGM();
    setIsBgmOn(enabled);
    playHapticFeedback();
    
    // Automatically unmute if user turns BGM on, so they can hear it
    if (enabled && isMuted) {
      const muted = toggleMute();
      setIsMuted(muted);
    }
  };

  const handleOpenCart = () => {
    openCart();
    playClickSound();
    playHapticFeedback();
  };

  const handleOpenHelp = () => {
    openHelp();
    playClickSound();
    playHapticFeedback();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-black/60 backdrop-blur-xl border-b border-white/[0.04] px-6 py-4 md:px-12 flex justify-between items-center transition-all duration-500">
      {/* Brand logo in minimalist style */}
      <div 
        className="flex flex-col items-start cursor-pointer select-none"
        onClick={() => handlePageChange('home')}
      >
        <span className="font-sans text-xs tracking-[0.45em] text-white font-semibold uppercase leading-none">
          AETHER
        </span>
        <span className="font-mono text-[8px] tracking-[0.2em] text-neutral-500 uppercase mt-0.5 leading-none">
          LABORATORY
        </span>
      </div>

      {/* Nav items - minimal lowercase elegant style */}
      <nav className="hidden md:flex items-center space-x-12">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handlePageChange(item.id)}
              className="relative py-2 group flex flex-col items-center cursor-pointer transition-colors"
            >
              <span className={`font-sans text-xs tracking-widest transition-all duration-300 ${
                isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'
              }`}>
                {item.label}
              </span>
              <span className="font-mono text-[7px] tracking-wider text-neutral-600 scale-[0.8] mt-0.5 leading-none block">
                {item.labelEn}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeNavLine"
                  className="absolute bottom-0 w-6 h-[1.5px] bg-white"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right side actions */}
      <div className="flex items-center space-x-6">
        {/* Sleek help button */}
        <button
          onClick={handleOpenHelp}
          className="p-2 hover:bg-white/[0.04] rounded-full border border-white/5 bg-white/[0.01] transition-all duration-300 group flex items-center justify-center cursor-pointer"
          title="系统帮助与工艺问答 / Technical FAQ"
          aria-label="Open help center"
        >
          <HelpCircle className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white transition-colors" />
        </button>

        {/* Ambient BGM toggle */}
        <button
          onClick={handleToggleBgm}
          className="p-2 hover:bg-white/[0.04] rounded-full border border-white/5 bg-white/[0.01] transition-all duration-300 group flex items-center justify-center cursor-pointer"
          title={isBgmOn ? "关闭背景音乐 / Turn off BGM" : "开启背景音乐 / Turn on BGM"}
          aria-label="Toggle background music"
        >
          {!isMuted && isBgmOn ? (
            <div className="w-3.5 h-3.5 flex items-end justify-center space-x-[2px] h-3.5">
              <motion.span
                className="w-[1.2px] bg-neutral-200 rounded-full"
                animate={{ height: ["20%", "90%", "20%"] }}
                transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
              />
              <motion.span
                className="w-[1.2px] bg-neutral-200 rounded-full"
                animate={{ height: ["35%", "100%", "35%"] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.span
                className="w-[1.2px] bg-neutral-200 rounded-full"
                animate={{ height: ["15%", "75%", "15%"] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut", delay: 0.4 }}
              />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
          )}
        </button>

        {/* Sleek mute button */}
        <button
          onClick={handleToggleMute}
          className="p-2 hover:bg-white/[0.04] rounded-full border border-white/5 bg-white/[0.01] transition-all duration-300 group flex items-center justify-center cursor-pointer"
          title={isMuted ? "开启声音 / Unmute" : "静音 / Mute"}
          aria-label="Toggle mute"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white transition-colors" />
          )}
        </button>

        <button 
          onClick={handleOpenCart} 
          className="relative group p-2 hover:bg-white/[0.04] rounded-full transition-colors flex items-center space-x-1"
          aria-label="View Shopping Cart"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white transition-colors" />
          <span className="font-mono text-[9px] text-neutral-400 group-hover:text-white transition-colors">
            [{cartCount}]
          </span>
        </button>

        <div className="hidden lg:flex flex-col items-end border-l border-white/[0.1] pl-6 text-right select-none">
          <span className="font-mono text-[8px] tracking-widest text-neutral-400">
            SHANGHAI / ZURICH
          </span>
          <span className="font-mono text-[7px] text-neutral-500 tracking-wider mt-0.5 animate-pulse">
            EDITION 01
          </span>
        </div>
      </div>

      {/* Reading Progress Line directly at the bottom edge of the navbar */}
      <div 
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-neutral-800 via-white to-neutral-800 transition-all duration-100 ease-out z-[101]"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ruler, Activity, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { TECHNICAL_DOTS, IMAGES } from '../data';

export default function CraftView() {
  const [activeDot, setActiveDot] = useState<string>('capsule');

  const currentDot = TECHNICAL_DOTS.find(d => d.id === activeDot) || TECHNICAL_DOTS[1];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-28 pb-16 px-6 md:px-12 lg:px-24 flex flex-col justify-center items-center select-none overflow-hidden">
      
      {/* Immersive Title */}
      <div className="w-full max-w-7xl flex flex-col items-start mb-12">
        <span className="font-mono text-[8px] tracking-[0.4em] text-neutral-500 uppercase">
          Chapter 03 / Master Tailoring Architecture
        </span>
        <h2 className="font-sans font-light text-2xl tracking-[0.2em] text-white uppercase mt-2">
          CRAFT CONSTRUCTION 匠艺解构
        </h2>
        <div className="w-24 h-[1px] bg-white/10 mt-4" />
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Technical Blueprint Image with Glowing Target Hotspots */}
        <div className="col-span-1 lg:col-span-7 flex justify-center relative">
          <div className="relative w-full max-w-xl aspect-square border border-white/[0.04] bg-neutral-900/10 rounded-lg p-6 flex items-center justify-center">
            
            {/* Fine decoration detail lines for scientific scanner aesthetics */}
            <div className="absolute inset-x-6 top-4 flex justify-between font-mono text-[6px] tracking-widest text-neutral-500">
              <span>MAPPING CODE: SYS-A01.3D</span>
              <span>PRESSURE PROFILE: NOMINAL</span>
            </div>
            
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded overflow-hidden shadow-2xl border border-white/[0.06]">
              <img
                src={IMAGES.detail}
                alt="Seamless Waistband Stitching Detail"
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay shadow for technical aesthetic */}
              <div className="absolute inset-0 bg-neutral-950/40 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Hotspots layer */}
              {TECHNICAL_DOTS.map((dot) => {
                const isActive = dot.id === activeDot;
                return (
                  <button
                    key={dot.id}
                    onClick={() => setActiveDot(dot.id)}
                    style={{ left: dot.x, top: dot.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer focus:outline-none"
                    aria-label={`Show detail for ${dot.title}`}
                  >
                    {/* Ripple visual effects */}
                    <span className="absolute inline-flex h-6 w-6 rounded-full bg-white/30 animate-ping opacity-60 pointer-events-none" />
                    <span className={`relative inline-flex rounded-full h-3.5 w-3.5 transition-all duration-300 ${
                      isActive ? 'bg-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'bg-white/40 border border-white/60 group-hover:bg-white'
                    }`} />
                    
                    {/* Micro name tooltip - enlarged and positioned to avoid cursor block */}
                    <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-950/95 border border-white/20 px-3 py-1 rounded text-[11px] tracking-widest font-sans text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_4px_12px_rgba(0,0,0,0.8)] backdrop-blur-md">
                      {dot.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Symmetrical framing indicators */}
            <div className="absolute inset-y-12 left-4 w-[1px] bg-white/5 flex flex-col justify-between items-center py-2 text-[6px] font-mono text-neutral-600">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>

          </div>
        </div>

        {/* Right Side: Showcase Active Detail details with high typography value */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-center space-y-8">
          
          <div className="flex flex-col space-y-2">
            <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">
              SEAMLESS STRUCTURAL Hotspot
            </span>
            <span className="font-mono text-xs text-neutral-400">
              TAP OR HOVER TARGET DOT TO EXPLORE ERGONOMICS
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDot}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-6"
            >
              <div className="border-l-2 border-white pl-4">
                <span className="font-mono text-[10px] text-neutral-500 tracking-[0.3em] uppercase block">
                  POSITION / {currentDot.id.toUpperCase()}
                </span>
                <h3 className="font-sans font-light text-xl text-white tracking-widest mt-1">
                  {currentDot.title}
                </h3>
              </div>

              <p className="font-sans font-light text-neutral-400 text-xs tracking-wider leading-relaxed bg-white/[0.01] border border-white/[0.04] p-5 rounded-lg">
                {currentDot.desc}
              </p>

              {/* Scientific design benefits specs */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center space-x-2">
                  <div className="bg-white/5 rounded p-1.5 border border-white/10">
                    <Layers className="w-3.5 h-3.5 text-neutral-300" />
                  </div>
                  <div>
                    <span className="font-mono text-[7px] text-neutral-500 block uppercase tracking-wide">SHAPE INDEX</span>
                    <span className="font-mono text-[9px] text-neutral-200 uppercase">3D Ergonomic FIT</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="bg-white/5 rounded p-1.5 border border-white/10">
                    <Activity className="w-3.5 h-3.5 text-neutral-300" />
                  </div>
                  <div>
                    <span className="font-mono text-[7px] text-neutral-500 block uppercase tracking-wide">FRICTION STRESS</span>
                    <span className="font-mono text-[9px] text-neutral-200 uppercase">ZERO-PRESSURE BOND</span>
                  </div>
                </div>
              </div>

              {/* Interactive Craft notes block */}
              <div className="bg-neutral-900/40 p-4 rounded-md border border-white/[0.03]">
                <div className="flex items-center space-x-2 mb-2 text-white font-sans text-[10px] tracking-wider uppercase font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span>AETHER 原厂微米激光无缝粘合标准</span>
                </div>
                <p className="text-neutral-500 text-[9px] leading-relaxed tracking-wide">
                  我们使用高达240℃温度的微激光，在纳米级别精准融合面料经纬缕丝。粘合缝合带薄至仅 0.3mm，不仅能提高防过敏纯净度，拉伸寿命更是超越普通车线的5倍以上。
                </p>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}

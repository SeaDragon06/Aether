/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, ShieldCheck, Waves, Maximize2, Cpu } from 'lucide-react';
import { IMAGES } from '../data';
import { playClickSound, playSwitchSound, playHapticFeedback } from '../utils/audio';

interface FabricFeature {
  id: string;
  name: string;
  chemicalName: string;
  percentage: string;
  spec: string;
  description: string;
  highlights: string[];
}

export default function FabricView() {
  const [activeTab, setActiveTab] = useState<string>('silk');
  const [elasticBounce, setElasticBounce] = useState<number>(0);
  const [modalZoomTrigger, setModalZoomTrigger] = useState<number>(0);
  const [magnifier, setMagnifier] = useState({ show: false, x: 0, y: 0, bgX: 0, bgY: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const totalHeight = docHeight - winHeight;
      if (totalHeight <= 0) {
        setScrollProgress(100);
        setIsAtBottom(true);
        return;
      }
      const currentScroll = window.scrollY;
      const currentProgress = (currentScroll / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      
      // Near bottom check (15px threshold)
      const nearBottom = (currentScroll + winHeight) >= (docHeight - 15);
      setIsAtBottom(nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    // Observe size changes to dynamically adjust scroll limits
    const observer = new ResizeObserver(() => {
      handleScroll();
    });
    if (document.body) {
      observer.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [activeTab]);

  const materials: FabricFeature[] = [
    {
      id: 'silk',
      name: '极光桑蚕丝',
      chemicalName: 'Natural Fibroin Protein',
      percentage: '22%',
      spec: 'Grade 6A Premium Long-filament',
      description: '选用江浙流域黄金维度的珍稀春茧，经28道低温精缫工序。保留丝蛋白天然的18种氨基酸活性，让皮肤时刻处于舒缓饱水的微气候温床，完美拒绝外界闷汗带来的潮红或过敏源。',
      highlights: [
        '天然多孔纤维结构，吸湿散热速率是纯棉的1.5倍',
        '极低摩擦系数（仅0.12μ），避免摩擦引起暗沉与过敏',
        '卓越的物理级长效抗菌，防止微菌异味滋生'
      ]
    },
    {
      id: 'modal',
      name: '140S超细木代尔',
      chemicalName: 'Air MicroModal Weave',
      percentage: '70%',
      spec: '140S Ultra-fine Count Microfiber',
      description: '甄选奥地利高山生态榉木，采用环保无污染工艺精制提纯，极致拉伸纺成直径仅有头发丝十分之一的140支纱线。质地如清晨薄雾般轻柔无感，触之即化。',
      highlights: [
        '超高支数紧密编织，面料细腻柔韧，经洗涤不易起球僵硬',
        '亲肤透干，提供无可比拟的柔软垂坠感与无感透光性',
        '100% 可降解林业环保材质，绿色可持续的奢用之选'
      ]
    },
    {
      id: 'elastane',
      name: 'Creora减压医用弹力丝',
      chemicalName: 'Thermostable Segmented Polyurethane',
      percentage: '8%',
      spec: 'Creora High-stretching Medical Elasticity',
      description: '特种分段式分子结构，受拉伸时能温和释压，不重力掐入小腹、大腿肌肉。出色的耐热及防松退性能，确保长年使用依然保持初穿般的极致记忆。',
      highlights: [
        '250%超强横向负重拉伸，无丝毫局部勒痕或紧绷压迫感',
        '高回弹率，绝不因反复洗涤、拉扯导致腰封卷边松懈',
        '卓越的排湿疏水极速干燥通道，运动出汗亦保持干爽'
      ]
    }
  ];

  const currentMaterial = materials.find(m => m.id === activeTab) || materials[0];

  const getMaterialTexture = (tabId: string) => {
    return IMAGES.texture;
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'elastane') {
      setElasticBounce(prev => prev + 1);
    } else if (tabId === 'modal') {
      setModalZoomTrigger(prev => prev + 1);
    }
    playSwitchSound();
    playHapticFeedback();
  };

  // Magnifier coordinate calculations
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Magnified view offset percentage
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setMagnifier({
      show: true,
      x,
      y,
      bgX,
      bgY
    });
  };

  const handleMouseLeave = () => {
    setMagnifier(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-28 pb-16 px-6 md:px-12 lg:px-24 flex flex-col justify-center items-center select-none overflow-hidden">
      
      {/* Title block with deep negative space and scroll-triggered fade-in */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-7xl flex flex-col items-start mb-12"
      >
        <span className="font-mono text-[8px] tracking-[0.4em] text-neutral-500 uppercase">
          Chapter 02 / Textile Laboratory
        </span>
        <h2 className="font-sans font-light text-2xl tracking-[0.2em] text-white uppercase mt-2">
          MATERIAL GRAIN 材质肌理
        </h2>
        <div className="w-24 h-[1px] bg-white/10 mt-4" />
      </motion.div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: 3D High Fidelity Texture display with Custom Loupe/Magnifier - scroll triggered float-up */}
        <motion.div 
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-1 lg:col-span-6 flex flex-col items-center"
        >
          <div className="w-full border border-white/[0.04] bg-neutral-900/20 rounded-lg p-6 flex flex-col items-center relative">
            
            {/* Fine decoration detail lines */}
            <div className="absolute top-2 left-6 right-6 flex justify-between text-neutral-600 font-mono text-[7px] tracking-widest">
              <span>SCAN AREA PROFILE ST10</span>
              <span>150X MACRO DETECT</span>
            </div>

            {/* Main Interactive Magnifying Area */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full aspect-[4/3] rounded overflow-hidden cursor-crosshair border border-white/[0.08] mt-4 bg-neutral-900"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTab}
                  src={getMaterialTexture(activeTab)}
                  alt="High Precision Microscopic Weave of Aether Boxer Brief"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Silk Flowing Airwave Overlay (Active wave/airwave animation when silk is selected) */}
              {activeTab === 'silk' && (
                <div className="absolute inset-0 bg-neutral-950/20 pointer-events-none flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-[linear-gradient(270deg,rgba(147,197,253,0.15),rgba(244,180,26,0.05),rgba(236,72,153,0.1))] bg-[size:400%_400%] mix-blend-screen"
                  />
                  <svg className="absolute w-full h-[60%] opacity-70" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                      d="M 0,50 Q 25,30 50,50 T 100,50 L 100,100 L 0,100 Z"
                      fill="url(#silk-grad-1)"
                      opacity="0.15"
                      animate={{
                        d: [
                          "M 0,50 Q 25,30 50,50 T 100,50 L 100,100 L 0,100 Z",
                          "M 0,50 Q 25,60 50,45 T 100,50 L 100,100 L 0,100 Z",
                          "M 0,50 Q 25,30 50,50 T 100,50 L 100,100 L 0,100 Z"
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M 0,60 Q 30,45 60,60 T 100,60 L 100,100 L 0,100 Z"
                      fill="url(#silk-grad-2)"
                      opacity="0.25"
                      animate={{
                        d: [
                          "M 0,60 Q 30,45 60,60 T 100,60 L 100,100 L 0,100 Z",
                          "M 0,60 Q 25,30 50,65 T 100,60 L 100,100 L 0,100 Z",
                          "M 0,60 Q 30,45 60,60 T 100,60 L 100,100 L 0,100 Z"
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="silk-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                        <stop offset="50%" stopColor="rgba(147,197,253,0.12)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="rgba(219,39,119,0.05)" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="silk-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%" stopColor="rgba(192,132,252,0.18)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1.5 font-mono text-[7px] text-sky-300 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-500/20 select-none">
                    <Waves className="w-2.5 h-2.5 animate-bounce" />
                    <span>SILK GRADE-6A AIRWAVE // 极光呼吸流场模拟</span>
                  </div>
                </div>
              )}

              {/* Dynamic Lens Overlay instructions */}
              {!magnifier.show && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                  <div className="border border-white/20 rounded-full p-3 bg-neutral-950/80 mb-2">
                    <Maximize2 className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <span className="font-mono text-[8px] text-neutral-300 tracking-[0.2em] uppercase">
                    移动鼠标激活 150x 极细肌理放大镜
                  </span>
                </div>
              )}

              {/* Magnifier Lens */}
              <AnimatePresence>
                {magnifier.show && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      left: magnifier.x - 70,
                      top: magnifier.y - 70,
                      width: 140,
                      height: 140,
                      backgroundImage: `url(${getMaterialTexture(activeTab)})`,
                      backgroundSize: '400%',
                      backgroundPosition: `${magnifier.bgX}% ${magnifier.bgY}%`,
                      pointerEvents: 'none',
                    }}
                    className="rounded-full border-2 border-white/40 shadow-2xl overflow-hidden z-20 flex items-center justify-center"
                  >
                    {/* Reticle grid */}
                    <div className="w-full h-[1px] bg-red-500/20 absolute" />
                    <div className="h-full w-[1px] bg-red-500/20 absolute" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom micro statistics panel */}
            <div className="w-full grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/[0.04]">
              <div className="flex flex-col">
                <span className="font-mono text-[7px] text-neutral-500 tracking-wider">TOUCH friction</span>
                <span className="font-mono text-[10px] text-white font-medium mt-0.5">0.12 μCoeff</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[7px] text-neutral-500 tracking-wider">BREATHABILITY</span>
                <span className="font-mono text-[10px] text-white font-medium mt-0.5">98.4 %</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[7px] text-neutral-500 tracking-wider">HYGROSCOPICITY</span>
                <span className="font-mono text-[10px] text-white font-medium mt-0.5">14.2 g/Kg</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[7px] text-neutral-500 tracking-wider">ANTIBAC RATE</span>
                <span className="font-mono text-[10px] text-white font-medium mt-0.5">99.98 %</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Right Side: Tab switcher and textual specifications - scroll triggered float-up with sequential entry */}
        <motion.div 
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="col-span-1 lg:col-span-6 flex flex-col justify-center space-y-8"
        >
          
          {/* Minimalism button tab switcher with small fonts */}
          <div className="flex space-x-3 border-b border-white/[0.04] pb-4">
            {materials.map((m) => {
              const isSelected = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleTabChange(m.id)}
                  className={`px-4 py-2 border rounded-full text-[9px] tracking-[0.2em] uppercase transition-all duration-300 ${
                    isSelected
                      ? 'border-white text-white bg-white/[0.03]'
                      : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {m.name.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* High precision content with smooth sliding fading animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${modalZoomTrigger}-${elasticBounce}`}
              initial={{ 
                opacity: 0, 
                x: 20, 
                scale: 1,
                scaleY: 1,
                scaleX: 1,
                y: 0
              }}
              animate={
                activeTab === 'modal' ? {
                  opacity: 1,
                  x: 0,
                  scale: [1, 1.06, 0.97, 1.02, 1],
                  y: 0,
                  scaleY: 1,
                  scaleX: 1,
                  transition: { duration: 0.75, ease: [0.175, 0.885, 0.32, 1.2] }
                } : activeTab === 'elastane' ? {
                  opacity: 1,
                  x: 0,
                  y: [0, -22, 14, -6, 2, 0],
                  scale: 1,
                  scaleY: [1, 0.92, 1.06, 0.98, 1.01, 1],
                  scaleX: [1, 1.06, 0.95, 1.01, 0.99, 1],
                  transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] }
                } : {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  y: 0,
                  scaleY: 1,
                  scaleX: 1,
                  transition: { duration: 0.4, ease: 'easeInOut' }
                }
              }
              exit={{ 
                opacity: 0, 
                x: -20,
                scale: 0.95
              }}
              className="flex flex-col space-y-6"
            >
              <div className="flex justify-between items-baseline">
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-neutral-500 tracking-[0.3em] uppercase">
                    {currentMaterial.chemicalName}
                  </span>
                  <h3 className="font-sans font-light text-xl text-white tracking-widest mt-1">
                    {currentMaterial.name}
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[24px] font-thin text-white leading-none">
                    {currentMaterial.percentage}
                  </span>
                  <span className="font-mono text-[7px] text-neutral-500 tracking-widest mt-1">
                    BLENDED ACCORDION
                  </span>
                </div>
              </div>

              <motion.div 
                whileHover={{ 
                  scale: 1.025,
                  borderColor: "rgba(255, 255, 255, 0.16)",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)"
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="border border-white/[0.04] bg-white/[0.01] p-4 rounded text-neutral-400 text-[11px] leading-relaxed tracking-wider font-light cursor-default select-text"
              >
                {currentMaterial.description}
              </motion.div>

              {/* Highlights bullets - luxury minimal layout */}
              <div className="flex flex-col space-y-3">
                <span className="font-mono text-[8px] text-neutral-500 tracking-widest uppercase">
                  核心奢华工艺性能 / HIGH ADVANCED ATTRIBUTE
                </span>
                <div className="flex flex-col space-y-2">
                  {currentMaterial.highlights.map((highlight, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ x: 6, color: "#ffffff" }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      className="flex items-start space-x-3 text-neutral-300 text-[10px] tracking-wide cursor-default select-text origin-left"
                    >
                      <span className="font-mono text-neutral-500 mt-1">{`0${index + 1}.`}</span>
                      <p className="leading-relaxed font-light">{highlight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 border-t border-white/[0.04] pt-4">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-mono text-[7px] text-neutral-400 tracking-[0.2em] uppercase">
                  Oeko-Tex Standard 100 婴儿级皮肤友好安全认证
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

        </motion.div>

      </div>

      {/* Floating Minimalist Scroll Progress Indicator & Breathing Guidance Arrow */}
      <div className="fixed bottom-0 left-0 w-full z-40 px-6 md:px-12 lg:px-24 pb-4 pt-10 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent pointer-events-none select-none">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-2 pointer-events-auto">
          
          {/* Progress Bar Container */}
          <div className="w-full flex items-center space-x-3">
            <span className="font-mono text-[7px] text-neutral-500 tracking-[0.3em] uppercase shrink-0">
              READING PROGRESS / 阅读进度
            </span>
            <div className="flex-1 h-[1px] bg-white/[0.06] rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-white origin-left"
                style={{ width: `${scrollProgress}%` }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
              />
            </div>
            <span className="font-mono text-[8px] text-white tracking-widest shrink-0 w-8 text-right bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/5">
              {Math.round(scrollProgress)}%
            </span>
          </div>

          {/* Breathing Arrow Light Indicator when reaching the bottom */}
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence>
              {isAtBottom && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex flex-col items-center pointer-events-none"
                >
                  <motion.div
                    animate={{ 
                      opacity: [0.35, 1, 0.35],
                      y: [0, 2, 0] 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.2, 
                      ease: "easeInOut" 
                    }}
                    className="flex flex-col items-center space-y-0.5"
                  >
                    <span className="font-mono text-[6px] text-neutral-400 tracking-[0.4em] uppercase">
                      FABRIC MATRIX FULLY RESOLVED / 材质肌理探索完毕
                    </span>
                    <svg 
                      className="w-3 h-3 text-neutral-400 stroke-[1.2]"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

    </div>
  );
}

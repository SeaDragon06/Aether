/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, Award, Sparkles, Eye } from 'lucide-react';
import { IMAGES } from '../data';
import { playClickSound, playSuccessSound, playHapticFeedback } from '../utils/audio';

interface HomeProps {
  onExplore: () => void;
}

export default function HomeView({ onExplore }: HomeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [hoverDetail, setHoverDetail] = useState<string | null>(null);

  // 3D Tilt Card state variables
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });

  // Luxury Interactive Simulation and Hotspot states
  const [simulationMode, setSimulationMode] = useState<'ambient' | 'cryo' | 'vacuum' | 'stretch'>('ambient');
  const [activeFeature, setActiveFeature] = useState<'none' | 'material' | 'cavity' | 'bonding'>('none');

  // Ref synchronizer to allow high-performance animation frames to read state without re-creating canvas context
  const simModeRef = useRef(simulationMode);
  useEffect(() => {
    simModeRef.current = simulationMode;
  }, [simulationMode]);

  // Newsletter subscription states
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailStatus('error');
      setErrorMessage('请输入您的电子邮箱 / Please enter an email address.');
      playHapticFeedback();
      return;
    }
    if (!regex.test(email)) {
      setEmailStatus('error');
      setErrorMessage('邮箱格式不正确 / Incorrect email format.');
      playHapticFeedback();
      return;
    }

    setEmailStatus('validating');
    playClickSound();
    playHapticFeedback();

    setTimeout(() => {
      setEmailStatus('success');
      setEmail('');
      setErrorMessage('');
      playSuccessSound();
      playHapticFeedback();
    }, 1200);
  };

  // Sync scroll state for custom parallax and Chamber auto-triggering on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-35% 0px -40% 0px', // Sweet spots for viewport triggers
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chamberId = entry.target.getAttribute('data-chamber');
          if (chamberId) {
            setSimulationMode(chamberId as any);
            // Link corresponding visual scanner hotspot target automatically
            if (chamberId === 'ambient') {
              setActiveFeature('material');
            } else if (chamberId === 'cryo') {
              setActiveFeature('cavity');
            } else if (chamberId === 'vacuum') {
              setActiveFeature('bonding');
            } else if (chamberId === 'stretch') {
              setActiveFeature('material');
            }
            playHapticFeedback();
          }
        }
      });
    }, options);

    const chambers = document.querySelectorAll('[data-chamber]');
    chambers.forEach((el) => observer.observe(el));

    return () => {
      chambers.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // HTML5 Interactive Canvas: Dynamic Flowing Luxury Silk Wave with Custom Simulation States
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let height = (canvas.height = window.innerHeight * window.devicePixelRatio);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    window.addEventListener('resize', handleResize);

    // Mouse interactive coordinates
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Particle initial allocation for deep environment atmosphere
    interface SimParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      phase: number;
      spin: number;
    }
    const particlesList: SimParticle[] = [];
    const particleCount = 45;
    for (let pIdx = 0; pIdx < particleCount; pIdx++) {
      particlesList.push({
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: Math.random() * (canvas.height / window.devicePixelRatio),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        spin: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    // Simulation loop
    const render = () => {
      const currentMode = simModeRef.current;
      
      // Determine dynamic math parameters based on active luxury scenario
      let speedFactor = 0.0012;
      let threadCount = 38;
      let amplitudeMultiplier = 1.0;
      let freqMultiplier = 1.0;

      if (currentMode === 'cryo') {
        speedFactor = 0.0005; // Crystalline low movement speed
        threadCount = 44;     // Dense crisp grid structure
        amplitudeMultiplier = 0.55;
        freqMultiplier = 1.7; // Crisp high-frequency icy ripples
      } else if (currentMode === 'vacuum') {
        speedFactor = 0.0024; // Smooth soaring drift
        threadCount = 20;     // Featherlight structural lines
        amplitudeMultiplier = 2.4;
        freqMultiplier = 0.42;
      } else if (currentMode === 'stretch') {
        speedFactor = 0.0048; // Highly dynamic elastic bounce
        threadCount = 48;     // Complex warp yarns tension count
        amplitudeMultiplier = 1.35;
        freqMultiplier = 0.8;
      }

      time += speedFactor;
      ctx.fillStyle = 'rgba(5, 5, 5, 0.16)'; // Deep space black fluid blend
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const styleWidth = canvas.width / window.devicePixelRatio;
      const styleHeight = canvas.height / window.devicePixelRatio;
      const points = 45;

      // Draw multiple overlaid waving threads
      for (let i = 0; i < threadCount; i++) {
        ctx.beginPath();
        const amplitude = (30 + (i * 1.5) + Math.sin(time * 5 + i * 0.1) * 10) * amplitudeMultiplier;
        const frequency = (0.003 + i * 0.0001) * freqMultiplier;
        const speed = time * 2.2 + i * 0.035;

        const progress = i / threadCount;
        const alpha = Math.max(0.04, Math.sin(progress * Math.PI) * 0.22 + 0.02);
        
        // Render theme color tones dynamically reflecting current simulation mode parameters
        if (currentMode === 'cryo') {
          // Cold crystalline laser cyan & frozen diamond blue
          ctx.strokeStyle = `rgba(${100 + progress * 60}, ${185 + progress * 70}, 255, ${alpha * 1.6})`;
          ctx.lineWidth = 0.6 + progress * 0.4;
        } else if (currentMode === 'vacuum') {
          // Celestial warm stardust bronze and solar amber gold
          ctx.strokeStyle = `rgba(255, ${192 + progress * 60}, ${120 + progress * 100}, ${alpha * 0.85})`;
          ctx.lineWidth = 0.9 + progress * 0.8;
        } else if (currentMode === 'stretch') {
          // Platinum magnesium pristine tech whites
          ctx.strokeStyle = `rgba(${235 + progress * 20}, ${235 + progress * 20}, ${240 + progress * 15}, ${alpha * 1.4})`;
          ctx.lineWidth = 0.7 + progress * 0.5;
        } else {
          // Classic ambient metallic space silver and sleek slate grey
          ctx.strokeStyle = `rgba(${120 + progress * 100}, ${120 + progress * 110}, ${145 + progress * 100}, ${alpha})`;
          ctx.lineWidth = 0.8 + progress * 0.6;
        }

        for (let j = 0; j < points; j++) {
          const px = (styleWidth / (points - 1)) * j;
          
          const baseSin = Math.sin(px * frequency - speed);
          const distanceToMouse = Math.abs(px - mouse.x);
          const pullFactor = Math.max(0, 1 - distanceToMouse / 260);
          
          const interactionOffset = Math.sin(time * 12 + i) * 15 * pullFactor * (mouse.y - styleHeight / 2) * 0.012;
          const py = (styleHeight / 1.7) + baseSin * amplitude + (Math.cos(px * 0.001 - speed) * 35) + interactionOffset;
          
          if (j === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      }

      // Render theme particle overlays based on currentMode
      particlesList.forEach((p) => {
        // 1. Particle Physics updates based on simulation mode
        if (currentMode === 'ambient') {
          p.x += p.vx * 0.4 + Math.sin(time + p.phase) * 0.05;
          p.y += p.vy * 0.2;
          p.alpha = 0.1 + Math.abs(Math.sin(time * 0.8 + p.phase)) * 0.15;
        } else if (currentMode === 'cryo') {
          p.x += p.vx * 0.15;
          p.y += Math.abs(p.vy) * 0.35 + 0.2; // Falling downward
          p.alpha = 0.25 + Math.abs(Math.cos(time + p.phase)) * 0.4;
        } else if (currentMode === 'vacuum') {
          p.x += Math.sin(time * 0.6 + p.phase) * 0.3;
          p.y -= Math.abs(p.vy) * 0.2 + 0.1; // Rising upward float
          p.alpha = 0.15 + Math.abs(Math.sin(time * 0.3 + p.phase)) * 0.45;
        } else if (currentMode === 'stretch') {
          p.x += p.vx * 3.2;
          p.y += p.vy * 3.2;
          p.alpha = 0.35 + Math.abs(Math.sin(time * 2.5 + p.phase)) * 0.5;
        }

        // 2. Wrap-around boundaries
        if (p.x < 0) p.x = styleWidth;
        if (p.x > styleWidth) p.x = 0;
        if (p.y < 0) p.y = styleHeight;
        if (p.y > styleHeight) p.y = 0;

        // 3. Draw depending on mode
        if (currentMode === 'cryo') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.spin + time * 0.06);
          ctx.strokeStyle = `rgba(165, 243, 252, ${p.alpha})`; // cyan-200
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          const r = p.size * 1.5;
          for (let k = 0; k < 6; k++) {
            const angle = (Math.PI / 3) * k;
            const hx = Math.cos(angle) * r;
            const hy = Math.sin(angle) * r;
            if (k === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        } else if (currentMode === 'vacuum') {
          ctx.beginPath();
          ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`; // amber-400
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(217, 119, 6, ${p.alpha * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else if (currentMode === 'stretch') {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${p.alpha})`; // purple-500
          ctx.lineWidth = p.size * 0.4;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.fillStyle = `rgba(243, 244, 246, ${p.alpha})`; // gray-100
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render subtle overlay grid structure
      ctx.strokeStyle = currentMode === 'cryo' 
        ? 'rgba(100, 200, 255, 0.02)' 
        : currentMode === 'vacuum' 
          ? 'rgba(255, 200, 150, 0.015)' 
          : 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 1;
      const step = 80;
      for (let x = 0; x < styleWidth; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, styleHeight);
        ctx.stroke();
      }
      for (let y = 0; y < styleHeight; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(styleWidth, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Framer Motion spring config
  const springConfig = { stiffness: 120, damping: 25 };

  const getSimulationReadouts = () => {
    switch (simulationMode) {
      case 'cryo':
        return {
          temp: '-196.2 °C',
          vibration: '1.24 GHz',
          strain: '3.42 MPa',
          desc: '极寒零感固态物理形貌测定中 / CRYOGENIC MOLECULAR STATIC TEST',
          badge: 'CRYO ACTIVE'
        };
      case 'vacuum':
        return {
          temp: '22.0 °C',
          vibration: '0.00 Hz',
          strain: '0.01 MPa',
          desc: '太空零重力悬浮折叠弹性指数测算 / WEIGHTLESS FLUID SEAMLESS DRIFT',
          badge: 'VACUUM ZERO-G'
        };
      case 'stretch':
        return {
          temp: '37.0 °C',
          vibration: '24.80 KHz',
          strain: '35.40 MPa',
          desc: '生物肌群高频拉伸极限回弹恢复测算 / HIGH STRETCH EXTENSION PROFILE',
          badge: 'FORCE MAXIMUM'
        };
      default:
        return {
          temp: '25.0 °C',
          vibration: '14.20 Hz',
          strain: '0.12 MPa',
          desc: '标准恒温实验室风道触感标定 / STANDARD ATMOSPHERIC COEFF DRIFT',
          badge: 'AMBIENT CALIB'
        };
    }
  };

  const telemetry = getSimulationReadouts();
  
  return (
    <div ref={containerRef} className="relative bg-neutral-950 text-white min-h-[220vh] w-full overflow-hidden select-none">
      {/* Immersive interactive silk background container */}
      <div className="fixed top-0 left-0 w-full h-full z-0 opacity-80 pointer-events-auto">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Screen 1: The Ambient Master Welcome Page */}
      <div className="relative min-h-screen w-full flex flex-col justify-between items-center z-10 px-6 py-28 pointer-events-none">
        
        {/* Absolute dynamic space alignment / Left & Right small vertical parameters */}
        <div className="absolute top-1/4 left-8 md:grid lg:flex flex-col space-y-6 text-left opacity-60 hidden">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-400">MATERIAL CODE</span>
            <span className="font-mono text-[9px] text-white">A-AIRSILK.140</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-400">FINENESS SPEC</span>
            <span className="font-mono text-[9px] text-white">140S / ULTRALIGHT</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-400">FRICTION INDEX</span>
            <span className="font-mono text-[9px] text-white">0.12 MICRO-COEFF</span>
          </div>
        </div>

        <div className="absolute top-1/4 right-8 md:grid lg:flex flex-col space-y-6 text-right opacity-60 hidden">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-400">BREATHABILITY RATE</span>
            <span className="font-mono text-[9px] text-white">98.4% / ULTRA DRY</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-400">STRETCH RANGE</span>
            <span className="font-mono text-[9px] text-white">350% COMPRESSION</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[8px] tracking-[0.3em] text-neutral-400">CRAFT MANIFESTO</span>
            <span className="font-mono text-[9px] text-white">SEAMLESS BONDING</span>
          </div>
        </div>

        {/* Minimal Hero Title Frame */}
        <div className="my-auto flex flex-col items-center justify-center text-center space-y-7 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center space-y-2 mt-4"
          >
            <span className="font-mono text-[10px] tracking-[0.5em] text-neutral-400 uppercase">
              THE ART OF AIR-DRESSED
            </span>
            <motion.h1 
              initial={{ letterSpacing: "0.15em", opacity: 0 }}
              animate={{ letterSpacing: "0.26em", opacity: 1 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-light text-3xl md:text-5xl lg:text-6xl text-neutral-100 uppercase py-2 leading-tight"
            >
              AETHER「流萤」
            </motion.h1>
            <p className="font-sans font-light text-neutral-400 text-xs tracking-[0.1em] max-w-lg mt-4 leading-relaxed px-4">
              真丝纤维的月影微光，在140支极致超细莫代尔上流淌。无压，无重，无摩擦。触碰皮肤的那一刻，仿佛空气本身被赋予了形态。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.5 }}
            className="flex flex-col items-center space-y-8"
          >
            <button
              onClick={onExplore}
              className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-105 duration-300"
              id="cta-enter-atelier"
            >
              <div className="flex items-center space-x-2 border border-white/20 bg-white/[0.02] backdrop-blur-md px-6 py-2.5 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-500">
                <span className="font-sans text-[10px] tracking-[0.3em] text-white uppercase pl-1">
                  进入极简工坊 ATELIER / EXPLORE NOW
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-100 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </button>
          </motion.div>
        </div>

        {/* Bottom Prompter */}
        <div className="flex flex-col items-center space-y-2 opacity-50 animate-bounce cursor-pointer pointer-events-auto" onClick={() => {
          playClickSound();
          const targetEl = document.querySelector('[data-chamber="ambient"]');
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            window.scrollTo({ top: window.innerHeight * 0.95, behavior: 'smooth' });
          }
        }}>
          <span className="font-mono text-[8px] tracking-[0.3em] font-light">SCROLL TO EXPOSE PRECISION</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </div>
      </div>

      {/* Screen 2: Interactive Testing Chambers Timeline (Scroll Triggered) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sequential narrative chambers */}
          <div className="lg:col-span-7 space-y-48 lg:space-y-64 pb-32">
            
            {/* Chamber I */}
            <div 
              data-chamber="ambient"
              className="min-h-[45vh] flex flex-col justify-center space-y-6 border-t border-white/[0.05] pt-12 first:border-0 first:pt-0"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[9px] tracking-[0.4em] text-neutral-400 font-semibold">01 / AMBIENT CHAMBER</span>
                <span className="h-[1px] flex-1 bg-white/[0.05]" />
                <span className="font-mono text-[8px] px-2 py-0.5 rounded border border-neutral-500/30 text-neutral-400 bg-neutral-900/30">AMBIENT CALIB</span>
              </div>
              
              <h3 className="font-sans font-light text-xl md:text-2xl text-neutral-100 tracking-wider">
                恒温常压：0.12 微磨阻触觉标定
              </h3>
              
              <p className="font-sans font-light text-neutral-400 text-xs tracking-wide leading-relaxed">
                在最舒适的25°C标准常温实验室中，校准「流萤」基础皮肤阻尼。140支极致单丝熔纺莫代尔，配合真丝天然动物蛋白，在腹股沟及大腿内侧娇嫩肌群建立起极高敏、极软接触，多余空气经由纤维微孔高速流动。
              </p>

              {/* Unique Interactive Feature detail card 1 */}
              <div className="border border-white/5 rounded-lg p-4 bg-white/[0.01] backdrop-blur-sm space-y-3 text-left">
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest block">TECH FOCUS: MATERIAL EVOLUTION</span>
                <h4 className="font-sans font-light text-xs text-neutral-200">桑蚕丝与超细莫代尔高配融和</h4>
                <p className="font-sans font-light text-[11px] text-neutral-400 leading-relaxed">
                  保持生物级排汗速率（98.4%），亲和天然角质皮层。极佳的弱摩擦性能消除了一切起步跟腿张力，极尽柔和。
                </p>
                {/* Micro comparative gauge */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between font-mono text-[8px] text-neutral-500">
                    <span>FRICTION COMPARATIVE (COEFF)</span>
                    <span className="text-neutral-300">AETHER (0.12) vs PREMIUM SEAMLESS (0.48)</span>
                  </div>
                  <div className="h-1 bg-neutral-950 rounded overflow-hidden flex">
                    <div className="h-full bg-neutral-450" style={{ width: '25%' }} />
                    <div className="h-full bg-neutral-800" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chamber II */}
            <div 
              data-chamber="cryo"
              className="min-h-[45vh] flex flex-col justify-center space-y-6 border-t border-white/[0.05] pt-12"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[9px] tracking-[0.4em] text-cyan-400 font-semibold">02 / CRYOGENIC SYSTEM</span>
                <span className="h-[1px] flex-1 bg-cyan-950/20" />
                <span className="font-mono text-[8px] px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-950/25">CRYO ACTIVE</span>
              </div>
              
              <h3 className="font-sans font-light text-xl md:text-2xl text-cyan-100 tracking-wider">
                深冷分子：-196.2°C 液氮致密凝析
              </h3>
              
              <p className="font-sans font-light text-neutral-400 text-xs tracking-wide leading-relaxed">
                在液氮致冷极寒环境中，检测蚕丝超分子排布变性风险。人造化纤在极低温常缩变僵、产生钢硬异物感，而「流萤」三维精纺网格在零下依然保持顺滑弹性，其囊袋内部冷感空气对流通道畅通无阻。
              </p>

              {/* Unique Interactive Feature detail card 2 */}
              <div className="border border-cyan-500/10 rounded-lg p-4 bg-cyan-950/5 backdrop-blur-sm space-y-3 text-left">
                <span className="font-mono text-[8px] text-cyan-500 uppercase tracking-widest block">TECH FOCUS: ERGONOMIC CAVITY</span>
                <h4 className="font-sans font-light text-xs text-cyan-200">3D仿生 U-Chamber 独立避震落位</h4>
                <p className="font-sans font-light text-[11px] text-neutral-400 leading-relaxed">
                  提供器官饱满的托举容积与微量温控对流。独立区隔隔离热传导，确保私处时刻较核心肌层体温低 1.5°C 舒爽。
                </p>
                {/* Micro comparative gauge */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between font-mono text-[8px] text-cyan-500">
                    <span>THERMAL RETENTION INDEX</span>
                    <span className="text-cyan-300">ACTIVE COOLING (-1.5°C DIFFERENTIAL)</span>
                  </div>
                  <div className="h-1 bg-neutral-950 rounded overflow-hidden">
                    <div className="h-full bg-cyan-400 animate-pulse" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chamber III */}
            <div 
              data-chamber="vacuum"
              className="min-h-[45vh] flex flex-col justify-center space-y-6 border-t border-white/[0.05] pt-12"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[9px] tracking-[0.4em] text-amber-400 font-semibold">03 / VACUUM CHAMBER</span>
                <span className="h-[1px] flex-1 bg-amber-950/20" />
                <span className="font-mono text-[8px] px-2 py-0.5 rounded border border-amber-500/30 text-amber-400 bg-amber-950/25">VACUUM G0</span>
              </div>
              
              <h3 className="font-sans font-light text-xl md:text-2xl text-amber-100 tracking-wider">
                零重应力：三维悬浮无接触点包裹
              </h3>
              
              <p className="font-sans font-light text-neutral-400 text-xs tracking-wide leading-relaxed">
                模拟真空轨道条件，检验重力负累对皮肤的受力反馈。由于采用激光热无缝熔接线取代车缝，腰部与大腿边缘张力被绝对解构，蚕丝纤维在空气囊垫中呈微悬浮包覆状态，给您带来失重般的穿戴自由。
              </p>

              {/* Unique Interactive Feature detail card 3 */}
              <div className="border border-amber-500/10 rounded-lg p-4 bg-amber-950/5 backdrop-blur-sm space-y-3 text-left">
                <span className="font-mono text-[8px] text-amber-500 uppercase tracking-widest block">TECH FOCUS: THERMOPLASTIC BONDING</span>
                <h4 className="font-sans font-light text-xs text-amber-200">极窄无感激光热粘合封口</h4>
                <p className="font-sans font-light text-[11px] text-neutral-400 leading-relaxed">
                  点阵式高压热熔替代车缝线。历经数万次大幅度拉伸不变形，贴身处毫无硌物与压狠，极致消除机械勒褶。
                </p>
                {/* Micro comparative gauge */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between font-mono text-[8px] text-amber-500">
                    <span>PRESSURE POINTS METRIC</span>
                    <span className="text-amber-300">0.01 MPa MAXIMUM (PEAK FREE)</span>
                  </div>
                  <div className="h-1 bg-neutral-950 rounded overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chamber IV */}
            <div 
              data-chamber="stretch"
              className="min-h-[45vh] flex flex-col justify-center space-y-6 border-t border-white/[0.05] pt-12"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[9px] tracking-[0.4em] text-indigo-400 font-semibold">04 / HYPER STRETCH X</span>
                <span className="h-[1px] flex-1 bg-indigo-950/20" />
                <span className="font-mono text-[8px] px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-400 bg-indigo-950/25">FORCE MAXIMUM</span>
              </div>
              
              <h3 className="font-sans font-light text-xl md:text-2xl text-indigo-100 tracking-wider">
                超弹抗压：350% 极限物理弹性缓冲
              </h3>
              
              <p className="font-sans font-light text-neutral-400 text-xs tracking-wide leading-relaxed">
                在37°C高热体表面开展大腿及髋骨强收放极限。双向对冲交叠尼龙网膜可瞬间契合大块腰臀肌肉舒伸动作，不仅不易起褶走样，更可在数十万次磨折后维持最初的贴体剪裁骨架。
              </p>

              {/* Unique Interactive Feature detail card 4 */}
              <div className="border border-indigo-500/10 rounded-lg p-4 bg-indigo-950/5 backdrop-blur-sm space-y-3 text-left">
                <span className="font-mono text-[8px] text-indigo-500 uppercase tracking-widest block">TECH FOCUS: DOUBLE COMPRESSION</span>
                <h4 className="font-sans font-light text-xs text-indigo-200">2-Way 柔弹性多维度高拉载网络</h4>
                <p className="font-sans font-light text-[11px] text-neutral-400 leading-relaxed">
                  选用比一般运动聚酯拉力更长达3倍的莫代尔混拼记忆丝。全时包裹私密，随动作自发弹回，无任何夹裤与不服帖忧虑。
                </p>
                {/* Micro comparative gauge */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between font-mono text-[8px] text-indigo-500">
                    <span>ELASTIC STRAIN MEMORY</span>
                    <span className="text-indigo-300">100,000 CYCLES TEST OK</span>
                  </div>
                  <div className="h-1 bg-neutral-950 rounded overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Physics Testing Rig & Custom Colored Log Console */}
          {(() => {
            const modeThemes = {
              ambient: {
                border: 'border-neutral-800/80',
                bg: 'bg-neutral-900/30',
                text: 'text-neutral-400',
                accent: 'text-neutral-200',
                indicator: 'bg-neutral-400',
                glow: 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
                activeBorder: 'border-white/10'
              },
              cryo: {
                border: 'border-cyan-500/20',
                bg: 'bg-cyan-950/10',
                text: 'text-cyan-400',
                accent: 'text-cyan-200',
                indicator: 'bg-cyan-400',
                glow: 'shadow-[0_20px_50px_rgba(6,182,212,0.18)]',
                activeBorder: 'border-cyan-500/30'
              },
              vacuum: {
                border: 'border-amber-500/20',
                bg: 'bg-amber-950/10',
                text: 'text-amber-400',
                accent: 'text-amber-200',
                indicator: 'bg-amber-500',
                glow: 'shadow-[0_20px_50px_rgba(245,158,11,0.15)]',
                activeBorder: 'border-amber-500/30'
              },
              stretch: {
                border: 'border-indigo-500/20',
                bg: 'bg-indigo-950/10',
                text: 'text-indigo-400',
                accent: 'text-indigo-200',
                indicator: 'bg-indigo-500',
                glow: 'shadow-[0_20px_50px_rgba(99,102,241,0.18)]',
                activeBorder: 'border-indigo-500/30'
              }
            };
            const activeTheme = modeThemes[simulationMode] || modeThemes.ambient;

            return (
              <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit space-y-6 pointer-events-auto">
                <div className={`relative rounded-lg border p-6 backdrop-blur-md transition-all duration-700 ${activeTheme.border} ${activeTheme.bg} ${activeTheme.glow}`}>
                  
                  {/* Decorative hardware corner brackets */}
                  <div className={`absolute top-0 left-0 w-3 h-[1px] ${activeTheme.activeBorder}`} />
                  <div className={`absolute top-0 left-0 w-[1px] h-3 ${activeTheme.activeBorder}`} />
                  <div className={`absolute bottom-0 right-0 w-3 h-[1px] ${activeTheme.activeBorder}`} />
                  <div className={`absolute bottom-0 right-0 w-[1px] h-3 ${activeTheme.activeBorder}`} />

                  {/* Header lock index */}
                  <div className="flex justify-between items-center pb-3 mb-4 border-b border-white/[0.04]">
                    <div className="flex items-center space-x-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.indicator} animate-ping`} />
                      <span className="font-mono text-[8px] text-neutral-400 tracking-wider uppercase">
                        ATELIER RIG / 物理微观测定仪
                      </span>
                    </div>
                    <span className={`font-mono text-[7.5px] px-1.5 py-0.5 rounded border ${activeTheme.activeBorder} ${activeTheme.text} bg-black/40`}>
                      {telemetry.badge}
                    </span>
                  </div>

                  {/* 3D Render Canvas / Image Mockup */}
                  <div className="relative group overflow-hidden rounded border border-white/[0.08]" style={{ perspective: 1200 }}>
                    <motion.div
                      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const percentX = x / rect.width;
                        const percentY = y / rect.height;
                        const rotX = (0.5 - percentY) * 18;
                        const rotY = (percentX - 0.5) * 18;
                        setTilt({ x: rotX, y: rotY });
                        setShine({ x: percentX * 100, y: percentY * 100, opacity: 0.95 });
                      }}
                      onMouseLeave={() => {
                        setTilt({ x: 0, y: 0 });
                        setShine({ x: 50, y: 50, opacity: 0 });
                      }}
                      animate={{
                        rotateX: tilt.x,
                        rotateY: tilt.y,
                        y: simulationMode === 'vacuum' ? [0, -8, 0] : 0, // orbit floating effect
                        scale: simulationMode === 'stretch' ? [1, 1.025, 1] : 1, // mechanical tension contraction effect
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                      transition={
                        simulationMode === 'vacuum'
                          ? { y: { repeat: Infinity, duration: 6, ease: "easeInOut" } }
                          : simulationMode === 'stretch'
                            ? { scale: { repeat: Infinity, duration: 3, ease: "easeInOut" } }
                            : { type: "spring", stiffness: 140, damping: 18 }
                      }
                      className="relative w-full aspect-[4/3] overflow-hidden rounded bg-black/40"
                    >
                      <img
                        src={IMAGES.hero}
                        alt="Aether Luxury Boxer Brief Physical Testing"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                        referrerPolicy="no-referrer"
                      />

                      {/* Cryo Frosting Filter overlay */}
                      {simulationMode === 'cryo' && (
                        <div className="absolute inset-0 bg-cyan-900/10 mix-blend-color-burn z-15 pointer-events-none transition-opacity duration-700">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12),transparent_75%)] animate-pulse" />
                        </div>
                      )}

                      {/* Active laser scanner hotspots */}
                      <AnimatePresence>
                        {activeFeature === 'material' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 pointer-events-none"
                          >
                            <div className="absolute top-[35%] left-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                              <div className="w-10 h-10 border border-emerald-400 rounded-full animate-spin flex items-center justify-center">
                                <div className="w-6 h-6 border border-dashed border-emerald-400 rounded-full" />
                              </div>
                              <div className="w-1 h-1 bg-emerald-400 rounded-full absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
                              <div className="absolute top-12 left-6 bg-black/85 border border-white/10 px-2 py-0.5 rounded text-[7.5px] font-mono tracking-widest text-[#ffffff] whitespace-nowrap uppercase">
                                [ 140S / MULBERRY SILK WEAVE ] <span className="text-emerald-405">92.4% LOCK</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeFeature === 'cavity' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 pointer-events-none"
                          >
                            <div className="absolute top-[62%] left-[42%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                              <div className="w-12 h-12 border border-cyan-400/80 rounded-full flex items-center justify-center animate-pulse">
                                <div className="w-2.5 h-2.5 border border-cyan-400 rounded-full animate-ping" />
                              </div>
                              <div className="absolute -top-10 left-6 bg-black/85 border border-white/10 px-2 py-0.5 rounded text-[7.5px] font-mono tracking-widest text-[#ffffff] whitespace-nowrap uppercase">
                                [ U-CHAMBER SUSPENSION MESH ] <span className="text-cyan-450">COOLING ACTIVE</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeFeature === 'bonding' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-15 pointer-events-none"
                          >
                            <div className="absolute top-[75%] left-0 w-full h-[1.5px] bg-amber-400/60 shadow-[0_0_8px_#fbbf24] animate-bounce" />
                            <div className="absolute top-[78%] left-1/2 -translate-x-1/2 bg-black/85 border border-white/10 px-2 py-0.5 rounded text-[7.5px] font-mono tracking-widest text-[#ffffff] uppercase whitespace-nowrap">
                              [ FUSED SPOT INTERSECTION: PRESSURE-FREE ]
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Glow Sweep Reflection */}
                      <div 
                        style={{
                          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 65%)`,
                          opacity: shine.opacity,
                          transition: "opacity 0.25s ease",
                        }}
                        className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 opacity-50 pointer-events-none" />
                    </motion.div>
                  </div>

                  {/* Micro Telemetry Panel */}
                  <div className="mt-6 space-y-4 text-left">
                    {/* Readouts values column */}
                    <div className="grid grid-cols-3 gap-2 bg-[#060606]/85 p-3 rounded border border-white/[0.04]">
                      <div className="flex flex-col">
                        <span className="font-mono text-[7px] text-neutral-500 tracking-widest uppercase">CHAMBER TEMP</span>
                        <span className={`font-mono text-[11px] ${activeTheme.text} tracking-wider mt-0.5 font-medium transition-colors duration-500`}>
                          {telemetry.temp}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[7px] text-neutral-500 tracking-widest uppercase">DYNAMIC FREQ</span>
                        <span className={`font-mono text-[11px] ${activeTheme.text} tracking-wider mt-0.5 font-medium transition-colors duration-500`}>
                          {telemetry.vibration}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[7px] text-neutral-500 tracking-widest uppercase">STRESS INDEX</span>
                        <span className={`font-mono text-[11px] ${activeTheme.text} tracking-wider mt-0.5 font-medium transition-colors duration-500`}>
                          {telemetry.strain}
                        </span>
                      </div>
                    </div>

                    {/* Sys log ticker */}
                    <div className="text-[8px] font-mono text-neutral-400 tracking-normal text-left flex items-start space-x-1.5 leading-relaxed h-[24px]">
                      <span className={`${activeTheme.text} shrink-0 text-[8.5px] transition-colors duration-500 font-bold`}>{"$ [LOCK_LOG]:"}</span>
                      <span className="break-all opacity-85 text-neutral-300 transition-opacity duration-300 pl-0.5">{telemetry.desc}</span>
                    </div>
                  </div>

                </div>

                {/* Dispatch Button Callout Block */}
                <div className="border border-white/5 rounded-lg p-4 bg-white/[0.01] backdrop-blur-sm flex justify-between items-center pr-5">
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[7px] text-neutral-500 tracking-widest uppercase">STUDIO WORKSHOP ACCESS</span>
                    <span className="font-sans font-light text-[10px] text-neutral-300 mt-0.5">即刻登入极简工坊，触碰纯净新物。</span>
                  </div>
                  <button
                    onClick={onExplore}
                    className="flex items-center space-x-1.5 border border-white/20 bg-white/[0.03] px-4 py-1.5 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-350 font-mono text-[8px] tracking-widest text-white uppercase cursor-pointer"
                  >
                    <span>ENTER ATELIER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })()}

        </div>
      </div>

      {/* Screen 3: Subtle Newsletter Subscription Interaction Block */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 pb-32 pt-16 border-t border-white/[0.05]">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex flex-col items-center space-y-1">
            <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">AETHER BIWEEKLY INDEX</span>
            <h4 className="font-sans font-light text-base text-neutral-200 tracking-widest">
              订阅曜石实验室简报
            </h4>
            <p className="font-sans font-light text-[10px] text-neutral-500 tracking-wide max-w-md mt-1 leading-relaxed">
              率先获取极窄研发日志、新材料熔炼首发通知及雅致工坊配额指派。
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md relative flex flex-col items-center space-y-3">
            <div className="w-full relative flex items-center border border-white/10 hover:border-white/20 focus-within:border-white/50 bg-neutral-950/40 rounded transition-all duration-300">
              <input
                type="text"
                placeholder="EMAIL ADDRESS / 电子邮箱"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailStatus === 'error') {
                    setEmailStatus('idle');
                    setErrorMessage('');
                  }
                }}
                disabled={emailStatus === 'validating' || emailStatus === 'success'}
                className="w-full pl-4 pr-12 py-2.5 bg-transparent font-mono text-[9px] tracking-widest text-[#ffffff] placeholder-neutral-650 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={emailStatus === 'validating' || emailStatus === 'success'}
                className="absolute right-1 px-3 py-1 bg-white hover:bg-neutral-200 text-black font-sans font-medium text-[8px] tracking-widest rounded transition-all duration-300 uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {emailStatus === 'validating' ? '验证中' : emailStatus === 'success' ? '已订阅' : '提交 DISPATCH'}
              </button>
            </div>

            {/* Validation Feedback Messages */}
            <AnimatePresence mode="wait">
              {emailStatus === 'error' && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="font-sans text-[9px] text-[#ff4444] tracking-wide font-light"
                >
                  {errorMessage}
                </motion.span>
              )}
              {emailStatus === 'success' && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="font-sans text-[9px] text-emerald-400 tracking-wide font-light"
                >
                  订阅成功。您的工艺席位已录入曜石分发矩阵。
                </motion.span>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}

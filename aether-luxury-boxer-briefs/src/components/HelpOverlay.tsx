/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Shield, Scissors, Sparkles, Truck, CircleDot } from 'lucide-react';
import { playClickSound, playHapticFeedback } from '../utils/audio';

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  category: 'care' | 'sizing' | 'shipping';
  questionEn: string;
  questionZh: string;
  answerEn: string;
  answerZh: string;
}

export default function HelpOverlay({ isOpen, onClose }: HelpOverlayProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'care' | 'sizing' | 'shipping'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '全部问答', labelEn: 'ALL INQUIRIES' },
    { id: 'care', label: '材质护理', labelEn: 'FABRIC CARE', icon: Scissors },
    { id: 'sizing', label: '精细尺码', labelEn: 'FIT & SIZING', icon: Shield },
    { id: 'shipping', label: '安全递送', labelEn: 'DISPATCH', icon: Truck },
  ] as const;

  const faqs: FaqItem[] = [
    {
      id: 'care-1',
      category: 'care',
      questionEn: 'How should I care for Aether Silk garments?',
      questionZh: '如何悉心护理 AETHER 臻选桑蚕丝衣物？',
      answerEn: 'Our 100% mulberry silk uses raw protein fibers. We strongly recommend gentle hand washing with cold water (below 30°C) and neutral silk-specific detergents. Do not wring or twist; lay flat to dry in a shaded, well-ventilated space.',
      answerZh: '顶奢桑蚕丝富含天然活性蛋白质纤维。强烈建议使用弱酸性真丝专用洗涤剂，在30°C以下的冷水中轻柔手洗。不可绞拧，于阴凉通风处平铺自然晾干。'
    },
    {
      id: 'care-2',
      category: 'care',
      questionEn: 'Can the Superfine Micro-Modal be machine washed?',
      questionZh: '超细木代尔材质是否可以机洗？',
      answerEn: 'Yes, but always use a delicate laundry bag. Wash on a gentle, low-spin cycle with cool water, and avoid using softeners or bleach to preserve the extreme fine softness of the wood-derived cellulose.',
      answerZh: '可以，但请务必放入细网护衣袋中。选择超平缓轻柔机洗模式（低于30°C），并避免使用强效漂白剂或过度柔顺剂，以保护天然木精纤维的极致亲肤韧性。'
    },
    {
      id: 'care-3',
      category: 'care',
      questionEn: 'How do I iron or steam these technical fabrics?',
      questionZh: '这些高定及高弹性科技材质可以熨烫吗？',
      answerEn: 'For technical elastane, silk, and fused seams, please steam gently from a distance. If using a physical iron, use a low temperature setting (below 110°C) and place a press cloth between the iron and the fabric.',
      answerZh: '针对热融合无缝工艺与高弹科技纤维，建议使用悬挂蒸汽式熨烫机在稍远距离轻柔蒸汽服贴。若使用传统熨斗，请设置极低温（110°C以下）并垫布整烫。'
    },
    {
      id: 'sizing-1',
      category: 'sizing',
      questionEn: 'How do I determine my size on the Atelier page?',
      questionZh: '如何确定我在「雅致奢选」页面的最优尺码？',
      answerEn: 'Our systems feature real-time mathematical physical profile mapping. Simply enter your Height (cm) and Weight (kg) on the Atelier product view, and our custom fit algorithm will calculate your precise micro-fit profile (S, M, L, XL) instantly.',
      answerZh: '我们在奢选详情中集成了高度精准的身形量子计算测算系统。您只需输入您的身高(cm)及体重(kg)，系统即会结合面料拉伸弹性，瞬间运算并推荐出最适合您体态的专属尺码。'
    },
    {
      id: 'sizing-2',
      category: 'sizing',
      questionEn: 'Do Aether garments run true to size or run small?',
      questionZh: 'AETHER 的内著剪裁是偏大还是偏小？',
      answerEn: 'Aether items are engineered with high-precision ergonomic tailoring. Fabric stretch coefficients are dynamically adjusted, meaning the sizing profile fits true to your recommended physical calculations. If you prefer a loose relaxed sensation, size up.',
      answerZh: 'AETHER 采用人体工程学高保真3D剪裁。面料的高弹恢复率已被精确估算，因此推荐尺码与身体轮廓近乎完美贴合。如果您偏好较为轻盈放空的穿着体感，可微调选大一码。'
    },
    {
      id: 'shipping-1',
      category: 'shipping',
      questionEn: 'What is the signature Obsidian Magnetic Box packing?',
      questionZh: '曜石磁吸专属礼盒具备何种防御性能？',
      answerEn: 'All dispatches are encased inside our vacuum-sealed anti-static dust liner and nestled inside the heavy-stock, obsidian-inspired matte black storage box with double magnet closure, ensuring perfect, unblemished presentation.',
      answerZh: '所有衣物均采用无酸防潮纸与防静电真空袋贴服封装，随后置入配有重质高密度纸壳与双重磁吸设计的曜石纯黑硬质极简收纳箱中，确保物理防护与艺术美感。'
    },
    {
      id: 'shipping-2',
      category: 'shipping',
      questionEn: 'How fast will my Atelier dispatch arrive?',
      questionZh: '我购买的工艺单品多久可以配送到达？',
      answerEn: 'Following order allocation and high-protection vacuum unboxing testing (completed within 12-24 hours), your package ships with signature-required signature courier (SF Express Priority / DHL Express), arriving within 1-3 business days.',
      answerZh: '在物料指派与出厂高防测试（12-24小时内完成）后，物流将自动指派顺丰专送或DHL特快（需本人签收），全国主要都市群及港澳台地区预计在 1 至 3 个工作日送达。'
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleExpand = (id: string) => {
    playClickSound();
    playHapticFeedback();
    setExpandedId(expandedId === id ? null : id);
  };

  const handleClose = () => {
    playClickSound();
    playHapticFeedback();
    onClose();
  };

  const handleCategorySelect = (catId: 'all' | 'care' | 'sizing' | 'shipping') => {
    setActiveCategory(catId);
    setExpandedId(null);
    playClickSound();
    playHapticFeedback();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-4 md:inset-x-auto md:w-full md:max-w-3xl md:left-1/2 md:-translate-x-1/2 md:top-12 md:bottom-12 z-[201] bg-neutral-950/95 border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden text-neutral-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-black/30">
              <div className="flex items-center space-x-3 text-left">
                <div className="p-2 border border-white/10 rounded bg-white/[0.02]">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-neutral-500 tracking-[0.3em] uppercase block">AETHER ASSISTANCE / [ 工艺帮助中心 ]</span>
                  <h2 className="font-sans font-light text-base tracking-widest text-white mt-0.5">智库问答与精细指引</h2>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-1.5 border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
                aria-label="Close help options"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category selection */}
            <div className="px-6 py-4 border-b border-white/[0.04] bg-[#060606] flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = 'icon' in cat ? cat.icon : CircleDot;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3 py-1.5 rounded text-[8px] font-mono tracking-widest uppercase transition-all duration-300 flex items-center space-x-1.5 cursor-pointer border ${
                      isActive 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/[0.01] text-neutral-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-2.5 h-2.5" />
                    <span>{cat.labelEn}</span>
                    <span className="opacity-60 text-[7px] font-sans">({cat.label})</span>
                  </button>
                );
              })}
            </div>

            {/* Questions list */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedId === faq.id;
                  return (
                    <motion.div
                      key={faq.id}
                      layout="position"
                      className={`border rounded transition-all duration-300 ${
                        isExpanded ? 'border-white/20 bg-white/[0.02]' : 'border-white/[0.04] bg-white/[0.01] hover:border-white/10'
                      }`}
                    >
                      {/* Question button */}
                      <button
                        onClick={() => toggleExpand(faq.id)}
                        className="w-full text-left p-4 flex justify-between items-start space-x-4 cursor-pointer select-none"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[7px] text-neutral-500 scale-90 tracking-widest bg-white/5 border border-white/5 px-1 py-0.5 rounded leading-none">
                              {faq.category.toUpperCase()}
                            </span>
                            <span className="font-mono text-[9px] text-neutral-400 tracking-wider font-light uppercase hidden sm:inline">
                              {faq.questionEn}
                            </span>
                          </div>
                          <h4 className="font-sans font-light text-xs text-neutral-200 tracking-wide">
                            {faq.questionZh}
                          </h4>
                        </div>
                        <span className="text-neutral-500 font-mono text-[10px] select-none mt-1">
                          {isExpanded ? '[-]' : '[+]'}
                        </span>
                      </button>

                      {/* Expandable answer */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden border-t border-white/[0.04]"
                          >
                            <div className="p-4 bg-black/40 space-y-3 text-left">
                              <p className="font-sans font-light text-xs leading-relaxed text-neutral-300">
                                {faq.answerZh}
                              </p>
                              <div className="border-t border-dashed border-white/5 pt-2.5">
                                <p className="font-mono text-[8px] leading-relaxed text-neutral-500 tracking-wide uppercase font-light">
                                  Concierge Log: {faq.answerEn}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Concierge contact note */}
              <div className="mt-8 border border-white/[0.03] bg-white/[0.01] p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3 text-left">
                  <Sparkles className="w-4 h-4 text-neutral-400 hidden sm:block shrink-0" />
                  <div>
                    <h5 className="font-sans font-medium text-xs text-white">需要专属高定咨询？</h5>
                    <p className="font-sans font-light text-[9px] text-neutral-500 tracking-wide mt-0.5">Aether Atelier Concierge team is available 24/7 for tailored fits.</p>
                  </div>
                </div>
                <div className="font-mono text-[8px] text-neutral-300 border border-white/10 px-2.5 py-1 rounded tracking-widest bg-white/5 uppercase">
                  CONCIERGE@AETHER.LAB
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.05] bg-black/60 flex flex-col sm:flex-row justify-between items-center gap-2 select-none">
              <span className="font-mono text-[7px] text-neutral-600 tracking-[0.25em]">
                AETHER SECURITY CRYPTOGRAPHY 1.0.8
              </span>
              <span className="font-mono text-[7px] text-neutral-500 tracking-[0.2em] flex items-center gap-1.5">
                <CircleDot className="w-1.5 h-1.5 text-white/40 animate-pulse" />
                SYSTEM SECURED & LAB VERIFIED
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

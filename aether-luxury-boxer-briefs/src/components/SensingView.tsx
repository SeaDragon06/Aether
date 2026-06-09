/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, Wind, Layers, Compass, Thermometer } from 'lucide-react';
import { SENSORY_LAB_DATA, IMAGES } from '../data';
import { CartItem } from './InteractiveTrunk';

interface SensingViewProps {
  cartItems?: CartItem[];
  onExplore?: () => void;
}

// Map chosen fabric and tone details to high precision photos
export function getCartItemImage(name: string, color: string): string {
  const normName = name.toLowerCase();
  const normColor = color.toLowerCase();
  
  if (normName.includes('极光') || normName.includes('silk')) {
    if (normColor.includes('曜石') || normColor.includes('obsidian')) return IMAGES.model1;
    if (normColor.includes('陨铁') || normColor.includes('steel')) return IMAGES.silkGrey;
    if (normColor.includes('海') || normColor.includes('indigo') || normColor.includes('blue')) return IMAGES.silkBlue;
    return IMAGES.model1;
  }
  
  if (normName.includes('无缝') || normName.includes('seamless')) {
    if (normColor.includes('曜石') || normColor.includes('obsidian') || normColor.includes('black')) return IMAGES.seamlessBlack;
    if (normColor.includes('雪花') || normColor.includes('alabaster') || normColor.includes('white')) return IMAGES.modelWhite;
    return IMAGES.model2;
  }
  
  if (normName.includes('防辐射') || normName.includes('silver') || normName.includes('银网')) {
    if (normColor.includes('曜石') || normColor.includes('obsidian') || normColor.includes('black')) return IMAGES.silverBlack;
    return IMAGES.model3;
  }
  
  return IMAGES.giftBox; // Luxurious magnetic box fallback
}

export default function SensingView({ cartItems = [], onExplore }: SensingViewProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = SENSORY_LAB_DATA.packagingSteps;
  const currentStep = steps[activeStep];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-28 pb-16 px-6 md:px-12 lg:px-24 flex flex-col justify-center items-center select-none overflow-hidden">
      
      {/* Dynamic Title */}
      <div className="w-full max-w-7xl flex flex-col items-start mb-12">
        <span className="font-mono text-[8px] tracking-[0.4em] text-neutral-500 uppercase">
          Chapter 05 / Sensory Ecology Research
        </span>
        <h2 className="font-sans font-light text-2xl tracking-[0.2em] text-white uppercase mt-2">
          SENSORY & RITUAL 感官洗礼
        </h2>
        <div className="w-24 h-[1px] bg-white/10 mt-4" />
      </div>



      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left Side: Sensory Stats & Scientific diagnostics (Breathability chart & Skin friction indicators) */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-between border border-white/[0.04] bg-neutral-900/10 rounded-lg p-6 relative">
          
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[8px] text-neutral-500 tracking-[0.3em] uppercase">
                DIAGNOSTIC 01 / Breathability Index (%)
              </span>
              <span className="font-mono text-[7px] text-neutral-400">UNIT: VAPOR VOLUME cc/m²</span>
            </div>

            {/* Custom SVG/HTML Bar Chart for breathability index comparison */}
            <div className="space-y-3.5 pt-2">
              {SENSORY_LAB_DATA.breathability.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between font-mono text-[8.5px] text-neutral-400">
                    <span className="tracking-wide font-light">{item.name}</span>
                    <span className="text-white font-medium">{item.value}%</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-white/[0.02]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.2, delay: index * 0.1 }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnostic 02: Skin friction comparative list */}
            <div className="pt-6 border-t border-white/[0.04] space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-[8px] text-neutral-500 tracking-[0.3em] uppercase">
                  DIAGNOSTIC 02 / Epidermis Friction Coefficient (μ)
                </span>
                <span className="font-mono text-[7px] text-neutral-400">LOWER IS SMOOTHER</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {SENSORY_LAB_DATA.friction.map((f, i) => (
                  <div key={i} className="bg-white/[0.01] border border-white/[0.04] p-3 rounded flex flex-col justify-between text-left">
                    <span className="font-sans text-[9px] text-neutral-400 font-light leading-none">{f.name}</span>
                    <div className="mt-4">
                      <span className="font-mono text-[14px] text-white font-light leading-none">
                        {f.value}
                      </span>
                      <p className="font-sans text-neutral-500 text-[7px] tracking-wide mt-1.5 leading-relaxed">
                        {f.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Micro environmental disclaimer */}
          <div className="mt-8 pt-4 border-t border-white/[0.03] flex items-center space-x-2 text-neutral-500 text-[7.5px] tracking-wider leading-relaxed text-left">
            <Compass className="w-3 h-3 text-neutral-600 shrink-0" />
            <span>
              数据出自 AETHER 生态微生态模拟实验室。基于环境温度 24℃、湿度 55%RH 状态下与市售10款普通贴身衣物多轮对标测试均值所得。部分受测个体可能会有个别差异。
            </span>
          </div>

        </div>

        {/* Right Side: Unpacking ritual visualizer & Wash maintenance instructions */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* Unpacking Step card */}
          <div className="border border-white/[0.04] bg-neutral-900/10 rounded-lg p-6 text-left flex flex-col justify-between">
            
            <div className="flex justify-between items-baseline pb-4 border-b border-white/[0.04]">
              <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">
                02 / UNBOXING RITUAL 开启开箱礼序
              </span>
              <div className="flex space-x-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      activeStep === i ? 'bg-white scale-125' : 'bg-white/20 hover:bg-white/50'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="py-6 flex flex-col space-y-4"
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                    {currentStep.step}
                  </span>
                  <span className="font-mono text-[7px] text-white/40 tracking-widest">
                    AETHER CRITICAL PACK
                  </span>
                </div>

                <h3 className="font-sans font-light text-base md:text-lg text-white tracking-widest">
                  {currentStep.title}
                </h3>

                <p className="font-sans font-light text-neutral-400 text-xs tracking-wider leading-relaxed">
                  {currentStep.desc}
                </p>

                {/* Immersive high fidelity photography for unboxing step */}
                <div className="relative w-full aspect-[21/10] sm:aspect-[21/9] rounded border border-white/[0.08] bg-neutral-950 mt-4 overflow-hidden flex items-center justify-center group flex-col">
                  {/* Image background with modern smooth transitions */}
                  <div className="absolute inset-0">
                    <img
                      src={activeStep === 0 ? IMAGES.giftBox : activeStep === 1 ? IMAGES.detail : IMAGES.colors}
                      alt={currentStep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover brightness-[0.7] group-hover:scale-102 transition-transform duration-700 select-none pointer-events-none"
                    />
                  </div>
                  
                  {/* High precision tech grid & aesthetic dark wash overlay */}
                  <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[0.5px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/45 pointer-events-none" />

                  {/* Scientific metadata specs overlays inside the box photo */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/5 text-[6.5px] font-mono tracking-[0.2em] text-neutral-300 uppercase select-none">
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    <span>AETHER LAB // REALTIME UNBOXING SPEC 0{activeStep + 1}</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[7px] font-mono tracking-widest text-neutral-400 uppercase select-none">
                    {activeStep === 0 ? 'MATTE OBSIDIAN METALLIC DRAWER CASE' : activeStep === 1 ? 'SEAMLESS NITROGEN SEAL' : 'COBALT COLD PINE AROMATIC CARD'}
                  </div>

                  {/* Transparent Glassmorphism Overlay badge to emphasize tech precision */}
                  <div className="relative z-10 py-1.5 px-3.5 bg-black/50 backdrop-blur-md border border-white/10 rounded text-[9px] font-sans font-light text-white tracking-widest uppercase select-none">
                    {activeStep === 0 && "MAGNET CLOSED 双面手工压纹"}
                    {activeStep === 1 && "VACUUM NITROGEN SHIELD 医用硫酸防潮纸"}
                    {activeStep === 2 && "WOOD COLD PINE RESIN 特调沙龙固态松香"}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Wash Maintenance instructions */}
          <div className="border border-white/[0.04] bg-neutral-900/10 rounded-lg p-6 text-left">
            <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase block mb-3.5">
              03 / LUXURY CARE MANUAL 低温温柔洗涤指南
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <span className="font-mono text-[8s] text-neutral-400 font-medium tracking-wide">30℃ 水温</span>
                <p className="text-neutral-500 text-[8px] leading-relaxed">
                  水温不可高于 30 摄氏度。建议放入细密网孔洗涤袋。选择温柔模式，防止真丝纤维发生表面起毛或勾丝断弦。
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[8s] text-neutral-400 font-medium tracking-wide">忌高浓度氯</span>
                <p className="text-neutral-500 text-[8px] leading-relaxed">
                  切勿使用高浓度漂白剂或含氯洗衣粉，避免破坏动物蚕丝蛋白的健康微表面，造成弹性纤维分子脆化断开。
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[8s] text-neutral-400 font-medium tracking-wide">自然平铺网晾</span>
                <p className="text-neutral-500 text-[8px] leading-relaxed">
                  不可大力扭绞或干衣机离心烘干。建议将裤身平铺在阴凉、通风网格网架上自然风干，避免强光烈日长曝。
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[8s] text-neutral-400 font-medium tracking-wide">低温抗皱熨制</span>
                <p className="text-neutral-500 text-[8px] leading-relaxed">
                  如有微皱需熨。应使用低温档（≤110℃ 蒸汽档）在内侧进行隔布喷汽熨平，确保热融合无车线边缘受热均匀。
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

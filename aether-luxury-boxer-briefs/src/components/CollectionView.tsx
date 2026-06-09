/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Shield, Gift, RefreshCcw } from 'lucide-react';
import { MODELS, COLOR_PALETTE, IMAGES } from '../data';
import { ProductModel } from '../types';
import { playClickSound, playSwitchSound, playHapticFeedback } from '../utils/audio';

interface CollectionProps {
  onAddToCart: (item: {
    model: ProductModel;
    color: string;
    size: string;
    isPack: boolean;
    quantity: number;
    price: number;
  }) => void;
}

export default function CollectionView({ onAddToCart }: CollectionProps) {
  const [selectedModel, setSelectedModel] = useState<ProductModel>(MODELS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isPack, setIsPack] = useState<boolean>(true); // Default to premium 3-pack
  const [quantity, setQuantity] = useState<number>(1);
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(70);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Dynamic size logic
  const calculateSize = (h: number, w: number): { size: string; waist: string; text: string } => {
    const bmi = w / ((h / 100) * (h / 100));
    if (w < 60) {
      return { size: 'S', waist: '2.0尺 - 2.2尺 (68cm-74cm)', text: '微弹塑合，极高贴肤感' };
    } else if (w >= 60 && w < 73) {
      return { size: 'M', waist: '2.2尺 - 2.4尺 (74cm-100cm)', text: '舒展舒压，黄金比例贴身贴合' };
    } else if (w >= 73 && w < 84) {
      return { size: 'L', waist: '2.4尺 - 2.6尺 (80cm-86cm)', text: '宽松零触感，无侧缝不卡裆' };
    } else if (w >= 84 && w < 92) {
      return { size: 'XL', waist: '2.6尺 - 2.8尺 (86cm-92cm)', text: '抗重力分区承托，腿部肌肉不紧绷' };
    } else {
      return { size: 'XXL', waist: '2.8尺 - 3.1尺 (92cm-102cm)', text: '极高拉伸复位力，抗褶皱大围腰' };
    }
  };

  const calculatedFit = calculateSize(height, weight);

  const basePriceNum = parseInt(selectedModel.price.replace(/[^\d]/g, ''));
  const finalSinglePrice = isPack ? Math.round(basePriceNum * 3 * 0.82) : basePriceNum; // 3-pack gets 18% off
  const totalPrice = finalSinglePrice * quantity;

  // Change model handler
  const handleModelChange = (model: ProductModel) => {
    setSelectedModel(model);
    playSwitchSound();
    playHapticFeedback();
    // Auto sync selected color if previous isn't supported in new model
    const isColorAvailable = model.colors.some(c => c.id === selectedColor.id);
    if (!isColorAvailable) {
      const matchColor = COLOR_PALETTE.find(c => c.id === model.colors[0].id);
      if (matchColor) setSelectedColor(matchColor);
    }
  };

  // Find color specific image (Underwear Models are visually distinct and color accurate)
  const getUnderwearImage = (modelId: string, colorId: string) => {
    if (modelId === 'air-silk') {
      if (colorId === 'obsidian') return IMAGES.model1; // obsidian silk
      if (colorId === 'steel') return IMAGES.silkGrey; // steel grey silk
      if (colorId === 'indigo') return IMAGES.silkBlue; // abyssal blue silk
    } else if (modelId === 'seamless-tech') {
      if (colorId === 'obsidian') return IMAGES.seamlessBlack; // seamless black
      if (colorId === 'steel') return IMAGES.model2; // seamless grey
      if (colorId === 'alabaster') return IMAGES.modelWhite; // seamless white
    } else if (modelId === 'silver-mesh') {
      if (colorId === 'obsidian') return IMAGES.silverBlack; // silver black
      if (colorId === 'indigo') return IMAGES.model3; // silver blue
    }
    return IMAGES.model1;
  };

  // Switch direct focus to the active underwear slide when color changes
  const handleColorChange = (color: typeof COLOR_PALETTE[0]) => {
    setSelectedColor(color);
    playClickSound();
    playHapticFeedback();
  };

  // Switch direct focus when pack type changes
  const handlePackChange = (pack: boolean) => {
    setIsPack(pack);
    playSwitchSound();
    playHapticFeedback();
  };

  const handleAdd = () => {
    if (isAdding) return;
    setIsAdding(true);
    playClickSound();
    playHapticFeedback();
    
    setTimeout(() => {
      onAddToCart({
        model: selectedModel,
        color: selectedColor.name,
        size: calculatedFit.size,
        isPack,
        quantity,
        price: finalSinglePrice
      });
      setIsAdding(false);
    }, 1200);
  };

  // Get active underwear image
  const activeUnderwearUrl = getUnderwearImage(selectedModel.id, selectedColor.id);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-28 pb-16 px-6 md:px-12 lg:px-24 flex flex-col justify-center items-center select-none overflow-hidden">
      
      {/* Immersive Title */}
      <div className="w-full max-w-7xl flex flex-col items-start mb-12">
        <span className="font-mono text-[8px] tracking-[0.4em] text-neutral-500 uppercase">
          Chapter 04 / Aether Bespoke Atelier
        </span>
        <h2 className="font-sans font-light text-2xl tracking-[0.16em] text-white uppercase mt-2">
          ATELIER COLLECTION 雅致奢选
        </h2>
        <div className="w-24 h-[1px] bg-white/10 mt-4" />
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Section: Immersive Studio display image of products */}
        <div className="col-span-1 lg:col-span-5 flex flex-col space-y-6">
          
          {/* Main Underwear Model Fit Card */}
          <div className="w-full border border-white/[0.04] bg-neutral-900/10 rounded-lg p-5 flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-neutral-500 font-mono text-[7px] tracking-widest uppercase mb-4">
              <span>DESIGN STYLE / 款式实拍</span>
              <span className="text-white border border-white/10 bg-white/[0.05] px-2 py-0.5 rounded text-[6px]">
                {selectedModel.name.split('「')[1].replace('」', '')}
              </span>
            </div>

            {/* Pristine Style Image - completely unobstructed, NO arrows, NO dots, NO black float overlays */}
            <div className="relative w-full aspect-[4/3] rounded overflow-hidden shadow-2xl border border-white/[0.06]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedModel.id + '_' + selectedColor.id}
                  src={activeUnderwearUrl}
                  alt={`${selectedModel.name} - ${selectedColor.name}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Seamless automated stock request feedback overlay */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        className="w-10 h-10 rounded-full border border-neutral-800 border-t-white"
                      />
                      <span className="absolute font-mono text-[9px] text-white/50 tracking-widest">A</span>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <span className="font-mono text-[8px] text-neutral-400 tracking-[0.3em] uppercase">SYSTEM DISPATCHING...</span>
                      <span className="font-sans text-[10px] text-white tracking-widest font-light">智能原厂库存配给中</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Caption outside of the image container to prevent blocking */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mt-3.5 flex justify-between items-center select-none pl-0.5"
            >
              <span className="text-neutral-300 font-sans text-[10px] tracking-wide uppercase font-light">
                {selectedModel.name} <span className="text-neutral-500">在人体的实物着装呈现</span>
              </span>
              <span className="font-mono text-[9px] text-white tracking-widest bg-white/[0.08] px-2.5 py-0.5 rounded flex items-center justify-center">
                {selectedColor.name}
              </span>
            </motion.div>
          </div>

          {/* Premium Gift Box Packaging Card */}
          <div className="w-full border border-white/[0.04] bg-neutral-900/10 rounded-lg p-5 flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-neutral-500 font-mono text-[7px] tracking-widest uppercase mb-4">
              <span>LUXURY PACKAGING / 奢华礼赠展示</span>
              <span className="text-neutral-400 font-mono text-[6px]">AETHER BOX</span>
            </div>

            {/* Pristine Packaging Image - completely unobstructed, NO black shading blocks */}
            <div className="relative w-full aspect-[4/3] rounded overflow-hidden shadow-2xl border border-white/[0.06]">
              <img
                src={IMAGES.giftBox}
                alt="Aether High-end Gift Packaging Magnet Box"
                className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Caption outside of the image container to keep it perfectly clean */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mt-3.5 pl-0.5 select-none text-left"
            >
              <p className="text-neutral-300 font-sans text-[10px] tracking-wide font-light">
                【AETHER 曜石定制磁吸礼盒】双面手工高级压纹，触感舒适，配精美冷松香气。
              </p>
            </motion.div>
          </div>

          {/* Micro value props listed cleanly below */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-3.5 px-1 py-1 text-left"
          >
            <div className="flex items-start space-x-3 text-neutral-400 text-[10px] tracking-wide">
              <Gift className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
              <p className="font-light leading-relaxed">
                <span className="text-white font-medium">【高端礼赠包装】</span>配以原厂奢华双面压纹磁吸盒，真空包裹，附带“冷松木香”香氛卡，赠礼或独自开启均享仪式感。
              </p>
            </div>

            <div className="flex items-start space-x-3 text-neutral-400 text-[10px] tracking-wide">
              <Shield className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
              <p className="font-light leading-relaxed">
                <span className="text-white font-medium">【终身弹力保养保障】</span>自售出起 365 天内，若出现非洗折导致的腰封断裂或松退，支持免费一对一置换新裤。
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right Section: Customized Atelier Dashboard */}
        <div className="col-span-1 lg:col-span-7 space-y-8 text-left">
          
          {/* Selector 1: Model Choice in premium cards */}
          <div className="space-y-3 text-left">
            <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">
              01 / SELECT TEXTURE CLASSIFICATION 选定面料分类
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {MODELS.map((model) => {
                const isActive = selectedModel.id === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model)}
                    className={`p-4 border rounded text-left cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                      isActive
                        ? 'border-white bg-white/[0.03] shadow-[0_0_8px_rgba(255,255,255,0.06)]'
                        : 'border-white/10 hover:border-white/30 hover:bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className={`font-sans text-[11px] tracking-wider transition-colors ${isActive ? 'text-white font-medium' : 'text-neutral-400'}`}>
                        {model.name}
                      </span>
                      <span className="font-mono text-[7px] text-neutral-500 mt-0.5 uppercase tracking-widest leading-none">
                        {model.nameEn.split(' ')[1]} Weave
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-white mt-4 font-light">
                      {model.price} <span className="text-[8px] text-neutral-500">/ 件</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="font-sans text-neutral-400 text-[10px] tracking-wide leading-relaxed pl-1 pt-1 italic font-light">
              "{selectedModel.tagline}"
            </p>
          </div>

          {/* Selector 2: Dynamic Colors in high contrast round pins */}
          <div className="space-y-3 text-left">
            <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">
              02 / CHOOSE EXQUISITE COLOR 臻选矿物色系
            </span>
            <div className="flex items-center space-x-6 pl-1">
              <div className="flex space-x-4">
                {COLOR_PALETTE.map((color) => {
                  // Only render if color is supported in selectedModel
                  const isSupported = selectedModel.colors.some(c => c.id === color.id);
                  if (!isSupported) return null;

                  const isActive = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-5 h-5 rounded-full border cursor-pointer relative shadow-md transition-all duration-300 hover:scale-110 ${
                        isActive ? 'border-white scale-110 shadow-[0_0_6px_rgba(255,255,255,0.5)]' : 'border-white/10'
                      }`}
                      aria-label={`Select ${color.name} color`}
                    >
                      {isActive && (
                        <span className="absolute -inset-1.5 rounded-full border border-white/60 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col border-l border-white/15 pl-6">
                <span className="font-sans text-[10px] text-white tracking-widest uppercase leading-none">
                  {selectedColor.name} <span className="font-mono text-[8.5px] text-neutral-400">({selectedColor.nameEn})</span>
                </span>
                <span className="font-sans text-[8px] text-neutral-500 tracking-wide mt-1 leading-normal max-w-sm">
                  {selectedColor.description || '极深沉静的雅致色系，与贴体质感相宜。'}
                </span>
              </div>
            </div>
          </div>

          {/* Selector 3: Premium Sizing Smart Calculator (Highly satisfying interactive Sliders) */}
          <div className="space-y-4 text-left border-y border-white/[0.04] py-6">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">
                03 / ATELIER SMART SIZE CALCULATOR 智能尺码模拟器
              </span>
              <div className="flex items-center space-x-1.5 border border-white/10 px-2.5 py-0.5 rounded bg-black">
                <span className="font-mono text-[8px] text-white">WAISTLINE SUGGESTION:</span>
                <span className="font-mono text-[9px] text-white font-medium tracking-wide">
                  {calculatedFit.size} CODE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Height Slider */}
              <div className="space-y-2 flex flex-col justify-center">
                <div className="flex justify-between font-mono text-[8px] tracking-wide text-neutral-400">
                  <span>HEIGHT 身高</span>
                  <span className="text-white text-[10px] font-medium">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="195"
                  value={height}
                  onChange={(e) => {
                    setHeight(Number(e.target.value));
                    playHapticFeedback();
                  }}
                  className="w-full accent-white bg-neutral-800 h-1 rounded overflow-hidden cursor-pointer"
                  style={{ direction: 'ltr' }}
                />
              </div>

              {/* Weight Slider */}
              <div className="space-y-2 flex flex-col justify-center">
                <div className="flex justify-between font-mono text-[8px] tracking-wide text-neutral-400">
                  <span>WEIGHT 体重</span>
                  <span className="text-white text-[10px] font-medium">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="105"
                  value={weight}
                  onChange={(e) => {
                    setWeight(Number(e.target.value));
                    playHapticFeedback();
                  }}
                  className="w-full accent-white bg-neutral-800 h-1 rounded overflow-hidden cursor-pointer"
                  style={{ direction: 'ltr' }}
                />
              </div>
            </div>

            {/* Smart Advice Box */}
            <div className="bg-white/[0.01] border border-white/[0.04] rounded p-4 flex justify-between items-center">
              <div className="flex flex-col space-y-1">
                <span className="font-mono text-[7px] text-neutral-500 tracking-widest uppercase">
                  MATCHING WAIST & DENSITY / 建议规格与围度
                </span>
                <span className="font-sans text-[11px] text-neutral-200 tracking-wide font-light">
                  腰围匹配范围：{calculatedFit.waist}
                </span>
                <p className="font-sans text-neutral-500 text-[9px] tracking-wide font-light">
                  触感：{calculatedFit.text}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center h-12 w-12 rounded border border-white/10 bg-black/60 relative">
                <span className="font-sans text-xs text-white font-medium">{calculatedFit.size}</span>
                <span className="font-mono text-[5px] text-neutral-500 absolute bottom-1 tracking-widest">SIZE</span>
              </div>
            </div>
          </div>

          {/* Selector 4: Pack Option & Quantity & Buy */}
          <div className="space-y-6 text-left">
            <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">
              04 / PACKAGE SPECIFICATION & QUANTITY 包装参数与尊享数量
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Single vs 3-Pack */}
              <button
                onClick={() => handlePackChange(false)}
                className={`p-4 border rounded text-left cursor-pointer transition-all duration-300 relative ${
                  !isPack 
                    ? 'border-white bg-white/[0.03]' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] tracking-wider text-white">
                    雅致单件装 (Single piece)
                  </span>
                  <span className="font-mono text-[8px] text-neutral-500 tracking-widest mt-0.5 uppercase">
                    Original packaging feel
                  </span>
                </div>
                <span className="font-mono text-[11px] text-neutral-300 mt-4 block">
                  {selectedModel.price}
                </span>
              </button>

              <button
                onClick={() => handlePackChange(true)}
                className={`p-4 border rounded text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  isPack 
                    ? 'border-white bg-white/[0.03] shadow-[0_0_12px_rgba(255,255,255,0.06)]' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* 3-Pack Special Flag */}
                <div className="absolute top-0 right-0 bg-neutral-200 text-neutral-950 font-mono text-[6px] px-2 py-0.5 tracking-widest uppercase font-semibold">
                  18% OFF / 推荐礼盒
                </div>
                
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] tracking-wider text-white flex items-center space-x-1.5">
                    <span>臻奢3件礼享装 (3-Piece Gift Set)</span>
                  </span>
                  <span className="font-mono text-[8px] text-neutral-500 tracking-widest mt-0.5 uppercase">
                    3 Boxer Briefs in Obsidian magnetic box
                  </span>
                </div>
                <span className="font-mono text-[11px] text-white mt-4 block">
                  ¥ {finalSinglePrice} <span className="text-[8px] text-neutral-400 line-through">¥ {basePriceNum * 3}</span>
                </span>
              </button>
            </div>

            {/* Quantity Selector and Total Order checkout block */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-between border-t border-white/[0.04] pt-6">
              
              <div className="flex items-center space-x-4">
                <span className="font-mono text-[8.5px] text-neutral-500 uppercase tracking-widest">
                  QUANTITY 数量 :
                </span>
                <div className="flex items-center border border-white/10 rounded overflow-hidden">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1 font-mono hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 font-mono text-xs">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1 font-mono hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total checkout drawer */}
              <div className="flex items-end space-x-6">
                <div className="flex flex-col text-right">
                  <span className="font-mono text-[7px] text-neutral-500 tracking-widest">TOTAL VALUE 合计：</span>
                  <span className="font-mono text-[20px] text-white font-light leading-none mt-1">
                    ¥ {totalPrice}
                  </span>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isAdding}
                  className={`group relative cursor-pointer px-8 py-3 rounded text-[10px] tracking-[0.25em] font-medium transition-all duration-300 uppercase flex items-center space-x-2 ${
                    isAdding
                      ? 'bg-neutral-800 text-neutral-500 border border-white/5 cursor-not-allowed shadow-none'
                      : 'bg-neutral-100 hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] text-black'
                  }`}
                  id="checkout-add-to-cart"
                >
                  {isAdding ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-600 border-t-neutral-300 animate-spin mr-1.5" />
                      <span>正在调度 DISPATCHING...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-black" />
                      <span className="pl-1">加入臻选箱 ADD TO TRUNK</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

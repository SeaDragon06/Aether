/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShieldAlert, Check } from 'lucide-react';
import { useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  color: string;
  size: string;
  isPack: boolean;
  quantity: number;
  price: number;
}

interface TrunkProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  activePage?: string;
}

export default function InteractiveTrunk({ isOpen, onClose, cartItems, onRemoveItem, onClearCart, activePage }: TrunkProps) {
  const [checkedOut, setCheckedOut] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckedOut(true);
      setTimeout(() => {
        onClearCart();
        setCheckedOut(false);
        onClose();
      }, 3500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          {activePage !== 'sensing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
          )}

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[460px] bg-neutral-950 border-l border-white/[0.08] text-white z-[60] flex flex-col justify-between shadow-2xl p-6 select-none"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-5 border-b border-white/[0.08]">
              <div className="flex flex-col text-left">
                <span className="font-sans text-xs tracking-[0.3em] font-semibold text-white">
                  AETHER TRUNK
                </span>
                <span className="font-mono text-[7px] text-neutral-500 tracking-[0.2em] uppercase mt-0.5">
                  SELECTED ATELIER TRUNK BAG
                </span>
              </div>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-white/5 rounded-full border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main content body */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {isCheckingOut ? (
                /* Premium skeleton spinning dial loader */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-5 px-6"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      className="w-14 h-14 rounded-full border border-neutral-800 border-t-white"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 absolute rounded-full border border-neutral-900 border-b-neutral-400"
                    />
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <span className="font-mono text-[8px] text-neutral-500 tracking-[0.4em] uppercase">SYSTEM CRYPTO LOCKING</span>
                    <h3 className="font-sans font-light text-xs text-neutral-300">
                      正在分配曜石磁吸专箱并建立高防封装通道...
                    </h3>
                    <p className="font-sans font-light text-[8px] text-neutral-500 tracking-wider">
                      LATENCY: 12ms // ALLOTING UNIQUE ID
                    </p>
                  </div>
                </motion.div>
              ) : checkedOut ? (
                /* Success view simulation */
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 px-6"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 mb-2">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="font-sans text-xs tracking-[0.3em] text-white uppercase">
                    ATELIER BOX COMMITTED
                  </span>
                  <h3 className="font-sans font-light text-base text-neutral-300">
                    工艺箱包预定成功
                  </h3>
                  <p className="font-sans font-light text-[10px] text-neutral-500 tracking-wide leading-relaxed max-w-sm">
                    已为您在 Aether 浦东原厂智能调取库存。我们将通过防静电真空密封装配曜石磁吸手提盒，搭配您的专属香氛，预计于 24 小时内发出。请耐心等待。
                  </p>
                </motion.div>
              ) : cartItems.length === 0 ? (
                /* Empty view */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-55">
                  <span className="font-sans text-xs tracking-widest text-neutral-400">TRUNK IS VACANT</span>
                  <p className="font-sans text-[10px] text-neutral-500 tracking-wider">
                    奢选箱目前为空。
                  </p>
                </div>
              ) : (
                /* Listed items */
                <div className="space-y-4 text-left">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="border border-white/[0.05] bg-white/[0.01] p-4 rounded flex items-start justify-between space-x-4 relative"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-sans text-[11.5px] font-medium tracking-wide text-white">
                            {item.name}
                          </h4>
                          <span className="font-mono text-xs text-white">
                            ¥ {item.price * item.quantity}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[7.5px] tracking-widest text-neutral-300">
                            SIZE: {item.size}
                          </span>
                          <span className="font-sans px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[7.5px] tracking-wide text-neutral-300">
                            COLOR: {item.color}
                          </span>
                          <span className="font-sans px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[7.5px] tracking-wide text-neutral-300">
                            {item.isPack ? '臻奢3件礼盒装' : '单件装'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/[0.03]">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                            MULTIPLIER 数量 / [ {item.quantity} 件 ]
                          </span>

                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="flex items-center space-x-1.5 hover:text-red-400 text-neutral-500 transition-colors cursor-pointer"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="font-mono text-[7px] tracking-widest uppercase">REMOVE</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom calculation & checkout frame */}
            {!checkedOut && cartItems.length > 0 && (
              <div className="border-t border-white/[0.08] pt-5 space-y-4 text-left">
                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-[9px] text-neutral-400 tracking-widest uppercase">
                    SUBTOTAL / 预订金总计
                  </span>
                  <span className="text-[18px] text-white font-light">
                    ¥ {totalAmount}
                  </span>
                </div>

                <div className="bg-white/[0.01] border border-white/5 px-3 py-2.5 rounded-md flex items-center space-x-2 text-neutral-500 text-[8px] tracking-wide leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>
                    高端贴身衣物礼享服务不支持无理由退换，在未开箱且封标未损毁状态下，自签收之日起7天内可协助更换尺码。
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full relative py-3 bg-white hover:bg-neutral-100 hover:shadow-[0_0_12px_rgba(255,255,255,0.3)] text-black rounded text-[10px] tracking-[0.3em] font-semibold transition-all duration-300 uppercase cursor-pointer"
                  id="cart-checkout"
                >
                  PREPARE DELIVER / 锁定并开启发货箱
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

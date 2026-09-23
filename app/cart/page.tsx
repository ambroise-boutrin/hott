"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { useTranslationStore } from "@/lib/i18n/useTranslationStore";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { TransitionLink } from "@/components/transition-link";
import { motion } from "framer-motion";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function CartPage() {
  const { items, getCartTotal, removeItem, updateQuantity } = useCartStore();
  const { dict } = useTranslationStore();

  const totalAmount = getCartTotal();

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
        <SiteHeader />
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center max-w-md w-full border border-black/10 p-12 bg-black/5">
            <h2 className="text-lg font-medium text-black mb-8 tracking-wide uppercase">{dict.cart.empty}</h2>
            <p className="font-sans text-sm font-light text-black/60 mb-8">{dict.cart.emptyDesc}</p>
            <TransitionLink href="/" className="inline-block px-8 py-4 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-black/80 transition-colors">
              {dict.cart.continueShopping}
            </TransitionLink>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      <SiteHeader />
      <motion.div 
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans"
      >
        <div className="max-w-6xl mx-auto border-t border-black/10 pt-12">
          <div className="mb-12 border-b border-black/10 pb-6 flex justify-between items-end">
            <h1 className="text-3xl font-light text-black tracking-widest uppercase">
              {dict.cart.title}
            </h1>
            <span className="text-sm font-light tracking-widest text-black/50 uppercase">{items.length} article(s)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
            
            {/* Colonne de Gauche : Articles */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 sm:gap-8 pb-8 border-b border-black/10 last:border-0 last:pb-0">
                    <div className="relative w-full sm:w-40 h-48 sm:h-48 bg-black/5 flex-shrink-0 overflow-hidden group">
                      <Image 
                        src={item.image || "/placeholder.jpg"} 
                        alt={item.name}
                        fill
                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-light text-black tracking-widest uppercase mb-2">{item.name}</h3>
                          <p className="text-sm text-black/50 uppercase tracking-wider">{item.price.toFixed(2)} €</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-black/40 hover:text-black transition-colors"
                        >
                          <X size={20} strokeWidth={1} />
                        </button>
                      </div>
                      
                      <div className="flex items-end justify-between mt-8 sm:mt-0">
                        <div className="flex items-center gap-6 border border-black/10 py-2 px-4">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-black/40 hover:text-black transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-sans text-sm text-black w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-black/40 hover:text-black transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-lg font-medium text-black tracking-widest">{(item.price * item.quantity).toFixed(2)} €</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne de Droite : Résumé */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-black/5 border border-black/10 p-8">
                <h2 className="text-lg font-light text-black tracking-widest uppercase mb-8 pb-4 border-b border-black/10">
                  Résumé
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-sm tracking-wide">
                    <span className="text-black/60 uppercase">Sous-total</span>
                    <span className="text-black font-medium">{totalAmount.toFixed(2)} €</span>
                  </div>
                  <div className="flex items-center justify-between text-sm tracking-wide">
                    <span className="text-black/60 uppercase">Livraison</span>
                    <span className="text-black font-medium">OFFERTE</span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-black/10">
                    <span className="text-lg font-medium text-black tracking-widest uppercase">Total</span>
                    <span className="text-xl font-medium text-black tracking-wider">{totalAmount.toFixed(2)} €</span>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="mt-8 flex justify-center items-center w-full border border-black bg-black py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-transparent hover:text-black"
                >
                  {dict.cart.checkout}
                </Link>

                <TransitionLink
                  href="/"
                  className="mt-4 flex justify-center items-center w-full border border-black/10 bg-transparent py-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                >
                  {dict.cart.continueShopping}
                </TransitionLink>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
      <SiteFooter />
    </main>
  );
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useCartStore } from "../lib/store/useCartStore"

export function SplitProductSection() {
  const [hoveredProduct, setHoveredProduct] = useState<"warmbit" | "warmfeet" | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent, name: string, price: number, image: string) => {
    e.stopPropagation()
    addItem({
      id: name,
      name,
      price,
      image,
      quantity: 1,
    })
  }

  const handleHover = (product: "warmbit" | "warmfeet" | null) => {
    setHoveredProduct(product)
  }

  return (
    <>
      {/* Mobile Layout (Static Stack) */}
      <section id="experience-mobile" className="md:hidden flex flex-col w-full bg-black">
        {/* Mobile Warmbit */}
        <div className="relative w-full min-h-[75vh] flex flex-col items-center justify-center text-white overflow-hidden border-b border-white/10 p-8">
          <div className="absolute inset-0">
            <Image src="/hott-detail.png" alt="Warmbit" fill className="object-cover opacity-60" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="font-sans font-light text-5xl uppercase tracking-[0.2em] mb-6">WARMBIT</h2>
            <p className="font-sans text-sm text-white/90 font-light leading-relaxed mb-10 max-w-sm">
              La révolution thermique pour le bien-être de votre cheval. Offrez une expérience unique et un confort inégalé pour de meilleures performances.
            </p>
            <button
              onClick={(e) => handleAddToCart(e, "WARMBIT", 189, "/hott-detail.png")}
              className="border border-white bg-transparent px-8 py-4 font-sans text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              Ajouter au panier (189€)
            </button>
          </div>
        </div>

        {/* Mobile Warmfeet */}
        <div className="relative w-full min-h-[75vh] flex flex-col items-center justify-center text-white overflow-hidden p-8">
          <div className="absolute inset-0">
            <Image src="/placeholder.jpg" alt="Warmfeet" fill className="object-cover opacity-60 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="font-sans font-light text-5xl uppercase tracking-[0.2em] mb-6">WARMFEET</h2>
            <p className="font-sans text-sm text-white/90 font-light leading-relaxed mb-10 max-w-sm">
              La perfection au service du cavalier. Une chaleur enveloppante pour rester performant même dans les conditions les plus extrêmes.
            </p>
            <button
              onClick={(e) => handleAddToCart(e, "WARMFEET", 129, "/placeholder.jpg")}
              className="border border-white bg-transparent px-8 py-4 font-sans text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              Précommander (129€)
            </button>
          </div>
        </div>
      </section>

      {/* Desktop Layout (Interactive Split) */}
      <section id="experience-desktop" className="hidden md:flex relative w-full h-screen bg-black flex-row overflow-hidden">
        {/* Warmbit Side */}
        <div
          className="relative cursor-default overflow-hidden group border-r border-white/10 flex-1 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          onMouseEnter={() => handleHover("warmbit")}
          onMouseLeave={() => handleHover(null)}
          style={{
            flex: hoveredProduct === "warmbit" ? 1.6 : hoveredProduct === "warmfeet" ? 0.4 : 1,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh]">
            <Image
              src="/hott-detail.png"
              alt="Warmbit"
              fill
              className="object-cover"
            />
          </div>
          <div 
            className="absolute inset-0 transition-colors duration-700"
            style={{
              backgroundColor: hoveredProduct === "warmfeet" ? "rgba(0,0,0,0.85)" : hoveredProduct === "warmbit" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.5)"
            }}
          />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
            <motion.h2 
              className="font-sans font-light text-6xl lg:text-[5rem] uppercase tracking-[0.2em] text-center whitespace-nowrap"
              animate={{
                y: hoveredProduct === "warmbit" ? -30 : 0,
                scale: hoveredProduct === "warmbit" ? 1.05 : hoveredProduct === "warmfeet" ? 0.9 : 1,
                opacity: hoveredProduct === "warmfeet" ? 0 : 1,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              WARMBIT
            </motion.h2>
            
            <AnimatePresence>
              {hoveredProduct === "warmbit" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 flex flex-col items-center max-w-sm text-center"
                >
                  <p className="font-sans text-base text-white/90 font-light leading-relaxed mb-8 px-4">
                    La révolution thermique pour le bien-être de votre cheval. Offrez une expérience unique et un confort inégalé pour de meilleures performances.
                  </p>
                  <button
                    onClick={(e) => handleAddToCart(e, "WARMBIT", 189, "/hott-detail.png")}
                    className="border border-white bg-transparent px-8 py-4 font-sans text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
                  >
                    Ajouter au panier (189€)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Warmfeet Side */}
        <div
          className="relative cursor-default overflow-hidden group flex-1 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          onMouseEnter={() => handleHover("warmfeet")}
          onMouseLeave={() => handleHover(null)}
          style={{
            flex: hoveredProduct === "warmfeet" ? 1.6 : hoveredProduct === "warmbit" ? 0.4 : 1,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh]">
            <Image
              src="/placeholder.jpg" 
              alt="Warmfeet"
              fill
              className="object-cover opacity-80 mix-blend-luminosity" 
            />
          </div>
          <div 
            className="absolute inset-0 transition-colors duration-700"
            style={{
              backgroundColor: hoveredProduct === "warmbit" ? "rgba(0,0,0,0.85)" : hoveredProduct === "warmfeet" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.5)"
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
            <motion.h2 
              className="font-sans font-light text-6xl lg:text-[5rem] uppercase tracking-[0.2em] text-center whitespace-nowrap"
              animate={{
                y: hoveredProduct === "warmfeet" ? -30 : 0,
                scale: hoveredProduct === "warmfeet" ? 1.05 : hoveredProduct === "warmbit" ? 0.9 : 1,
                opacity: hoveredProduct === "warmbit" ? 0 : 1,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              WARMFEET
            </motion.h2>
            
            <AnimatePresence>
              {hoveredProduct === "warmfeet" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 flex flex-col items-center max-w-sm text-center"
                >
                  <p className="font-sans text-base text-white/90 font-light leading-relaxed mb-8 px-4">
                    La perfection au service du cavalier. Une chaleur enveloppante pour rester performant même dans les conditions les plus extrêmes.
                  </p>
                  <button
                    onClick={(e) => handleAddToCart(e, "WARMFEET", 129, "/placeholder.jpg")}
                    className="border border-white bg-transparent px-8 py-4 font-sans text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
                  >
                    Précommander (129€)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}


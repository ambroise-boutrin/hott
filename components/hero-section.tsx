"use client"

import { motion } from "framer-motion"
import { useTranslationStore } from "../lib/i18n/useTranslationStore"

export function HeroSection() {
  const { dict } = useTranslationStore()
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-end overflow-hidden bg-black">
      <video 
        src="/11543-231232163_medium.mp4" 
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        onEnded={(e) => {
          const video = e.target as HTMLVideoElement;
          video.play();
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark gradient to fade seamlessly into the next section */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

      {/* Main content — bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full flex-col md:flex-row md:items-end md:justify-between gap-8 px-6 md:px-12"
      >
        <div className="max-w-2xl text-left">
          <h1 className="font-sans text-5xl font-light tracking-[0.15em] text-white md:text-6xl lg:text-7xl uppercase">
            {dict.hero.title}
          </h1>
          <p className="mt-4 max-w-xl text-pretty font-sans font-light text-lg italic tracking-wide text-white/90 md:text-xl">
            {dict.hero.subtitle}
          </p>
        </div>
        
        <div className="flex-shrink-0 text-left md:text-right">
          <a
            href="#boutique"
            className="inline-block border border-white bg-transparent px-8 md:px-10 py-4 font-sans text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            {dict.hero.cta}
          </a>
        </div>
      </motion.div>

      {/* Simple scroll arrow */}
      <motion.a
        href="#experience"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="relative z-10 mb-8 mt-6 cursor-pointer"
      >
        <motion.svg
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            duration: 0.6, 
            repeat: 3, 
            repeatDelay: 2.5, 
            ease: [0.36, 0, 0.66, -0.56],
            delay: 2 
          }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/50 hover:text-white transition-colors"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </motion.a>
    </section>
  )
}

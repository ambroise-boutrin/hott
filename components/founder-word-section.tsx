"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { TextReveal } from "./text-reveal"
import { useTranslationStore } from "../lib/i18n/useTranslationStore"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

export function FounderWordSection() {
  const { dict } = useTranslationStore()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // Parallax très doux pour l'image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section ref={containerRef} className="relative w-full bg-black px-8 py-28 md:px-12 lg:py-40 overflow-hidden border-t border-white/10">
      
      <div className="mx-auto max-w-6xl relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 pt-12">
        
        {/* Colonne de gauche (Image Éditoriale) */}
        <motion.div 
          {...fadeUp}
          className="md:col-span-5 flex flex-col gap-12"
        >
          <TextReveal
            text={dict.founder.title}
            className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-white/50"
          />
          
          {/* Image style magazine, adaptée pour mobile (portrait 4:5) et desktop (portrait 3:4) */}
          <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden mt-6 md:mt-0">
            <img 
              src="/fondateur.jpeg" 
              alt="HOTT Vision"
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 opacity-70"
            />
          </div>
        </motion.div>

        {/* Colonne de droite (Texte) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="md:col-span-6 md:col-start-7 flex flex-col gap-8 font-sans text-lg md:text-xl font-light leading-[1.7] text-white/80"
        >
          <TextReveal syncWithParent text={dict.founder.p1} delay={0.1} stagger={0.005} />
          
          <TextReveal syncWithParent text={dict.founder.p2} delay={0.15} stagger={0.005} />
          
          <TextReveal syncWithParent text={dict.founder.p3} delay={0.2} stagger={0.005} />
          
          <TextReveal syncWithParent text={dict.founder.p4} delay={0.25} stagger={0.005} className="text-white font-medium" />
          
          <TextReveal syncWithParent text={dict.founder.p5} delay={0.3} stagger={0.005} />
          
          <TextReveal syncWithParent text={dict.founder.p6} delay={0.35} stagger={0.005} />

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }} className="mt-8 pt-8 border-t border-white/10">
            <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-white">
              {dict.founder.signature}
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

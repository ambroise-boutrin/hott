import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#fbfbf9] text-black px-6 py-12 md:px-12">
      {/* Top Header */}
      <header className="flex justify-center">
        <Link href="/" aria-label="HOTT — Accueil">
          <Image 
            src="/7-black.svg" 
            alt="HOTT Logo" 
            width={586} 
            height={185} 
            unoptimized={true}
            priority={true}
            className="h-10 w-auto" 
          />
        </Link>
      </header>

      {/* Center content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center max-w-xl mx-auto py-16">
        <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#c5a880] mb-6">
          Erreur 404
        </span>
        <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black mb-6 leading-tight">
          Piste Introuvable
        </h1>
        <p className="font-sans text-xs md:text-sm text-black/60 font-medium leading-relaxed mb-12 max-w-md">
          Il semblerait que vous ayez quitté le sentier. La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/"
            className="border border-black bg-black px-8 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-transparent hover:text-black text-center"
          >
            Retour à l'accueil
          </Link>
          <Link 
            href="/#collections"
            className="border border-black/10 bg-transparent px-8 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:border-black text-center"
          >
            Nos Collections
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between border-t border-black/5 pt-8 md:flex-row w-full max-w-7xl mx-auto gap-4">
        <p className="font-sans text-xs font-medium text-black/40">
          &copy; {new Date().getFullYear()} HOTT. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          <a href="#" className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-black">Instagram</a>
          <a href="#" className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-black">Facebook</a>
        </div>
      </footer>
    </div>
  )
}

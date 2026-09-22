"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store/useCartStore";

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(7);
  // Générer un faux numéro de commande pour l'aspect visuel
  const [orderNumber] = useState(`HOTT-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    // Vider le panier après un achat réussi
    useCartStore.setState({ items: [] });

    // Décrémenter le compte à rebours
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Effectuer la redirection quand le compteur atteint 0 (en dehors de setCountdown)
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 font-sans text-white selection:bg-white selection:text-black">
      <div className="w-full max-w-2xl text-center">
        
        {/* Logo HOTT */}
        <div className="mb-16">
          <img
            src="/7.svg"
            alt="HOTT Logo"
            className="h-16 md:h-20 w-auto object-contain mx-auto"
          />
        </div>

        <div className="border border-zinc-800 p-12 lg:p-20 bg-zinc-950/50 relative overflow-hidden">
          {/* Décoration subtile */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ddc8b8] to-transparent opacity-20"></div>

          {/* Textes Remerciements */}
          <h1 className="text-3xl lg:text-4xl font-light tracking-widest uppercase mb-4 font-serif">
            Merci pour votre commande
          </h1>
          
          <p className="text-sm text-zinc-400 font-light tracking-widest uppercase mb-12">
            Commande n° {orderNumber}
          </p>
          
          <p className="text-sm lg:text-base text-zinc-300 font-light leading-loose mb-12 max-w-lg mx-auto">
            Votre paiement a été accepté avec succès. Nous préparons avec le plus grand soin votre colis. Un email de confirmation contenant votre reçu et vos informations de livraison vient de vous être envoyé.
          </p>

          <div className="h-px w-24 bg-zinc-800 mx-auto mb-12"></div>

          {/* Compte à rebours */}
          <div className="text-xs text-zinc-500 tracking-widest uppercase mb-10 flex items-center justify-center gap-3">
            <svg className="animate-spin h-3 w-3 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Retour vers l'accueil dans {countdown} seconde{countdown > 1 ? 's' : ''}
          </div>

          {/* Bouton de retour manuel */}
          <Link 
            href="/"
            className="inline-block w-full sm:w-auto py-4 px-12 border border-zinc-600 text-zinc-300 hover:bg-white hover:border-white hover:text-black transition-all duration-500 font-medium tracking-widest uppercase text-xs"
          >
            Continuer la visite
          </Link>
        </div>
        
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useAuthUIStore } from "@/lib/store/useAuthUIStore";
import { UserCircle2, ArrowRight } from "lucide-react";

// Initialisation de Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Une erreur est survenue avec votre carte");
    } else {
      setMessage("Une erreur inattendue est survenue.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-8 mt-8">
      <div>
        <h3 className="text-sm font-medium text-black uppercase tracking-widest mb-4">Adresse de livraison</h3>
        <AddressElement options={{ mode: 'shipping' }} />
      </div>
      <div className="pt-6 border-t border-black/10">
        <h3 className="text-sm font-medium text-black uppercase tracking-widest mb-4">Paiement</h3>
        <PaymentElement id="payment-element" options={{ layout: "accordion" }} />
      </div>
      
      {message && (
        <div className="text-center text-xs tracking-wide uppercase text-red-600 bg-red-50 p-4 border border-red-200">
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className={`w-full flex justify-center py-5 px-4 border border-black text-sm font-semibold tracking-widest uppercase transition-all duration-300 ${
          isLoading || !stripe || !elements
            ? "bg-black/5 text-black/40 border-black/10 cursor-not-allowed"
            : "bg-black text-white hover:bg-transparent hover:text-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 focus:ring-offset-white"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            TRAITEMENT EN COURS
          </span>
        ) : (
          `PAYER ${amount.toFixed(2)} €`
        )}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, getCartTotal } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const [isGuest, setIsGuest] = useState(false);
  const setIsAccountOpen = useAuthUIStore((state) => state.setIsOpen);

  const totalAmount = getCartTotal();

  useEffect(() => {
    if (totalAmount <= 0) return;

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: Math.round(totalAmount * 100),
        items: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price, name: i.name })),
        userEmail: session?.user?.email || null
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de communication avec le serveur");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [totalAmount]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 text-black">
        <SiteHeader />
        <div className="text-center max-w-md w-full border border-black/10 p-12 bg-black/5 mt-16">
          <h2 className="text-lg font-medium text-black mb-8 tracking-wide uppercase">VOTRE PANIER EST VIDE</h2>
          <Link href="/" className="inline-block px-8 py-4 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-black/80 transition-colors">
            RETOURNER À LA BOUTIQUE
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin h-6 w-6 border-b-2 border-black rounded-full"></div>
      </div>
    );
  }

  if (status === "unauthenticated" && !isGuest) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-black selection:bg-black selection:text-white">
        <SiteHeader />
        <motion.div 
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
        >
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 border-t border-black/10 pt-16">
            
            <div className="flex flex-col">
              <h2 className="text-2xl font-light text-black tracking-widest uppercase mb-4">Déjà client ?</h2>
              <p className="text-sm font-light text-black/60 mb-8 leading-relaxed">Connectez-vous pour retrouver vos informations enregistrées et suivre votre commande plus facilement.</p>
              <button 
                onClick={() => setIsAccountOpen(true)}
                className="flex justify-center items-center gap-3 w-full border border-black bg-black py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-transparent hover:text-black"
              >
                <UserCircle2 size={16} />
                Se connecter
              </button>
            </div>

            <div className="flex flex-col md:border-l md:border-black/10 md:pl-16">
              <h2 className="text-2xl font-light text-black tracking-widest uppercase mb-4">Nouveau client</h2>
              <p className="text-sm font-light text-black/60 mb-8 leading-relaxed">Passez votre commande rapidement sans créer de compte. Vous pourrez en créer un à la fin si vous le souhaitez.</p>
              <button 
                onClick={() => setIsGuest(true)}
                className="flex justify-center items-center gap-3 w-full border border-black/20 bg-transparent py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-black transition-all hover:bg-black/5 hover:border-black"
              >
                Continuer en tant qu'invité
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </motion.div>
        <SiteFooter />
      </div>
    );
  }

  // Configuration de Stripe Ultra Minimaliste claire (sharp edges)
  const appearance = {
    theme: 'flat' as const,
    variables: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      colorPrimary: '#000000',
      colorBackground: '#ffffff',
      colorText: '#000000',
      colorDanger: '#ef4444',
      spacingUnit: '4px',
      borderRadius: '0px', // Pas d'arrondis
      colorTextSecondary: '#71717a', // zinc-500
    },
    rules: {
      '.Input': {
        border: '1px solid #e4e4e7', // zinc-200
        backgroundColor: '#ffffff',
        boxShadow: 'none',
        padding: '12px',
        borderRadius: '0px',
      },
      '.Input:focus': {
        border: '1px solid #000000',
        boxShadow: 'none',
      },
      '.Label': {
        color: '#52525b', // zinc-600
        fontWeight: '500',
        textTransform: 'uppercase',
        fontSize: '12px',
        letterSpacing: '1px',
        marginBottom: '8px',
      },
      '.Tab': {
        borderRadius: '0px',
        border: '1px solid #e4e4e7',
      },
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black selection:bg-black selection:text-white">
      <SiteHeader />
      <motion.div 
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto border-t border-black/10 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Colonne de Gauche : Paiement */}
            <div>
              <div className="mb-12 border-b border-black/10 pb-6">
                <h1 className="text-2xl font-light text-black tracking-widest uppercase">
                  Paiement
                </h1>
              </div>

              {error ? (
                <div className="text-center text-xs tracking-wide uppercase text-red-600 bg-red-50 p-4 border border-red-200">
                  {error}
                </div>
              ) : clientSecret ? (
                <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                  <CheckoutForm amount={totalAmount} />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin h-6 w-6 border-b-2 border-black rounded-full"></div>
                </div>
              )}
            </div>

            {/* Colonne de Droite : Résumé */}
            <div>
              <div className="mb-12 border-b border-black/10 pb-6">
                <h2 className="text-lg font-light text-black tracking-widest uppercase">
                  Résumé
                </h2>
              </div>
              
              <div className="bg-transparent">
                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-black/10">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 pb-6 border-b border-black/10 last:border-0 last:pb-0">
                      <div className="relative w-24 h-24 bg-black/5 flex-shrink-0">
                        <img 
                          src={item.image || "/placeholder.jpg"} 
                          alt={item.name} 
                          className="w-full h-full object-cover opacity-90"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="text-sm font-medium text-black tracking-wide uppercase">{item.name}</h3>
                          <p className="text-xs text-black/50 mt-2 uppercase tracking-widest">QTE {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-black">{(item.price * item.quantity).toFixed(2)} €</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-black/10 space-y-6">
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
                
                <div className="mt-12 flex items-center justify-center gap-3 text-black/50 border border-black/10 py-4">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                   </svg>
                   <span className="text-[10px] tracking-widest uppercase">Paiement Sécurisé via Stripe</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
      <SiteFooter />
    </div>
  );
}

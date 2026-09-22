"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";

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
        <PaymentElement id="payment-element" options={{ layout: "accordion" }} />
      </div>
      
      {message && (
        <div className="text-center text-xs tracking-wide uppercase text-red-500 bg-red-500/10 p-4 border border-red-500/20">
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className={`w-full flex justify-center py-5 px-4 border border-transparent text-sm font-semibold tracking-widest uppercase transition-all duration-300 ${
          isLoading || !stripe || !elements
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            : "bg-white text-black hover:bg-zinc-200 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-black"
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

  const totalAmount = getCartTotal();

  useEffect(() => {
    if (totalAmount <= 0) return;

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(totalAmount * 100) }),
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-black py-12 px-4">
        <div className="text-center max-w-md w-full border border-zinc-800 p-12 bg-zinc-950">
          <h2 className="text-lg font-medium text-white mb-8 tracking-wide uppercase">VOTRE PANIER EST VIDE</h2>
          <Link href="/" className="inline-block px-8 py-4 bg-white text-black text-xs font-semibold tracking-widest uppercase hover:bg-zinc-200 transition-colors">
            RETOURNER À LA BOUTIQUE
          </Link>
        </div>
      </div>
    );
  }

  // Configuration de Stripe Ultra Minimaliste (sharp edges)
  const appearance = {
    theme: 'night' as const,
    variables: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      colorPrimary: '#ffffff',
      colorBackground: '#000000',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      spacingUnit: '4px',
      borderRadius: '0px', // Pas d'arrondis
      colorTextSecondary: '#a1a1aa',
    },
    rules: {
      '.Input': {
        border: '1px solid #27272a',
        backgroundColor: '#000000',
        boxShadow: 'none',
        padding: '12px',
        borderRadius: '0px', // Bords stricts
      },
      '.Input:focus': {
        border: '1px solid #ffffff',
        boxShadow: 'none',
      },
      '.Label': {
        color: '#e4e4e7',
        fontWeight: '500',
        textTransform: 'uppercase',
        fontSize: '12px',
        letterSpacing: '1px',
        marginBottom: '8px',
      },
      '.Tab': {
        borderRadius: '0px',
        border: '1px solid #27272a',
      },
    },
  };

  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-white selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto border-t border-zinc-800 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Colonne de Gauche : Paiement */}
          <div>
            <div className="mb-12 border-b border-zinc-800 pb-6">
              <h1 className="text-2xl font-light text-white tracking-widest uppercase">
                Paiement
              </h1>
            </div>

            {error ? (
              <div className="text-center text-xs tracking-wide uppercase text-red-500 bg-red-500/10 p-4 border border-red-500/20">
                {error}
              </div>
            ) : clientSecret ? (
              <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                <CheckoutForm amount={totalAmount} />
              </Elements>
            ) : (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin h-6 w-6 border-b-2 border-white rounded-full"></div>
              </div>
            )}
          </div>

          {/* Colonne de Droite : Résumé */}
          <div>
            <div className="mb-12 border-b border-zinc-800 pb-6">
              <h2 className="text-lg font-light text-white tracking-widest uppercase">
                Résumé
              </h2>
            </div>
            
            <div className="bg-transparent">
              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-800">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 pb-6 border-b border-zinc-900 last:border-0 last:pb-0">
                    <div className="relative w-24 h-24 bg-zinc-900 flex-shrink-0">
                      <img 
                        src={item.image || "/placeholder.jpg"} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale opacity-90"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-medium text-white tracking-wide uppercase">{item.name}</h3>
                        <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">QTE {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-white">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-800 space-y-6">
                <div className="flex items-center justify-between text-sm tracking-wide">
                  <span className="text-zinc-400 uppercase">Sous-total</span>
                  <span className="text-white font-medium">{totalAmount.toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between text-sm tracking-wide">
                  <span className="text-zinc-400 uppercase">Livraison</span>
                  <span className="text-white font-medium">OFFERTE</span>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                  <span className="text-lg font-medium text-white tracking-widest uppercase">Total</span>
                  <span className="text-xl font-medium text-white tracking-wider">{totalAmount.toFixed(2)} €</span>
                </div>
              </div>
              
              <div className="mt-12 flex items-center justify-center gap-3 text-zinc-600 border border-zinc-800 py-4">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                 </svg>
                 <span className="text-[10px] tracking-widest uppercase">Paiement Sécurisé via Stripe</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

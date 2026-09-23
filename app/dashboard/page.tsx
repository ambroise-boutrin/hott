"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const navItems = [
  { 
    id: "dashboard", 
    label: "Tableau de bord", 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  { 
    id: "commandes", 
    label: "Vos commandes", 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  { 
    id: "produits", 
    label: "Vos produits", 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  { 
    id: "adresses", 
    label: "Carnet d'adresses", 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  { 
    id: "informations", 
    label: "Vos informations", 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  { 
    id: "aide", 
    label: "Centre d'aide", 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-[#f5f5f3] font-sans text-sm tracking-widest uppercase text-black/40">Chargement...</div>;
  }

  if (!session) return null;

  const userName = session.user?.name || "Cher(e) Client(e)";

  // Find active nav label for breadcrumb
  const activeNavItem = navItems.find(item => item.id === activeTab);
  const activeLabel = activeNavItem?.label || "Tableau de bord";

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f3]">
      <SiteHeader />
      
      <main className="flex-1 px-6 pt-36 pb-24 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">

          {/* Breadcrumb */}
          <nav className="mb-10 font-sans text-[0.65rem] font-normal tracking-wide text-black/35">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/dashboard" className="hover:text-black transition-colors">Mon Compte</Link>
            <span className="mx-2">/</span>
            <span className="text-black/50">{activeLabel}</span>
          </nav>

          {/* Greeting */}
          <h1 className="font-sans text-3xl font-bold tracking-tight text-black md:text-4xl">
            Bonjour{" "}
            <span className="text-black/30">_</span>
          </h1>

          {/* Layout */}
          <div className="mt-14 flex flex-col gap-10 md:flex-row md:gap-16">
            
            {/* Sidebar navigation */}
            <nav className="w-full flex-shrink-0 md:w-[320px]">
              <div className="flex flex-col">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-5 py-3.5 text-left font-sans text-sm transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-black text-white font-semibold"
                        : "bg-transparent text-black/70 hover:bg-black/[0.03] hover:text-black font-normal"
                    }`}
                  >
                    <span className={activeTab === item.id ? "text-white" : "text-black/40"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}

                {/* Déconnexion */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-1 flex items-center gap-4 px-5 py-3.5 text-left font-sans text-sm font-normal text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </nav>

            {/* Content area */}
            <div className="flex-1">
              {activeTab === "dashboard" && (
                <DashboardTab userName={userName} />
              )}
              {activeTab === "commandes" && (
                <CommandesTab />
              )}
              {activeTab === "produits" && (
                <ProduitsTab />
              )}
              {activeTab === "adresses" && (
                <AdressesTab />
              )}
              {activeTab === "informations" && (
                <InformationsTab session={session} />
              )}
              {activeTab === "aide" && (
                <AideTab />
              )}
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─── Tab Components ─── */

function DashboardTab({ userName }: { userName: string }) {
  return (
    <div>
      <h2 className="font-sans text-xl font-bold tracking-tight text-black">
        Tableau de bord
      </h2>
      <div className="mt-8 rounded-none bg-white p-10 md:p-14">
        <p className="font-sans text-sm leading-relaxed text-black/60">
          Bienvenue <span className="font-semibold text-black">{userName}</span>. 
          Depuis votre tableau de bord, vous pouvez consulter vos commandes récentes, 
          gérer vos adresses de livraison et modifier vos informations personnelles.
        </p>
      </div>
    </div>
  );
}

function CommandesTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => {
        if (!res.ok) throw new Error("Impossible de charger les commandes");
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="font-sans text-xl font-bold tracking-tight text-black">
        Toutes vos commandes
      </h2>
      <div className="mt-8 rounded-none bg-white p-10 md:p-14">
        {loading ? (
          <div className="flex items-center gap-3 text-black/50 font-sans text-sm">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Chargement de vos commandes...
          </div>
        ) : error ? (
          <p className="font-sans text-sm leading-relaxed text-red-500">
            Une erreur est survenue lors du chargement de vos commandes.
          </p>
        ) : orders.length === 0 ? (
          <p className="font-sans text-sm leading-relaxed text-black/50">
            Vous n'avez réalisé aucune commande. Vous trouverez ici les informations concernant vos futures commandes.
          </p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border border-black/10 p-6">
                <div className="flex flex-wrap gap-6 justify-between items-start mb-6 pb-6 border-b border-black/10">
                  <div>
                    <p className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50 mb-1">Commande n°</p>
                    <p className="font-sans text-sm font-medium text-black">{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50 mb-1">Date</p>
                    <p className="font-sans text-sm font-medium text-black">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50 mb-1">Statut</p>
                    <p className="font-sans text-sm font-medium text-black">{order.status === "PAID" ? "Payée" : order.status}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50 mb-1">Total</p>
                    <p className="font-sans text-sm font-medium text-black">{order.amount.toFixed(2)} €</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm font-sans">
                      <div className="flex gap-4">
                        <span className="text-black/50">{item.quantity}x</span>
                        <span className="text-black">{item.name}</span>
                      </div>
                      <span className="text-black">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-black/10">
                  <p className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50 mb-2">Livraison</p>
                  <p className="font-sans text-sm text-black">
                    {order.shippingName}<br/>
                    {order.addressLine1} {order.addressLine2 ? <br/> : ""}{order.addressLine2}
                    {order.postalCode} {order.city}, {order.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProduitsTab() {
  return (
    <div>
      <h2 className="font-sans text-xl font-bold tracking-tight text-black">
        Vos produits
      </h2>
      <div className="mt-8 rounded-none bg-white p-10 md:p-14">
        <p className="font-sans text-sm leading-relaxed text-black/50">
          Vous n'avez pas encore enregistré de produit HOTT. Enregistrez votre WARMBIT pour accéder à l'assistance et aux mises à jour.
        </p>
      </div>
    </div>
  );
}

function AdressesTab() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAddresses = () => {
    setLoading(true);
    fetch("/api/addresses")
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setAddresses(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;
    
    fetch(`/api/addresses/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setAddresses(addresses.filter(a => a.id !== id));
      })
      .catch(err => alert(err.message));
  };

  const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const newAddress = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
    };

    fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setAddresses([data, ...addresses]);
        setIsAdding(false);
        setFormLoading(false);
      })
      .catch(err => {
        setFormError(err.message);
        setFormLoading(false);
      });
  };

  return (
    <div>
      <h2 className="font-sans text-xl font-bold tracking-tight text-black">
        Carnet d'adresses
      </h2>
      
      {isAdding ? (
        <div className="mt-8 rounded-none bg-white p-10 md:p-14">
          <div className="mb-8 flex justify-between items-center">
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-black">Nouvelle adresse</h3>
            <button onClick={() => setIsAdding(false)} className="text-black/50 hover:text-black font-sans text-xs uppercase tracking-widest transition-colors">
              Annuler
            </button>
          </div>
          
          <form onSubmit={handleAddAddress} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50">Prénom</label>
                <input required name="firstName" className="w-full border-b border-black/20 bg-transparent py-2 font-sans text-sm text-black focus:border-black focus:outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50">Nom</label>
                <input required name="lastName" className="w-full border-b border-black/20 bg-transparent py-2 font-sans text-sm text-black focus:border-black focus:outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50">Adresse</label>
              <input required name="addressLine1" className="w-full border-b border-black/20 bg-transparent py-2 font-sans text-sm text-black focus:border-black focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50">Complément d'adresse (optionnel)</label>
              <input name="addressLine2" className="w-full border-b border-black/20 bg-transparent py-2 font-sans text-sm text-black focus:border-black focus:outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50">Code postal</label>
                <input required name="postalCode" className="w-full border-b border-black/20 bg-transparent py-2 font-sans text-sm text-black focus:border-black focus:outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50">Ville</label>
                <input required name="city" className="w-full border-b border-black/20 bg-transparent py-2 font-sans text-sm text-black focus:border-black focus:outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-sans text-[0.65rem] uppercase tracking-widest text-black/50">Pays</label>
              <input required name="country" defaultValue="France" className="w-full border-b border-black/20 bg-transparent py-2 font-sans text-sm text-black focus:border-black focus:outline-none transition-colors" />
            </div>
            
            {formError && (
              <p className="font-sans text-xs text-red-500 mt-4">{formError}</p>
            )}

            <button disabled={formLoading} type="submit" className="mt-8 border border-black px-8 py-3 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black hover:bg-black hover:text-white transition-colors w-full disabled:opacity-50">
              {formLoading ? "Enregistrement..." : "Enregistrer l'adresse"}
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-8 rounded-none bg-white p-10 md:p-14">
          {loading ? (
            <div className="flex items-center gap-3 text-black/50 font-sans text-sm">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Chargement de vos adresses...
            </div>
          ) : error ? (
            <p className="font-sans text-sm leading-relaxed text-red-500">
              Une erreur est survenue lors du chargement de vos adresses.
            </p>
          ) : addresses.length === 0 ? (
            <div>
              <p className="font-sans text-sm leading-relaxed text-black/50">
                Aucune adresse enregistrée.
              </p>
              <button onClick={() => setIsAdding(true)} className="mt-8 border border-black px-8 py-3 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black hover:bg-black hover:text-white transition-colors">
                Ajouter une adresse
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border border-black/10 p-6 flex flex-col justify-between">
                    <div>
                      <p className="font-sans text-sm font-semibold tracking-wide text-black mb-4 uppercase">{addr.firstName} {addr.lastName}</p>
                      <p className="font-sans text-sm text-black/70 leading-relaxed">
                        {addr.addressLine1} <br/>
                        {addr.addressLine2 ? <>{addr.addressLine2}<br/></> : ""}
                        {addr.postalCode} {addr.city} <br/>
                        {addr.country}
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-black/10 flex justify-end">
                      <button onClick={() => handleDelete(addr.id)} className="font-sans text-xs tracking-widest uppercase text-red-600/70 hover:text-red-600 transition-colors">
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsAdding(true)} className="border border-black px-8 py-3 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black hover:bg-black hover:text-white transition-colors">
                Ajouter une autre adresse
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InformationsTab({ session }: { session: any }) {
  return (
    <div>
      <h2 className="font-sans text-xl font-bold tracking-tight text-black">
        Vos informations
      </h2>
      <div className="mt-8 rounded-none bg-white p-10 md:p-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black/30">Nom complet</span>
            <span className="font-sans text-sm font-medium text-black">{session.user?.name || "Non renseigné"}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black/30">Adresse email</span>
            <span className="font-sans text-sm font-medium text-black">{session.user?.email}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black/30">Mot de passe</span>
            <span className="font-sans text-sm font-medium text-black">••••••••</span>
          </div>
        </div>

        <button className="mt-10 border border-black px-8 py-3 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black hover:bg-black hover:text-white transition-colors">
          Modifier mes informations
        </button>
      </div>
    </div>
  );
}

function AideTab() {
  return (
    <div>
      <h2 className="font-sans text-xl font-bold tracking-tight text-black">
        Centre d'aide
      </h2>
      <div className="mt-8 rounded-none bg-white p-8 md:p-10">
        <p className="font-sans text-sm leading-relaxed text-black/50">
          Besoin d'assistance ? Notre équipe est à votre disposition.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black/30">Téléphone</span>
            <span className="font-sans text-sm font-medium text-black">+33 1 84 00 00 00</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-black/30">Email</span>
            <span className="font-sans text-sm font-medium text-black">conseil@hott.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page Export (with Suspense for useSearchParams) ─── */

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f3] font-sans text-sm tracking-widest uppercase text-black/40">
        Chargement...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

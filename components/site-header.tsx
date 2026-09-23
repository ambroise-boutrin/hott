"use client"

import { User, ShoppingBag, Search, X, Menu, Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TransitionLink } from "./transition-link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signIn, signOut } from "next-auth/react"
import { useCartStore } from "../lib/store/useCartStore"
import { useTranslationStore, Locale } from "../lib/i18n/useTranslationStore"

export function SiteHeader() {
  const { dict, locale, setLocale } = useTranslationStore()
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const [isVisible, setIsVisible] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isCartOpen = useCartStore((state) => state.isOpen)
  const setIsCartOpen = useCartStore((state) => state.setIsOpen)
  const cartItems = useCartStore((state) => state.items)
  const removeCartItem = useCartStore((state) => state.removeItem)
  const updateCartItemQuantity = useCartStore((state) => state.updateQuantity)
  const cartTotal = useCartStore((state) => state.getCartTotal())

  // Auth taskpane states
  const [authStep, setAuthStep] = useState<"email" | "login" | "register">("email")
  const [emailValue, setEmailValue] = useState("")
  const [nameValue, setNameValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleOAuthClick = (provider: string) => {
    setError(`La connexion avec ${provider} est temporairement indisponible (clés d'API requises).`)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailValue) return
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      })
      const data = await res.json()
      if (data.exists) {
        setAuthStep("login")
      } else {
        setAuthStep("register")
      }
    } catch (err) {
      setError("Erreur lors de la vérification de l'email.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authStep === "email") return handleEmailSubmit(e)

    setIsLoading(true)
    setError("")

    if (authStep === "login") {
      const res = await signIn("credentials", {
        email: emailValue,
        password: passwordValue,
        redirect: false,
      })
      if (res?.error) {
        setError(res.error)
        setIsLoading(false)
      } else {
        setIsAccountOpen(false)
        router.push("/dashboard")
      }
    } else if (authStep === "register") {
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nameValue, email: emailValue, password: passwordValue }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || "Une erreur est survenue.")
          setIsLoading(false)
        } else {
          // Auto login après inscription
          await signIn("credentials", {
            email: emailValue,
            password: passwordValue,
            redirect: false,
          })
          setIsAccountOpen(false)
          router.push("/dashboard")
        }
      } catch (err) {
        setError("Erreur de connexion.")
        setIsLoading(false)
      }
    }
  }

  // Reset form when drawer closes
  useEffect(() => {
    if (!isAccountOpen) {
      setTimeout(() => {
        setAuthStep("email")
        setEmailValue("")
        setPasswordValue("")
        setNameValue("")
        setError("")
      }, 300)
    }
  }, [isAccountOpen])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 50) setIsAtTop(true)
      else setIsAtTop(false)

      const scrollDiff = Math.abs(currentScrollY - lastScrollY)
      if (currentScrollY <= 80) setIsVisible(true)
      else if (scrollDiff > 5) {
        if (currentScrollY > lastScrollY) setIsVisible(false)
        else setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const useTransparentMode = isHomePage && isAtTop && !isSearchOpen
  const linkClass = `group relative font-sans text-[0.75rem] uppercase tracking-[0.2em] transition-colors duration-300 ${useTransparentMode ? "text-white/80 hover:text-white" : "text-black/60 hover:text-black"
    }`
  const underlineClass = `absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-500 ease-out group-hover:w-full ${useTransparentMode ? "bg-white" : "bg-black"
    }`
  const iconClass = `transition-colors duration-300 ${useTransparentMode ? "text-white/80 hover:text-white" : "text-black/60 hover:text-black"
    }`

  const handleUserClick = () => {
    setIsAccountOpen(true)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
          } ${useTransparentMode ? "bg-transparent" : "bg-white/95 backdrop-blur-sm border-b border-black/5"
          }`}
      >
        <div className="mx-auto flex w-full items-center justify-between px-6 py-4 md:grid md:grid-cols-3 md:px-12 md:py-6">
          <div className="flex flex-1 items-center justify-start md:flex-none">
            <button
              type="button"
              aria-label="Menu"
              className={`md:hidden ${iconClass}`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={1} />
            </button>

            <nav aria-label="Navigation gauche" className="hidden items-center gap-8 md:flex">
              <a href="#collections" className={linkClass}>
                {dict.header.collections}
                <span className={underlineClass}></span>
              </a>
              <a href="#histoire" className={linkClass}>
                {dict.header.history}
                <span className={underlineClass}></span>
              </a>
            </nav>
          </div>

          <div className="flex flex-1 justify-center md:flex-none">
            <TransitionLink href="/" aria-label="HOTT — Accueil" className="flex items-center justify-center">
              <img
                src={useTransparentMode ? "/7.svg" : "/7-black.svg"}
                alt="HOTT Logo"
                className="h-9 md:h-14 w-auto object-contain"
              />
            </TransitionLink>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4 md:gap-8 md:flex-none">
            <nav aria-label="Navigation droite" className="hidden items-center gap-8 md:flex">
              <a href="#technologie" className={linkClass}>
                {dict.header.technology}
                <span className={underlineClass}></span>
              </a>
              <a href="#boutique" className={linkClass}>
                {dict.header.store}
                <span className={underlineClass}></span>
              </a>
            </nav>

            <div className="flex items-center gap-4 md:gap-6">
              <button
                type="button"
                aria-label={isSearchOpen ? "Fermer la recherche" : "Recherche"}
                className={iconClass}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? <X size={18} strokeWidth={1} /> : <Search size={18} strokeWidth={1} />}
              </button>
              <button
                type="button"
                aria-label="Compte utilisateur"
                className={iconClass}
                onClick={handleUserClick}
              >
                <User size={18} strokeWidth={1} />
              </button>
              <button
                type="button"
                aria-label="Panier"
                className={iconClass}
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={18} strokeWidth={1} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-black/5 bg-white px-6 md:px-12"
            >
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-8">
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-black/40" size={20} strokeWidth={1} />
                  <input
                    type="text"
                    placeholder={dict.header.searchPlaceholder}
                    className="w-full border-b border-black/20 bg-transparent py-3 pl-10 pr-4 font-sans text-lg font-light text-black outline-none transition-colors focus:border-black placeholder:text-black/20"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-sans text-xs font-medium uppercase tracking-widest text-black/40">{dict.header.popular}</span>
                  <div className="flex gap-3">
                    {["WARMBIT", "Batterie", "Housse", "Application"].map((term) => (
                      <button key={term} className="font-sans text-xs text-black/60 hover:text-black transition-colors underline underline-offset-4">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Account Drawer Overlay */}
      {isAccountOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          onClick={() => setIsAccountOpen(false)}
        />
      )}

      {/* Account Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-white p-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isAccountOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          onClick={() => setIsAccountOpen(false)}
          className="absolute right-8 top-8 flex items-center gap-2 text-black/60 transition-colors hover:text-black"
        >
          <span className="font-sans text-xs font-semibold uppercase tracking-widest">Fermer</span>
          <X size={18} strokeWidth={1} />
        </button>

        <div className="mt-20 flex h-full flex-col">

          {/* ─── AUTHENTICATED: Account nav ─── */}
          {status === "authenticated" ? (
            <>
              <h2 className="font-sans text-3xl font-semibold tracking-tight text-black">
                {dict.auth.myAccount}
              </h2>
              <p className="mt-2 font-sans text-sm text-black/50">
                {dict.auth.hello}, {session?.user?.name || "Client"}
              </p>

              <nav className="mt-10 flex flex-col">
                {[
                  {
                    label: dict.dashboard.dashboard, tab: "dashboard", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                      </svg>
                    )
                  },
                  {
                    label: dict.dashboard.orders, tab: "commandes", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                    )
                  },
                  {
                    label: dict.dashboard.products, tab: "produits", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                      </svg>
                    )
                  },
                  {
                    label: dict.dashboard.addresses, tab: "adresses", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    )
                  },
                  {
                    label: dict.dashboard.info, tab: "informations", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    )
                  },
                  {
                    label: dict.dashboard.help, tab: "aide", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    )
                  },
                ].map((item) => (
                  <TransitionLink
                    key={item.tab}
                    href={`/dashboard?tab=${item.tab}`}
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-4 px-2 py-3.5 font-sans text-sm font-normal text-black/70 transition-all duration-200 hover:bg-black/[0.03] hover:text-black"
                  >
                    <span className="text-black/35">{item.icon}</span>
                    {item.label}
                  </TransitionLink>
                ))}
              </nav>

              {/* Déconnexion */}
              <div className="mt-auto pb-8">
                <button
                  onClick={() => {
                    setIsAccountOpen(false)
                    signOut({ callbackUrl: "/" })
                  }}
                  className="flex w-full items-center gap-4 px-2 py-3.5 font-sans text-sm font-normal text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {dict.auth.logout}
                </button>
              </div>
            </>
          ) : (
            /* ─── NOT AUTHENTICATED: Auth form ─── */
            <>
              <motion.h2 layout className="font-sans text-3xl font-semibold tracking-tight text-black">
                {authStep === "email" ? dict.auth.login : authStep === "login" ? dict.auth.welcomeBack : dict.auth.createAccount}
              </motion.h2>
              <motion.p layout className="mt-2 font-sans text-sm text-black/60">
                {authStep === "email"
                  ? dict.auth.enterEmail
                  : authStep === "login"
                    ? dict.auth.enterPassword
                    : dict.auth.completeInfo}
              </motion.p>

              {error && (
                <motion.div layout className="mt-6 rounded-md bg-red-50 p-3 text-center font-sans text-xs font-medium text-red-600">
                  {error}
                </motion.div>
              )}

              <motion.form
                layout
                onSubmit={handleAuthSubmit}
                className="mt-8 flex flex-col gap-6"
              >
                <motion.div layout className="flex flex-col gap-2">
                  <label className="font-sans text-[0.65rem] font-semibold uppercase tracking-widest text-black/40">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    disabled={authStep !== "email" || isLoading}
                    required
                    className="border-b border-black/20 bg-transparent py-3 font-sans text-sm text-black outline-none transition-colors focus:border-black disabled:opacity-50"
                    placeholder="nom@exemple.com"
                  />
                </motion.div>

                <AnimatePresence mode="popLayout">
                  {authStep === "register" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-2"
                    >
                      <label className="font-sans text-[0.65rem] font-semibold uppercase tracking-widest text-black/40">
                        Prénom et Nom
                      </label>
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        required
                        className="border-b border-black/20 bg-transparent py-3 font-sans text-sm text-black outline-none transition-colors focus:border-black"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {authStep !== "email" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex justify-between">
                        <label className="font-sans text-[0.65rem] font-semibold uppercase tracking-widest text-black/40">
                          Mot de passe
                        </label>
                        {authStep === "login" && (
                          <a href="#" className="font-sans text-[0.65rem] font-medium tracking-wide text-black underline-offset-4 hover:underline">
                            Oublié ?
                          </a>
                        )}
                      </div>
                      <input
                        type="password"
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        required
                        className="border-b border-black/20 bg-transparent py-3 font-sans text-sm text-black outline-none transition-colors focus:border-black"
                        placeholder="••••••••"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  layout
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 w-full border border-black bg-black py-4 font-sans text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-transparent hover:text-black disabled:opacity-70"
                >
                  {isLoading
                    ? dict.auth.loading
                    : authStep === "email"
                      ? dict.auth.continue
                      : authStep === "login"
                        ? dict.auth.loginBtn
                        : dict.auth.createBtn}
                </motion.button>

                {authStep === "email" && (
                  <motion.div layout className="flex flex-col gap-4 mt-2">
                    <div className="flex items-center gap-4 my-2">
                      <div className="h-[1px] bg-black/10 flex-1" />
                      <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-widest text-black/40">ou</span>
                      <div className="h-[1px] bg-black/10 flex-1" />
                    </div>

                    <button
                      type="button"
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="flex items-center justify-center gap-3 w-full border border-black/10 py-3.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-black transition-all hover:bg-black/5"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.5z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.11C3.18 21.88 7.31 24 12 24z" />
                        <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.62H1.21C.44 8.16 0 9.88 0 11.7c0 1.82.44 3.54 1.21 5.08l4.11-3.11z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 6.62l4.11 3.11c.94-2.85 3.57-4.98 6.68-4.98z" />
                      </svg>
                      {dict.auth.continueWithGoogle}
                    </button>
                  </motion.div>
                )}
              </motion.form>

              <AnimatePresence>
                {authStep !== "email" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 text-center"
                  >
                    <button
                      type="button"
                      onClick={() => setAuthStep("email")}
                      className="font-sans text-xs font-medium text-black/60 underline-offset-4 transition-colors hover:text-black hover:underline"
                    >
                      {dict.auth.useAnotherEmail}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-[#050505] p-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-l border-white/10 ${isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          onClick={() => setIsCartOpen(false)}
          className="absolute right-8 top-8 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
        >
          <span className="font-sans text-xs font-light uppercase tracking-widest">Fermer</span>
          <X size={18} strokeWidth={1} />
        </button>

        <div className="mt-20 flex h-full flex-col">
          <h2 className="font-sans text-3xl font-light tracking-widest uppercase text-white">{dict.cart.title}</h2>

          {cartItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <ShoppingBag size={48} strokeWidth={1} className="mb-6 text-white/20" />
              <p className="font-sans text-lg font-light text-white/60">{dict.cart.empty}</p>
              <p className="mt-2 font-sans text-sm font-light text-white/40">{dict.cart.emptyDesc}</p>

              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-8 border border-white/20 px-8 py-4 font-sans text-xs font-light uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black"
              >
                {dict.cart.continueShopping}
              </button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col mt-8">
              <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-white/10 py-6">
                    <div className="relative h-24 w-20 overflow-hidden bg-white/5">
                      <Image src={item.image} alt={item.name} fill className="object-cover opacity-80" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-sans text-sm uppercase tracking-wider font-light text-white">{item.name}</h3>
                          <button onClick={() => removeCartItem(item.id)} className="text-white/40 hover:text-white transition-colors">
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                        
                        <div className="mt-4 flex items-center gap-4">
                          <button 
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-sans text-xs text-white/80 w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="font-sans text-xs font-medium tracking-widest text-white/60">{item.price}€</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-6 mt-6 pb-8">
                <div className="flex justify-between font-sans text-sm uppercase tracking-widest font-light text-white mb-6">
                  <span>{dict.cart.total}</span>
                  <span>{cartTotal}€</span>
                </div>
                <TransitionLink
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex justify-center items-center w-full border border-white bg-white py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-white"
                >
                  {dict.cart.checkout}
                </TransitionLink>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-[101] flex w-full max-w-xs flex-col bg-white p-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute right-8 top-8 flex items-center justify-center w-12 h-12 rounded-full border border-black/10 text-black/60 transition-colors hover:text-black hover:border-black"
        >
          <X size={18} strokeWidth={1} />
        </button>

        <div className="mt-20 flex h-full flex-col justify-between">
          <nav className="flex flex-col gap-8">
            <a href="#collections" onClick={() => setIsMobileMenuOpen(false)} className="font-sans text-2xl font-light text-black/90 tracking-wide hover:text-black transition-colors">{dict.header.collections}</a>
            <a href="#histoire" onClick={() => setIsMobileMenuOpen(false)} className="font-sans text-2xl font-light text-black/90 tracking-wide hover:text-black transition-colors">{dict.header.history}</a>
            <a href="#technologie" onClick={() => setIsMobileMenuOpen(false)} className="font-sans text-2xl font-light text-black/90 tracking-wide hover:text-black transition-colors">{dict.header.technology}</a>
            <a href="#boutique" onClick={() => setIsMobileMenuOpen(false)} className="font-sans text-2xl font-light text-black/90 tracking-wide hover:text-black transition-colors">{dict.header.store}</a>
          </nav>

          <div className="border-t border-black/10 pt-6">
            <p className="font-sans text-xs text-black/40 uppercase tracking-widest">HOTT Équitation</p>
            <p className="mt-2 font-sans text-xs text-black/60">L'élégance absolue.</p>
          </div>
        </div>
      </div>
    </>
  )
}

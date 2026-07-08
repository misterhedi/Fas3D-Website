import { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  RotateCcw,
  Menu,
  X,
  ArrowRight,
  Phone,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Mail,
  Receipt,
  ShieldCheck,
  FileText,
  CreditCard,
  Briefcase,
  CheckCircle2,
  MapPin,
  PhoneCall,
  Globe2,
  Send,
  MessageSquare,
  Check,
  Box,
  Coins,
  Search,
  Lock,
  Heart,
} from "lucide-react";
import Scene3D from "./components/Scene3D";
import CheckoutModal from "./components/CheckoutModal";
import StatusChecker from "./components/StatusChecker";
import AdminDashboard from "./components/AdminDashboard";
import DuitkuSandbox from "./components/DuitkuSandbox";
import { SERVICE_PACKAGES, formatRupiah } from "./data";
import { ServicePackage } from "./types";
import TestimonialSlider from "./components/TestimonialSlider";
import WishlistModal from "./components/WishlistModal";
import CatalogModal from "./components/CatalogModal";
import AboutModal from "./components/AboutModal";
import LiveChatWidget from "./components/LiveChatWidget";
import FAQSection from "./components/FAQSection";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [soundOn, setSoundOn] = useState(false);
  const [cameraView, setCameraView] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Interactive Overlays
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeCheckoutPkg, setActiveCheckoutPkg] = useState<ServicePackage | null>(null);
  const [activeStatusView, setActiveStatusView] = useState(false);
  const [activeAdminView, setActiveAdminView] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<any | null>(null);

  // Core products mobile carousel state
  const productContainerRef = useRef<HTMLDivElement>(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  const handleProductScroll = () => {
    if (!productContainerRef.current) return;
    const { scrollLeft, clientWidth } = productContainerRef.current;
    if (clientWidth === 0) return;
    // Compute current active card index (0 to 3) based on scroll offset
    const index = Math.round(scrollLeft / (clientWidth * 0.8));
    setActiveProductIndex(Math.max(0, Math.min(3, index)));
  };

  // Load session & fetch backend wishlist if authenticated, or fallback to local storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("fas_auth_token");
    if (savedToken) {
      setAuthToken(savedToken);
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAuthUser(data.user);
            setWishlistIds(data.user.wishlistIds || []);
            localStorage.setItem("fas_wishlist_package_ids", JSON.stringify(data.user.wishlistIds || []));
          } else {
            localStorage.removeItem("fas_auth_token");
            setAuthToken(null);
            loadLocalWishlist();
          }
        })
        .catch((err) => {
          console.error("Failed to verify session on mount", err);
          loadLocalWishlist();
        });
    } else {
      loadLocalWishlist();
    }
  }, []);

  const loadLocalWishlist = () => {
    const saved = localStorage.getItem("fas_wishlist_package_ids");
    if (saved) {
      try {
        setWishlistIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  };

  const handleLoginSuccess = async (token: string, user: any) => {
    setAuthToken(token);
    setAuthUser(user);

    const backendWishlist = user.wishlistIds || [];
    
    // Merge local wishlist items with backend wishlist items
    const localSaved = localStorage.getItem("fas_wishlist_package_ids");
    let localIds: string[] = [];
    if (localSaved) {
      try {
        localIds = JSON.parse(localSaved);
      } catch (e) {
        console.error(e);
      }
    }

    // Merge unique values
    const mergedIds = Array.from(new Set([...backendWishlist, ...localIds]));
    
    // Update local state and localStorage
    setWishlistIds(mergedIds);
    localStorage.setItem("fas_wishlist_package_ids", JSON.stringify(mergedIds));

    // If local was merged or if backend is empty, update the database
    if (JSON.stringify(mergedIds.sort()) !== JSON.stringify(backendWishlist.sort())) {
      try {
        await fetch("/api/user/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ wishlistIds: mergedIds })
        });
      } catch (err) {
        console.error("Failed to sync merged wishlist on login", err);
      }
    }
  };

  const handleLogoutSuccess = () => {
    setAuthToken(null);
    setAuthUser(null);
  };

  const toggleWishlist = async (id: string) => {
    let next: string[] = [];
    setWishlistIds((prev) => {
      next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("fas_wishlist_package_ids", JSON.stringify(next));
      return next;
    });

    const savedToken = localStorage.getItem("fas_auth_token") || authToken;
    if (savedToken) {
      try {
        await fetch("/api/user/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedToken}`
          },
          body: JSON.stringify({ wishlistIds: next })
        });
      } catch (err) {
        console.error("Failed to sync toggleWishlist to backend", err);
      }
    }
  };

  const removeFromWishlist = async (id: string) => {
    let next: string[] = [];
    setWishlistIds((prev) => {
      next = prev.filter((item) => item !== id);
      localStorage.setItem("fas_wishlist_package_ids", JSON.stringify(next));
      return next;
    });

    const savedToken = localStorage.getItem("fas_auth_token") || authToken;
    if (savedToken) {
      try {
        await fetch("/api/user/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedToken}`
          },
          body: JSON.stringify({ wishlistIds: next })
        });
      } catch (err) {
        console.error("Failed to sync removeFromWishlist to backend", err);
      }
    }
  };
  const [activeSandboxPayment, setActiveSandboxPayment] = useState<{
    orderId: string;
    amount: number;
    customerName: string;
  } | null>(null);
  const [trackedOrderId, setTrackedOrderId] = useState("");

  // WhatsApp contact forms
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNeed, setClientNeed] = useState("sid");

  // Web Audio Synth references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Loader effect
  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 15) + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 400);
      }
      setProgress(p);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Scroll spy to change cameraView dynamically
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "products", "testimonials", "pricing", "legal", "contact"];
      let currentSection = "hero";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setCameraView(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync HTML class for theme
  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
    } else {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
    }
  }, [theme]);

  // Ambient sound synthesizer
  const toggleSound = () => {
    if (!soundOn) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        // Bass Drone (C2 = 65.41Hz)
        const osc1 = ctx.createOscillator();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(65.41, ctx.currentTime);

        // Fifth drone (G2 = 98.00Hz)
        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(98.00, ctx.currentTime);

        // Filter
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(220, ctx.currentTime);

        // LFO
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(100, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        // Ambient Gain (very soft)
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3.0);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        lfo.start();

        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
        filterRef.current = filter;
        gainRef.current = gain;
        lfoRef.current = lfo;

        setSoundOn(true);
      } catch (err) {
        console.error("Gagal menjalankan Web Audio Synthesizer:", err);
      }
    } else {
      // Fade out and stop
      const gain = gainRef.current;
      const ctx = audioCtxRef.current;
      if (gain && ctx) {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
        setTimeout(() => {
          try {
            osc1Ref.current?.stop();
            osc2Ref.current?.stop();
            lfoRef.current?.stop();
          } catch (e) {}
          setSoundOn(false);
        }, 1000);
      }
    }
  };

  // WhatsApp Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo PT FAS Technology Solutions, saya *${clientName}* (No: ${clientPhone}) tertarik untuk berdiskusi mengenai modul digitalisasi desa. Mohon informasi dan konsultasi lebih lanjut.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6281211223344?text=${encoded}`, "_blank");
  };

  // Handles checkout completion
  const handleCheckoutComplete = (
    orderId: string,
    paymentMethod: string,
    customerName: string,
    amount: number,
    paymentUrl?: string
  ) => {
    setActiveCheckoutPkg(null);

    if (paymentMethod === "DUITKU" && paymentUrl) {
      if (paymentUrl.includes("duitku-sandbox")) {
        // Launch custom simulator modal inside React
        setActiveSandboxPayment({
          orderId,
          amount,
          customerName,
        });
      } else {
        // Real Duitku popup or redirect
        window.open(paymentUrl, "_blank");
        // Open tracker for client comfort
        setTrackedOrderId(orderId);
        setActiveStatusView(true);
      }
    } else {
      // Manual Bank Transfer -> Open tracker directly to show upload instructions
      setTrackedOrderId(orderId);
      setActiveStatusView(true);
    }
  };

  // Handles simulated payment result
  const handleSandboxResult = (status: "paid" | "failed") => {
    const sandboxInfo = activeSandboxPayment;
    setActiveSandboxPayment(null);
    if (sandboxInfo) {
      setTrackedOrderId(sandboxInfo.orderId);
      setActiveStatusView(true);
    }
  };

  return (
    <div className={`relative min-h-screen text-[#f8fafc] overflow-x-hidden ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
      
      {/* 1. LOADING SCREEN */}
      {loading && (
        <div className="fixed inset-0 w-full h-full bg-[#050b14] z-[9999] flex flex-col justify-center items-center">
          <div className="text-center max-w-[420px] px-6">
            <div className="relative w-24 h-24 mx-auto mb-8 flex justify-center items-center">
              <span className="font-extrabold text-2xl tracking-tighter text-white drop-shadow-[0_0_12px_rgba(201,168,76,0.8)]">
                FAS
              </span>
              <div className="absolute inset-0 border-4 border-white/5 border-t-[#1e6bb8] border-r-[#c9a84c] rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">PT FAS Technology Solutions</h2>
            <p className="text-sm text-gray-400 mb-6">Menyiapkan Pengalaman 3D Interaktif...</p>
            <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#1e6bb8] to-[#c9a84c] transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="font-mono text-xs text-gray-300">{progress}%</span>
          </div>
        </div>
      )}

      {/* 2. 3D WEBGL INTERACTIVE BACKGROUND */}
      <Scene3D cameraView={cameraView} theme={theme} />

      {/* Atmospheric glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#0b2b4a] rounded-full blur-[140px] opacity-40 pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[#1e6bb8] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"></div>

      {/* 3. FLOAT / FIXED HUD & CONTROLS */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-auto">
        <button
          onClick={toggleSound}
          className="bg-[rgba(5,11,20,0.65)] hover:bg-[#1e6bb8] border border-white/10 text-white p-3 rounded-xl backdrop-blur-xl flex items-center gap-2 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          title={soundOn ? "Matikan Musik Latar" : "Nyalakan Musik Latar"}
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="text-[10px] uppercase tracking-wider font-bold hidden sm:inline">Musik</span>
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-[rgba(5,11,20,0.65)] hover:bg-[#1e6bb8] border border-white/10 text-white p-3 rounded-xl backdrop-blur-xl flex items-center gap-2 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          title="Ganti Tema Visual"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="text-[10px] uppercase tracking-wider font-bold hidden sm:inline">Tema</span>
        </button>

        <button
          onClick={() => setCameraView("hero")}
          className="bg-[rgba(5,11,20,0.65)] hover:bg-[#1e6bb8] border border-white/10 text-white p-3 rounded-xl backdrop-blur-xl flex items-center gap-2 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          title="Reset Sudut Kamera"
        >
          <RotateCcw size={16} />
          <span className="text-[10px] uppercase tracking-wider font-bold hidden sm:inline">Reset 3D</span>
        </button>
      </div>

      {/* 4. MAIN INTERACTIVE NAVIGATION HUD (BOTTOM LEFT) */}
      <div className="fixed bottom-6 left-6 z-40 max-w-[280px] p-4 bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-300 hidden md:block">
        <div className="text-[10px] font-extrabold tracking-widest text-[#c9a84c] mb-1 flex items-center gap-1.5 uppercase">
          <Box size={12} /> PANEL NAVIGASI 3D
        </div>
        <p className="text-[10px] text-gray-400 leading-normal mb-3">
          Gunakan mouse / sentuhan di latar belakang untuk memutar, memperbesar, dan mengeksplorasi model 3D FAS.
        </p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setCameraView("front")}
            className="w-full text-left text-[11px] font-semibold py-1.5 px-3 bg-white/5 hover:bg-[#1e6bb8] text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          >
            Fokus Depan
          </button>
          <button
            onClick={() => setCameraView("top")}
            className="w-full text-left text-[11px] font-semibold py-1.5 px-3 bg-white/5 hover:bg-[#1e6bb8] text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          >
            Fokus Atas
          </button>
          <button
            onClick={() => setCameraView("particles")}
            className="w-full text-left text-[11px] font-semibold py-1.5 px-3 bg-white/5 hover:bg-[#1e6bb8] text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          >
            Mode Partikel Bintang
          </button>
        </div>
      </div>

      {/* 5. OVERLAY CONTENT WRAPPER */}
      <main className="relative z-10 pointer-events-none w-full min-h-screen flex flex-col">
        
        {/* HEADER / NAVBAR */}
        <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-6xl bg-[rgba(5,11,20,0.85)] border border-white/10 h-16 rounded-2xl px-6 flex justify-between items-center z-[100] shadow-2xl backdrop-blur-xl pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#c9a84c] rotate-45 flex items-center justify-center shadow-[0_0_10px_rgba(201,168,76,0.3)]">
              <span className="-rotate-45 font-bold text-[10px]">FAS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[13px] tracking-widest uppercase">PT FAS Tech</span>
              <span className="text-[9px] text-[#c9a84c] font-medium tracking-wider uppercase">Technology Solutions</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1 items-center">
            <a href="#hero" className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all">Beranda</a>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              Tentang
            </button>
            <a href="#products" className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all">Produk</a>
            <a href="#testimonials" className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all">Testimoni</a>
            <a href="#pricing" className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all">Paket</a>
            <a href="#legal" className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all">Legalitas</a>
            <a href="#faq" className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all">FAQ</a>
            <a href="#contact" className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all">Kontak</a>
            
            <div className="w-[1px] h-6 bg-white/10 mx-2"></div>

            {/* Quick Action Payment Tracking Buttons */}
            <button
              onClick={() => {
                setTrackedOrderId("");
                setActiveStatusView(true);
              }}
              className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-[#1e6bb8] hover:border-transparent text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Lacak Invoice
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 rounded-xl border border-rose-500/20 hover:border-rose-500/30 transition-all flex items-center gap-1.5"
              title="Lihat Wishlist"
            >
              <Heart size={14} className={wishlistIds.length > 0 ? "fill-current text-rose-500" : ""} />
              <span className="text-[10px] uppercase font-mono font-bold">{wishlistIds.length}</span>
            </button>

            <button
              onClick={() => setActiveAdminView(true)}
              className="p-2 bg-white/5 hover:bg-[#c9a84c] text-gray-300 hover:text-[#050b14] rounded-xl border border-white/10 hover:border-transparent transition-all"
              title="Portal Back-office Admin"
            >
              <Lock size={14} />
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-[#c9a84c] transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="fixed top-22 left-4 w-[calc(100%-32px)] bg-[rgba(5,11,20,0.95)] border border-white/10 rounded-2xl p-4 z-[99] shadow-2xl backdrop-blur-2xl pointer-events-auto md:hidden space-y-3">
            <nav className="flex flex-col gap-1">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-wider py-2.5 px-4 text-gray-200 hover:bg-white/5 rounded-xl block">Beranda</a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAboutOpen(true);
                }}
                className="text-sm font-semibold uppercase tracking-wider py-2.5 px-4 text-gray-200 hover:bg-white/5 rounded-xl block text-left w-full"
              >
                Tentang
              </button>
              <a href="#products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-wider py-2.5 px-4 text-gray-200 hover:bg-white/5 rounded-xl block">Produk</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-wider py-2.5 px-4 text-gray-200 hover:bg-white/5 rounded-xl block">Testimoni</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-wider py-2.5 px-4 text-gray-200 hover:bg-white/5 rounded-xl block">Paket</a>
              <a href="#legal" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-wider py-2.5 px-4 text-gray-200 hover:bg-white/5 rounded-xl block">Legalitas</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-wider py-2.5 px-4 text-gray-200 hover:bg-white/5 rounded-xl block">FAQ</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-wider py-2.5 px-4 text-gray-200 hover:bg-white/5 rounded-xl block">Kontak</a>
            </nav>
            <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrackedOrderId("");
                  setActiveStatusView(true);
                }}
                className="w-full text-center py-2.5 bg-[#1e6bb8] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
              >
                Lacak Pembayaran
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWishlistOpen(true);
                }}
                className="w-full text-center py-2.5 bg-rose-500/15 border border-rose-500/20 text-rose-300 hover:text-rose-100 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
              >
                <Heart size={14} className={wishlistIds.length > 0 ? "fill-current text-rose-500" : ""} />
                Wishlist Saya ({wishlistIds.length})
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveAdminView(true);
                }}
                className="w-full text-center py-2.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl"
              >
                Portal Admin
              </button>
            </div>
          </div>
        )}

        {/* 1. HERO SECTION */}
        <section id="hero" className="relative min-h-screen w-full flex justify-center items-center px-6 pt-24 pb-12">
          <div className="max-w-4xl text-center pointer-events-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xl mb-6 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-ping"></span>
              <span className="text-[9px] font-mono font-bold text-[#c9a84c] tracking-[0.2em] uppercase">
                Solusi Teknologi Terpercaya
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              PT FAS <span className="bg-gradient-to-r from-[#1e6bb8] to-[#c9a84c] bg-clip-text text-transparent">Technology</span> Solutions
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Solusi Digital Terpadu untuk Desa Modern. Kami menghadirkan inovasi teknologi informasi tercanggih untuk mendigitalisasi layanan, administrasi, dan meningkatkan efisiensi kinerja pemerintahan daerah.
            </p>

            <div className="flex justify-center items-center gap-4 flex-wrap">
              <a
                href="#pricing"
                className="px-8 py-4 bg-[#1e6bb8] hover:bg-[#154f8a] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1e6bb8]/30 transition-all duration-300 flex items-center gap-2"
              >
                <span>Lihat Paket Layanan</span>
                <ArrowRight size={14} />
              </a>
              <a
                href="#contact"
                className="px-8 py-4 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <span>Hubungi Kami</span>
                <Phone size={14} />
              </a>
            </div>

            {/* Scrollhint */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
              <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400 font-mono">Gulir ke bawah</span>
              <div className="w-[1px] h-10 bg-gradient-to-b from-[#c9a84c] to-transparent"></div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT PROFILE SECTION */}
        <section id="about" className="relative min-h-screen w-full flex justify-center items-center px-6 py-24">
          <div className="max-w-5xl w-full pointer-events-auto">
            <div className="mb-12">
              <span className="font-mono text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase block mb-2">
                PROFIL PERUSAHAAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Inovasi Tiada Henti Untuk Kemajuan Desa
              </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-[#1e6bb8] transition-all duration-500 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1e6bb8]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#1e6bb8]/20 transition-all"></div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex justify-center items-center text-[#c9a84c] mb-6">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3">Visi Utama Kami</h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Menjadi mitra teknologi terdepan dan terpercaya dalam mewujudkan ekosistem pemerintahan desa yang modern, mandiri, transparan, akuntabel, dan berbasis digital sepenuhnya di seluruh penjuru Indonesia.
                </p>
              </div>

              <div className="bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-[#c9a84c] transition-all duration-500 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex justify-center items-center text-[#c9a84c] mb-6">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3">Misi Unggulan</h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  Mengembangkan produk perangkat lunak handal, praktis, dan aman untuk mengoptimalkan administrasi desa dan pelayanan publik.
                </p>
              </div>

              <div className="bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-[#06b6d4] transition-all duration-500 shadow-xl md:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex justify-center items-center text-[#c9a84c] mb-6">
                      <Users size={20} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Fokus Layanan dan Pengguna</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      Kami berfokus sepenuhnya untuk mendampingi Pemerintah Desa, Perangkat Desa, Badan Permusyawaratan Desa (BPD), serta masyarakat luas demi tercapainya tata kelola pemerintahan yang terpadu dan efisien.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
                    <span className="font-mono text-4xl font-extrabold text-[#c9a84c] block mb-1">50+</span>
                    <span className="text-xs uppercase tracking-wider font-bold text-gray-400">Desa Terdigitalisasi</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Selengkapnya Tentang Kami Button */}
            <div className="mt-12 text-center">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="inline-flex items-center gap-2.5 bg-[#c9a84c]/10 hover:bg-[#c9a84c] border border-[#c9a84c]/20 hover:border-transparent text-[#c9a84c] hover:text-slate-900 font-extrabold uppercase text-[11px] tracking-widest px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-yellow-950/10 hover:shadow-yellow-950/20 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles size={14} />
                <span>Selengkapnya Tentang FAS Technology</span>
              </button>
            </div>

          </div>
        </section>

        {/* 3. PRODUCTS PORTFOLIO SECTION */}
        <section id="products" className="relative min-h-screen w-full flex justify-center items-center px-6 py-24">
          <div className="max-w-5xl w-full pointer-events-auto">
            <div className="mb-12 text-center md:text-left">
              <span className="font-mono text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase block mb-2">
                LAYANAN DAN PORTFOLIO
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Produk Digital Unggulan Kami
              </h2>
              <p className="text-sm text-gray-400 mt-3 max-w-xl">
                Sistem ekosistem pintar nirkertas yang dirancang khusus untuk memodernisasi tata pamong dan pelayanan desa.
              </p>
            </div>

            {/* Core product cards - responsive horizontal carousel on mobile, grid on desktop */}
            <div
              ref={productContainerRef}
              onScroll={handleProductScroll}
              className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:grid-cols-2 gap-6 pb-6 md:pb-0 scrollbar-none scroll-smooth"
            >
              {[
                {
                  id: "sid",
                  title: "Sistem Informasi Desa (SID)",
                  badge: "Terpopuler",
                  icon: Globe,
                  iconColor: "bg-[#1e6bb8]",
                  desc: "Platform digital terintegrasi untuk pengelolaan administrasi, pelayanan publik, kependudukan, dan transparansi anggaran desa secara online.",
                  features: ["Database Kependudukan Akurat", "Portal Berita & Informasi Desa", "Grafik Statistik Desa Otomatis"]
                },
                {
                  id: "absensi",
                  title: "Absensi Online Perangkat",
                  badge: "Inovatif",
                  icon: Smartphone,
                  iconColor: "bg-[#c9a84c]",
                  desc: "Sistem pencatatan kehadiran berbasis lokasi (GPS) dan pengenalan wajah untuk perangkat desa guna meningkatkan kedisiplinan dan kinerja harian.",
                  features: ["Deteksi Wajah (Face Recognition)", "Radius Lokasi GPS Kantor Desa", "Laporan Kehadiran Bulanan PDF/Excel"]
                },
                {
                  id: "surat",
                  title: "Sistem Surat Menyurat",
                  badge: "Efisien",
                  icon: Mail,
                  iconColor: "bg-[#3b82f6]",
                  desc: "Digitalisasi birokrasi surat-menyurat dengan template otomatis, tanda tangan digital (TTE), serta pelacakan status permohonan surat secara real-time.",
                  features: ["50+ Kategori Surat Standar Desa", "Integrasi Tanda Tangan Digital", "Pengajuan Mandiri via Mobile App"]
                },
                {
                  id: "pbb",
                  title: "Sistem Pengelolaan PBB",
                  badge: "Akuntabel",
                  icon: Receipt,
                  iconColor: "bg-[#06b6d4]",
                  desc: "Solusi pelacakan tagihan, penagihan kolektif, dan pelaporan realisasi Pajak Bumi dan Bangunan (PBB) tingkat desa secara presisi, akurat, dan transparan.",
                  features: ["Pemetaan Blok PBB Interaktif", "Notifikasi Tagihan via WhatsApp", "Laporan Realisasi Pajak per Dusun"]
                }
              ].map((p) => {
                const IconComponent = p.icon;
                return (
                  <div
                    key={p.id}
                    className="group bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl flex flex-col hover:border-[#c9a84c] transition-all duration-500 w-[85vw] sm:w-[350px] md:w-auto shrink-0 snap-center"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className={`w-12 h-12 rounded-xl flex justify-center items-center text-white ${p.iconColor}`}>
                        <IconComponent size={22} />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-lg">
                        {p.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 tracking-tight">{p.title}</h3>
                    <p className="text-xs leading-relaxed text-gray-300 mb-6 flex-grow">{p.desc}</p>
                    
                    <ul className="space-y-2.5 mb-6">
                      {p.features.map((feat, i) => (
                        <li key={i} className="text-[11px] text-gray-400 flex items-center gap-2">
                          <Check size={12} className="text-[#c9a84c]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#pricing"
                      className="w-full text-center bg-white/5 hover:bg-[#1e6bb8] border border-white/10 hover:border-transparent text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 block"
                    >
                      Pesan Melalui Paket Layanan
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Mobile Carousel Navigation Dots & Touch Guidance */}
            <div className="flex flex-col items-center gap-3 mt-6 md:hidden">
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (productContainerRef.current) {
                        const container = productContainerRef.current;
                        const children = container.children;
                        if (children && children[idx]) {
                          children[idx].scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center"
                          });
                        }
                        setActiveProductIndex(idx);
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeProductIndex === idx
                        ? "w-6 bg-[#c9a84c]"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Pindah ke slide ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-[9px] text-gray-500 font-medium tracking-wider uppercase">
                Geser secara horizontal untuk melihat lebih banyak
              </span>
            </div>

            {/* Catalog Button Call to Action */}
            <div className="mt-12 text-center pointer-events-auto">
              <button
                onClick={() => setIsCatalogOpen(true)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#c9a84c] to-[#b0913c] hover:from-[#e3be56] hover:to-[#c9a84c] text-slate-900 font-extrabold uppercase text-[11px] tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-yellow-900/10 hover:shadow-yellow-900/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                <Box size={16} />
                Buka Katalog Lengkap (43 Produk & Layanan)
              </button>
            </div>

          </div>
        </section>

        {/* TESTIMONIAL SLIDER SECTION */}
        <TestimonialSlider theme={theme} />

        {/* 3B. NEW ONLINE PRICING & PAYMENT PACKAGES SECTION */}
        <section id="pricing" className="relative min-h-screen w-full flex justify-center items-center px-6 py-24 bg-black/10">
          <div className="max-w-5xl w-full pointer-events-auto">
            
            <div className="mb-12 text-center">
              <span className="font-mono text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase block mb-2">
                STRUKTUR HARGA KONTRAK
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Pilih Paket Layanan Digitalisasi Desa
              </h2>
              <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
                Dukung layanan modern instan dengan sistem berlangganan tahunan resmi yang dapat dibayar otomatis via Duitku PG atau transfer bank.
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {SERVICE_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative bg-[rgba(5,11,20,0.75)] border rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl ${
                    pkg.recommended 
                      ? "border-[#c9a84c] shadow-[#c9a84c]/5" 
                      : "border-white/10"
                  }`}
                >
                  {pkg.recommended && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-[#050b14] font-extrabold text-[8px] uppercase tracking-widest py-1.5 px-4 rounded-full">
                      PILIHAN UTAMA
                    </div>
                  )}

                  {/* Heart Wishlist Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(pkg.id);
                    }}
                    className="absolute top-5 right-5 z-10 p-2 bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-gray-400 hover:text-rose-400 rounded-xl transition-all duration-200"
                    title={wishlistIds.includes(pkg.id) ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
                  >
                    <Heart
                      size={14}
                      className={wishlistIds.includes(pkg.id) ? "fill-rose-500 text-rose-500" : ""}
                    />
                  </button>

                  <div>
                    {/* Header info */}
                    <div className="mb-6">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold mb-3 ${pkg.badgeColor}`}>
                        {pkg.badge}
                      </span>
                      <h3 className="text-base font-extrabold text-white tracking-tight">{pkg.title}</h3>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal">{pkg.subtitle}</p>
                    </div>

                    {/* Cost */}
                    <div className="mb-6 pb-6 border-b border-white/5">
                      <span className="text-xl font-extrabold text-[#c9a84c] tracking-tight">
                        {formatRupiah(pkg.price)}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono block">/ tahun</span>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-gray-300 mb-6 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Features checklist */}
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="text-[10px] text-gray-400 flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 size={12} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => setActiveCheckoutPkg(pkg)}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                      pkg.recommended
                        ? "bg-[#c9a84c] hover:bg-[#b0913c] text-[#050b14]"
                        : "bg-white/5 hover:bg-[#1e6bb8] text-white border border-white/10 hover:border-transparent"
                    }`}
                  >
                    Beli Paket Sekarang
                  </button>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. LEGALITAS SECTION */}
        <section id="legal" className="relative min-h-screen w-full flex justify-center items-center px-6 py-24">
          <div className="max-w-5xl w-full pointer-events-auto">
            <div className="mb-12">
              <span className="font-mono text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase block mb-2">
                KREDIBILITAS & REGULASI
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Dokumen Resmi & Legalitas Hukum
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                PT FAS Technology Solutions merupakan entitas perseroan terbatas resmi yang patuh pada aturan ketatanegaraan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="text-[#c9a84c] mb-6">
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Keabsahan Negara</h3>
                  <p className="text-xs leading-relaxed text-gray-400 mb-6">
                    Kami memprioritaskan rasa aman bagi para mitra desa dengan mendaftarkan instansi secara resmi pada Kemenkumham RI, Dirjen Pajak, dan lembaga berwenang lainnya.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-[#c9a84c]"><FileText size={18} /></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">SK Kemenkumham RI</span>
                      <span className="text-xs font-mono font-medium text-white">AHU-0062418.AH.01.01.Tahun 2023</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-[#c9a84c]"><CreditCard size={18} /></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">NPWP Perusahaan</span>
                      <span className="text-xs font-mono font-medium text-white">40.824.182.9-411.000</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-[#c9a84c]"><Briefcase size={18} /></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">NIB (Nomor Induk Berusaha)</span>
                      <span className="text-xs font-mono font-medium text-white">1209230045612</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1e6bb8]/15 via-[#c9a84c]/5 to-transparent border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center items-center text-center shadow-2xl">
                <div className="border-2 border-[#c9a84c] rounded-2xl p-6 mb-8 max-w-[200px] shadow-[0_0_20px_rgba(201,168,76,0.15)]">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-1">STANDAR</span>
                  <span className="text-xl font-extrabold text-[#c9a84c] block leading-tight mb-1">NASIONAL</span>
                  <span className="text-[8px] text-gray-300 font-medium block">SLA Keandalan & Keamanan</span>
                </div>
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-2.5 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <CheckCircle2 size={14} className="text-[#c9a84c] flex-shrink-0" />
                    <span className="text-[10px] font-semibold text-gray-200 text-left">SLA Server Aktif 99.9%</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <CheckCircle2 size={14} className="text-[#c9a84c] flex-shrink-0" />
                    <span className="text-[10px] font-semibold text-gray-200 text-left">Enkripsi Data Aman</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <CheckCircle2 size={14} className="text-[#c9a84c] flex-shrink-0" />
                    <span className="text-[10px] font-semibold text-gray-200 text-left">Dukungan Teknis Siap 24/7</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4B. FAQ SECTION */}
        <FAQSection />

        {/* 5. CONTACT SECTION */}
        <section id="contact" className="relative min-h-screen w-full flex justify-center items-center px-6 py-24">
          <div className="max-w-5xl w-full pointer-events-auto">
            <div className="mb-12">
              <span className="font-mono text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase block mb-2">
                SALURAN HUBUNGAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Hubungi Tim Ahli Kami
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Mari berkonsultasi secara gratis mengenai digitalisasi instansi di daerah Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-6">Informasi Kontak</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1e6bb8] text-white flex justify-center items-center flex-shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Alamat Kantor</h4>
                        <p className="text-xs text-gray-200 leading-relaxed">
                          Jl. Raya Malingping-Rangkasbitung Km. 2, Malingping, Lebak, Banten 42391
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#c9a84c] text-white flex justify-center items-center flex-shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">E-mail Resmi</h4>
                        <p className="text-xs text-gray-200 leading-relaxed">
                          info@fastech.id <br />
                          <span className="text-gray-400 font-mono">malingpingpos@gmail.com</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#06b6d4] text-white flex justify-center items-center flex-shrink-0">
                        <PhoneCall size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">WhatsApp Chat</h4>
                        <p className="text-xs text-gray-200 font-mono">
                          +62 812-1122-3344
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex justify-center items-center flex-shrink-0">
                        <Globe2 size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Website Resmi</h4>
                        <p className="text-xs text-gray-200 font-mono">
                          www.fastech.id
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Email / Chat Admin Direct:</span>
                  <a
                    href="https://wa.me/6281211223344?text=Halo%20PT%20FAS%20Technology%20Solutions,%20saya%20tertarik%20dengan%20produk%20digitalisasi%20desa."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 py-3 bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                <h3 className="text-xl font-bold mb-6">Konsultasi Kustomisasi</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                      Nama Instansi / Pribadi
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="cth. Desa Malingping Selatan"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1e6bb8] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="cth. 0812XXXXXXXX"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1e6bb8] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                      Kebutuhan Produk
                    </label>
                    <select
                      value={clientNeed}
                      onChange={(e) => setClientNeed(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1e6bb8] transition-all"
                    >
                      <option value="sid" className="bg-[#050b14] text-white">Sistem Informasi Desa (SID)</option>
                      <option value="absensi" className="bg-[#050b14] text-white">Absensi Online Perangkat</option>
                      <option value="surat" className="bg-[#050b14] text-white">Sistem Surat Menyurat</option>
                      <option value="pbb" className="bg-[#050b14] text-white">Sistem Pengelolaan PBB</option>
                      <option value="custom" className="bg-[#050b14] text-white">Solusi Custom Lainnya</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#1e6bb8] to-[#114275] hover:from-[#154f8a] hover:to-[#0f3761] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#1e6bb8]/20 transition-all flex justify-center items-center gap-2"
                  >
                    <span>Kirim via WhatsApp</span>
                    <Send size={12} />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full bg-[rgba(5,11,20,0.85)] border-t border-white/10 py-6 px-6 backdrop-blur-xl pointer-events-auto">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
            <p className="text-[10px] text-gray-400">
              &copy; 2026 PT FAS Technology Solutions. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
              Malingping, Lebak, Banten, Indonesia
            </span>
          </div>
        </footer>

      </main>

      {/* 6. MODAL INTERACTIVE DIALOG OVERLAYS (PORTALS) */}
      <LiveChatWidget />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* catalog portal */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
        onSelectForCheckout={(pkg) => {
          setIsCatalogOpen(false);
          setActiveCheckoutPkg(pkg);
        }}
      />

      {/* checkout portal */}
      {activeCheckoutPkg && (
        <CheckoutModal
          pkg={activeCheckoutPkg}
          onClose={() => setActiveCheckoutPkg(null)}
          onCheckoutComplete={handleCheckoutComplete}
        />
      )}

      {/* wishlist portal */}
      {wishlistOpen && (
        <WishlistModal
          wishlistIds={wishlistIds}
          onClose={() => setWishlistOpen(false)}
          onRemoveFromWishlist={removeFromWishlist}
          onSelectPackageForCheckout={(pkg) => {
            setWishlistOpen(false);
            setActiveCheckoutPkg(pkg);
          }}
        />
      )}

      {/* invoice status tracking portal */}
      {activeStatusView && (
        <div className="fixed inset-0 z-[1000] w-full h-full bg-black/80 flex justify-center items-center p-4 backdrop-blur-md">
          <StatusChecker
            initialOrderId={trackedOrderId}
            onBack={() => setActiveStatusView(false)}
          />
        </div>
      )}

      {/* back-office admin portal */}
      {activeAdminView && (
        <div className="fixed inset-0 z-[1000] w-full h-full bg-black/80 flex justify-center items-center p-4 backdrop-blur-md">
          <AdminDashboard
            onBack={() => setActiveAdminView(false)}
            onViewWishlist={() => setWishlistOpen(true)}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogoutSuccess}
          />
        </div>
      )}

      {/* Duitku simulated sandbox portal */}
      {activeSandboxPayment && (
        <DuitkuSandbox
          orderId={activeSandboxPayment.orderId}
          amount={activeSandboxPayment.amount}
          customerName={activeSandboxPayment.customerName}
          onPaymentResult={handleSandboxResult}
          onClose={() => setActiveSandboxPayment(null)}
        />
      )}

    </div>
  );
}

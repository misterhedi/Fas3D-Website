import { useState, useEffect } from "react";
import {
  X,
  Search,
  Filter,
  Check,
  ShoppingBag,
  Heart,
  Layers,
  ArrowRight,
  Info,
  Server,
  Code,
  DollarSign,
  HelpCircle,
  FileText
} from "lucide-react";
import { formatRupiah } from "../data";
import { ServicePackage } from "../types";

interface Product {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  billingPeriod: string;
  description: string;
  image: string;
  features: string[];
  attributes: Record<string, any>;
}

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectForCheckout: (pkg: ServicePackage) => void;
}

export default function CatalogModal({
  isOpen,
  onClose,
  wishlistIds,
  onToggleWishlist,
  onSelectForCheckout
}: CatalogModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("SEMUA KATEGORI");
  const [selectedType, setSelectedType] = useState("all");

  const categories = [
    "SEMUA KATEGORI",
    "PRODUK WEBSITE",
    "PRODUK SOFTWARE",
    "PRODUK SUBSCRIPTION",
    "LAYANAN JASA",
    "PRODUK DIGITAL",
    "HOSTING & DOMAIN"
  ];

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (err) {
      console.error("Gagal memuat produk dari API:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search products
  useEffect(() => {
    let result = products;

    if (selectedCategory !== "SEMUA KATEGORI") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.features.some(f => f.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  if (!isOpen) return null;

  const handleCheckoutClick = (product: Product) => {
    // Adapt product to ServicePackage interface for compatibility with existing CheckoutModal
    const adaptedPkg: ServicePackage = {
      id: product.id,
      title: product.name,
      subtitle: product.category,
      price: product.price,
      description: product.description,
      features: product.features
    };
    onSelectForCheckout(adaptedPkg);
  };

  const getBillingPeriodLabel = (period: string) => {
    switch (period) {
      case "monthly":
        return "/ bulan";
      case "yearly":
        return "/ tahun";
      case "per-session":
        return "/ sesi";
      case "per-project":
      case "one-time":
      default:
        return "";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "PRODUK WEBSITE":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
      case "PRODUK SOFTWARE":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
      case "PRODUK SUBSCRIPTION":
        return "bg-purple-500/15 text-purple-400 border border-purple-500/20";
      case "LAYANAN JASA":
        return "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/20";
      case "PRODUK DIGITAL":
        return "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20";
      case "HOSTING & DOMAIN":
        return "bg-pink-500/15 text-pink-400 border border-pink-500/20";
      default:
        return "bg-gray-500/15 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] w-full h-full bg-black/90 flex justify-center items-center p-4 backdrop-blur-md">
      <div className="bg-[#050b14] border border-white/10 w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 bg-white/5 border border-white/10 hover:bg-red-500 hover:border-transparent text-white p-2 rounded-full transition-all"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-[#0b1322] border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-[#c9a84c]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#c9a84c] font-bold block mb-1">
              PT FAS Technology Solutions
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              E-Catalog Produk & Layanan Digital
            </h2>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Temukan solusi digitalisasi lengkap terstandarisasi untuk desa, UMKM, instansi, dan ekosistem bisnis modern. Terintegrasi, aman, dan berstandar ISO 27001.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="p-4 md:p-6 bg-white/5 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Categories Tab Scroll */}
          <div className="w-full md:w-auto overflow-x-auto flex gap-2 pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-[10px] font-bold uppercase rounded-xl tracking-wider border whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#c9a84c] text-[#050b14] border-[#c9a84c] shadow-lg shadow-yellow-950/20"
                    : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.replace("PRODUK ", "")}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk atau fitur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/35 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c] transition-all"
            />
          </div>
        </div>

        {/* Catalog Body / Main Grid */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-black/15 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
              <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-mono">Membuka lemari arsip katalog produk...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <Layers size={40} className="text-gray-600 mb-3" />
              <p className="text-sm font-semibold">Produk tidak ditemukan</p>
              <p className="text-xs text-gray-500 mt-1">Coba gunakan kata kunci lain atau ubah filter kategori.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isSaved = wishlistIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="bg-[#0b1322]/80 border border-white/10 hover:border-[#c9a84c]/50 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 group hover:shadow-xl hover:shadow-black/25"
                  >
                    {/* Card Thumbnail Image */}
                    <div className="h-44 relative overflow-hidden bg-slate-900">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1322] to-transparent"></div>
                      
                      {/* Floating Category Badge */}
                      <span className={`absolute top-4 left-4 text-[8px] font-extrabold uppercase px-2 py-1 rounded-md tracking-wider ${getCategoryColor(p.category)}`}>
                        {p.category}
                      </span>

                      {/* Wishlist Icon Button */}
                      <button
                        onClick={() => onToggleWishlist(p.id)}
                        className={`absolute top-4 right-4 p-2 rounded-full border transition-all ${
                          isSaved
                            ? "bg-red-500/20 border-red-500 text-red-400"
                            : "bg-black/40 border-white/10 text-white hover:bg-white/10"
                        }`}
                        title={isSaved ? "Hapus dari Favorit" : "Simpan Favorit"}
                      >
                        <Heart size={12} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Card Description Area */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4 relative -mt-4 bg-[#0b1322]/95 rounded-t-2xl">
                      <div className="space-y-2">
                        <h3 className="text-sm font-extrabold text-white leading-snug group-hover:text-[#c9a84c] transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-[10.5px] leading-relaxed text-gray-400 font-sans line-clamp-3">
                          {p.description}
                        </p>
                      </div>

                      {/* Features Bullet List */}
                      {p.features && p.features.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[8px] uppercase font-bold tracking-widest text-[#c9a84c] block">Fitur Utama:</span>
                          <ul className="space-y-1">
                            {p.features.slice(0, 3).map((feat, idx) => (
                              <li key={idx} className="text-[9.5px] text-gray-300 flex items-start gap-1.5">
                                <Check size={10} className="text-emerald-400 mt-0.5 shrink-0" />
                                <span className="line-clamp-1">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Attributes (Technical Details) */}
                      {p.attributes && Object.keys(p.attributes).length > 0 && (
                        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] font-mono">
                          {Object.entries(p.attributes).slice(0, 3).map(([key, val]) => {
                            // Beautify keys like techStack -> Tech Stack
                            const beautifiedKey = key
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                              .replace(/^\w/, (c) => c.toUpperCase());
                            return (
                              <div key={key} className="text-gray-400">
                                <span className="text-gray-500">{beautifiedKey}:</span>{" "}
                                <span className="text-gray-300 font-sans font-bold">{String(val)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Pricing and Action row */}
                      <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[8px] text-gray-500 uppercase tracking-wider block">Harga</span>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-xs font-black text-[#c9a84c]">
                              {formatRupiah(p.price)}
                            </span>
                            <span className="text-[9px] text-gray-500 font-semibold">
                              {getBillingPeriodLabel(p.billingPeriod)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCheckoutClick(p)}
                          className="px-3.5 py-1.5 bg-[#1e6bb8] hover:bg-[#155394] text-white text-[10px] font-extrabold uppercase tracking-widest rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-blue-950/20"
                        >
                          <ShoppingBag size={11} />
                          Pesan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-6 bg-[#0b1322] border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-semibold">
            <Info size={12} className="text-[#c9a84c]" />
            <span>Mendukung pembayaran langsung via Transfer Manual & Pembayaran Instan Terenkripsi.</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Tutup Katalog
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

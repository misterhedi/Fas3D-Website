import { useState, useEffect } from "react";
import { X, Heart, Trash2, ArrowRight, ShoppingCart, Sparkles } from "lucide-react";
import { ServicePackage } from "../types";
import { formatRupiah, SERVICE_PACKAGES } from "../data";

interface WishlistModalProps {
  wishlistIds: string[];
  onClose: () => void;
  onRemoveFromWishlist: (id: string) => void;
  onSelectPackageForCheckout: (pkg: ServicePackage) => void;
}

export default function WishlistModal({
  wishlistIds,
  onClose,
  onRemoveFromWishlist,
  onSelectPackageForCheckout,
}: WishlistModalProps) {
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          const adaptedProducts = data.products.map((p: any) => ({
            id: p.id,
            title: p.name,
            subtitle: p.category,
            price: p.price,
            description: p.description,
            features: p.features,
            badge: p.category.replace("PRODUK ", ""),
            badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
            billingPeriod: p.billingPeriod
          }));
          setCatalogProducts(adaptedProducts);
        }
      })
      .catch((err) => console.error("Wishlist products load error:", err));
  }, []);

  // Map wishlistIds to full ServicePackage objects from both static packages and dynamic products
  const allPackages = [...SERVICE_PACKAGES, ...catalogProducts];
  const savedPackages = allPackages.filter((pkg) => wishlistIds.includes(pkg.id));

  return (
    <div className="fixed inset-0 z-[1100] w-full h-full bg-black/85 flex justify-center items-center p-4 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b1322] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-white/5 border border-white/10 hover:bg-red-500 hover:border-transparent text-white p-2 rounded-full transition-all"
          title="Tutup Wishlist"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="bg-[#111c30] p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] flex justify-center items-center">
            <Heart size={20} className="fill-current" />
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#c9a84c] font-bold block mb-0.5">
              FAVORIT LAYANAN ANDA
            </span>
            <h3 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Wishlist Paket Layanan Desa
              <span className="bg-white/5 px-2 py-0.5 rounded-md text-xs font-mono font-bold text-gray-300 border border-white/10">
                {savedPackages.length}
              </span>
            </h3>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          {savedPackages.length === 0 ? (
            <div className="py-12 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex justify-center items-center text-gray-500">
                <Heart size={32} />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Wishlist Kosong</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Anda belum menyimpan paket layanan apa pun. Ketuk ikon hati pada kartu harga paket untuk menyimpannya di sini.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#c9a84c] text-[#050b14] rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-[#b0913c] transition-all"
              >
                Jelajahi Paket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                >
                  <div className="space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-bold ${pkg.badgeColor}`}>
                        {pkg.badge}
                      </span>
                      {pkg.recommended && (
                        <span className="bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                          <Sparkles size={8} /> Unggulan
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-extrabold text-white leading-tight">
                      {pkg.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 max-w-md leading-relaxed">
                      {pkg.description}
                    </p>
                    <div className="text-xs font-bold text-[#c9a84c] font-mono">
                      {formatRupiah(pkg.price)} <span className="text-[10px] text-gray-500">
                        {pkg.billingPeriod === "monthly" ? " / bulan" : pkg.billingPeriod === "yearly" ? " / tahun" : pkg.billingPeriod === "per-session" ? " / sesi" : pkg.billingPeriod === "one-time" ? "" : " / tahun"}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => onSelectPackageForCheckout(pkg)}
                      className="flex-grow sm:flex-grow-0 px-4 py-2.5 bg-[#1e6bb8] hover:bg-[#154f8a] text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ShoppingCart size={12} />
                      Beli
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(pkg.id)}
                      className="px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                      title="Hapus dari Favorit"
                    >
                      <Trash2 size={12} />
                      <span className="sm:hidden">Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#070d17] p-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-500">
            * Wishlist Anda disimpan secara lokal di browser ini agar dapat diakses kapan saja.
          </p>
        </div>

      </div>
    </div>
  );
}

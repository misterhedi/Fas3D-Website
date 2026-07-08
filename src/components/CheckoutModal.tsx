import { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  CreditCard,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Info,
} from "lucide-react";
import { ServicePackage } from "../types";
import { formatRupiah, BANK_ACCOUNTS } from "../data";

interface CheckoutModalProps {
  pkg: ServicePackage;
  onClose: () => void;
  onCheckoutComplete: (orderId: string, paymentMethod: string, customerName: string, amount: number, paymentUrl?: string) => void;
}

export default function CheckoutModal({ pkg, onClose, onCheckoutComplete }: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientVillage, setClientVillage] = useState("");
  
  // Payment Method selection
  const [paymentType, setPaymentType] = useState<"DUITKU" | "MANUAL">("DUITKU");
  const [manualBank, setManualBank] = useState<"BCA" | "MANDIRI" | "BNI" | "BRI">("BCA");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    const chosenMethod = paymentType === "DUITKU" ? "DUITKU" : `TRANSFER_${manualBank}`;

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          clientVillage,
          packageName: pkg.title,
          amount: pkg.price,
          paymentMethod: chosenMethod,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onCheckoutComplete(
          data.transaction.orderId,
          chosenMethod,
          clientName,
          pkg.price,
          data.transaction.paymentUrl
        );
      } else {
        alert("Gagal membuat transaksi: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghubungi server pembayaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] w-full h-full bg-black/85 flex justify-center items-center p-4 backdrop-blur-md">
      <div className="bg-[#0b1322] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-white/5 border border-white/10 hover:bg-red-500 hover:border-transparent text-white p-2 rounded-full transition-all"
        >
          <X size={16} />
        </button>

        {/* Header summary of selected plan */}
        <div className="bg-[#111c30] p-6 border-b border-white/5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#c9a84c] font-bold block mb-1">
            FORMULIR PEMESANAN PAKET
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-white mb-1">
            {pkg.title}
          </h3>
          <p className="text-xs text-gray-400">
            Nilai Kontrak Layanan: <span className="text-[#c9a84c] font-bold">{formatRupiah(pkg.price)}</span> / tahun
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex border-b border-white/5 text-center text-xs">
          <div className={`w-1/2 py-3 font-semibold ${step === 1 ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-gray-500"}`}>
            1. Data Instansi
          </div>
          <div className={`w-1/2 py-3 font-semibold ${step === 2 ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-gray-500"}`}>
            2. Metode Pembayaran
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {step === 1 ? (
            <div className="space-y-4">
              
              {/* Name input */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nama Kontak Penanggung Jawab
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="cth. Budiono Siregar"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#c9a84c] transition-all"
                  />
                </div>
              </div>

              {/* Email input */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                  Alamat E-mail Aktif
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cth. budiono@desa-maju.id"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#c9a84c] transition-all"
                  />
                </div>
              </div>

              {/* Phone input */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nomor WhatsApp / Telp
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="cth. 081234567890"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#c9a84c] transition-all"
                  />
                </div>
              </div>

              {/* Village Address */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nama Desa / Kantor Instansi
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={clientVillage}
                    onChange={(e) => setClientVillage(e.target.value)}
                    placeholder="cth. Desa Malingping Barat, Kec. Malingping"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#c9a84c] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1e6bb8] hover:bg-[#154f8a] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all flex justify-center items-center gap-1.5"
                >
                  <span>Pilih Metode Pembayaran</span>
                  <ChevronRight size={14} />
                </button>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Payment Methods tabs switcher */}
              <div>
                <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                  Gerbang Saluran Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaymentType("DUITKU")}
                    className={`flex items-center justify-center gap-1.5 py-3 rounded-lg text-xs font-bold transition-all ${
                      paymentType === "DUITKU"
                        ? "bg-[#1e6bb8] text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <QrCode size={14} />
                    <span>Duitku Instan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("MANUAL")}
                    className={`flex items-center justify-center gap-1.5 py-3 rounded-lg text-xs font-bold transition-all ${
                      paymentType === "MANUAL"
                        ? "bg-[#1e6bb8] text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Transfer Manual</span>
                  </button>
                </div>
              </div>

              {/* Payment Type Conditional Displays */}
              {paymentType === "DUITKU" ? (
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="text-blue-400 flex-shrink-0 mt-0.5"><Info size={16} /></div>
                    <p className="text-[11px] text-gray-300 leading-normal">
                      Mendukung pembayaran otomatis, verifikasi instan real-time via QRIS, GoPay, OVO, ShopeePay, Virtual Account (BCA, Mandiri, BNI, BRI), dan kartu kredit.
                    </p>
                  </div>
                  <div className="flex justify-between items-center bg-black/30 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Mitra Keuangan Resmi:</span>
                    <span className="text-[10px] font-mono font-extrabold text-blue-400 tracking-tighter">DUITKU PG</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-400">
                    Pilih bank tujuan untuk pengiriman bukti transfer secara manual:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["BCA", "MANDIRI", "BNI", "BRI"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setManualBank(bank as any)}
                        className={`py-3 px-4 rounded-xl text-xs font-mono font-extrabold border text-center transition-all ${
                          manualBank === bank
                            ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        Bank {bank}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 bg-[#c9a84c]/5 border border-[#c9a84c]/10 rounded-xl text-[10px] text-[#c9a84c] leading-relaxed">
                    * Pembayaran manual memerlukan verifikasi dari tim administrasi PT FAS (biasanya 5-15 menit setelah upload kuitansi).
                  </div>
                </div>
              )}

              {/* Actions buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 border border-white/10 hover:border-white/20 text-gray-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-gradient-to-r from-[#1e6bb8] to-[#114275] hover:from-[#154f8a] hover:to-[#0f3761] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-1.5"
                >
                  <span>{isSubmitting ? "Memproses..." : "Konfirmasi Pembelian"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          )}
        </form>

        {/* Shield compliance badge */}
        <div className="bg-[#090f1a] px-6 py-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-mono">
          <ShieldCheck size={12} className="text-[#c9a84c]" />
          <span>Transaksi Anda terlindungi enkripsi 256-bit Secure Socket Layer (SSL).</span>
        </div>
      </div>
    </div>
  );
}

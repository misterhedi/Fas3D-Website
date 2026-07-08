import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, CreditCard, QrCode, Wallet, Landmark, RefreshCw } from "lucide-react";
import { formatRupiah } from "../data";

interface DuitkuSandboxProps {
  orderId: string;
  amount: number;
  customerName: string;
  onPaymentResult: (status: "paid" | "failed") => void;
  onClose: () => void;
}

export default function DuitkuSandbox({
  orderId,
  amount,
  customerName,
  onPaymentResult,
  onClose,
}: DuitkuSandboxProps) {
  const [selectedMethod, setSelectedMethod] = useState<"QRIS" | "VA" | "EWALLET">("QRIS");
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerCallback = async (status: "paid" | "failed") => {
    setIsProcessing(true);
    try {
      // Direct call to simulate-callback
      const response = await fetch("/api/admin/simulate-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          success: status === "paid"
        })
      });

      const res = await response.json();
      if (res.success) {
        onPaymentResult(status);
      } else {
        alert("Gagal memproses simulasi: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Koneksi gagal saat memicu callback.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] w-full h-full bg-[#050b14]/90 backdrop-blur-md flex justify-center items-center p-4">
      <div className="bg-[#0b1322] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Header bar mimicking Duitku gateway design */}
        <div className="bg-gradient-to-r from-[#111c30] to-[#1a2d4c] px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white p-1.5 rounded-lg font-bold text-xs tracking-tighter">
              DUITKU
            </div>
            <span className="text-[10px] uppercase font-mono font-bold text-blue-400 tracking-widest">
              SANDBOX SIMULATOR
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            ID: {orderId}
          </span>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <span className="text-xs text-gray-400 block mb-1">Total Tagihan Pembayaran</span>
            <span className="text-2xl font-extrabold text-[#c9a84c] tracking-tight">
              {formatRupiah(amount)}
            </span>
            <span className="text-[11px] text-gray-500 block mt-1">
              Pelanggan: {customerName}
            </span>
          </div>

          {/* Payment Methods tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setSelectedMethod("QRIS")}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                selectedMethod === "QRIS"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <QrCode size={16} />
              <span>QRIS</span>
            </button>
            <button
              onClick={() => setSelectedMethod("VA")}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                selectedMethod === "VA"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Landmark size={16} />
              <span>Virtual Account</span>
            </button>
            <button
              onClick={() => setSelectedMethod("EWALLET")}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                selectedMethod === "EWALLET"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Wallet size={16} />
              <span>E-Wallet</span>
            </button>
          </div>

          {/* Method Details */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8 flex flex-col items-center text-center">
            {selectedMethod === "QRIS" && (
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 rounded-xl mb-3 shadow-md">
                  {/* Real-looking mock QRIS */}
                  <div className="w-36 h-36 bg-gray-200 flex flex-col justify-center items-center border border-black/10">
                    <span className="font-extrabold text-[10px] text-black">QRIS INDONESIA</span>
                    <div className="w-28 h-28 bg-black flex items-center justify-center relative">
                      <div className="absolute inset-2 bg-white flex flex-wrap p-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1/4 h-1/4 ${
                              (i * 3 + 5) % 2 === 0 ? "bg-black" : "bg-white"
                            }`}
                          ></div>
                        ))}
                      </div>
                      <div className="w-6 h-6 bg-blue-600 z-10 rounded-sm border-2 border-white flex justify-center items-center text-[8px] font-bold text-white">
                        FAS
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs">
                  Scan QR menggunakan e-wallet GoPay, OVO, Dana, LinkAja, ShopeePay, atau Mobile Banking pilihan Anda.
                </p>
              </div>
            )}

            {selectedMethod === "VA" && (
              <div className="w-full text-left space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">BANK MANDIRI VA</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-mono text-base font-bold text-white">8831 2345 6789 0123</span>
                    <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">Copy</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">BCA VIRTUAL ACCOUNT</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-mono text-base font-bold text-white">1234 5081 2112 2334</span>
                    <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">Copy</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 text-center leading-normal">
                  Penyedia VA lain seperti BNI, BRI, Permata, Danamon didukung penuh di backend Duitku API.
                </p>
              </div>
            )}

            {selectedMethod === "EWALLET" && (
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex justify-center items-center text-[10px] font-bold text-white">G</div>
                    <span className="text-xs font-semibold">OVO / GoPay Direct</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Terhubung</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex justify-center items-center text-[10px] font-bold text-white">D</div>
                    <span className="text-xs font-semibold">ShopeePay / DANA</span>
                  </div>
                  <span className="text-[10px] text-blue-400">Terhubung</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Simulation Controls */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-1.5 justify-center">
              <RefreshCw size={12} className="animate-spin" /> SIMULASI STATUS CALLBACK
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => triggerCallback("paid")}
                disabled={isProcessing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle size={14} />
                <span>BAYAR SUKSES</span>
              </button>

              <button
                onClick={() => triggerCallback("failed")}
                disabled={isProcessing}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-lg shadow-red-600/20"
              >
                <AlertTriangle size={14} />
                <span>SIMULASI GAGAL</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200"
            >
              Batal / Tutup Portal
            </button>
          </div>
        </div>

        {/* Footer simulation warnings */}
        <div className="bg-[#090f1a] px-6 py-3 text-center text-[10px] text-gray-500 border-t border-white/5">
          Lingkungan Uji Coba Sandbox. Transaksi ini murni simulasi interaktif.
        </div>
      </div>
    </div>
  );
}

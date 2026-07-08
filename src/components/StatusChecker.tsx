import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  UploadCloud,
  FileCheck,
  ArrowLeft,
  Copy,
  Check,
  Download,
  ShieldAlert,
} from "lucide-react";
import { Transaction } from "../types";
import { formatRupiah, BANK_ACCOUNTS } from "../data";

interface StatusCheckerProps {
  initialOrderId?: string;
  onBack?: () => void;
}

export default function StatusChecker({ initialOrderId = "", onBack }: StatusCheckerProps) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [tx, setTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const fetchStatus = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/payment/status/${id.trim()}`);
      const data = await res.json();
      if (data.success) {
        setTx(data.transaction);
      } else {
        setError(data.message || "Transaksi tidak ditemukan.");
        setTx(null);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server untuk memverifikasi status.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchStatus(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setOrderId(searchQuery.trim());
      fetchStatus(searchQuery.trim());
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // Drag and Drop & File Upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diizinkan (PNG, JPG, JPEG).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Maksimal ukuran file adalah 8MB.");
      return;
    }

    setUploadProgress("uploading");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64 || !tx) return;

      try {
        const response = await fetch("/api/payment/upload-proof", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: tx.orderId,
            proofImage: base64
          })
        });

        const res = await response.json();
        if (res.success) {
          setUploadProgress("success");
          setTx(res.transaction);
        } else {
          setUploadProgress("error");
          alert("Gagal mengunggah: " + res.message);
        }
      } catch (err) {
        console.error(err);
        setUploadProgress("error");
        alert("Terjadi kesalahan jaringan.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl bg-[rgba(5,11,20,0.85)] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
      
      {/* Back CTA */}
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#c9a84c] hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Beranda
        </button>
        <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 font-bold">
          PELACAKAN INVOICE
        </span>
      </div>

      {/* Query Search Form */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Masukkan ID Transaksi (cth. FAS-1718-X)"
            required
            className="w-full bg-white/5 border border-white/10 focus:border-[#1e6bb8] text-white rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold focus:outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#1e6bb8] hover:bg-[#154f8a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
        >
          Cari
        </button>
      </form>

      {isLoading && (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-white/5 border-t-[#c9a84c] rounded-full animate-spin mb-4"></div>
          <span className="text-xs text-gray-400">Memeriksa status dari ledger...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <AlertCircle className="mx-auto text-red-400 mb-2" size={24} />
          <p className="text-sm font-bold text-red-200">{error}</p>
          <p className="text-xs text-gray-400 mt-1">Pastikan kode ID yang Anda masukkan sudah benar.</p>
        </div>
      )}

      {tx && !isLoading && (
        <div className="space-y-6">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/5 border border-white/5 p-5 rounded-2xl">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">ID Transaksi / Order</span>
              <span className="text-sm font-mono font-bold text-white">{tx.orderId}</span>
            </div>

            <div className="flex items-center gap-2">
              {tx.status === "paid" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle size={12} /> LUNAS
                </span>
              )}
              {tx.status === "pending" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">
                  <Clock size={12} /> MENUNGGU PEMBAYARAN
                </span>
              )}
              {tx.status === "pending_verification" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FileCheck size={12} /> VERIFIKASI BUKTI
                </span>
              )}
              {tx.status === "failed" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  <XCircle size={12} /> GAGAL
                </span>
              )}
              {tx.status === "expired" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                  <Clock size={12} /> KADALUARSA
                </span>
              )}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Rincian Paket</h4>
            <div className="grid grid-cols-2 gap-y-3 text-xs">
              <span className="text-gray-400">Paket Layanan:</span>
              <span className="text-white text-right font-bold">{tx.packageName}</span>
              
              <span className="text-gray-400">Nama Pelanggan:</span>
              <span className="text-white text-right font-medium">{tx.customerName}</span>
              
              <span className="text-gray-400">Instansi Desa:</span>
              <span className="text-white text-right font-medium">{tx.customerVillage || "-"}</span>

              <span className="text-gray-400">WhatsApp / Telp:</span>
              <span className="text-white text-right font-medium">{tx.customerPhone}</span>

              <span className="text-gray-400">Metode Pembayaran:</span>
              <span className="text-[#c9a84c] text-right font-bold">{tx.paymentMethod.replace("TRANSFER_", "Manual: ")}</span>
            </div>

            <div className="border-t border-white/5 pt-4 mt-2 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-300">Total Nominal</span>
              <span className="text-lg font-extrabold text-[#c9a84c]">{formatRupiah(tx.amount)}</span>
            </div>
          </div>

          {/* Action-based Content depending on Status */}
          {tx.status === "paid" && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex justify-center items-center mx-auto mb-3">
                <FileText size={20} />
              </div>
              <h5 className="font-extrabold text-sm text-emerald-400 mb-1">Terima Kasih, Pembayaran Diterima!</h5>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                Pembelian Anda telah tervalidasi di sistem. Tim teknis kami akan segera menghubungi Anda dalam 1x24 jam untuk instalasi.
              </p>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                <Download size={12} /> Cetak Invoice Resmi
              </button>
            </div>
          )}

          {tx.status === "pending" && tx.paymentMethod.startsWith("TRANSFER_") && (
            <div className="space-y-6">
              
              {/* Bank Transfer Instructions */}
              <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/10 rounded-2xl p-6">
                <h5 className="font-extrabold text-xs text-[#c9a84c] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Petunjuk Transfer Bank Manual
                </h5>
                <p className="text-xs text-gray-300 mb-4 leading-normal">
                  Mohon transfer sesuai nominal persis ke rekening perusahaan berikut sebelum batas waktu berakhir:
                </p>

                {/* Account Details Box */}
                {(() => {
                  const targetBank = tx.paymentMethod.replace("TRANSFER_", "");
                  const bankDetails = BANK_ACCOUNTS.find((b) => b.bankName.toLowerCase().includes(targetBank.toLowerCase())) 
                    || BANK_ACCOUNTS[0];

                  return (
                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <span className="text-gray-400">Nama Bank:</span>
                        <span className="text-white text-right font-bold">{bankDetails.bankName}</span>

                        <span className="text-gray-400">Nomor Rekening:</span>
                        <div className="flex justify-end items-center gap-1.5">
                          <span className="text-white font-mono font-bold">{bankDetails.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bankDetails.accountNumber, "ac")}
                            className="text-gray-400 hover:text-white"
                          >
                            {copiedAccount === "ac" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>

                        <span className="text-gray-400">Atas Nama:</span>
                        <span className="text-white text-right font-medium">{bankDetails.accountHolder}</span>

                        <span className="text-gray-300 font-bold border-t border-white/5 pt-2 mt-1">Nominal Transfer:</span>
                        <span className="text-[#c9a84c] text-right font-mono font-extrabold border-t border-white/5 pt-2 mt-1">
                          {formatRupiah(tx.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Drag and Drop Uploader */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-gray-300 uppercase tracking-widest">Unggah Bukti Pembayaran</h5>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col justify-center items-center text-center transition-all cursor-pointer ${
                    dragActive
                      ? "border-[#c9a84c] bg-[#c9a84c]/5"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  }`}
                >
                  <input
                    type="file"
                    id="proof-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="proof-upload" className="w-full h-full flex flex-col justify-center items-center cursor-pointer">
                    <div className="bg-white/5 p-3.5 rounded-full text-[#c9a84c] mb-3">
                      <UploadCloud size={24} />
                    </div>
                    <span className="text-xs font-bold text-white mb-1">
                      {uploadProgress === "uploading" ? "Sedang Mengunggah..." : "Pilih atau Seret Foto Bukti Transfer"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Format PNG, JPG, JPEG maks 8MB.
                    </span>
                  </label>
                </div>

                {uploadProgress === "uploading" && (
                  <div className="text-center text-xs text-[#c9a84c] animate-pulse font-medium">
                    Mentransmisikan file gambar kuitansi...
                  </div>
                )}
              </div>

            </div>
          )}

          {tx.status === "pending" && tx.paymentMethod === "DUITKU" && (
            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl text-center space-y-4">
              <Clock className="text-[#c9a84c] mx-auto animate-pulse" size={32} />
              <h5 className="font-extrabold text-sm">Menunggu Pembayaran Instan Duitku</h5>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-normal">
                Selesaikan pembayaran Anda menggunakan QRIS, e-wallet, atau bank Virtual Account Anda dengan membuka portal Duitku.
              </p>
              {tx.paymentUrl && (
                <a
                  href={tx.paymentUrl}
                  className="inline-block px-6 py-3.5 bg-[#1e6bb8] hover:bg-[#154f8a] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Bayar Sekarang via Duitku
                </a>
              )}
            </div>
          )}

          {tx.status === "pending_verification" && (
            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6 text-center space-y-3">
              <FileCheck className="text-cyan-400 mx-auto" size={36} />
              <h5 className="font-extrabold text-sm text-cyan-400">Bukti Pembayaran Sedang Diverifikasi</h5>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-normal">
                Anda telah berhasil mengunggah bukti pembayaran. Tim administrator PT FAS sedang meneliti transfer dana Anda. Status akan diperbarui dalam beberapa menit.
              </p>
            </div>
          )}

          {tx.status === "failed" && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 text-center space-y-3">
              <XCircle className="text-red-400 mx-auto" size={36} />
              <h5 className="font-extrabold text-sm text-red-400">Pembayaran Gagal</h5>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-normal">
                Mohon maaf, transaksi pembayaran Anda ditolak atau dinyatakan gagal oleh gerbang pembayaran.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

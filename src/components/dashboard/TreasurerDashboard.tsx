import { useState, useEffect } from "react";
import {
  TrendingUp,
  CreditCard,
  Check,
  X,
  FileText,
  DollarSign,
  Download,
  RotateCcw,
  RefreshCw,
  Image
} from "lucide-react";
import { formatRupiah } from "../../data";

interface TreasurerDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function TreasurerDashboard({ token, onLogout }: TreasurerDashboardProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"verify" | "all" | "stats">("verify");
  
  // zoom proof slip modal
  const [zoomedSlip, setZoomedSlip] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setTransactions(data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (orderId: string, status: "paid" | "failed") => {
    const confirmationMsg = status === "paid" 
      ? "Sahkan transaksi pembayaran ini? Kontrak akan diaktifkan dan komisi reseller otomatis dikreditkan."
      : "Batalkan / nyatakan pembayaran transfer ini tidak sah?";
      
    if (!confirm(confirmationMsg)) return;

    try {
      const res = await fetch(`/api/admin/transactions/${orderId}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        alert("Transaksi berhasil diverifikasi!");
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefund = async (orderId: string) => {
    if (!confirm("Proses pengembalian dana (refund) untuk transaksi ini?")) return;
    try {
      const res = await fetch(`/api/admin/transactions/${orderId}/refund`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("Status transaksi diubah menjadi REFUNDED.");
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportFinancialReport = () => {
    // Simulated direct download of excel
    const headers = "ID Transaksi,Nama Klien,Desa,Paket,Metode Pembayaran,Jumlah,Status,Tanggal\n";
    let rows = "";
    transactions.forEach((t) => {
      rows += `"${t.orderId}","${t.customerName}","${t.customerVillage}","${t.packageName}","${t.paymentMethod}",${t.amount},"${t.status}","${t.createdAt}"\n`;
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `laporan_keuangan_fastech_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingVerification = transactions.filter((t) => t.status === "pending_verification");
  const totalIncome = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest block mb-1">
            Bendahara Keuangan Level
          </span>
          <h2 className="text-xl font-bold tracking-tight">Divisi Keuangan & Verifikasi Billing (Bendahara)</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTransactions}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Financial Mini KPI HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Omset Kumulatif</span>
            <div className="text-base font-extrabold text-emerald-400 font-mono">{formatRupiah(totalIncome)}</div>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Menunggu Verifikasi</span>
            <div className="text-base font-extrabold text-yellow-400 font-mono">{pendingVerification.length} Transaksi</div>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
            <CreditCard size={20} className="animate-pulse" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Laporan Buku Kas</span>
            <button
              onClick={handleExportFinancialReport}
              className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-1 hover:underline pt-0.5"
            >
              <Download size={10} /> Ekspor Excel (.csv)
            </button>
          </div>
          <div className="p-3 bg-[#c9a84c]/10 rounded-xl text-[#c9a84c]">
            <FileText size={20} />
          </div>
        </div>
      </div>

      {/* Target & Capaian Pendapatan Bulanan */}
      <div className="bg-[#1e293b]/30 border border-white/5 rounded-3xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Target & Capaian Pendapatan Kuartal III</h4>
            <p className="text-[10px] text-gray-400">Akumulasi target omset penjualan sistem desa digital PT FAS.</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-gray-300 font-medium">Progress: </span>
            <span className="text-xs font-mono font-bold text-emerald-400">{Math.min(100, Math.round((totalIncome / 120000000) * 100))}%</span>
            <span className="text-[10px] text-gray-500 font-mono"> (Goal: Rp 120.000.000)</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/5 rounded-full h-3.5 overflow-hidden p-0.5 border border-white/10">
          <div 
            style={{ width: `${Math.max(4, Math.min(100, Math.round((totalIncome / 120000000) * 100)))}%` }}
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
          ></div>
        </div>

        <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">
          <span>Sangat Awal</span>
          <span>Desa Mandiri 50%</span>
          <span>Target Terlampaui 100%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveTab("verify")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "verify" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Butuh Verifikasi ({pendingVerification.length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "all" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Semua Riwayat Invoice
        </button>
      </div>

      {/* ================= VERIFICATION TAB ================= */}
      {activeTab === "verify" && (
        <div className="space-y-4">
          {pendingVerification.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-10 text-center text-xs text-gray-400">
              Keren! Seluruh billing manual transfer bank telah diselesaikan. Tidak ada verifikasi tertunda.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                    <th className="p-4">Klien / Desa</th>
                    <th className="p-4">Paket / Layanan</th>
                    <th className="p-4">Jumlah Tagihan</th>
                    <th className="p-4 text-center">Bukti Slip</th>
                    <th className="p-4 text-right">Aksi Billing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingVerification.map((t) => (
                    <tr key={t.orderId} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-white">{t.customerName}</div>
                        <div className="text-[10px] text-gray-400">{t.customerVillage || "Umum"}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-300">{t.packageName}</td>
                      <td className="p-4 font-mono font-bold text-white">{formatRupiah(t.amount)}</td>
                      <td className="p-4 text-center">
                        {t.proofOfPayment ? (
                          <button
                            onClick={() => setZoomedSlip(t.proofOfPayment)}
                            className="px-2.5 py-1 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 mx-auto"
                          >
                            <Image size={10} /> Lihat Slip
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-500">Tanpa Slip</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleVerify(t.orderId, "paid")}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase rounded-lg flex items-center gap-1"
                          >
                            <Check size={12} /> Sahkan / Lunas
                          </button>
                          <button
                            onClick={() => handleVerify(t.orderId, "failed")}
                            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase rounded-lg flex items-center gap-1"
                          >
                            <X size={12} /> Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= ALL INVOICES TAB ================= */}
      {activeTab === "all" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                  <th className="p-4 font-mono text-[9px] w-24">Tanggal</th>
                  <th className="p-4">Klien / Desa</th>
                  <th className="p-4">Paket</th>
                  <th className="p-4">Metode</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi Refund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((t) => (
                  <tr key={t.orderId} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-[9px] text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{t.customerName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{t.customerVillage}</span>
                        <span className="text-gray-600">•</span>
                        <button
                          onClick={() => setSelectedInvoice(t)}
                          className="text-[9px] font-bold text-[#c9a84c] uppercase hover:underline"
                        >
                          Cetak Invoice
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-medium">
                      {t.packageName} ({formatRupiah(t.amount)})
                    </td>
                    <td className="p-4 font-mono text-gray-400 text-[10px]">{t.paymentMethod}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        t.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" :
                        t.status === "pending" ? "bg-gray-500/10 text-gray-400" :
                        t.status === "pending_verification" ? "bg-yellow-500/10 text-yellow-400" :
                        t.status === "refunded" ? "bg-purple-500/10 text-purple-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {t.status === "paid" && (
                        <button
                          onClick={() => handleRefund(t.orderId)}
                          className="px-2 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/20 text-purple-400 font-bold text-[9px] uppercase rounded-lg inline-flex items-center gap-1 transition-all"
                        >
                          <RotateCcw size={10} /> Refund Dana
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slip Zoom Lightbox Modal */}
      {zoomedSlip && (
        <div className="fixed inset-0 z-[1300] w-full h-full bg-black/95 flex flex-col justify-center items-center p-4 backdrop-blur-md">
          <div className="absolute top-4 right-4 z-[1301]">
            <button
              onClick={() => setZoomedSlip(null)}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>
          <div className="max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl relative bg-[#0b1322] flex items-center justify-center p-4">
            <img
              src={zoomedSlip}
              alt="Bukti Transfer Zoom"
              className="max-w-full max-h-[75vh] object-contain rounded-xl"
            />
          </div>
          <span className="text-gray-400 text-xs font-semibold mt-3 uppercase tracking-wider">Berkas Bukti Transfer Bank (Slip Resi)</span>
        </div>
      )}

      {/* Selected Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[1300] w-full h-full bg-black/90 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1322] border border-white/10 w-full max-w-lg rounded-3xl p-6 relative shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={16} className="text-[#c9a84c]" /> Detail Invoice & Kwitansi Resmi
              </h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Simulated Printed Invoice Card */}
            <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-inner space-y-4 text-xs select-none">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 tracking-tight uppercase">PT FAS Solusi Teknologi</h4>
                  <p className="text-[9px] text-gray-500 leading-normal">
                    Transformasi Digital & Sistem Desa Pintar<br />
                    Lebak, Banten, Indonesia
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-100 text-emerald-800 tracking-wider">
                    {selectedInvoice.status}
                  </span>
                  <div className="text-[10px] font-mono font-bold mt-1.5 text-gray-900">#INV-{selectedInvoice.orderId.substring(0, 8).toUpperCase()}</div>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-3 grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Ditagihkan Kepada:</span>
                  <strong className="text-gray-900 block mt-0.5">{selectedInvoice.customerName}</strong>
                  <span className="text-gray-600 block">{selectedInvoice.customerVillage || "Umum"}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Tanggal Terbit:</span>
                  <span className="text-gray-900 font-mono block mt-0.5">{new Date(selectedInvoice.createdAt).toLocaleDateString("id-ID")}</span>
                  <span className="text-gray-500 block">Metode: {selectedInvoice.paymentMethod}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-500 text-[9px] font-bold uppercase tracking-wider border-b border-gray-100 pb-1">
                  <span>Deskripsi Paket Layanan</span>
                  <span>Total Harga</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-900">
                  <div>
                    <span>{selectedInvoice.packageName}</span>
                    <p className="text-[8px] text-gray-500 font-normal">Sistem Lisensi & Integrasi Cloud Desa PT FAS</p>
                  </div>
                  <span className="font-mono">{formatRupiah(selectedInvoice.amount)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-900 uppercase">Jumlah Total Terbayar:</span>
                <span className="text-sm font-extrabold text-emerald-600 font-mono">{formatRupiah(selectedInvoice.amount)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => alert("Kwitansi resmi berhasil diunduh dalam format PDF (Simulated).")}
                className="py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-white/5"
              >
                <Download size={12} /> Unduh PDF
              </button>
              <button
                onClick={() => alert(`Kwitansi pembayaran telah dikirimkan secara otomatis via WhatsApp (Simulasi) ke nomor klien.`)}
                className="py-2.5 bg-[#c9a84c] hover:bg-[#b0913c] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                Kirim WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

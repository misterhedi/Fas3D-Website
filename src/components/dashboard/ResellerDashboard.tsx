import { useState, useEffect } from "react";
import {
  TrendingUp,
  Briefcase,
  Link2,
  DollarSign,
  Plus,
  RefreshCw,
  Send,
  Check,
  Trophy,
  Users
} from "lucide-react";
import { formatRupiah } from "../../data";

interface ResellerDashboardProps {
  token: string;
  user: any;
  onLogout: () => void;
  onRefreshMe: () => void;
}

export default function ResellerDashboard({ token, user, onLogout, onRefreshMe }: ResellerDashboardProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"leads" | "withdraw" | "links">("leads");

  // Client leads states
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadClientName, setLeadClientName] = useState("");
  const [leadVillageName, setLeadVillageName] = useState("");
  const [leadStatus, setLeadStatus] = useState("lead");
  const [leadPackage, setLeadPackage] = useState("Paket Standard");
  const [leadCommission, setLeadCommission] = useState(500000);

  // Withdraw states
  const [wthAmount, setWthAmount] = useState("");
  const [wthBank, setWthBank] = useState("BCA");
  const [wthAccount, setWthAccount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Link generator state
  const [genVillage, setGenVillage] = useState("Malingping Utara");
  const [generatedLink, setGeneratedLink] = useState("");

  // Commission simulator states
  const [simStandardCount, setSimStandardCount] = useState(1);
  const [simPremiumCount, setSimPremiumCount] = useState(0);
  const [simEnterpriseCount, setSimEnterpriseCount] = useState(0);

  useEffect(() => {
    fetchClients();
    fetchWithdrawals();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/reseller/clients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setClients(data.clients);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch("/api/reseller/withdrawals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setWithdrawals(data.withdrawals);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reseller/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          clientName: leadClientName,
          villageName: leadVillageName,
          status: leadStatus,
          packageName: leadPackage,
          commissionAmount: Number(leadCommission)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Prospek desa berhasil disimpan!");
        setShowLeadModal(false);
        fetchClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(wthAmount);
    if (!val || val <= 0) return alert("Jumlah penarikan harus lebih dari 0!");
    if (val > (user?.balance || 0)) return alert("Saldo komisi Anda tidak mencukupi.");

    setIsWithdrawing(true);
    try {
      const res = await fetch("/api/reseller/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: val,
          bankName: wthBank,
          accountNumber: wthAccount
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setWthAmount("");
        setWthAccount("");
        fetchWithdrawals();
        onRefreshMe(); // Updates sidebar/header balance
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const generateAffiliateLink = () => {
    const slug = genVillage.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const domain = window.location.origin;
    const link = `${domain}/?ref=${user?.id}&village=${encodeURIComponent(genVillage)}`;
    setGeneratedLink(link);
  };

  useEffect(() => {
    if (user?.id) {
      generateAffiliateLink();
    }
  }, [genVillage, user]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 uppercase tracking-widest block mb-1">
            Reseller Mitra Level
          </span>
          <h2 className="text-xl font-bold tracking-tight">Portal Afiliasi & Komisi Agen (Reseller)</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchClients();
              fetchWithdrawals();
              onRefreshMe();
            }}
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

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Saldo Dompet Komisi</span>
            <div className="text-base font-extrabold text-[#c9a84c] font-mono">{formatRupiah(user?.balance || 0)}</div>
          </div>
          <div className="p-3 bg-[#c9a84c]/10 rounded-xl text-[#c9a84c]">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Total Leads Pitching</span>
            <div className="text-base font-extrabold text-white font-mono">{clients.length} Desa</div>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Rate Komisi Agen</span>
            <div className="text-base font-extrabold text-emerald-400 font-mono">10% per Paket</div>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Target & Lencana Pencapaian Reseller */}
      <div className="bg-[#1e293b]/30 border border-white/5 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <span className="p-4 bg-[#c9a84c]/10 text-[#c9a84c] rounded-2xl border border-[#c9a84c]/20">
          <Trophy size={28} />
        </span>
        <div className="space-y-1 text-center sm:text-left flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lencana Tingkat Kemitraan Anda:</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-widest inline-block mx-auto sm:mx-0 ${
              (user?.balance || 0) <= 1000000 ? "bg-amber-700/10 text-amber-500 border-amber-500/20" :
              (user?.balance || 0) <= 5000000 ? "bg-slate-300/10 text-slate-300 border-slate-300/20 animate-pulse" :
              "bg-yellow-400/10 text-yellow-400 border-yellow-400/25 animate-bounce"
            }`}>
              {(user?.balance || 0) <= 1000000 ? "🥉 Rookie Reseller (Perunggu)" :
               (user?.balance || 0) <= 5000000 ? "🥈 Silver Agent (Perak)" :
               "👑 Golden Ambassador (Emas)"}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            {(user?.balance || 0) <= 1000000 ? "Tingkatkan saldo dompet komisi Anda melewati Rp 1.000.000 untuk naik peringkat menjadi Silver Agent dengan benefit eksklusif." :
             (user?.balance || 0) <= 5000000 ? "Satu langkah lagi menuju peringkat tertinggi Golden Ambassador! Tingkatkan saldo komisi Anda melewati Rp 5.000.000." :
             "Selamat! Anda berada di kasta tertinggi kemitraan PT FAS. Anda berhak mendapatkan jalur prioritas pencairan dana instan."}
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "leads" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Prospek Desa Klien
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "withdraw" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Tarik Komisi (Withdraw)
        </button>
        <button
          onClick={() => setActiveTab("links")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "links" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Generator Link Afiliasi
        </button>
      </div>

      {/* ================= PROSPECT LEADS TAB ================= */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Database prospek mandiri Anda: <b className="text-white">{clients.length} Desa</b></span>
            <button
              onClick={() => {
                setLeadClientName("");
                setLeadVillageName("");
                setLeadStatus("lead");
                setLeadPackage("Paket Standard");
                setLeadCommission(500000);
                setShowLeadModal(true);
              }}
              className="px-3.5 py-2 bg-[#c9a84c] hover:bg-[#b0913c] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1"
            >
              <Plus size={12} /> Daftarkan Prospek
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                  <th className="p-4">Nama Kontak Kades</th>
                  <th className="p-4">Desa Prospek</th>
                  <th className="p-4">Rekomendasi Paket</th>
                  <th className="p-4 text-center">Estimasi Komisi (10%)</th>
                  <th className="p-4 text-right">Status Deal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{c.clientName}</td>
                    <td className="p-4 font-bold text-gray-200">{c.villageName}</td>
                    <td className="p-4 text-gray-400 font-mono text-[11px]">{c.packageName || "-"}</td>
                    <td className="p-4 text-center font-mono font-bold text-[#c9a84c]">{formatRupiah(c.commissionAmount)}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                        c.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" :
                        c.status === "contract_signed" ? "bg-blue-500/10 text-blue-400" :
                        c.status === "pitching" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= WITHDRAW COMMISSION TAB ================= */}
      {activeTab === "withdraw" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Withdrawal Request Form */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4 h-fit">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Formulir Tarik Komisi</span>
            <form onSubmit={handleRequestWithdraw} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-gray-400 mb-1">Nominal Penarikan (IDR)</label>
                <input
                  type="number"
                  value={wthAmount}
                  onChange={(e) => setWthAmount(e.target.value)}
                  placeholder="cth. 1000000"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono"
                />
                <span className="text-[9px] text-gray-400 block mt-1">Sisa saldo dompet: {formatRupiah(user?.balance || 0)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] text-gray-400 mb-1">Pilih Bank Rekening</label>
                  <select
                    value={wthBank}
                    onChange={(e) => setWthBank(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="BCA" className="bg-[#0b1322]">BCA</option>
                    <option value="MANDIRI" className="bg-[#0b1322]">Mandiri</option>
                    <option value="BNI" className="bg-[#0b1322]">BNI</option>
                    <option value="BRI" className="bg-[#0b1322]">BRI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 mb-1">No. Rekening</label>
                  <input
                    type="text"
                    value={wthAccount}
                    onChange={(e) => setWthAccount(e.target.value)}
                    placeholder="901283419"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isWithdrawing}
                className="w-full py-3 bg-[#c9a84c] hover:bg-[#b0913c] text-white font-bold uppercase rounded-xl tracking-wider text-[10px] flex justify-center items-center gap-1.5 transition-all"
              >
                <Send size={12} /> {isWithdrawing ? "Memproses..." : "Ajukan Pencairan Dana"}
              </button>
            </form>
          </div>

          {/* Withdrawal History List */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Riwayat Pencairan Dana Komisi</span>
            
            {withdrawals.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-10 text-center text-xs text-gray-400 font-mono">
                Belum ada pengajuan pencairan dana komisi yang tercatat.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                      <th className="p-4">ID Request</th>
                      <th className="p-4">Rekening Tujuan</th>
                      <th className="p-4">Nominal</th>
                      <th className="p-4 text-center">Status Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono text-[9px] text-gray-400">{w.id}</td>
                        <td className="p-4">
                          <span className="font-bold text-white text-[10px]">{w.bankName}</span>
                          <div className="text-[9px] text-gray-400 font-mono">{w.accountNumber}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-[#c9a84c]">{formatRupiah(w.amount)}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            w.status === "approved" ? "bg-emerald-500/10 text-emerald-400" :
                            w.status === "pending" ? "bg-yellow-500/10 text-yellow-400 animate-pulse" :
                            "bg-red-500/10 text-red-400"
                          }`}>
                            {w.status === "approved" ? "Selesai Ditransfer" : w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= AFFILIATE LINK GENERATOR ================= */}
      {activeTab === "links" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Bangun Link Afiliasi Desa</span>
              <p className="text-xs text-gray-400 leading-normal">
                Masukkan nama desa sasaran prospek Anda di bawah ini untuk membuat link landing page PT FAS dengan rujukan ID reseller Anda. Saat kades menyelesaikan checkout, komisi Anda 10% otomatis tercatat!
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[9px] text-gray-400 mb-1">Nama Desa Sasaran Pitching</label>
                  <input
                    type="text"
                    value={genVillage}
                    onChange={(e) => setGenVillage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-[#c9a84c]/20 rounded-2xl p-6 flex flex-col justify-center gap-4">
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">Link Unik Anda Berhasil Dibuat</span>
                <p className="text-xs font-mono bg-black/30 p-3 rounded-xl border border-white/5 text-gray-200 select-all break-all leading-normal">
                  {generatedLink}
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  alert("Link afiliasi sukses disalin ke clipboard! Bagikan tautan ini ke kontak kades.");
                }}
                className="px-4 py-2.5 bg-[#c9a84c] hover:bg-[#b0913c] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Link2 size={12} /> Salin Link Afiliasi
              </button>
            </div>
          </div>

          {/* Interactive Calculator Simulator */}
          <div className="bg-[#1e293b]/30 border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Trophy size={18} className="text-[#c9a84c]" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kalkulator Simulasi Target Komisi Agen</h4>
                <p className="text-[10px] text-gray-400">Rencanakan target penutupan transaksi Anda dan hitung total potensi penghasilan pasif Anda langsung.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3.5 text-xs">
                {/* Standard Package Slider/Counter */}
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div>
                    <span className="font-bold text-white text-[11px] block">Paket Standard (10%)</span>
                    <span className="text-[10px] text-gray-400">Komisi: {formatRupiah(2500000)} per desa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSimStandardCount(Math.max(0, simStandardCount - 1))}
                      className="w-7 h-7 bg-white/5 rounded-lg text-white hover:bg-white/10 font-mono font-bold text-sm"
                    >-</button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-[#c9a84c]">{simStandardCount}</span>
                    <button 
                      onClick={() => setSimStandardCount(simStandardCount + 1)}
                      className="w-7 h-7 bg-white/5 rounded-lg text-white hover:bg-white/10 font-mono font-bold text-sm"
                    >+</button>
                  </div>
                </div>

                {/* Professional Package Slider/Counter */}
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div>
                    <span className="font-bold text-white text-[11px] block">Paket Professional (10%)</span>
                    <span className="text-[10px] text-gray-400">Komisi: {formatRupiah(4500000)} per desa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSimPremiumCount(Math.max(0, simPremiumCount - 1))}
                      className="w-7 h-7 bg-white/5 rounded-lg text-white hover:bg-white/10 font-mono font-bold text-sm"
                    >-</button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-[#c9a84c]">{simPremiumCount}</span>
                    <button 
                      onClick={() => setSimPremiumCount(simPremiumCount + 1)}
                      className="w-7 h-7 bg-white/5 rounded-lg text-white hover:bg-white/10 font-mono font-bold text-sm"
                    >+</button>
                  </div>
                </div>

                {/* Enterprise Package Slider/Counter */}
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div>
                    <span className="font-bold text-white text-[11px] block">Paket Enterprise (10%)</span>
                    <span className="text-[10px] text-gray-400">Komisi: {formatRupiah(7500000)} per desa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSimEnterpriseCount(Math.max(0, simEnterpriseCount - 1))}
                      className="w-7 h-7 bg-white/5 rounded-lg text-white hover:bg-white/10 font-mono font-bold text-sm"
                    >-</button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-[#c9a84c]">{simEnterpriseCount}</span>
                    <button 
                      onClick={() => setSimEnterpriseCount(simEnterpriseCount + 1)}
                      className="w-7 h-7 bg-white/5 rounded-lg text-white hover:bg-white/10 font-mono font-bold text-sm"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Total Summary Block */}
              <div className="bg-black/35 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-2 h-full py-8">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest block">Potensi Pendapatan Komisi Bersih Anda</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {formatRupiah((simStandardCount * 2500000) + (simPremiumCount * 4500000) + (simEnterpriseCount * 7500000))}
                </div>
                <p className="text-[10px] text-gray-500 leading-normal max-w-xs">
                  Selesaikan verifikasi kesepakatan dengan kepala desa. Komisi akan otomatis dicairkan ke saldo akun Anda begitu transaksi disahkan bendahara keuangan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[1200] w-full h-full bg-black/85 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1322] border border-white/10 w-full max-w-md rounded-3xl p-6 relative">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Daftarkan Prospek Desa</h3>
              <button onClick={() => setShowLeadModal(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nama Kontak Kades / Tokoh</label>
                <input
                  type="text"
                  value={leadClientName}
                  onChange={(e) => setLeadClientName(e.target.value)}
                  placeholder="cth. Bapak Kades Junaedi"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nama Desa</label>
                <input
                  type="text"
                  value={leadVillageName}
                  onChange={(e) => setLeadVillageName(e.target.value)}
                  placeholder="cth. Desa Malingping Tengah"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Rekomendasi Paket</label>
                  <select
                    value={leadPackage}
                    onChange={(e) => {
                      setLeadPackage(e.target.value);
                      if (e.target.value === "Paket Basic") {
                        setLeadCommission(250000);
                      } else if (e.target.value === "Paket Standard") {
                        setLeadCommission(500000);
                      } else if (e.target.value === "Paket Professional") {
                        setLeadCommission(1000000);
                      } else {
                        setLeadCommission(1500000);
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                  >
                    <option value="Paket Basic" className="bg-[#0b1322]">Paket Basic</option>
                    <option value="Paket Standard" className="bg-[#0b1322]">Paket Standard</option>
                    <option value="Paket Professional" className="bg-[#0b1322]">Paket Professional</option>
                    <option value="Paket Enterprise" className="bg-[#0b1322]">Paket Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Deal Status</label>
                  <select
                    value={leadStatus}
                    onChange={(e) => setLeadStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="lead" className="bg-[#0b1322]">Cold Lead</option>
                    <option value="pitching" className="bg-[#0b1322]">Pitching / Presentasi</option>
                    <option value="contract_signed" className="bg-[#0b1322]">Skenario Deal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Estimasi Bonus Komisi Anda (10% IDR)</label>
                <input
                  type="text"
                  value={formatRupiah(leadCommission)}
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-[#c9a84c] font-mono font-bold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-[#c9a84c] text-white font-bold uppercase tracking-wider text-[10px] rounded-xl flex justify-center items-center gap-1"
                >
                  <Check size={14} /> Simpan Prospek
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-3 bg-white/5 text-gray-300 font-bold uppercase tracking-wider text-[10px] rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

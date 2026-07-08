import { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  User,
  Key,
  ChevronRight,
  ArrowLeft,
  Building2,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  Mail,
  UserPlus,
  Heart
} from "lucide-react";

// Import role-based dashboard sub-components
import SuperAdminDashboard from "./dashboard/SuperAdminDashboard";
import AdminRoleDashboard from "./dashboard/AdminRoleDashboard";
import EditorDashboard from "./dashboard/EditorDashboard";
import TreasurerDashboard from "./dashboard/TreasurerDashboard";
import SecretaryDashboard from "./dashboard/SecretaryDashboard";
import ResellerDashboard from "./dashboard/ResellerDashboard";

import { formatRupiah } from "../data";

interface AdminDashboardProps {
  onBack: () => void;
  onViewWishlist: () => void;
  onLoginSuccess?: (token: string, user: any) => void;
  onLogout?: () => void;
}

export default function AdminDashboard({ onBack, onViewWishlist, onLoginSuccess, onLogout }: AdminDashboardProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  
  // Auth view switcher
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Login & Register Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Check existing session
  useEffect(() => {
    const savedToken = localStorage.getItem("fas_auth_token");
    if (savedToken) {
      verifySession(savedToken);
    }
  }, []);

  const verifySession = async (savedToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setToken(savedToken);
        setUser(data.user);
        if (onLoginSuccess) {
          onLoginSuccess(savedToken, data.user);
        }
      } else {
        localStorage.removeItem("fas_auth_token");
      }
    } catch (err) {
      console.error("Session verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("fas_auth_token", data.token);
        setToken(data.token);
        setUser(data.user);
        if (onLoginSuccess) {
          onLoginSuccess(data.token, data.user);
        }
      } else {
        setErrorMsg(data.message || "Email atau password salah.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterReseller = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register-reseller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword })
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        setIsRegistering(false);
        setEmail(regEmail);
        setPassword(regPassword);
      } else {
        setErrorMsg(data.message || "Gagal melakukan pendaftaran.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fas_auth_token");
    setToken(null);
    setUser(null);
    setEmail("");
    setPassword("");
    if (onLogout) {
      onLogout();
    }
  };

  const refreshMe = () => {
    if (token) {
      verifySession(token);
    }
  };

  // Pre-configured Quick Login Accounts
  const quickAccounts = [
    { label: "Super Admin", email: "superadmin@fas-tech-solutions.com", pass: "SuperAdmin@2026", color: "from-red-600 to-red-800" },
    { label: "Admin Staff", email: "admin@fas-tech-solutions.com", pass: "Admin@2026", color: "from-purple-600 to-purple-800" },
    { label: "Editor Berita", email: "editor@fas-tech-solutions.com", pass: "Editor@2026", color: "from-blue-600 to-blue-800" },
    { label: "Bendahara Keuangan", email: "bendahara@fas-tech-solutions.com", pass: "Bendahara@2026", color: "from-emerald-600 to-emerald-800" },
    { label: "Sekretaris Arsip", email: "sekretaris@fas-tech-solutions.com", pass: "Sekretaris@2026", color: "from-pink-600 to-pink-800" },
    { label: "Reseller Mitra", email: "reseller@fas-tech-solutions.com", pass: "Reseller@2026", color: "from-yellow-600 to-yellow-800" }
  ];

  return (
    <div className="w-full max-w-6xl bg-[#090f1d] border border-white/10 rounded-3xl min-h-[550px] shadow-2xl flex flex-col md:flex-row overflow-hidden relative" id="admin-portal-container">
      
      {/* Sidebar - Brand Identity info */}
      <div className="w-full md:w-80 bg-gradient-to-b from-[#0a1428] to-[#040810] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={onBack}
            className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Landing
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="text-[#c9a84c]" size={28} />
              <h1 className="text-lg font-black tracking-tight text-white font-sans uppercase">PT FAS Technology</h1>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
              Sistem Manajemen Terintegrasi Perangkat Desa Modern, Transparan, & Mandiri.
            </p>
          </div>

          {/* Favorit & Wishlist Button */}
          <button
            onClick={onViewWishlist}
            className="w-full text-left p-3.5 bg-rose-500/10 border border-rose-500/15 hover:border-rose-500/30 hover:bg-rose-500/15 text-rose-300 rounded-2xl flex items-center justify-between transition-all group"
          >
            <span className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider">
              <Heart size={14} className="fill-current text-rose-500 group-hover:scale-110 transition-transform" />
              Wishlist Paket Desa
            </span>
            <ChevronRight size={14} className="text-rose-400 animate-pulse" />
          </button>

          {/* User Profile details (if logged in) */}
          {user && (
            <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-4 space-y-3 pt-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center font-bold text-white text-xs uppercase shadow-md">
                  {user.name.substring(0, 2)}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white leading-none">{user.name}</h4>
                  <span className="text-[9px] text-gray-400 font-mono block truncate max-w-[150px]">{user.email}</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-2.5 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[8px] font-bold bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/15 uppercase tracking-wider">
                  {user.role.replace("_", " ")}
                </span>
                
                {user.role === "reseller" && (
                  <div className="text-right">
                    <span className="text-[8px] text-gray-400 block uppercase font-bold">Dompet Komisi</span>
                    <span className="text-[10px] font-extrabold text-[#c9a84c] font-mono leading-none">
                      {formatRupiah(user.balance || 0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legal credentials display */}
        <div className="pt-6 border-t border-white/5 space-y-1.5 text-gray-500 font-mono text-[8px]">
          <div>SK Kemenkumham: AHU-A101229.AH.01.30.2026</div>
          <div>NPWP: 1000 0000 1019 1846</div>
          <div className="text-[#c9a84c]/50 font-sans font-bold">© PT FAS Technology Solutions</div>
        </div>
      </div>

      {/* Core work space */}
      <div className="flex-grow p-6 bg-[#060a14] min-h-[480px] overflow-y-auto">
        {isLoading && !user && (
          <div className="h-full flex flex-col justify-center items-center gap-3">
            <RefreshCw size={24} className="text-[#c9a84c] animate-spin" />
            <span className="text-xs text-gray-400 font-mono">Mengamankan enkripsi data...</span>
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {!user && !isLoading && !isRegistering && (
          <div className="space-y-6 max-w-lg mx-auto py-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white">
                <Lock size={16} className="text-[#c9a84c]" />
                <h3 className="text-base font-bold tracking-tight">Login Portal Staff & Mitra</h3>
              </div>
              <p className="text-xs text-gray-400">Silakan masukkan email kerja resmi Anda atau gunakan Sandbox untuk menguji.</p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-xl text-xs font-semibold text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={(e) => handleLogin(e)} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1.5">Alamat Email Resmi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cth. superadmin@fas-tech-solutions.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a84c]"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1.5">Kata Sandi (Password)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a84c]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c9a84c] hover:bg-[#b0913c] text-white font-bold uppercase rounded-xl tracking-wider transition-all shadow-md text-[10px]"
              >
                Masuk Sistem
              </button>
            </form>

            <div className="border-t border-white/5 pt-4 text-center">
              <button
                onClick={() => setIsRegistering(true)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mx-auto font-semibold"
              >
                <UserPlus size={14} className="text-[#c9a84c]" /> Mendaftar Mitra Reseller Baru?
              </button>
            </div>

            {/* QUICK SANDBOX TESTING ACCORDION */}
            <div className="border border-[#c9a84c]/20 bg-[#c9a84c]/[0.02] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-white">
                <Sparkles size={14} className="text-[#c9a84c]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Quick Sandbox Login (Pilih Peran)</span>
              </div>
              <p className="text-[9px] text-gray-400 leading-relaxed">
                Guna mempermudah penilaian dan audit fungsionalitas, kami menyediakan tombol akses cepat langsung ke-6 level hak akses (RBAC) yang telah ter-seeding:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLogin(undefined, acc.email, acc.pass)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left transition-all flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-bold text-white block mb-0.5">{acc.label}</span>
                    <span className="text-[8px] font-mono text-[#c9a84c] uppercase tracking-wide">Akses Instan ➔</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= REGISTER FORM ================= */}
        {!user && !isLoading && isRegistering && (
          <div className="space-y-6 max-w-lg mx-auto py-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white tracking-tight">Formulir Pendaftaran Reseller Agen</h3>
              <p className="text-xs text-gray-400">Bergabunglah sebagai mitra agen kami untuk memasarkan digitalisasi desa dan raih komisi 10% setiap deal.</p>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-xl text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterReseller} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="cth. Ahmad Sugeng"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1.5">Alamat Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="cth. sugeng@gmail.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1.5">Buat Kata Sandi (Password)</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-[#c9a84c] text-white font-bold uppercase rounded-xl tracking-wider text-[10px]"
                >
                  Kirim Formulir Pendaftaran
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase rounded-xl text-[10px]"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= ROUTING LOGGED-IN SUB-DASHBOARDS ================= */}
        {user && token && (
          <div className="h-full">
            {user.role === "super_admin" && (
              <SuperAdminDashboard token={token} onLogout={handleLogout} />
            )}
            {user.role === "admin" && (
              <AdminRoleDashboard token={token} onLogout={handleLogout} />
            )}
            {user.role === "editor" && (
              <EditorDashboard token={token} onLogout={handleLogout} />
            )}
            {user.role === "bendahara" && (
              <TreasurerDashboard token={token} onLogout={handleLogout} />
            )}
            {user.role === "sekretaris" && (
              <SecretaryDashboard token={token} onLogout={handleLogout} />
            )}
            {user.role === "reseller" && (
              <ResellerDashboard token={token} user={user} onLogout={handleLogout} onRefreshMe={refreshMe} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}

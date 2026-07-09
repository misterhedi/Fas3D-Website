import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Plus,
  Edit2,
  Lock,
  UserX,
  UserCheck,
  TrendingUp,
  RefreshCw,
  X,
  Check
} from "lucide-react";

interface AdminRoleDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function AdminRoleDashboard({ token, onLogout }: AdminRoleDashboardProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "resellers">("users");

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // User save form
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("reseller");
  const [userStatus, setUserStatus] = useState("active");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isEditingUser ? `/api/users/${isEditingUser}` : "/api/users";
      const method = isEditingUser ? "PUT" : "POST";
      const body: any = {
        name: userName,
        email: userEmail,
        role: userRole,
        status: userStatus
      };
      if (userPassword || !isEditingUser) {
        body.password = userPassword || "Password@123";
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        alert("User berhasil disimpan.");
        setShowUserModal(false);
        fetchUsers();
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleResellerStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Status reseller berhasil diubah menjadi ${newStatus.toUpperCase()}`);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resellers = users.filter((u) => u.role === "reseller");
  const staffUsers = users.filter((u) => u.role !== "reseller" && u.role !== "super_admin");
  const activeResellers = resellers.filter((u) => u.status === "active");
  const pendingResellers = resellers.filter((u) => u.status === "pending_approval" || u.status === "suspended");

  // Filtering users list based on search and role filter
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest block mb-1">
            Admin Level
          </span>
          <h2 className="text-xl font-bold tracking-tight">Dasbor Manajemen Pengguna & Mitra (Admin)</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchUsers}
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

      {/* KPI Summary Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e293b]/20 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Total Staff Internal</span>
            <div className="text-xl font-extrabold text-white font-mono mt-0.5">{staffUsers.length} Orang</div>
          </div>
          <span className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
            <Users size={16} />
          </span>
        </div>
        <div className="bg-[#1e293b]/20 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Mitra Reseller Aktif</span>
            <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">{activeResellers.length} Agen</div>
          </div>
          <span className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <ShieldCheck size={16} />
          </span>
        </div>
        <div className="bg-[#1e293b]/20 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Menunggu Persetujuan</span>
            <div className="text-xl font-extrabold text-yellow-400 font-mono mt-0.5">{pendingResellers.length} Prospek</div>
          </div>
          <span className="p-2.5 bg-yellow-500/10 text-yellow-400 rounded-xl">
            <TrendingUp size={16} />
          </span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "users" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Kelola User Staff
        </button>
        <button
          onClick={() => setActiveTab("resellers")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "resellers" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Verifikasi & Approve Reseller
        </button>
      </div>

      {/* ================= TAB 1: USERS CRUD ================= */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-xs text-gray-400">Total terdaftar (selain super admin): <b className="text-white">{users.length} user</b></span>
            
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari nama / email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c9a84c] w-full sm:w-48 font-semibold"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c9a84c]"
              >
                <option value="ALL" className="bg-[#0b1322]">Semua Peran</option>
                <option value="admin" className="bg-[#0b1322]">Admin</option>
                <option value="editor" className="bg-[#0b1322]">Editor</option>
                <option value="bendahara" className="bg-[#0b1322]">Bendahara</option>
                <option value="sekretaris" className="bg-[#0b1322]">Sekretaris</option>
                <option value="reseller" className="bg-[#0b1322]">Reseller</option>
              </select>
              <button
                onClick={() => {
                  setIsEditingUser(null);
                  setUserName("");
                  setUserEmail("");
                  setUserRole("reseller");
                  setUserStatus("active");
                  setUserPassword("");
                  setShowUserModal(true);
                }}
                className="px-3.5 py-2 bg-[#c9a84c] hover:bg-[#b0913c] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1 w-full sm:w-auto justify-center"
              >
                <Plus size={12} /> Tambah Staff Baru
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Peran (Role)</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{u.name}</td>
                    <td className="p-4 font-mono text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wide border bg-purple-500/10 text-purple-400 border-purple-500/25">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        u.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setIsEditingUser(u.id);
                          setUserName(u.name);
                          setUserEmail(u.email);
                          setUserRole(u.role);
                          setUserStatus(u.status);
                          setUserPassword("");
                          setShowUserModal(true);
                        }}
                        className="p-1.5 bg-white/5 text-gray-300 hover:text-white rounded-lg border border-white/5 ml-auto flex items-center gap-1"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RESELLER VERIFICATION ================= */}
      {activeTab === "resellers" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            Berikut adalah daftar mitra yang mendaftarkan diri secara mandiri sebagai Reseller PT FAS. Verifikasi keaslian dan aktifkan akun mereka di bawah ini.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                  <th className="p-4">Reseller</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Tanggal Daftar</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi Persetujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {resellers.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{r.name}</td>
                    <td className="p-4 font-mono text-gray-300">{r.email}</td>
                    <td className="p-4 text-gray-400">{new Date(r.createdAt).toLocaleDateString("id-ID")}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        r.status === "active" ? "bg-emerald-500/10 text-emerald-400" :
                        r.status === "pending_approval" ? "bg-yellow-500/10 text-yellow-400 animate-pulse" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {r.status === "pending_approval" ? (
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => toggleResellerStatus(r.id, "suspended")}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase rounded-lg flex items-center gap-1"
                          >
                            <UserCheck size={12} /> Setujui / Approve
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleResellerStatus(r.id, r.status)}
                          className={`px-2.5 py-1.5 text-[10px] font-bold uppercase rounded-lg ml-auto flex items-center gap-1 ${
                            r.status === "active"
                              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                              : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                          }`}
                        >
                          {r.status === "active" ? <UserX size={12} /> : <UserCheck size={12} />}
                          <span>{r.status === "active" ? "Suspend Reseller" : "Aktifkan"}</span>
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

      {/* Staff modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-[1200] w-full h-full bg-black/85 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1322] border border-white/10 w-full max-w-md rounded-3xl p-6 relative">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isEditingUser ? "Edit Staff" : "Tambah Staff Baru"}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="cth. Sapri Malingping"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="cth. sapri@fas-tech-solutions.com"
                  required
                  disabled={!!isEditingUser}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Role Peran</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="editor" className="bg-[#0b1322]">Editor</option>
                    <option value="bendahara" className="bg-[#0b1322]">Bendahara</option>
                    <option value="sekretaris" className="bg-[#0b1322]">Sekretaris</option>
                    <option value="reseller" className="bg-[#0b1322]">Reseller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Status</label>
                  <select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="active" className="bg-[#0b1322]">Active</option>
                    <option value="suspended" className="bg-[#0b1322]">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Kata Sandi</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder={isEditingUser ? "Kosongkan jika tidak diubah" : "Sandi default"}
                  required={!isEditingUser}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-[#c9a84c] text-white font-bold uppercase tracking-wider text-[10px] rounded-xl flex justify-center items-center gap-1"
                >
                  <Check size={14} /> Simpan Staff
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
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

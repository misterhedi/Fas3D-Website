import { useState, useEffect } from "react";
import {
  Users,
  ShieldAlert,
  FileText,
  Download,
  Upload,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Sliders,
  Database,
  Check,
  X
} from "lucide-react";
import { formatRupiah } from "../../data";

interface SuperAdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function SuperAdminDashboard({ token, onLogout }: SuperAdminDashboardProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "audit" | "settings">("users");

  // User form state
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("reseller");
  const [userStatus, setUserStatus] = useState("active");
  const [userPassword, setUserPassword] = useState("");

  // System settings state
  const [commissionRate, setCommissionRate] = useState(10);
  const [sessionTimeout, setSessionTimeout] = useState(3600);
  const [backupFile, setBackupFile] = useState<any>(null);

  // Filters
  const [searchLog, setSearchLog] = useState("");
  const [roleLogFilter, setRoleLogFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit-logs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setLogs(data.logs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
        alert(data.message);
        setShowUserModal(false);
        fetchUsers();
        fetchLogs();
      } else {
        alert("Gagal menyimpan user: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user ${name}? Tindakan ini permanen.`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("User berhasil dihapus");
        fetchUsers();
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackupDownload = () => {
    window.open(`/api/admin/backup?token=${token}`, "_blank");
  };

  const handleRestoreUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupFile) return alert("Pilih file backup (.json) terlebih dahulu!");
    
    const confirmRestore = confirm("Peringatan! Proses pemulihan akan menggantikan semua data transaksi, artikel, dokumen, dan pengguna saat ini. Lanjutkan?");
    if (!confirmRestore) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const res = await fetch("/api/admin/restore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(parsed)
          });
          const data = await res.json();
          if (data.success) {
            alert(data.message);
            fetchUsers();
            fetchLogs();
          } else {
            alert("Gagal merestore backup: " + data.message);
          }
        } catch (e) {
          alert("Format file JSON salah atau korup.");
        }
      };
      reader.readAsText(backupFile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportLogsToCsv = () => {
    if (logs.length === 0) return alert("Belum ada log aktivitas untuk diekspor.");
    let csvContent = "data:text/csv;charset=utf-8,ID,User Email,Role,Aksi,Detail,IP Address,Waktu\n";
    logs.forEach((l) => {
      csvContent += `"${l.id}","${l.userEmail}","${l.role}","${l.action}","${l.details.replace(/"/g, '""')}","${l.ipAddress}","${l.timestamp}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter audit logs
  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.userEmail.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.action.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.details.toLowerCase().includes(searchLog.toLowerCase());
    const matchesRole = roleLogFilter === "ALL" || l.role === roleLogFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest animate-pulse">
              Super Admin Level
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Pusat Kendali Sistem Utama (Super Admin)</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchUsers();
              fetchLogs();
            }}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300 transition-all flex items-center gap-1.5"
            title="Refresh Data"
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

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "users" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Manajemen Pengguna
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "audit" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Audit Trail Log
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "settings" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Konfigurasi & Backup
        </button>
      </div>

      {/* ================= USER MANAGEMENT TAB ================= */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-gray-400">Total terdaftar: <b className="text-white font-mono">{users.length} user</b></span>
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
              className="px-3.5 py-2 bg-[#c9a84c] hover:bg-[#b0913c] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1"
            >
              <Plus size={12} /> Tambah User Baru
            </button>
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
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{u.name}</td>
                    <td className="p-4 font-mono text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wide border ${
                        u.role === "super_admin" ? "bg-red-500/10 text-red-400 border-red-500/25" :
                        u.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/25" :
                        u.role === "editor" ? "bg-blue-500/10 text-blue-400 border-blue-500/25" :
                        u.role === "bendahara" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                        u.role === "sekretaris" ? "bg-pink-500/10 text-pink-400 border-pink-500/25" :
                        "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/25"
                      }`}>
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        u.status === "active" ? "bg-emerald-500/10 text-emerald-400" :
                        u.status === "pending_approval" ? "bg-yellow-500/10 text-yellow-400 animate-pulse" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex gap-1.5 justify-end">
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
                        className="p-1.5 bg-white/5 text-gray-300 hover:text-white rounded-lg border border-white/5"
                        title="Edit User"
                      >
                        <Edit2 size={12} />
                      </button>
                      {u.role !== "super_admin" && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/25 rounded-lg border border-red-500/20"
                          title="Hapus User"
                        >
                          <Trash2 size={12} />
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

      {/* ================= AUDIT TRAIL LOGS TAB ================= */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="flex gap-2 flex-grow sm:max-w-md">
              <input
                type="text"
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                placeholder="Cari log email, aksi, detail..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c9a84c]"
              />
              <select
                value={roleLogFilter}
                onChange={(e) => setRoleLogFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="ALL">Semua Peran</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="bendahara">Bendahara</option>
                <option value="sekretaris">Sekretaris</option>
                <option value="reseller">Reseller</option>
              </select>
            </div>
            <button
              onClick={exportLogsToCsv}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all text-gray-200"
            >
              <Download size={14} /> Ekspor CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20 max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-[#0d1527] z-10">
                <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                  <th className="p-4 font-mono text-[9px] w-24">Waktu</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Aksi</th>
                  <th className="p-4">Detail Aktivitas</th>
                  <th className="p-4 font-mono text-[10px]">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-[9px] text-gray-400">
                      {new Date(l.timestamp).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{l.userEmail}</div>
                      <span className="text-[9px] font-bold text-[#c9a84c] uppercase">{l.role}</span>
                    </td>
                    <td className="p-4 font-bold text-gray-200 font-mono text-[10px]">{l.action}</td>
                    <td className="p-4 text-gray-300 leading-normal">{l.details}</td>
                    <td className="p-4 font-mono text-[10px] text-gray-400">{l.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= CONFIGURATION & BACKUP TAB ================= */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Settings Form */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <Sliders size={18} className="text-[#c9a84c]" />
              <span>Konfigurasi Konstanta Sistem</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">
                  Komisi Reseller (%)
                </label>
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-semibold font-mono"
                />
                <span className="text-[9px] text-gray-400">Standard rate komisi reseller dari nilai total paket</span>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">
                  Timeout Sesi Pengguna (detik)
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-semibold font-mono"
                />
              </div>

              <button
                onClick={() => alert("Pengaturan berhasil disimpan (Simulated).")}
                className="px-4 py-2.5 bg-[#c9a84c] text-white hover:bg-[#b0913c] rounded-xl font-bold uppercase tracking-wider text-[10px] w-full"
              >
                Terapkan Pengaturan
              </button>
            </div>
          </div>

          {/* Backup & Restore Panel */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <Database size={18} className="text-[#c9a84c]" />
              <span>Cadangan Database Cloud (Backup & Restore)</span>
            </div>

            <p className="text-xs text-gray-400 leading-normal">
              Unduh salinan cadangan lengkap basis data instan untuk keamanan berkala. Anda juga dapat memulihkan seluruh server dari cadangan sebelumnya.
            </p>

            <div className="pt-2 border-t border-white/5 space-y-4 text-xs">
              <button
                onClick={handleBackupDownload}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold uppercase text-[10px] text-white flex justify-center items-center gap-1.5"
              >
                <Download size={14} /> Unduh Backup Sistem (.JSON)
              </button>

              <form onSubmit={handleRestoreUpload} className="border border-white/5 rounded-xl p-4 bg-black/10 space-y-3">
                <span className="text-[10px] text-gray-400 font-bold block uppercase mb-1">Pulihkan (Restore)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e: any) => setBackupFile(e.target.files[0])}
                  className="w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider text-[9px] rounded-lg flex justify-center items-center gap-1 transition-colors"
                >
                  <Upload size={12} /> Jalankan Restore Database
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Save Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-[1200] w-full h-full bg-black/85 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1322] border border-white/10 w-full max-w-md rounded-3xl p-6 relative shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isEditingUser ? "Ubah Data Pengguna" : "Tambah Pengguna Baru"}
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
                  placeholder="cth. Budiman Saputra"
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
                  placeholder="cth. budi@fas-tech-solutions.com"
                  required
                  disabled={!!isEditingUser}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none disabled:opacity-50 font-mono"
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
                    <option value="super_admin" className="bg-[#0b1322] text-white">Super Admin</option>
                    <option value="admin" className="bg-[#0b1322] text-white">Admin</option>
                    <option value="editor" className="bg-[#0b1322] text-white">Editor</option>
                    <option value="bendahara" className="bg-[#0b1322] text-white">Bendahara</option>
                    <option value="sekretaris" className="bg-[#0b1322] text-white">Sekretaris</option>
                    <option value="reseller" className="bg-[#0b1322] text-white">Reseller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Status</label>
                  <select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="active" className="bg-[#0b1322] text-white">Active</option>
                    <option value="suspended" className="bg-[#0b1322] text-white">Suspended</option>
                    <option value="pending_approval" className="bg-[#0b1322] text-white">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">
                  Kata Sandi {isEditingUser && "(Kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder={isEditingUser ? "Sandi lama tetap tersimpan" : "Masukkan password default"}
                  required={!isEditingUser}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-grow py-3 bg-[#c9a84c] hover:bg-[#b0913c] text-white font-bold uppercase tracking-wider text-[10px] rounded-xl flex justify-center items-center gap-1"
                >
                  {isLoading ? "Menyimpan..." : <><Check size={14} /> Simpan Data</>}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold uppercase tracking-wider text-[10px] rounded-xl"
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

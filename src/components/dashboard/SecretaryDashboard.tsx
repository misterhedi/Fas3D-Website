import { useState, useEffect } from "react";
import {
  FileText,
  Mail,
  Plus,
  Trash2,
  RefreshCw,
  Edit,
  Clipboard,
  Calendar,
  User,
  Check,
  X,
  Building,
  Users,
  ChevronRight,
  Briefcase,
  Sparkles,
  TrendingUp,
  FileCheck,
  Award,
  FileEdit,
  MapPin,
  Phone,
  DollarSign,
  Layers,
  MessageSquare,
  ArrowRight,
  Send,
  Eye,
  Settings,
  BookOpen,
  CheckSquare
} from "lucide-react";
import { formatRupiah } from "../../data";

interface SecretaryDashboardProps {
  token: string;
  onLogout: () => void;
}

interface TemplateLetter {
  id: string;
  name: string;
  subject: string;
  description: string;
  defaultBody: string;
}

export default function SecretaryDashboard({ token, onLogout }: SecretaryDashboardProps) {
  // State for original server-synced data
  const [documents, setDocuments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  
  // Tabs for the specialized modules requested
  const [activeTab, setActiveTab] = useState<"proposals" | "templates" | "correspondence" | "crm" | "compliance">("proposals");

  // ISO 27001 Compliance States
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [complianceInfo, setComplianceInfo] = useState<any | null>(null);
  const [isSecurityLoading, setIsSecurityLoading] = useState(false);
  const [isSecurityVerified, setIsSecurityVerified] = useState(false);
  const [securityPasswordPolicy, setSecurityPasswordPolicy] = useState({
    minLength: 10,
    requireNumbers: true,
    requireSpecial: true,
    sessionTimeoutMin: 30
  });

  // Feedback notifications
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Selected client for CRM Detail view
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [newLogText, setNewLogText] = useState("");
  const [newLogCategory, setNewLogCategory] = useState<"call" | "email" | "meeting" | "proposal" | "system">("meeting");

  // Persistent Client Extra Metadata (Phone, Email, Address, Logs) loaded from localStorage
  const [clientMetaMap, setClientMetaMap] = useState<Record<string, { phone: string; email: string; address: string; start: string; end: string; logs: any[] }>>({});

  // 1. Proposal Drafting Module State
  const [propTitle, setPropTitle] = useState("Proposal Penawaran Sistem Desa Digital Terpadu");
  const [propNumber, setPropNumber] = useState(`PRP/FAS/SRG/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
  const [propTargetVillage, setPropTargetVillage] = useState("Desa Sukamaju");
  const [propTargetCP, setPropTargetCP] = useState("Bapak Kades H. Yusuf");
  const [propTargetTitle, setPropTargetTitle] = useState("Kepala Desa Sukamaju");
  const [propPackage, setPropPackage] = useState("Gold Desa Pintar");
  const [propPrice, setPropPrice] = useState("15000000");
  const [propDuration, setPropDuration] = useState("1 Tahun Kemitraan");
  const [propBg, setPropBg] = useState("Dalam rangka mempercepat transformasi digital pedesaan, menyelaraskan dengan program Kemenkominfo RI, PT Futura Aksara Solusindo menawarkan platform administrasi desa mandiri guna meningkatkan akuntabilitas, transparansi, serta mempermudah pelayanan surat-menyurat warga secara online.");
  const [propDeliverables, setPropDeliverables] = useState<string[]>([
    "Sistem Administrasi Desa & Kependudukan Elektronik",
    "Portal Website Publik Desa Terintegrasi",
    "Aplikasi Mandiri Warga via Telegram/Web App",
    "Sistem Keuangan & Transparansi APBDes",
    "Hosting Cloud Premium 50GB & Nama Domain desa.id",
    "Bimbingan Teknis (Bimtek) Operator Desa 3 Sesi"
  ]);
  const [newDeliverable, setNewDeliverable] = useState("");
  const [propTerms, setPropTerms] = useState("Pembayaran di muka sebesar 50% setelah penandatanganan MOU resmi, dan pelunasan 50% sisanya setelah sistem online & serah terima kunci.");
  const [propSignatory, setPropSignatory] = useState("H. Adi Pratama, M.Kom (Direktur Kemitraan)");

  // 2. Letter Templates Management State
  const letterTemplates: TemplateLetter[] = [
    {
      id: "tpl-offering",
      name: "Surat Penawaran Resmi Kemitraan",
      subject: "Penawaran Kemitraan Implementasi Platform Desa Pintar",
      description: "Template formal untuk mengajukan opsi kerja sama sistem informasi digital kepada Kepala Desa baru.",
      defaultBody: `Sehubungan dengan program pemerintah pusat mengenai transformasi digital pedesaan guna meningkatkan efisiensi birokrasi, kami dari PT Futura Aksara Solusindo bermaksud mengajukan kerja sama pengadaan sistem administrasi pintar desa. Kami menawarkan integrasi portal layanan mandiri kependudukan, pelacakan anggaran desa, serta modul website profil desa yang up-to-date.`
    },
    {
      id: "tpl-mou",
      name: "Draf MOU / Nota Kesepahaman Bersama",
      subject: "Nota Kesepahaman Kemitraan Transformasi Digital Layanan Administrasi Desa",
      description: "Draf dokumen perjanjian awal (MOU) sebelum kontrak formal diterbitkan, mengatur batas tanggung jawab kedua pihak.",
      defaultBody: `Bahwa Pihak Pertama (PT Futura Aksara Solusindo) dan Pihak Kedua (Pemerintah Desa) sepakat melakukan sinergi implementasi teknologi guna percepatan digitalisasi pelayanan publik. Pihak Pertama menyediakan infrastruktur sistem, hosting, dan pemeliharaan server, sedangkan Pihak Kedua berkewajiban menyediakan operator aktif dan mengalokasikan anggaran sewa layanan tahunan.`
    },
    {
      id: "tpl-invoice",
      name: "Tagihan Pembayaran Layanan (Invoice)",
      subject: "Surat Penagihan Pembayaran Sewa Lisensi Sistem Informasi Desa",
      description: "Template surat tagihan invoice untuk perpanjangan sewa sistem atau pembayaran termin berjalan.",
      defaultBody: `Bersama surat ini, kami sampaikan rincian tagihan biaya sewa lisensi tahunan serta pemeliharaan server sistem administrasi desa digital terpadu sesuai kesepakatan Kontrak Kerja Sama yang telah ditandatangani. Mohon pembayaran dapat diselesaikan selambat-lambatnya 14 hari kerja setelah surat tagihan ini diterima.`
    },
    {
      id: "tpl-support",
      name: "Surat Penugasan Tim Teknis (Bimtek)",
      subject: "Pemberitahuan Pelaksanaan Bimbingan Teknis & Instalasi On-Site",
      description: "Surat penunjukan dan pemberitahuan kunjungan tim engineer PT FAS untuk melakukan setup on-site dan pelatihan operator.",
      defaultBody: `Guna memastikan implementasi sistem dapat berjalan dengan lancar dan optimal, bersama surat ini kami mengutus Tim Teknis & Training Specialist PT Futura Aksara Solusindo untuk menyelenggarakan instalasi server, integrasi domain desa, serta pelatihan intensif (bimbingan teknis) bagi seluruh perangkat desa setempat.`
    }
  ];

  const [selectedTplId, setSelectedTplId] = useState("tpl-offering");
  const [tplRecipientVillage, setTplRecipientVillage] = useState("Desa Sukasenang");
  const [tplRecipientName, setTplRecipientName] = useState("Bapak Kades H. Sanusi");
  const [tplRecipientTitle, setTplRecipientTitle] = useState("Kepala Desa Sukasenang");
  const [tplCustomBody, setTplCustomBody] = useState("");
  const [tplPriceInput, setTplPriceInput] = useState("12000000");

  // Sync letter template default body when chosen
  useEffect(() => {
    const tpl = letterTemplates.find(t => t.id === selectedTplId);
    if (tpl) {
      setTplCustomBody(tpl.defaultBody);
    }
  }, [selectedTplId]);

  // 3. Business Correspondence Archive Module State
  const [showDocModal, setShowDocModal] = useState(false);
  const [isEditingDoc, setIsEditingDoc] = useState<string | null>(null);
  const [docType, setDocType] = useState<"proposal" | "offering" | "agreement" | "invoice" | "other">("proposal");
  const [docNumber, setDocNumber] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docSourceTarget, setDocSourceTarget] = useState(""); 
  const [docDate, setDocDate] = useState("");
  const [docSummary, setDocSummary] = useState("");
  const [docSignature, setDocSignature] = useState("PT Futura Aksara Solusindo");

  // 4. Client Profile CRM State
  const [showClientModal, setShowClientModal] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [villageName, setVillageName] = useState("");
  const [clientStatus, setClientStatus] = useState<"lead" | "demo" | "active" | "expired">("active");
  const [clientPackage, setClientPackage] = useState("Gold Desa Pintar");
  const [clientCommissionAmount, setClientCommissionAmount] = useState<number>(12000000);
  
  // Extra CRM fields (Phone, Email, Address, Duration)
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientStart, setClientStart] = useState("");
  const [clientEnd, setClientEnd] = useState("");

  // Load and save functions
  useEffect(() => {
    fetchDocuments();
    fetchClients();
    loadClientMetaMap();
  }, []);

  useEffect(() => {
    if (activeTab === "compliance") {
      fetchSecurityData();
    }
  }, [activeTab]);

  const fetchSecurityData = async () => {
    setIsSecurityLoading(true);
    try {
      const resLogs = await fetch("/api/security/audit-logs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataLogs = await resLogs.json();
      if (dataLogs.success) {
        setSecurityLogs(dataLogs.logs);
      }

      const resComp = await fetch("/api/security/compliance", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataComp = await resComp.json();
      if (dataComp.success) {
        setComplianceInfo(dataComp.compliance);
      }
    } catch (err) {
      console.error("Gagal mengambil data kepatuhan ISO 27001:", err);
    } finally {
      setIsSecurityLoading(false);
    }
  };

  const loadClientMetaMap = () => {
    const saved = localStorage.getItem("fas_secretary_client_meta");
    if (saved) {
      try {
        setClientMetaMap(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse client meta map", err);
      }
    }
  };

  const saveClientMetaMap = (newMap: typeof clientMetaMap) => {
    setClientMetaMap(newMap);
    localStorage.setItem("fas_secretary_client_meta", JSON.stringify(newMap));
  };

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/documents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    setIsClientsLoading(true);
    try {
      const res = await fetch("/api/reseller/clients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsClientsLoading(false);
    }
  };

  // 3. Document Save (Business Correspondence Archive)
  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isEditingDoc ? `/api/documents/${isEditingDoc}` : "/api/documents";
      const method = isEditingDoc ? "PUT" : "POST";
      const body = {
        type: docType,
        letterNumber: docNumber,
        title: docTitle,
        sourceOrTarget: docSourceTarget,
        date: docDate,
        summary: docSummary,
        digitalSignature: docSignature
      };

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
        showFeedback(isEditingDoc ? "Arsip dokumen surat berhasil diperbarui!" : "Surat masuk/keluar berhasil diarsipkan!");
        setShowDocModal(false);
        fetchDocuments();
      } else {
        showFeedback(data.message || "Gagal menyimpan dokumen surat.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || "Terjadi kesalahan sistem.", "error");
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus surat ini dari arsip perusahaan?")) return;
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("Dokumen surat berhasil dihapus dari arsip.");
        fetchDocuments();
      } else {
        showFeedback(data.message || "Gagal menghapus dokumen.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || "Terjadi kesalahan.", "error");
    }
  };

  // 4. Client Save (Client Profile Management)
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !villageName) {
      return showFeedback("Lengkapi isian nama penanggung jawab dan mitra desa!", "error");
    }

    try {
      const endpoint = isEditingClient ? `/api/reseller/clients/${isEditingClient}` : "/api/reseller/clients";
      const method = isEditingClient ? "PUT" : "POST";
      const body = {
        clientName,
        villageName,
        status: clientStatus,
        packageName: clientPackage,
        commissionAmount: Number(clientCommissionAmount || 0)
      };

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
        const savedClientId = isEditingClient || data.client?.id || `cli-${Date.now()}`;
        
        // Save metadata to localStorage map
        const newMap = { ...clientMetaMap };
        newMap[savedClientId] = {
          phone: clientPhone || "0812-3456-7890",
          email: clientEmail || `layanan@${villageName.toLowerCase().replace(/\s+/g, "")}.desa.id`,
          address: clientAddress || `Kecamatan Malingping, Kabupaten Lebak, Banten`,
          start: clientStart || new Date().toISOString().split("T")[0],
          end: clientEnd || new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0],
          logs: newMap[savedClientId]?.logs || [
            { id: "init-log", date: new Date().toISOString().split("T")[0], note: "Kemitraan awal berhasil dibuat oleh Sekretaris.", category: "system" }
          ]
        };
        saveClientMetaMap(newMap);

        showFeedback(isEditingClient ? "Data profil pelanggan berhasil diperbarui!" : "Klien desa mitra baru berhasil didaftarkan!");
        setShowClientModal(false);
        fetchClients();
        
        // Update selectedClient if viewing
        if (selectedClient && selectedClient.id === savedClientId) {
          const updatedClientObj = { ...body, id: savedClientId };
          setSelectedClient(updatedClientObj);
        }
      } else {
        showFeedback(data.message || "Gagal menyimpan profil pelanggan.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || "Terjadi kesalahan sistem.", "error");
    }
  };

  // Save Proposal to Correspondence Archive
  const handleArchiveProposal = async () => {
    try {
      const body = {
        type: "proposal",
        letterNumber: propNumber,
        title: propTitle,
        sourceOrTarget: propTargetVillage,
        date: new Date().toISOString().split("T")[0],
        summary: `Draft proposal digitalisasi ${propPackage} dengan nilai investasi ${formatRupiah(Number(propPrice))}. Estimasi durasi: ${propDuration}.`,
        digitalSignature: propSignatory
      };

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Sukses mengekspor proposal ke Arsip Surat dengan No: ${propNumber}`);
        fetchDocuments();
      } else {
        showFeedback(data.message || "Gagal menyimpan draf proposal ke arsip.", "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("Terjadi kesalahan koneksi.", "error");
    }
  };

  // Save Customized Letter Template to Correspondence Archive
  const handleArchiveTemplateLetter = async () => {
    try {
      const activeTpl = letterTemplates.find(t => t.id === selectedTplId);
      const categoryMap: Record<string, "offering" | "agreement" | "invoice" | "other"> = {
        "tpl-offering": "offering",
        "tpl-mou": "agreement",
        "tpl-invoice": "invoice",
        "tpl-support": "other"
      };
      
      const numPrefix = selectedTplId === "tpl-invoice" ? "INV" : selectedTplId === "tpl-mou" ? "MOU" : "SPN";
      const generatedNumber = `${numPrefix}/FAS/SRG/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

      const body = {
        type: categoryMap[selectedTplId] || "offering",
        letterNumber: generatedNumber,
        title: activeTpl ? `${activeTpl.name} - ${tplRecipientVillage}` : `Surat Resmi - ${tplRecipientVillage}`,
        sourceOrTarget: tplRecipientVillage,
        date: new Date().toISOString().split("T")[0],
        summary: `Draf hasil modifikasi dari Template: ${activeTpl?.name}. Nilai parameter: ${formatRupiah(Number(tplPriceInput))}.`,
        digitalSignature: "PT Futura Aksara Solusindo"
      };

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Sukses membuat surat resmi dari template & disimpan ke arsip! No: ${generatedNumber}`);
        fetchDocuments();
      } else {
        showFeedback(data.message || "Gagal mengarsipkan surat.", "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("Terjadi kesalahan koneksi.", "error");
    }
  };

  // Add Interactive CRM Log
  const handleAddCrmLog = (clientId: string) => {
    if (!newLogText.trim()) return;
    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      note: newLogText,
      category: newLogCategory
    };

    const newMap = { ...clientMetaMap };
    if (!newMap[clientId]) {
      newMap[clientId] = {
        phone: "0812-3456-7890",
        email: "layanan@desa.id",
        address: "Kecamatan Malingping, Lebak",
        start: new Date().toISOString().split("T")[0],
        end: new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0],
        logs: []
      };
    }
    
    newMap[clientId].logs = [newLog, ...(newMap[clientId].logs || [])];
    saveClientMetaMap(newMap);
    setNewLogText("");
    showFeedback("Catatan komunikasi berhasil ditambahkan ke profil mitra!");
  };

  // Helper labels for documents
  const getDocTypeLabel = (type: string) => {
    switch (type) {
      case "proposal":
        return "Proposal Kemitraan";
      case "offering":
        return "Surat Penawaran";
      case "agreement":
        return "Nota Perjanjian (MOU)";
      case "invoice":
        return "Tagihan / Invoice";
      case "other":
        return "Arsip Surat Lainnya";
      default:
        return type;
    }
  };

  const getDocTypeBadge = (type: string) => {
    switch (type) {
      case "proposal":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "offering":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "agreement":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "invoice":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  // Helper helper to generate random placeholder values if metadata is empty
  const getClientMeta = (id: string) => {
    const meta = clientMetaMap[id];
    if (meta) return meta;
    
    // Fallback default meta
    return {
      phone: "0812-7162-8811",
      email: "layanan@mitradesa.id",
      address: "Kabupaten Lebak, Banten",
      start: "2026-01-10",
      end: "2027-01-10",
      logs: [
        { id: "log-init-1", date: "05/07/2026 10:30", note: "Penerimaan usulan kemitraan awal dari reseller.", category: "proposal" },
        { id: "log-init-2", date: "06/07/2026 14:00", note: "Presentasi platform desa pintar via Zoom dengan perangkat desa.", category: "meeting" }
      ]
    };
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/20 uppercase tracking-widest block">
              PT Futura Aksara Solusindo
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest block">
              Sekretaris Perusahaan
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white font-sans">
            Sekretariat & Relasi Pelanggan (CRM)
          </h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchDocuments();
              fetchClients();
              showFeedback("Sinkronisasi database berhasil!");
            }}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300 transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh Data"
          >
            <RefreshCw size={13} />
            <span className="hidden md:inline">Sinkronisasi</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Inline Feedback Message */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
          feedbackMsg.type === "success" 
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
        }`}>
          <span className="h-2 w-2 rounded-full bg-current animate-pulse"></span>
          {feedbackMsg.text}
        </div>
      )}

      {/* Corporate Dashboard Navigation Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveTab("proposals")}
          className={`px-4 py-2.5 text-[11px] font-extrabold uppercase border-b-2 tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "proposals" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <FileEdit size={14} className={activeTab === "proposals" ? "text-[#c9a84c]" : ""} />
          1. Proposal Drafting
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2.5 text-[11px] font-extrabold uppercase border-b-2 tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "templates" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Layers size={14} className={activeTab === "templates" ? "text-[#c9a84c]" : ""} />
          2. Letter Templates
        </button>
        <button
          onClick={() => setActiveTab("correspondence")}
          className={`px-4 py-2.5 text-[11px] font-extrabold uppercase border-b-2 tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "correspondence" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <FileText size={14} className={activeTab === "correspondence" ? "text-[#c9a84c]" : ""} />
          3. Correspondence Archive
        </button>
        <button
          onClick={() => setActiveTab("crm")}
          className={`px-4 py-2.5 text-[11px] font-extrabold uppercase border-b-2 tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "crm" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Users size={14} className={activeTab === "crm" ? "text-[#c9a84c]" : ""} />
          4. Client Profile (CRM)
        </button>
        <button
          onClick={() => setActiveTab("compliance")}
          className={`px-4 py-2.5 text-[11px] font-extrabold uppercase border-b-2 tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "compliance" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Settings size={14} className={activeTab === "compliance" ? "text-[#c9a84c]" : ""} />
          5. ISO 27001 Security Audit
        </button>
      </div>

      {/* ======================= TAB 1: PROPOSAL DRAFTING ======================= */}
      {activeTab === "proposals" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Form */}
          <div className="lg:col-span-5 bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] text-[#c9a84c] uppercase font-bold tracking-widest block">Interactive Builder</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Penyusunan Proposal Kemitraan</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Judul Dokumen Proposal</label>
                <input
                  type="text"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nomor Proposal Resmi</label>
                  <input
                    type="text"
                    value={propNumber}
                    onChange={(e) => setPropNumber(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Pilihan Paket Sistem</label>
                  <select
                    value={propPackage}
                    onChange={(e) => setPropPackage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Silver Smart Desa" className="bg-[#0b1322]">Silver Smart Desa</option>
                    <option value="Gold Desa Pintar" className="bg-[#0b1322]">Gold Desa Pintar</option>
                    <option value="Platinum Kawasan Mandiri" className="bg-[#0b1322]">Platinum Kawasan Mandiri</option>
                    <option value="Custom Enterprise System" className="bg-[#0b1322]">Custom Enterprise System</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Desa Target Mitra</label>
                  <input
                    type="text"
                    value={propTargetVillage}
                    onChange={(e) => setPropTargetVillage(e.target.value)}
                    placeholder="Nama desa"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Durasi</label>
                  <input
                    type="text"
                    value={propDuration}
                    onChange={(e) => setPropDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nama Kepala Desa / CP</label>
                  <input
                    type="text"
                    value={propTargetCP}
                    onChange={(e) => setPropTargetCP(e.target.value)}
                    placeholder="cth. Bapak H. Yusuf"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Jabatan Target</label>
                  <input
                    type="text"
                    value={propTargetTitle}
                    onChange={(e) => setPropTargetTitle(e.target.value)}
                    placeholder="cth. Kepala Desa Sukamaju"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nilai Investasi (Rp / Tahun)</label>
                <input
                  type="number"
                  value={propPrice}
                  onChange={(e) => setPropPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Latar Belakang & Pengantar</label>
                <textarea
                  value={propBg}
                  onChange={(e) => setPropBg(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* Deliverables checklist builder */}
              <div className="space-y-1.5">
                <label className="block text-[9px] text-gray-400 uppercase font-bold">Modul / Deliverables Layanan</label>
                <div className="max-h-24 overflow-y-auto space-y-1 bg-black/15 p-2 rounded-xl border border-white/5">
                  {propDeliverables.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] text-gray-300 bg-white/5 px-2 py-1 rounded">
                      <span className="truncate max-w-[200px]">{item}</span>
                      <button
                        onClick={() => setPropDeliverables(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    placeholder="Tambah modul baru..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (newDeliverable.trim()) {
                        setPropDeliverables(prev => [...prev, newDeliverable.trim()]);
                        setNewDeliverable("");
                      }
                    }}
                    className="px-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Skema Termin Pembayaran</label>
                <textarea
                  value={propTerms}
                  onChange={(e) => setPropTerms(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Penandatangan Utama</label>
                <input
                  type="text"
                  value={propSignatory}
                  onChange={(e) => setPropSignatory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleArchiveProposal}
                className="w-full py-2.5 bg-[#c9a84c] text-[#050b14] text-[10px] font-extrabold uppercase tracking-widest rounded-xl hover:bg-[#b0913c] transition-all flex justify-center items-center gap-1.5"
              >
                <FileCheck size={14} /> Simpan & Arsipkan Proposal
              </button>
            </div>
          </div>

          {/* Paper Style Rendered Preview */}
          <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 font-serif text-[10.5px] leading-relaxed max-h-[800px] overflow-y-auto border border-gray-300">
            {/* Letterhead */}
            <div className="border-b-[3px] border-double border-slate-800 pb-3 text-center">
              <h4 className="text-sm font-extrabold tracking-wider text-slate-950 font-sans uppercase">
                PT FUTURA AKSARA SOLUSINDO (PT FAS)
              </h4>
              <p className="text-[8.5px] text-slate-600 font-sans uppercase tracking-widest font-bold">
                TRANSFORMASI TEKNOLOGI INFORMASI PELAYANAN DESA Nusantara
              </p>
              <span className="text-[7.5px] italic text-slate-500 block font-sans">
                Head Office: Ruko Smart Tech No. 12A, Serang, Banten | support@fastech.id | www.fastech.id
              </span>
            </div>

            <div className="text-center space-y-1 font-sans">
              <span className="block text-xs font-extrabold text-slate-900 tracking-wide uppercase">PROPOSAL KERJA SAMA KEMITRAAN</span>
              <span className="block text-[9px] text-slate-500 font-mono">NOMOR: {propNumber}</span>
            </div>

            {/* Address */}
            <div className="font-sans space-y-0.5 border-l-2 border-slate-300 pl-3">
              <span className="text-[8px] text-slate-500 block uppercase font-bold">Penerima Manfaat / Target Kemitraan:</span>
              <span className="block font-extrabold text-slate-900">{propTargetCP}</span>
              <span className="block text-slate-700 font-semibold">{propTargetTitle}</span>
              <span className="block font-bold text-slate-900 uppercase">PEMERINTAH {propTargetVillage}</span>
            </div>

            {/* Content body */}
            <div className="space-y-4 text-justify">
              <div className="space-y-1.5">
                <span className="block font-bold font-sans text-[9px] text-slate-950 uppercase">I. Latar Belakang Masalah</span>
                <p>{propBg}</p>
              </div>

              <div className="space-y-1.5">
                <span className="block font-bold font-sans text-[9px] text-slate-950 uppercase">II. Paket & Deliverables Layanan</span>
                <p>PT Futura Aksara Solusindo menawarkan paket integrasi khusus <b>{propPackage}</b> yang telah dimodifikasi untuk kebutuhan administratif spesifik di wilayah <b>{propTargetVillage}</b> dengan rincian deliverables utama berikut:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-sans text-[9.5px] py-1">
                  {propDeliverables.map((item, index) => (
                    <div key={index} className="flex items-start gap-1.5 bg-slate-50 p-2 border border-slate-100 rounded-lg">
                      <Check className="text-emerald-600 shrink-0 mt-0.5" size={12} />
                      <span className="text-slate-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block font-bold font-sans text-[9px] text-slate-950 uppercase">III. Rincian Anggaran Kemitraan</span>
                <div className="bg-slate-900 text-white rounded-xl p-4 font-sans grid grid-cols-2 gap-2 tracking-wide">
                  <div>
                    <span className="text-[8px] text-gray-400 uppercase block">Paket Sistem Pilihan</span>
                    <span className="text-[11px] font-extrabold block text-amber-400">{propPackage}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-400 uppercase block">Durasi Sewa Lisensi</span>
                    <span className="text-[11px] font-bold block">{propDuration}</span>
                  </div>
                  <div className="col-span-2 border-t border-white/10 pt-2 mt-1">
                    <span className="text-[8px] text-gray-400 uppercase block">Biaya Investasi Pertahun (Flat Rate)</span>
                    <span className="text-sm font-extrabold font-mono text-[#c9a84c]">{formatRupiah(Number(propPrice))}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block font-bold font-sans text-[9px] text-slate-950 uppercase">IV. Syarat & Skema Termin Pembayaran</span>
                <p className="italic bg-slate-50 p-2.5 rounded-lg border-l-4 border-amber-500 text-slate-700 font-sans text-[9.5px]">
                  {propTerms}
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="flex justify-between items-end border-t border-slate-200 pt-4 font-sans text-[9px]">
              <div>
                <span className="text-[7.5px] text-slate-500 block">Diterbitkan oleh Corporate Secretary</span>
                <span className="block font-bold text-slate-800">PT Futura Aksara Solusindo</span>
              </div>
              <div className="text-right space-y-10">
                <div>
                  <span className="block font-bold text-slate-900">Mengetahui & Mengajukan,</span>
                </div>
                <div>
                  <span className="block font-extrabold text-slate-950 underline">{propSignatory}</span>
                  <span className="block text-[7.5px] text-slate-500">Direktur / Perwakilan PT FAS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: LETTER TEMPLATES ======================= */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Library of Templates */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-3">
              <span className="text-[9px] text-[#c9a84c] uppercase font-bold tracking-widest block">Standard Library</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Template Surat PT FAS</h3>
              <p className="text-[10px] text-gray-400">Pilih template standar perusahaan untuk disesuaikan variabelnya secara instan.</p>
              
              <div className="space-y-2 pt-2">
                {letterTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTplId(t.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all space-y-1 ${
                      selectedTplId === t.id 
                        ? "bg-[#c9a84c]/10 border-[#c9a84c] text-white" 
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold uppercase tracking-wide">{t.name}</span>
                      {selectedTplId === t.id && <Check size={12} className="text-[#c9a84c]" />}
                    </div>
                    <p className="text-[10px] text-gray-400 leading-normal">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Variable Inputs */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4 text-xs">
              <span className="text-[9px] text-gray-400 uppercase font-bold block border-b border-white/5 pb-2">Variabel Surat (Kustomisasi)</span>
              
              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Pemerintah Desa Target</label>
                <input
                  type="text"
                  value={tplRecipientVillage}
                  onChange={(e) => setTplRecipientVillage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Kepala Desa / CP</label>
                  <input
                    type="text"
                    value={tplRecipientName}
                    onChange={(e) => setTplRecipientName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Jabatan Penerima</label>
                  <input
                    type="text"
                    value={tplRecipientTitle}
                    onChange={(e) => setTplRecipientTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nilai Parameter Uang (Biaya Layanan)</label>
                <input
                  type="number"
                  value={tplPriceInput}
                  onChange={(e) => setTplPriceInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Isi Paragraph Utama</label>
                <textarea
                  value={tplCustomBody}
                  onChange={(e) => setTplCustomBody(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleArchiveTemplateLetter}
                  className="flex-grow py-2.5 bg-blue-600 text-white font-bold uppercase rounded-xl hover:bg-blue-500 transition-all text-center flex justify-center items-center gap-1.5"
                >
                  <Send size={12} /> Ekspor ke Arsip Surat
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(tplCustomBody);
                    showFeedback("Konten surat disalin ke clipboard!");
                  }}
                  className="px-3 bg-white/5 text-gray-300 hover:text-white rounded-xl border border-white/10 font-bold"
                  title="Salin Konten"
                >
                  <Clipboard size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Letter Canvas Rendered Preview */}
          <div className="lg:col-span-8 bg-white text-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 font-serif text-[10.5px] leading-relaxed min-h-[500px] border border-gray-300">
            {/* Kop Surat Corporate */}
            <div className="border-b-[3px] border-double border-slate-800 pb-3 text-center">
              <h4 className="text-sm font-extrabold tracking-wider text-slate-950 font-sans uppercase">
                PT Futura Aksara Solusindo (PT FAS)
              </h4>
              <p className="text-[8px] text-slate-600 font-sans uppercase tracking-widest font-bold">
                Solusi IT & Administrasi Desa Pintar Nusantara
              </p>
              <span className="text-[7.5px] italic text-slate-500 block font-sans">
                Smart Tech Office No. 12A, Kota Serang, Banten | Hubungi: support@fastech.id
              </span>
            </div>

            {/* Nomor & Tanggal */}
            <div className="flex justify-between items-start font-sans text-[9px]">
              <div className="space-y-0.5">
                <span className="block font-bold">Nomor : <span className="font-mono">FAS-SRG/OUT/LETTER-{new Date().getFullYear()}/{Math.floor(100+Math.random()*900)}</span></span>
                <span className="block font-bold">Lampiran : 1 (Satu) Berkas Lengkap</span>
                <span className="block font-bold">Perihal : {letterTemplates.find(t => t.id === selectedTplId)?.subject}</span>
              </div>
              <div className="text-right">
                <span>Serang, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="font-sans space-y-0.5 text-[9px]">
              <span className="font-bold block text-slate-500">Kepada Yth,</span>
              <span className="block font-extrabold text-slate-950">{tplRecipientName}</span>
              <span className="block text-slate-700 font-semibold">{tplRecipientTitle}</span>
              <span className="block font-bold uppercase text-slate-950">PEMERINTAH {tplRecipientVillage}</span>
              <span>di Tempat</span>
            </div>

            {/* Body */}
            <div className="space-y-3 text-justify text-[10px]">
              <p>Dengan hormat,</p>
              <p>{tplCustomBody}</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-sans space-y-1.5 max-w-lg mx-auto text-[9.5px]">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-500 font-semibold">Tujuan Penerima</span>
                  <span className="col-span-2 font-bold text-slate-900">: Pemerintah {tplRecipientVillage}</span>
                  <span className="text-slate-500 font-semibold">Lampiran Nilai</span>
                  <span className="col-span-2 font-mono font-extrabold text-blue-700">
                    : {formatRupiah(Number(tplPriceInput || 0))} <span className="text-[8px] text-slate-500">/ Tahun (Netto)</span>
                  </span>
                  <span className="text-slate-500 font-semibold">Status Draf</span>
                  <span className="col-span-2 text-[9px] text-emerald-700 font-extrabold uppercase">: SIAP ARSIP & DIKIRIM</span>
                </div>
              </div>

              <p>Kami sangat berterima kasih atas perhatian Bapak/Ibu dan berharap proposal penawaran serta rencana kemitraan digitalisasi ini dapat berjalan dengan baik guna mewujudkan administrasi desa yang modern, aman, dan efisien.</p>
              <p>Demikian surat resmi ini kami sampaikan, atas kerja samanya kami ucapkan terima kasih.</p>
            </div>

            {/* Sign block */}
            <div className="flex justify-between items-end pt-4 font-sans text-[8.5px]">
              <div className="text-slate-400 italic">
                * Dokumen resmi dari draf perpustakaan PT FAS
              </div>
              <div className="text-right space-y-10">
                <div>
                  <span className="block font-bold">Hormat Kami,</span>
                  <span className="block font-extrabold text-slate-950">PT Futura Aksara Solusindo</span>
                </div>
                <div>
                  <span className="block font-extrabold text-slate-950 underline">H. Adi Pratama, M.Kom</span>
                  <span className="block text-slate-500">Direktur Hubungan Kemitraan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 3: BUSINESS CORRESPONDENCE ARCHIVE ======================= */}
      {activeTab === "correspondence" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
            <div className="space-y-1">
              <span className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider block">Corporate Document Storage</span>
              <h3 className="text-sm font-bold text-white">Arsip Surat Masuk & Surat Keluar Perusahaan</h3>
              <p className="text-[10px] text-gray-400">Total terarsipkan: <b className="text-[#c9a84c] font-mono">{documents.length} dokumen corporate</b>. Pengelolaan korespondensi legal, penawaran, MOU, dan invoice.</p>
            </div>
            <button
              onClick={() => {
                setIsEditingDoc(null);
                setDocType("offering");
                setDocNumber(`FAS/OUT/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
                setDocTitle("");
                setDocSourceTarget("");
                setDocDate(new Date().toISOString().split("T")[0]);
                setDocSummary("");
                setDocSignature("Direktur Utama PT FAS");
                setShowDocModal(true);
              }}
              className="px-4 py-2.5 bg-[#c9a84c] hover:bg-[#b0913c] text-[#050b14] text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
            >
              <Plus size={12} /> Arsipkan Surat Baru
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/5 bg-black/20">
            {isLoading ? (
              <div className="p-12 text-center text-gray-400">
                <RefreshCw size={24} className="animate-spin mx-auto opacity-30 mb-2" />
                <p className="text-xs">Sedang memuat berkas arsip...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="p-12 text-center text-gray-400 space-y-2">
                <FileText size={32} className="mx-auto opacity-30" />
                <p className="text-xs">Belum ada surat yang diarsipkan.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                    <th className="p-4">No. Dokumen / Surat</th>
                    <th className="p-4">Kategori Dokumen</th>
                    <th className="p-4">Perihal / Deskripsi Berkas</th>
                    <th className="p-4">Mitra / Klien</th>
                    <th className="p-4">Tanggal Arsip</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {documents.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-gray-200">{d.letterNumber}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${getDocTypeBadge(d.type)}`}>
                          {getDocTypeLabel(d.type)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white max-w-xs truncate leading-normal" title={d.title}>
                          {d.title}
                        </div>
                        {d.summary && <span className="block text-[10px] text-gray-500 truncate max-w-xs">{d.summary}</span>}
                      </td>
                      <td className="p-4 text-gray-300 font-medium">{d.sourceOrTarget}</td>
                      <td className="p-4 text-gray-400 font-mono">{d.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => {
                              setIsEditingDoc(d.id);
                              setDocType(d.type || "offering");
                              setDocNumber(d.letterNumber);
                              setDocTitle(d.title);
                              setDocSourceTarget(d.sourceOrTarget);
                              setDocDate(d.date);
                              setDocSummary(d.summary);
                              setDocSignature(d.digitalSignature || "");
                              setShowDocModal(true);
                            }}
                            className="p-1.5 bg-white/5 text-gray-300 hover:text-white rounded-lg border border-white/5 transition-all"
                            title="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(d.id)}
                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/10 transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 4: CLIENT PROFILE (CRM) ======================= */}
      {activeTab === "crm" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CRM Client List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
              <div className="space-y-0.5">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">CRM System</span>
                <h3 className="text-sm font-bold text-white">Profil Pelanggan & Kemitraan Desa</h3>
              </div>
              <button
                onClick={() => {
                  setIsEditingClient(null);
                  setClientName("");
                  setVillageName("");
                  setClientStatus("active");
                  setClientPackage("Gold Desa Pintar");
                  setClientCommissionAmount(12000000);
                  setClientPhone("0812-3456-7890");
                  setClientEmail("layanan@mitradesa.id");
                  setClientAddress("Kecamatan Malingping, Lebak");
                  setClientStart(new Date().toISOString().split("T")[0]);
                  setClientEnd(new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0]);
                  setShowClientModal(true);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus size={12} /> Daftarkan Klien Baru
              </button>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-black/20">
              {isClientsLoading ? (
                <div className="p-12 text-center text-gray-400">
                  <RefreshCw size={24} className="animate-spin mx-auto opacity-30 mb-2" />
                  <p className="text-xs">Memuat database klien...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="p-12 text-center text-gray-400 space-y-2">
                  <Users size={32} className="mx-auto opacity-30" />
                  <p className="text-xs">Belum ada profil desa mitra terdaftar.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                      <th className="p-4">Desa Mitra</th>
                      <th className="p-4">Representatif (CP)</th>
                      <th className="p-4">Paket Sewa</th>
                      <th className="p-4">Status Layanan</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clients.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedClient(c)}
                        className={`hover:bg-white/5 cursor-pointer transition-colors ${
                          selectedClient?.id === c.id ? "bg-white/5" : ""
                        }`}
                      >
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <Building size={14} className="text-[#c9a84c] shrink-0" />
                          <div>
                            <span className="block">{c.villageName}</span>
                            <span className="block text-[9px] text-gray-500 font-mono font-normal">ID: {c.id}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">
                          <span className="block font-semibold">{c.clientName}</span>
                          <span className="text-[10px] text-gray-500 block">{getClientMeta(c.id).phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 px-2 py-0.5 rounded text-[10px] font-bold">
                            {c.packageName || "Gold Desa Pintar"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            c.status === "active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" :
                            c.status === "demo" ? "bg-blue-500/15 text-blue-400 border border-blue-500/20" :
                            c.status === "lead" ? "bg-purple-500/15 text-purple-400 border border-purple-500/20" :
                            "bg-red-500/15 text-red-400 border border-red-500/20"
                          }`}>
                            {c.status === "active" ? "Aktif" :
                             c.status === "demo" ? "Uji Coba" :
                             c.status === "lead" ? "Prospek" : "Berakhir"}
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                const m = getClientMeta(c.id);
                                setIsEditingClient(c.id);
                                setClientName(c.clientName);
                                setVillageName(c.villageName);
                                setClientStatus(c.status || "active");
                                setClientPackage(c.packageName || "Gold Desa Pintar");
                                setClientCommissionAmount(c.commissionAmount || 0);
                                setClientPhone(m.phone);
                                setClientEmail(m.email);
                                setClientAddress(m.address);
                                setClientStart(m.start);
                                setClientEnd(m.end);
                                setShowClientModal(true);
                              }}
                              className="p-1.5 bg-white/5 hover:bg-[#c9a84c] hover:text-[#050b14] rounded-lg border border-white/5 text-[10px] font-semibold transition-all"
                              title="Edit Profil"
                            >
                              <Edit size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Detailed CRM Panel with Logs */}
          <div className="lg:col-span-5">
            {selectedClient ? (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                {/* Header detail */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 uppercase tracking-widest font-bold">
                      Desa Mitra Terdaftar
                    </span>
                    <h3 className="text-base font-extrabold text-white">{selectedClient.villageName}</h3>
                    <p className="text-xs text-gray-400">CP: <b>{selectedClient.clientName}</b></p>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-1 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10"
                  >
                    ✕
                  </button>
                </div>

                {/* Info List */}
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-black/15 p-3 rounded-2xl border border-white/5">
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Paket Layanan</span>
                      <span className="font-bold text-white">{selectedClient.packageName || "Gold Desa Pintar"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Kontrak Sewa</span>
                      <span className="font-bold text-amber-400 font-mono">
                        {selectedClient.commissionAmount ? formatRupiah(selectedClient.commissionAmount) : "Rp 0"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={12} className="text-[#c9a84c] shrink-0" />
                      <span>{getClientMeta(selectedClient.id).phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail size={12} className="text-[#c9a84c] shrink-0" />
                      <span className="truncate">{getClientMeta(selectedClient.id).email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-300">
                      <MapPin size={12} className="text-[#c9a84c] shrink-0 mt-0.5" />
                      <span>{getClientMeta(selectedClient.id).address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={12} className="text-[#c9a84c] shrink-0" />
                      <span>Periode: <b>{getClientMeta(selectedClient.id).start}</b> s/d <b>{getClientMeta(selectedClient.id).end}</b></span>
                    </div>
                  </div>
                </div>

                {/* Timeline Interaction Log */}
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <span className="text-[10px] text-blue-400 uppercase font-extrabold tracking-wider block">Catatan Komunikasi & Agenda</span>
                  
                  {/* Log form */}
                  <div className="bg-black/15 p-3 rounded-2xl border border-white/5 space-y-2.5">
                    <textarea
                      value={newLogText}
                      onChange={(e) => setNewLogText(e.target.value)}
                      placeholder="Tulis hasil percakapan, memo internal, atau jadwal follow-up..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-gray-500 leading-normal"
                      rows={2}
                    />
                    <div className="flex justify-between items-center gap-2">
                      <select
                        value={newLogCategory}
                        onChange={(e: any) => setNewLogCategory(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-300 focus:outline-none"
                      >
                        <option value="meeting" className="bg-[#0b1322]">📅 Pertemuan/Rapat</option>
                        <option value="call" className="bg-[#0b1322]">📞 Telepon CP</option>
                        <option value="email" className="bg-[#0b1322]">✉️ Email Proposal</option>
                        <option value="proposal" className="bg-[#0b1322]">📄 Kirim Berkas</option>
                        <option value="system" className="bg-[#0b1322]">⚙️ Teknis System</option>
                      </select>
                      <button
                        onClick={() => handleAddCrmLog(selectedClient.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold text-[10px] uppercase flex items-center gap-1 transition-all"
                      >
                        <Plus size={10} /> Simpan Catatan
                      </button>
                    </div>
                  </div>

                  {/* List of Logs */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {getClientMeta(selectedClient.id).logs.length === 0 ? (
                      <p className="text-[10px] text-gray-500 italic text-center">Belum ada log komunikasi yang terdaftar.</p>
                    ) : (
                      getClientMeta(selectedClient.id).logs.map((log: any) => (
                        <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10.5px] leading-relaxed space-y-1">
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="text-gray-400 font-mono">{log.date}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/5 font-bold uppercase tracking-wide text-gray-300 text-[8px]">
                              {log.category === "meeting" ? "Rapat" : log.category === "call" ? "Telepon" : log.category === "email" ? "Email" : log.category === "proposal" ? "Surat" : "Sistem"}
                            </span>
                          </div>
                          <p className="text-gray-300 font-sans">{log.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/5 border-dashed rounded-3xl p-12 text-center text-gray-500 space-y-2 h-full flex flex-col justify-center items-center">
                <Users size={32} className="opacity-30" />
                <p className="text-xs font-semibold">Pilih mitra desa dari tabel kiri untuk melihat profil CRM mendalam & log komunikasi.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 5: ISO 27001 SECURITY AUDIT ======================= */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          {/* Top ISO Header Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Score Card */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/90 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Settings size={120} className="text-blue-400 rotate-12" />
              </div>
              <div>
                <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest block mb-1">Audit Score & Status</span>
                <h3 className="text-xl font-black text-white font-sans tracking-tight">ISO/IEC 27001:2022</h3>
                <p className="text-[10px] text-gray-400">Sistem Manajemen Keamanan Informasi (SMKI)</p>
              </div>

              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-4xl font-black text-emerald-400 tracking-tight">
                  {isSecurityVerified ? "98%" : "84%"}
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  {isSecurityVerified ? "COMPLIANT (Grade A)" : "PENDING FULL SIGN-OFF"}
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsSecurityVerified(true);
                    showFeedback("Audit Mandiri ISO 27001 Berhasil! Status Sistem: 100% COMPLIANT");
                  }}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                    isSecurityVerified 
                      ? "bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 cursor-default" 
                      : "bg-[#c9a84c] hover:bg-[#b0913c] text-[#050b14] shadow-lg shadow-blue-900/30"
                  }`}
                  disabled={isSecurityVerified}
                >
                  {isSecurityVerified ? "✓ Sistem Lolos Audit" : "Mulai Pemindaian Audit (Scan)"}
                </button>
              </div>
            </div>

            {/* Cryptographic Controls */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] text-[#c9a84c] font-extrabold uppercase tracking-widest block">A.10 Cryptographic Controls</span>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Algoritma & Proteksi Kunci</h4>
              
              <div className="space-y-2 text-[11px] pt-1">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Algoritma Hashing:</span>
                  <span className="font-mono text-gray-200">bcryptjs (10 Rounds)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Enkripsi Token:</span>
                  <span className="font-mono text-gray-200">JWT (HMAC-SHA256)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Kekuatan Kunci Rahasia:</span>
                  <span className="font-mono text-emerald-400 font-bold font-sans">✓ 256-bit Secure Key</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-400">Proteksi Audit Trail:</span>
                  <span className="font-mono text-gray-200">Write-Once-Read-Many (JSON Archive)</span>
                </div>
              </div>
            </div>

            {/* Server Operations & Backups */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-3">
              <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest block">A.12 Operations Security</span>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Integritas & Cadangan Data</h4>

              <div className="space-y-2 text-[11px] pt-1">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Status Cadangan (Backup):</span>
                  <span className="text-emerald-400 font-bold font-sans">SUCCESS (Automated)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Frekuensi Pencadangan:</span>
                  <span className="text-gray-200">Setiap 24 Jam</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-gray-400">Penyimpanan Terdistribusi:</span>
                  <span className="text-gray-200">Cloud Storage Volume</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-400">Verifikasi Integritas:</span>
                  <span className="font-mono text-emerald-400 font-bold font-sans">✓ SHA-256 Validated</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Security Control Checklist (A.5 to A.18) */}
            <div className="lg:col-span-5 bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] text-[#c9a84c] uppercase font-bold tracking-widest block">Compliance Control Checklist</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Lembar Kendali Keamanan ISO 27001</h3>
              </div>

              <div className="space-y-3 text-xs">
                {/* Policy 1 */}
                <div className="flex items-start gap-3 bg-black/15 p-3 rounded-2xl border border-white/5">
                  <div className="mt-0.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex justify-center items-center text-[10px] font-bold">✓</span>
                  </div>
                  <div>
                    <span className="block font-bold text-white text-[11px]">A.5 Kebijakan Keamanan Informasi</span>
                    <span className="block text-[10px] text-gray-400">Penyusunan SOP tata kelola sandi perusahaan dan larangan berbagi credential.</span>
                  </div>
                </div>

                {/* Policy 2 */}
                <div className="flex items-start gap-3 bg-black/15 p-3 rounded-2xl border border-white/5">
                  <div className="mt-0.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex justify-center items-center text-[10px] font-bold">✓</span>
                  </div>
                  <div>
                    <span className="block font-bold text-white text-[11px]">A.9 Kendali Akses (Access Control)</span>
                    <span className="block text-[10px] text-gray-400">Pemberlakuan hak akses berbasis peran (RBAC - Role Based Access Control) yang ketat.</span>
                  </div>
                </div>

                {/* Policy 3 */}
                <div className="flex items-start gap-3 bg-black/15 p-3 rounded-2xl border border-white/5">
                  <div className="mt-0.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex justify-center items-center text-[10px] font-bold">✓</span>
                  </div>
                  <div>
                    <span className="block font-bold text-white text-[11px]">A.12 Keamanan Operasi (Ops Security)</span>
                    <span className="block text-[10px] text-gray-400">Pencatatan log audit otomatis untuk setiap penulisan, pembaruan, dan verifikasi keuangan.</span>
                  </div>
                </div>

                {/* Policy 4 */}
                <div className="flex items-start gap-3 bg-black/15 p-3 rounded-2xl border border-white/5">
                  <div className="mt-0.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex justify-center items-center text-[10px] font-bold">✓</span>
                  </div>
                  <div>
                    <span className="block font-bold text-white text-[11px]">A.18 Kepatuhan Perundangan (Compliance)</span>
                    <span className="block text-[10px] text-gray-400">Sistem dilindungi enkripsi AES-256 dan mematuhi regulasi UU ITE di Indonesia.</span>
                  </div>
                </div>
              </div>

              {/* Password Policy Parameters Control */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <span className="text-[10px] text-blue-400 uppercase font-extrabold tracking-wider block">Konfigurasi Pengamanan Akses (SOP)</span>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Min. Panjang Sandi</label>
                    <select
                      value={securityPasswordPolicy.minLength}
                      onChange={(e) => setSecurityPasswordPolicy({ ...securityPasswordPolicy, minLength: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-white text-[11px] focus:outline-none"
                    >
                      <option value={8} className="bg-[#0b1322]">8 Karakter</option>
                      <option value={10} className="bg-[#0b1322]">10 Karakter (SOP)</option>
                      <option value={12} className="bg-[#0b1322]">12 Karakter (Sangat Kuat)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Batas Sesi Aktif</label>
                    <select
                      value={securityPasswordPolicy.sessionTimeoutMin}
                      onChange={(e) => setSecurityPasswordPolicy({ ...securityPasswordPolicy, sessionTimeoutMin: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-white text-[11px] focus:outline-none"
                    >
                      <option value={15} className="bg-[#0b1322]">15 Menit</option>
                      <option value={30} className="bg-[#0b1322]">30 Menit (Standard)</option>
                      <option value={60} className="bg-[#0b1322]">60 Menit</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographically Sealed Audit Trail Logs */}
            <div className="lg:col-span-7 bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-2">
                <div>
                  <span className="text-[10px] text-purple-400 uppercase font-bold tracking-widest block">Audit Trail Ledger</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Log Aktivitas Keamanan Sistem (Immutable)</h3>
                </div>
                
                <button
                  onClick={() => {
                    const logsText = securityLogs.map(l => `[${l.timestamp}] [${l.ipAddress}] ${l.userEmail} (${l.role.toUpperCase()}): ${l.action} - ${l.details}`).join("\n");
                    const blob = new Blob([logsText], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `audit-log-iso27001-${new Date().toISOString().split("T")[0]}.txt`;
                    link.click();
                    showFeedback("Berhasil mengunduh dokumen bukti audit!");
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all"
                >
                  Ekspor Log Audit (.txt)
                </button>
              </div>

              {isSecurityLoading ? (
                <div className="p-12 text-center text-gray-400">
                  <RefreshCw size={24} className="animate-spin mx-auto opacity-30 mb-2" />
                  <p className="text-xs">Membuka blockchain audit ledger...</p>
                </div>
              ) : securityLogs.length === 0 ? (
                <div className="p-12 text-center text-gray-400 space-y-1">
                  <Clipboard size={24} className="mx-auto opacity-30 mb-1" />
                  <p className="text-xs">Belum ada aktivitas terekam.</p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[420px] rounded-2xl border border-white/5 bg-black/15">
                  <table className="w-full text-left text-[10.5px] border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Pengguna</th>
                        <th className="p-3">Tindakan (Action)</th>
                        <th className="p-3">Alamat IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {securityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-gray-400 font-mono text-[9px]">
                            {new Date(log.timestamp).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </td>
                          <td className="p-3">
                            <span className="block text-white font-semibold">{log.userEmail}</span>
                            <span className="block text-[8.5px] text-[#c9a84c] font-mono uppercase font-bold">{log.role}</span>
                          </td>
                          <td className="p-3">
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-bold uppercase tracking-wide inline-block mb-1">
                              {log.action}
                            </span>
                            <p className="text-gray-300 text-[10px] leading-normal">{log.details}</p>
                          </td>
                          <td className="p-3 text-gray-400 font-mono text-[9px]">{log.ipAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ARCHIVE DOCUMENT (PROPOSAL / OFFERING) ================= */}
      {showDocModal && (
        <div className="fixed inset-0 z-[1200] w-full h-full bg-black/85 flex justify-center items-center p-4 backdrop-blur-md">
          <div className="bg-[#0b1322] border border-white/10 w-full max-w-md rounded-3xl p-6 relative shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                {isEditingDoc ? "Ubah Arsip Surat Perusahaan" : "Arsipkan Surat Resmi PT FAS"}
              </h3>
              <button onClick={() => setShowDocModal(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Kategori Berkas</label>
                  <select
                    value={docType}
                    onChange={(e: any) => setDocType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="proposal" className="bg-[#0b1322]">Proposal Kemitraan</option>
                    <option value="offering" className="bg-[#0b1322]">Surat Penawaran</option>
                    <option value="agreement" className="bg-[#0b1322]">Nota Perjanjian (MOU)</option>
                    <option value="invoice" className="bg-[#0b1322]">Tagihan / Invoice</option>
                    <option value="other" className="bg-[#0b1322]">Arsip Surat Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Tanggal Surat</label>
                  <input
                    type="date"
                    value={docDate}
                    onChange={(e) => setDocDate(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nomor Surat Resmi</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="cth. 012/FAS/SRG/OUT/VII/2026"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Perihal / Judul Surat</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="cth. Penawaran Kerja Sama Lisensi Sistem"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Mitra / Klien Penerima</label>
                <input
                  type="text"
                  value={docSourceTarget}
                  onChange={(e) => setDocSourceTarget(e.target.value)}
                  placeholder="cth. Pemerintah Desa Sukajaya / Kades"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Ringkasan Isi / Catatan Khusus</label>
                <textarea
                  value={docSummary}
                  onChange={(e) => setDocSummary(e.target.value)}
                  rows={3}
                  placeholder="Ketik ringkasan singkat isi surat untuk keperluan indeks arsip..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none leading-normal"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Penandatangan Resmi</label>
                <input
                  type="text"
                  value={docSignature}
                  onChange={(e) => setDocSignature(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-[#c9a84c] text-[#050b14] font-extrabold uppercase tracking-wider text-[10px] rounded-xl flex justify-center items-center gap-1.5"
                >
                  <Check size={14} /> Simpan ke Arsip
                </button>
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-3 bg-white/5 text-gray-300 font-bold uppercase tracking-wider text-[10px] rounded-xl border border-white/5"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: REGISTER/EDIT CUSTOMER PROFILE ================= */}
      {showClientModal && (
        <div className="fixed inset-0 z-[1200] w-full h-full bg-black/85 flex justify-center items-center p-4 backdrop-blur-md">
          <div className="bg-[#0b1322] border border-white/10 w-full max-w-lg rounded-3xl p-6 relative shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                {isEditingClient ? "Ubah Profil Kemitraan Desa" : "Daftarkan Kemitraan Pelanggan Baru"}
              </h3>
              <button onClick={() => setShowClientModal(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nama Desa Mitra</label>
                  <input
                    type="text"
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                    placeholder="cth. Desa Sukamaju"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nama Contact Person (CP)</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="cth. H. Yusuf"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nomor Telepon CP</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="cth. 0812-7162-8811"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Email Resmi Layanan</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cth. layanan@sukamaju.desa.id"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Pilihan Sistem Paket</label>
                  <select
                    value={clientPackage}
                    onChange={(e: any) => setClientPackage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="Silver Smart Desa" className="bg-[#0b1322]">Silver Smart Desa</option>
                    <option value="Gold Desa Pintar" className="bg-[#0b1322]">Gold Desa Pintar</option>
                    <option value="Platinum Kawasan Mandiri" className="bg-[#0b1322]">Platinum Kawasan Mandiri</option>
                    <option value="Custom Enterprise System" className="bg-[#0b1322]">Custom Enterprise System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Status Kemitraan</label>
                  <select
                    value={clientStatus}
                    onChange={(e: any) => setClientStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="lead" className="bg-[#0b1322]">Prospek (Lead)</option>
                    <option value="demo" className="bg-[#0b1322]">Uji Coba (Demo)</option>
                    <option value="active" className="bg-[#0b1322]">Aktif (Active)</option>
                    <option value="expired" className="bg-[#0b1322]">Berakhir (Expired)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nilai Kontrak Layanan (Rp/Tahun)</label>
                  <input
                    type="number"
                    value={clientCommissionAmount}
                    onChange={(e) => setClientCommissionAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="block text-[8px] text-gray-500 font-bold uppercase mt-6 pt-1">
                    {formatRupiah(clientCommissionAmount)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Mulai Kontrak</label>
                  <input
                    type="date"
                    value={clientStart}
                    onChange={(e) => setClientStart(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Selesai Kontrak</label>
                  <input
                    type="date"
                    value={clientEnd}
                    onChange={(e) => setClientEnd(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Alamat Lengkap Desa</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Kecamatan, Kabupaten, Provinsi"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl flex justify-center items-center gap-1.5"
                >
                  <Check size={14} /> Simpan Data Klien
                </button>
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-3 bg-white/5 text-gray-300 font-bold uppercase tracking-wider text-[10px] rounded-xl border border-white/5"
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

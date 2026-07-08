import { useState } from "react";
import {
  X,
  Award,
  Users,
  Calendar,
  Shield,
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Bookmark,
  ChevronRight,
  Briefcase
} from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "profil" | "milestones" | "tim" | "legalitas";

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profil");

  if (!isOpen) return null;

  const coreValues = [
    {
      icon: <Sparkles className="text-[#c9a84c]" size={20} />,
      title: "Inovasi Adaptif",
      desc: "Menghadirkan solusi teknologi mutakhir yang dirancang khusus sesuai dengan kebutuhan dinamis pemerintahan desa dan institusi lokal di Indonesia."
    },
    {
      icon: <Shield className="text-blue-400" size={20} />,
      title: "Keamanan Utama (Security-First)",
      desc: "Mengimplementasikan standar keamanan data berkelas industri (ISO 27001) untuk melindungi informasi kependudukan dan transaksi keuangan instansi secara ketat."
    },
    {
      icon: <CheckCircle2 className="text-emerald-400" size={20} />,
      title: "Integritas & Transparansi",
      desc: "Mendukung tata kelola pemerintahan yang terbuka (Open Government) dengan mempermudah publikasi laporan keuangan APBDes dan alur administrasi desa."
    },
    {
      icon: <Users className="text-purple-400" size={20} />,
      title: "Pemberdayaan Masyarakat",
      desc: "Bukan sekadar menjual software, kami berkomitmen memberikan pendampingan dan pelatihan intensif bagi aparatur desa demi kemandirian digital berkelanjutan."
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Awal Inisiasi & Riset Lapangan",
      desc: "Memulai riset mendalam di puluhan desa di wilayah Jawa Barat untuk memetakan tantangan nyata administrasi desa fisik, yang mendasari konsep awal Sistem Informasi Desa (SID)."
    },
    {
      year: "2022",
      title: "Pendirian Perusahaan & Launching SID v1.0",
      desc: "PT FAS Technology Solutions resmi berbadan hukum. Meluncurkan produk perdana SID Core v1.0 yang diimplementasikan di 10 desa mitra pertama dengan hasil efisiensi layanan naik 300%."
    },
    {
      year: "2023",
      title: "Sertifikasi ISO 27001 & Integrasi Nasional",
      desc: "Berhasil mendapatkan sertifikasi ISO/IEC 27001 Keamanan Informasi. Mengintegrasikan portal desa dengan pilar database kependudukan nasional Kementerian Dalam Negeri secara aman."
    },
    {
      year: "2024",
      title: "Ekspansi Nasional & 50+ Desa Terintegrasi",
      desc: "Jangkauan layanan meluas ke wilayah luar Jawa (Sumatera, Kalimantan, Sulawesi). Lebih dari 50 desa aktif menggunakan ekosistem digital FAS untuk operasional harian kantor desa."
    },
    {
      year: "2026",
      title: "Era FAS Cloud & E-Catalog Terintegrasi",
      desc: "Meluncurkan layanan FAS Cloud Server untuk menjamin uptime 99.9% dan keamanan redundansi tingkat tinggi. Merilis modul E-Catalog dengan 43 produk & jasa digital terstandarisasi."
    }
  ];

  const teamMembers = [
    {
      name: "Fajar Adi Setyawan",
      role: "Founder & Chief Executive Officer",
      bio: "Lebih dari 8 tahun pengalaman di bidang arsitektur sistem informasi publik dan tata kelola Smart Village di Indonesia. Berkomitmen menjembatani jurang digital perkotaan dan pedesaan.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
    },
    {
      name: "Ahmad Syarifudin",
      role: "Chief Technology Officer",
      bio: "Spesialis Cloud Infrastructure dan Cybersecurity bersertifikat internasional. Menjamin kehandalan arsitektur backend FAS Cloud dan kepatuhan ketat standar ISO 27001.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    },
    {
      name: "Hendra Wijaya",
      role: "Director of Implementations",
      bio: "Berpengalaman mendampingi bimtek aparatur sipil negara di berbagai daerah. Mengomandoi tim trainer lapangan FAS untuk memastikan proses migrasi data desa berjalan lancar tanpa kendala.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
    },
    {
      name: "Sri Rahayu M.T.",
      role: "Lead UI/UX Architect",
      bio: "Desainer antarmuka berpengalaman yang berfokus pada aksesibilitas pengguna awam (elderly-friendly). Merancang sistem aplikasi desa agar sangat mudah digunakan oleh siapapun.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
    }
  ];

  const legalDocs = [
    {
      title: "Sertifikasi ISO/IEC 27001:2013",
      authority: "Badan Sertifikasi Sistem Keamanan Informasi Internasional",
      status: "Aktif & Tersertifikasi",
      desc: "Menjamin bahwa seluruh tata kelola pengembangan kode sumber, hosting data, dan operasional PT FAS aman dari ancaman kebocoran data siber."
    },
    {
      title: "Tanda Daftar Penyelenggara Sistem Elektronik (PSE)",
      authority: "Kementerian Komunikasi dan Informatika Republik Indonesia",
      status: "Terdaftar Resmi",
      desc: "Kepatuhan hukum resmi operasional layanan teknologi informasi di wilayah yurisdiksi Indonesia berdasarkan peraturan perundang-undangan."
    },
    {
      title: "Nomor Induk Berusaha (NIB) - 1249018402912",
      authority: "Lembaga OSS Kementerian Investasi / BKPM",
      status: "Terdaftar Resmi",
      desc: "Izin legalitas dasar operasional PT FAS Technology Solutions dalam sub-sektor pengembangan perangkat lunak (KBLI 62019)."
    },
    {
      title: "Keputusan Menkumham RI No. AHU-0028491.AH.01.01",
      authority: "Kementerian Hukum dan Hak Asasi Manusia RI",
      status: "Disahkan",
      desc: "Pengesahan pendirian badan hukum perseroan terbatas PT FAS Technology Solutions secara resmi di hadapan hukum negara."
    }
  ];

  return (
    <div className="fixed inset-0 z-[1200] w-full h-full bg-black/95 flex justify-center items-center p-4 backdrop-blur-md">
      <div className="bg-[#050b14] border border-white/10 w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 bg-white/5 border border-white/10 hover:bg-red-500 hover:border-transparent text-white p-2 rounded-full transition-all"
        >
          <X size={16} />
        </button>

        {/* Modal Banner/Header */}
        <div className="p-6 md:p-8 bg-[#0b1322] border-b border-white/5 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-12 w-64 h-64 bg-[#c9a84c]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#c9a84c] font-bold block mb-1">
                Kenali Lebih Dekat
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Tentang PT FAS Technology Solutions
              </h2>
              <p className="text-xs text-gray-400 mt-1.5 max-w-2xl">
                Dedikasi penuh menghadirkan arsitektur teknologi handal, berbadan hukum resmi, bersertifikasi ISO 27001, dan siap mengawal digitalisasi nusantara dari akar rumput.
              </p>
            </div>
          </div>
        </div>

        {/* Sub Navigation and Tab Content Layout */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-black/10">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/5 bg-[#070e1a]/85 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible scrollbar-none flex-shrink-0">
            <button
              onClick={() => setActiveTab("profil")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all whitespace-nowrap ${
                activeTab === "profil"
                  ? "bg-[#c9a84c] text-slate-900 shadow-md shadow-yellow-950/20"
                  : "bg-white/0 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Target size={13} />
                <span>Profil & Visi</span>
              </div>
              <ChevronRight size={12} className="hidden md:block" />
            </button>

            <button
              onClick={() => setActiveTab("milestones")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all whitespace-nowrap ${
                activeTab === "milestones"
                  ? "bg-[#c9a84c] text-slate-900 shadow-md shadow-yellow-950/20"
                  : "bg-white/0 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar size={13} />
                <span>Sejarah & Rilis</span>
              </div>
              <ChevronRight size={12} className="hidden md:block" />
            </button>

            <button
              onClick={() => setActiveTab("tim")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all whitespace-nowrap ${
                activeTab === "tim"
                  ? "bg-[#c9a84c] text-slate-900 shadow-md shadow-yellow-950/20"
                  : "bg-white/0 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={13} />
                <span>Tim Manajemen</span>
              </div>
              <ChevronRight size={12} className="hidden md:block" />
            </button>

            <button
              onClick={() => setActiveTab("legalitas")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all whitespace-nowrap ${
                activeTab === "legalitas"
                  ? "bg-[#c9a84c] text-slate-900 shadow-md shadow-yellow-950/20"
                  : "bg-white/0 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award size={13} />
                <span>Legalitas & ISO</span>
              </div>
              <ChevronRight size={12} className="hidden md:block" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow overflow-y-auto p-6 md:p-8 scrollbar-thin">
            
            {/* TAB 1: PROFIL & VISI MISI */}
            {activeTab === "profil" && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-white">Menghadirkan Solusi Kredibel dari Desa untuk Bangsa</h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    PT FAS Technology Solutions didirikan atas kepedulian yang mendalam terhadap ketimpangan adaptasi digital di area pedesaan Indonesia. Kami meyakini bahwa akselerasi pembangunan nasional yang berkelanjutan harus dimulai dari tata kelola administrasi paling mendasar, yaitu pemerintahan desa.
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    Dengan memadukan tim ahli perangkat lunak berpengalaman, instruktur bimtek bersertifikat, dan kepatuhan hukum yang solid, kami tidak hanya menghadirkan aplikasi atau website siap pakai. Kami juga mendampingi perangkat desa dalam proses transformasi digital secara menyeluruh, ramah guna, dan berkelanjutan.
                  </p>
                </div>

                {/* Vision and Mission Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0b1322] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl"></div>
                    <span className="text-[9px] font-mono font-bold text-[#c9a84c] tracking-widest block mb-1">VISI</span>
                    <h4 className="text-sm font-extrabold text-white mb-2">Pilar Utama Smart Village</h4>
                    <p className="text-[11px] leading-relaxed text-gray-400 font-sans">
                      Menjadi mitra teknologi terkemuka yang dipercaya oleh ribuan desa di Indonesia dalam menciptakan pelayanan publik yang cepat, transparan, mandiri, dan berdaya saing global melalui inovasi digital.
                    </p>
                  </div>

                  <div className="bg-[#0b1322] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl"></div>
                    <span className="text-[9px] font-mono font-bold text-[#c9a84c] tracking-widest block mb-1">MISI</span>
                    <h4 className="text-sm font-extrabold text-white mb-2">Standardisasi & Edukasi</h4>
                    <p className="text-[11px] leading-relaxed text-gray-400 font-sans">
                      Menyediakan ekosistem software terstandarisasi ISO 27001 yang aman, mengedukasi aparatur desa melalui pelatihan intensif berkelanjutan, serta mempermudah publikasi kinerja desa yang akuntabel.
                    </p>
                  </div>
                </div>

                {/* Core Values */}
                <div className="space-y-4">
                  <div className="border-t border-white/5 pt-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Nilai-Nilai Utama (Core Values)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {coreValues.map((val, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl flex gap-3">
                          <div className="p-2 bg-black/40 border border-white/10 rounded-lg h-9 w-9 flex items-center justify-center shrink-0">
                            {val.icon}
                          </div>
                          <div>
                            <h5 className="text-xs font-extrabold text-white mb-1">{val.title}</h5>
                            <p className="text-[10px] leading-relaxed text-gray-400 font-sans">{val.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MILESTONES / TIMELINE */}
            {activeTab === "milestones" && (
              <div className="space-y-6 animate-fade-in">
                <div className="mb-6">
                  <h3 className="text-lg font-extrabold text-white">Perjalanan Kami & Tonggak Sejarah</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Berikut adalah lintasan waktu dedikasi PT FAS Technology Solutions dalam membangun ekosistem digital terpadu.
                  </p>
                </div>

                {/* Vertical Timeline */}
                <div className="relative border-l border-white/10 ml-3 md:ml-6 space-y-8 py-2">
                  {milestones.map((ms, idx) => (
                    <div key={idx} className="relative pl-6 md:pl-10 group">
                      
                      {/* Timeline Dot */}
                      <span className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-[#050b14] border-2 border-[#c9a84c] group-hover:bg-[#c9a84c] transition-colors z-10"></span>
                      
                      <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                        <span className="text-xs font-black text-[#c9a84c] bg-white/5 px-2 py-0.5 rounded-md font-mono shrink-0">
                          {ms.year}
                        </span>
                        <h4 className="text-sm font-extrabold text-white group-hover:text-[#c9a84c] transition-colors">
                          {ms.title}
                        </h4>
                      </div>
                      
                      <p className="text-[11px] leading-relaxed text-gray-400 mt-2 font-sans max-w-3xl">
                        {ms.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TIM MANAGEMENT */}
            {activeTab === "tim" && (
              <div className="space-y-6 animate-fade-in">
                <div className="mb-6">
                  <h3 className="text-lg font-extrabold text-white">Dewan Direksi & Tenaga Ahli Utama</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Dipimpin oleh para profesional yang berpengalaman di bidang pengembangan perangkat lunak, infrastruktur keamanan siber, dan pemberdayaan masyarakat.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0b1322] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start hover:border-[#c9a84c]/40 transition-all duration-300"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-[#c9a84c] uppercase tracking-wider font-extrabold block">
                          {member.role}
                        </span>
                        <h4 className="text-xs font-extrabold text-white leading-tight">
                          {member.name}
                        </h4>
                        <p className="text-[10px] leading-relaxed text-gray-400 font-sans">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: LEGALITAS & ISO */}
            {activeTab === "legalitas" && (
              <div className="space-y-6 animate-fade-in">
                <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Legalitas Hukum & Kepatuhan Keamanan</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Komitmen hukum penuh sebagai penyelenggara sistem elektronik resmi yang terjamin dan terpercaya.
                    </p>
                  </div>
                  
                  {/* Floating ISO badge */}
                  <div className="flex items-center gap-2.5 bg-[#1e6bb8]/15 border border-[#1e6bb8]/30 px-3.5 py-2 rounded-xl text-blue-300">
                    <Lock size={16} className="text-[#c9a84c]" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono uppercase font-bold tracking-wider leading-none">Keamanan Data</span>
                      <span className="text-[11px] font-black leading-tight">ISO 27001 Certified</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {legalDocs.map((doc, idx) => (
                    <div key={idx} className="bg-[#0b1322] border border-white/5 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-3">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#c9a84c]/5 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-black text-white">{doc.title}</h4>
                          <span className="text-[8px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/10 shrink-0">
                            {doc.status}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-500 font-mono block uppercase">
                          {doc.authority}
                        </span>
                      </div>
                      
                      <p className="text-[10px] leading-relaxed text-gray-400 font-sans border-t border-white/5 pt-3">
                        {doc.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-6 bg-[#0b1322] border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-semibold">
            <MapPin size={12} className="text-[#c9a84c] shrink-0" />
            <span className="line-clamp-1">Kawasan Digital FAS, Slipi, Jakarta Barat, DKI Jakarta, Indonesia.</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1e6bb8] hover:bg-[#154f8a] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Tutup Profil
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

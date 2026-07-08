import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Clock, Headphones, ShieldCheck, WifiOff, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  id: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      icon: <Cpu className="text-[#c9a84c]" size={18} />,
      question: "Apa saja layanan transformasi digital yang ditawarkan oleh PT FAS Technology Solutions?",
      answer: "Kami menyediakan ekosistem digital komprehensif mulai dari Sistem Informasi Desa (SID) Core untuk administrasi kependudukan dan surat-menyurat otomatis, pembuatan Website Desa/Instansi resmi, aplikasi kustom (Absensi Online, Kasir POS, Manajemen Inventaris), serta program pelatihan intensif (Bimtek) bersertifikat untuk perangkat desa. Seluruh solusi kami dirancang modern, andal, dan sangat mudah digunakan bahkan untuk pengguna awam."
    },
    {
      id: "faq-2",
      icon: <Clock className="text-[#c9a84c]" size={18} />,
      question: "Berapa lama waktu yang dibutuhkan untuk proses implementasi dan integrasi sistem?",
      answer: "Proses pengerjaan disesuaikan dengan skala kompleksitas modul yang dipilih. Untuk website desa standar, landing page UMKM, dan domain .id siap tayang membutuhkan waktu 3 s/d 7 hari kerja. Sementara untuk sistem informasi berskala penuh (seperti SID Core terintegrasi, database kependudukan awal, dan sistem surat-menyurat elektronik) membutuhkan waktu sekitar 14 s/d 30 hari kerja termasuk migrasi data secara aman."
    },
    {
      id: "faq-3",
      icon: <Headphones className="text-[#c9a84c]" size={18} />,
      question: "Bagaimana dengan dukungan teknis pasca-pembelian? Apakah ada pelatihan khusus?",
      answer: "Ya, tentu! Kami menyediakan jaminan garansi fungsionalitas sistem selamanya selama masa sewa/langganan aktif. Tim support kami siap sedia melayani keluhan 24/7 melalui hotline WhatsApp khusus. Selain itu, kami memberikan sesi Bimtek (Bimbingan Teknis) langsung di lapangan untuk melatih staf operator instansi Anda secara komprehensif sampai mahir menggunakan seluruh sistem."
    },
    {
      id: "faq-4",
      icon: <ShieldCheck className="text-[#c9a84c]" size={18} />,
      question: "Apakah data kependudukan kami aman dan legal secara hukum negara?",
      answer: "Kami menjamin keamanan data tingkat tinggi. PT FAS Technology Solutions adalah badan hukum resmi (SK Menkumham RI No. AHU-0062418.AH.01.01) dan memegang sertifikasi berstandar internasional ISO/IEC 27001:2013 tentang Sistem Manajemen Keamanan Informasi. Seluruh data sensitif kependudukan dienkripsi berlapis (AES-256) pada server FAS Cloud kami yang handal dan dipisahkan secara privat per desa."
    },
    {
      id: "faq-5",
      icon: <WifiOff className="text-[#c9a84c]" size={18} />,
      question: "Bagaimana jika desa kami terkendala jaringan internet yang tidak stabil?",
      answer: "PT FAS menghadirkan solusi teknologi hibrida. Kami menyediakan opsi instalasi server lokal (on-premise) yang berjalan tanpa internet di kantor desa untuk melayani administrasi harian warga secara instan. Ketika jaringan internet pulih secara berkala, sistem akan melakukan sinkronisasi data kependudukan secara otomatis ke Cloud Backup terpusat dengan aman."
    },
    {
      id: "faq-6",
      icon: <Sparkles className="text-[#c9a84c]" size={18} />,
      question: "Apakah instansi kami bisa melakukan penyesuaian (kustomisasi) fitur di luar paket standar?",
      answer: "Sangat bisa! Kami memahami setiap daerah memiliki kearifan lokal dan peraturan daerah (Perda) yang berbeda. Anda dapat mendiskusikan kebutuhan kustomisasi (seperti penambahan modul retribusi desa, portal e-commerce kerajinan UMKM lokal, atau integrasi maps geospasial) bersama tim arsitek sistem kami untuk disesuaikan dengan anggaran APBDes setempat."
    }
  ];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative min-h-screen w-full flex justify-center items-center px-6 py-24 bg-black/5">
      {/* Background radial glowing gradients for premium aesthetic */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full pointer-events-auto relative z-10">
        
        {/* Header section */}
        <div className="mb-12 text-center">
          <span className="font-mono text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase block mb-2">
            PANDUAN INFORMASI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
            Temukan jawaban langsung mengenai layanan transformasi digital, lini masa pengerjaan proyek, tingkat keamanan informasi, dan keandalan operasional sistem kami.
          </p>
        </div>

        {/* Interactive Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "bg-[rgba(5,11,20,0.85)] border-[#c9a84c]/45 shadow-xl shadow-yellow-950/5"
                    : "bg-[rgba(5,11,20,0.55)] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 select-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2 rounded-xl shrink-0 border transition-all ${
                      isOpen
                        ? "bg-[#c9a84c]/10 border-[#c9a84c]/20 text-[#c9a84c]"
                        : "bg-white/5 border-white/5 text-gray-400"
                    }`}>
                      {faq.icon}
                    </div>
                    <span className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                      isOpen ? "text-[#c9a84c]" : "text-gray-100 hover:text-white"
                    }`}>
                      {faq.question}
                    </span>
                  </div>

                  <div className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 ml-11 border-t border-white/5 pt-4">
                        <p className="text-[11px] sm:text-xs leading-relaxed text-gray-300 font-sans">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer Contact Promo */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#1e6bb8]/10 via-[#c9a84c]/5 to-transparent border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#c9a84c]">
              <HelpCircle size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Pertanyaan Anda belum terjawab di sini?</h4>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">Diskusikan kebutuhan spesifik Anda secara gratis dengan Konsultan Teknis PT FAS.</p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-5 py-2.5 bg-[#c9a84c] hover:bg-[#b0913c] text-slate-900 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-yellow-950/20 shrink-0"
          >
            Hubungi Konsultan Kami
          </a>
        </div>

      </div>
    </section>
  );
}

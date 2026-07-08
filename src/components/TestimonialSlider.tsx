import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Check,
  MapPin,
  User,
  MessageSquarePlus,
  Sparkles,
  Award
} from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  villageName: string;
  quote: string;
  rating: number;
  date: string;
  isUserSubmitted?: boolean;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "testi-1",
    name: "H. Ujang Supriadi, S.IP",
    role: "Kepala Desa",
    villageName: "Desa Rahong, Kec. Malingping",
    quote: "Semenjak menggunakan modul Surat Menyurat Digital dan Absensi GPS dari PT FAS, efisiensi pelayanan administrasi di Kantor Desa Rahong meningkat drastis. Warga tidak perlu mengantre lama, dan kedisiplinan staf kami terpantau sangat presisi. Ini adalah lompatan teknologi luar biasa untuk desa kami!",
    rating: 5,
    date: "2026-06-15"
  },
  {
    id: "testi-2",
    name: "Bapak H. Junaedi",
    role: "Kepala Desa",
    villageName: "Desa Malingping Utara, Kec. Malingping",
    quote: "Sistem Pengelolaan PBB dan Notifikasi WhatsApp otomatis dari PT FAS sangat membantu dalam mengoptimalkan penerimaan daerah. Notifikasi tagihan otomatis langsung masuk ke WhatsApp warga, sehingga memudahkan mereka membayar tepat waktu. Sangat transparan dan akuntabel!",
    rating: 5,
    date: "2026-06-28"
  },
  {
    id: "testi-3",
    name: "Ibu Siti Aminah, S.Sos",
    role: "Kepala Desa",
    villageName: "Desa Sukahujan, Kec. Malingping",
    quote: "Integrasi Sistem Informasi Desa (SID) dari PT FAS membuat transparansi publikasi program kerja dan anggaran desa menjadi sangat mudah diakses warga. Dukungan teknis dari tim ahli PT FAS juga sangat responsif dan mendampingi perangkat desa kami hingga benar-benar mahir menggunakan sistem.",
    rating: 5,
    date: "2026-07-02"
  },
  {
    id: "testi-4",
    name: "Bapak Drs. Hermawan",
    role: "Kepala Desa",
    villageName: "Desa Sumberwaras, Kec. Malingping",
    quote: "Paket Desa Maju yang kami ambil benar-benar memberikan solusi white-label yang menakjubkan. Kini desa kami memiliki reputasi sebagai 'Smart Village' pelopor di wilayah kami berkat portal mandiri kependudukan yang sangat praktis ini. Pelayanannya top!",
    rating: 5,
    date: "2026-07-05"
  }
];

interface TestimonialSliderProps {
  theme: "dark" | "light";
}

export default function TestimonialSlider({ theme }: TestimonialSliderProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Form states for submitting new testimonial
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("Kepala Desa");
  const [formVillage, setFormVillage] = useState("");
  const [formQuote, setFormQuote] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);

  // Autoplay cycle
  useEffect(() => {
    if (!isAutoplay || showForm) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [activeIndex, isAutoplay, showForm, testimonials.length]);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formVillage.trim() || !formQuote.trim()) {
      alert("Harap lengkapi semua kolom formulir.");
      return;
    }

    const newTestimonial: Testimonial = {
      id: `user-testi-${Date.now()}`,
      name: formName.trim(),
      role: formRole,
      villageName: formVillage.trim(),
      quote: formQuote.trim(),
      rating: formRating,
      date: new Date().toISOString().split("T")[0],
      isUserSubmitted: true
    };

    setTestimonials((prev) => [...prev, newTestimonial]);
    setIsSuccess(true);

    // Reset form fields
    setFormName("");
    setFormVillage("");
    setFormQuote("");
    setFormRating(5);

    // After 2 seconds, close form and focus on the newly added testimonial
    setTimeout(() => {
      setIsSuccess(false);
      setShowForm(false);
      setDirection(1);
      setActiveIndex(testimonials.length); // The new index will be testimonials.length
    }, 2000);
  };

  // Variants for sliding transition
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  const currentTesti = testimonials[activeIndex];

  return (
    <section id="testimonials" className="relative w-full max-w-5xl mx-auto px-6 py-24 scroll-mt-12">
      
      {/* Header */}
      <div className="mb-12 text-center pointer-events-auto">
        <span className="font-mono text-xs font-bold text-[#c9a84c] tracking-[0.25em] uppercase block mb-2">
          REPUTASI & TESTIMONI
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Aspirasi Kepala Desa & Perangkat Daerah
        </h2>
        <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
          Dengarkan langsung pengalaman otentik dari para pemimpin desa yang telah mentransformasi layanan publik mereka bersama solusi digital PT FAS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pointer-events-auto">
        
        {/* Testimonial Main Slider Card (Spans 8 columns on desktop) */}
        <div className="md:col-span-8 flex flex-col justify-between min-h-[380px] bg-[rgba(5,11,20,0.65)] border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/15">
          
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Large Back Quote Icon */}
          <Quote className="text-[#c9a84c]/5 absolute right-6 top-6 w-32 h-32 -rotate-12 pointer-events-none" />

          {/* Slider Content Wrapper */}
          <div className="relative flex-grow flex flex-col justify-between">
            <div className="relative min-h-[180px] flex items-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentTesti.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full text-left space-y-4"
                >
                  {/* Stars Rating */}
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: currentTesti.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-sm sm:text-base leading-relaxed text-gray-100 font-medium italic relative pl-4 border-l-2 border-[#c9a84c]/40">
                    "{currentTesti.quote}"
                  </blockquote>

                  {/* Badge User Submitted */}
                  {currentTesti.isUserSubmitted && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 uppercase tracking-widest">
                      <Sparkles size={8} /> Testimoni Baru Warga Desa
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Author Profile Information */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1e6bb8] to-[#c9a84c] flex items-center justify-center font-bold text-white text-sm shadow-lg tracking-wider">
                  {currentTesti.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none mb-1.5 flex items-center gap-1.5">
                    {currentTesti.name}
                    <Award size={13} className="text-[#c9a84c]" />
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
                    <span className="font-semibold text-gray-300">{currentTesti.role}</span>
                    <span className="text-gray-600">•</span>
                    <span className="inline-flex items-center gap-1 text-[#c9a84c] font-medium">
                      <MapPin size={11} /> {currentTesti.villageName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    setIsAutoplay(false);
                    handlePrev();
                  }}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300 hover:text-white transition-all transform active:scale-95"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => {
                    setIsAutoplay(false);
                    handleNext();
                  }}
                  className="p-2.5 bg-[#c9a84c] hover:bg-[#b0913c] rounded-xl text-[#050b14] font-bold transition-all transform active:scale-95"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator & Autoplay Status */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoplay(false);
                    handleDotClick(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-6 bg-[#c9a84c]" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 hover:text-gray-300 transition-colors"
            >
              {isAutoplay ? "● Autoplay Aktif" : "○ Autoplay Jeda"}
            </button>
          </div>
        </div>

        {/* Testimonial Writer Form / CTA Panel (Spans 4 columns on desktop) */}
        <div className="md:col-span-4 h-full flex flex-col justify-between">
          {!showForm ? (
            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-3xl p-6 flex flex-col gap-5 text-left h-full min-h-[380px] justify-center">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] flex justify-center items-center">
                <MessageSquarePlus size={20} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">Bagikan Pengalaman Anda</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Apakah Anda Kepala Desa, Sekretaris Desa, atau staf IT desa yang telah merasakan kemudahan layanan dari solusi kami? Berikan aspirasi Anda di sini secara instan.
                </p>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="mt-2 px-4 py-3 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/20 hover:border-[#c9a84c]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> Tulis Testimoni Sekarang
              </button>
            </div>
          ) : (
            <div className="bg-[#0b1322] border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[380px] shadow-xl">
              {isSuccess ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex justify-center items-center">
                    <Check size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Testimoni Disimpan!</h4>
                    <p className="text-xs text-gray-400 leading-normal">
                      Terima kasih atas aspirasi berharga Anda. Testimoni Anda langsung diaktifkan pada slider utama...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] text-[#c9a84c] font-extrabold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={11} /> Formulir Aspirasi
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      Batal
                    </button>
                  </div>

                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="cth. H. Syarifudin, M.Si"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Peran Jabatan</label>
                      <select
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none"
                      >
                        <option value="Kepala Desa" className="bg-[#0b1322]">Kepala Desa</option>
                        <option value="Sekretaris Desa" className="bg-[#0b1322]">Sekretaris Desa</option>
                        <option value="Bendahara Desa" className="bg-[#0b1322]">Bendahara Desa</option>
                        <option value="Staf IT Desa" className="bg-[#0b1322]">Staf IT Desa</option>
                        <option value="Tokoh Masyarakat" className="bg-[#0b1322]">Tokoh Masyarakat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Nama Desa Anda</label>
                      <input
                        type="text"
                        value={formVillage}
                        onChange={(e) => setFormVillage(e.target.value)}
                        placeholder="cth. Desa Rahong"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c] font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Rating Penilaian</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="text-gray-500 hover:text-yellow-400 transition-colors p-0.5"
                        >
                          <Star
                            size={16}
                            className={`${
                              star <= formRating ? "text-yellow-400 fill-current" : "text-gray-500"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Aspirasi / Pengalaman</label>
                    <textarea
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      placeholder="Bagikan ulasan jujur mengenai solusi digital PT FAS di desa Anda..."
                      rows={3}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c9a84c] leading-relaxed transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#c9a84c] hover:bg-[#b0913c] text-[#050b14] font-extrabold uppercase tracking-widest rounded-xl text-[10px] transition-all transform active:scale-95"
                  >
                    Kirim & Tampilkan Testimoni
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

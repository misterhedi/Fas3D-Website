import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Globe,
  Sliders,
  Image,
  Upload,
  Check,
  X,
  Sparkles
} from "lucide-react";

interface EditorDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function EditorDashboard({ token, onLogout }: EditorDashboardProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [pages, setPages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "pages" | "media">("articles");

  // Article state
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [isEditingArticle, setIsEditingArticle] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState("");
  const [artContent, setArtContent] = useState("");
  const [artCategory, setArtCategory] = useState("Kabar Desa");
  const [artTags, setArtTags] = useState("");
  const [artStatus, setArtStatus] = useState("draft");
  const [artSeoTitle, setArtSeoTitle] = useState("");
  const [artSeoDesc, setArtSeoDesc] = useState("");
  const [artSeoKeywords, setArtSeoKeywords] = useState("");

  const handleAutoFillSEO = () => {
    if (!artTitle) {
      alert("Silakan isi judul artikel terlebih dahulu!");
      return;
    }
    setArtSeoTitle(`${artTitle} | PT FAS Digitalisasi`);
    setArtSeoDesc(artContent 
      ? artContent.substring(0, 150) + "..." 
      : `Baca berita selengkapnya mengenai ${artTitle} di portal resmi transformasi digital PT FAS.`);
    setArtSeoKeywords(`${artCategory.toLowerCase()}, ${artTags || "portal desa, teknologi"}`);
    alert("Metadata SEO berhasil dioptimasi secara otomatis!");
  };

  // Static pages state
  const [pageTentang, setPageTentang] = useState("");
  const [pageFaq, setPageFaq] = useState("");
  const [pageKontak, setPageKontak] = useState("");

  // Media state
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchPages();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (data.success) setArticles(data.articles);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      if (data.success && data.pages) {
        setPages(data.pages);
        setPageTentang(data.pages.tentang_kami || "");
        setPageFaq(data.pages.faq || "");
        setPageKontak(data.pages.kontak_info || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = isEditingArticle ? `/api/articles/${isEditingArticle}` : "/api/articles";
      const method = isEditingArticle ? "PUT" : "POST";
      const body = {
        title: artTitle,
        content: artContent,
        category: artCategory,
        tags: artTags.split(",").map((t) => t.trim()).filter(Boolean),
        status: artStatus,
        seoTitle: artSeoTitle || artTitle,
        seoDesc: artSeoDesc,
        seoKeywords: artSeoKeywords
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
        alert("Artikel berhasil disimpan.");
        setShowArticleModal(false);
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("Artikel dihapus.");
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePages = async () => {
    setIsLoading(true);
    try {
      const updated = {
        ...pages,
        tentang_kami: pageTentang,
        faq: pageFaq,
        kontak_info: pageKontak
      };
      const res = await fetch("/api/pages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        alert("Konten halaman statis berhasil disimpan!");
        fetchPages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaUploadSim = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const mockUrl = `/uploads/media/${Date.now()}_${file.name}`;
      setMediaList((prev) => [mockUrl, ...prev]);
      setIsUploading(false);
      alert("Simulasi upload sukses! Tautan media dibuat.");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest block mb-1">
            Editor Level
          </span>
          <h2 className="text-xl font-bold tracking-tight">Ruang Kerja Redaksi & Konten (Editor)</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchArticles();
              fetchPages();
            }}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300 animate-none"
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-1">
        <button
          onClick={() => setActiveTab("articles")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "articles" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Artikel & Berita SID
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "pages" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Halaman Statis
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all ${
            activeTab === "media" ? "border-[#c9a84c] text-white" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Galeri Media
        </button>
      </div>

      {/* ================= ARTICLES TAB ================= */}
      {activeTab === "articles" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-mono">Total rilis: {articles.length} artikel</span>
            <button
              onClick={() => {
                setIsEditingArticle(null);
                setArtTitle("");
                setArtContent("");
                setArtCategory("Kabar Desa");
                setArtTags("");
                setArtStatus("draft");
                setArtSeoTitle("");
                setArtSeoDesc("");
                setArtSeoKeywords("");
                setShowArticleModal(true);
              }}
              className="px-3.5 py-2 bg-[#c9a84c] hover:bg-[#b0913c] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-1"
            >
              <Plus size={12} /> Tulis Artikel Baru
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 font-bold border-b border-white/5">
                  <th className="p-4">Judul Artikel</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Penulis</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white leading-normal max-w-xs truncate">{a.title}</td>
                    <td className="p-4 text-gray-300 font-medium">{a.category}</td>
                    <td className="p-4 text-gray-400">{a.author}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        a.status === "published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex gap-1.5 justify-end">
                      <button
                        onClick={() => {
                          setIsEditingArticle(a.id);
                          setArtTitle(a.title);
                          setArtContent(a.content);
                          setArtCategory(a.category);
                          setArtTags(a.tags.join(", "));
                          setArtStatus(a.status);
                          setArtSeoTitle(a.seoTitle);
                          setArtSeoDesc(a.seoDesc);
                          setArtSeoKeywords(a.seoKeywords);
                          setShowArticleModal(true);
                        }}
                        className="p-1.5 bg-white/5 text-gray-300 hover:text-white rounded-lg border border-white/5"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(a.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/10"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= STATIC PAGES TAB ================= */}
      {activeTab === "pages" && (
        <div className="space-y-4 max-w-3xl">
          <p className="text-xs text-gray-400 leading-normal">
            Sunting teks deskripsi statis yang tampil di profil landing page utama agar calon pembeli mendapatkan info legalitas & operasional terbaru.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">Tentang Kami (Legalitas & Profil)</label>
              <textarea
                value={pageTentang}
                onChange={(e) => setPageTentang(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c9a84c] leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">FAQ (Pertanyaan Populer)</label>
              <textarea
                value={pageFaq}
                onChange={(e) => setPageFaq(e.target.value)}
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c9a84c] leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">Informasi Kontak & Alamat Kantor</label>
              <textarea
                value={pageKontak}
                onChange={(e) => setPageKontak(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c9a84c] leading-relaxed"
              />
            </div>

            <button
              onClick={handleSavePages}
              disabled={isLoading}
              className="px-5 py-3 bg-[#c9a84c] hover:bg-[#b0913c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              {isLoading ? "Menyimpan..." : "Simpan Konten Halaman"}
            </button>
          </div>
        </div>
      )}

      {/* ================= MEDIA GALLERY TAB ================= */}
      {activeTab === "media" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            Unggah lampiran foto penunjang berita desa atau bukti kegiatan implementasi produk PT FAS.
          </p>

          <div className="border border-dashed border-white/20 hover:border-[#c9a84c]/50 rounded-2xl p-8 flex flex-col justify-center items-center gap-2 bg-white/[0.02] transition-colors relative">
            <Upload size={24} className="text-[#c9a84c] mb-1 animate-bounce" />
            <span className="text-xs font-semibold text-white">Seret & Jatuhkan Berkas Gambar</span>
            <span className="text-[10px] text-gray-400">Atau cari dari perangkat Anda (Simulasi instan)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaUploadSim}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {isUploading && (
            <div className="text-xs text-gray-300 animate-pulse text-center">Menyimpan dan mengoptimasi resolusi gambar...</div>
          )}

          {mediaList.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Berkas Diunggah Baru-baru Ini</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {mediaList.map((m, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
                    <div className="h-24 w-full bg-black/40 rounded-lg flex items-center justify-center text-[#c9a84c]">
                      <Image size={24} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-gray-400 font-mono truncate">{m}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m);
                          alert("Tautan media berhasil disalin!");
                        }}
                        className="text-[9px] font-bold text-[#c9a84c] uppercase hover:underline text-left"
                      >
                        Salin Tautan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 z-[1200] w-full h-full bg-black/90 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-[#0b1322] border border-white/10 w-full max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isEditingArticle ? "Edit Berita Artikel" : "Tulis Berita Artikel Baru"}
              </h3>
              <button onClick={() => setShowArticleModal(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Judul Artikel / Berita</label>
                <input
                  type="text"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  placeholder="Masukkan judul menarik"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Kategori</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="Kabar Desa" className="bg-[#0b1322]">Kabar Desa</option>
                    <option value="Event FAS" className="bg-[#0b1322]">Event FAS</option>
                    <option value="Inovasi Desa" className="bg-[#0b1322]">Inovasi Desa</option>
                    <option value="Digitalisasi" className="bg-[#0b1322]">Digitalisasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Status Publikasi</label>
                  <select
                    value={artStatus}
                    onChange={(e) => setArtStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="draft" className="bg-[#0b1322]">Draft (Sembunyikan)</option>
                    <option value="published" className="bg-[#0b1322]">Published (Rilis Publik)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Isi Artikel / Berita (Sederhana)</label>
                <textarea
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  rows={8}
                  placeholder="Ketik rincian berita selengkapnya..."
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray-400 uppercase font-bold mb-1">Tag (Dipisahkan koma)</label>
                <input
                  type="text"
                  value={artTags}
                  onChange={(e) => setArtTags(e.target.value)}
                  placeholder="cth. digital, lebak, inovasi"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                />
              </div>

              {/* SEO PANEL */}
              <div className="border border-white/5 rounded-2xl p-4 bg-black/15 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] text-gray-300 font-bold block uppercase">Optimasi Mesin Pencari (SEO Metadata)</span>
                  <button
                    type="button"
                    onClick={handleAutoFillSEO}
                    className="px-2 py-1 bg-[#c9a84c]/20 hover:bg-[#c9a84c]/35 text-[#c9a84c] rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                  >
                    <Sparkles size={10} /> Auto-Generate SEO
                  </button>
                </div>
                
                <div>
                  <label className="block text-[8px] text-gray-400 uppercase mb-1">SEO Title Tag</label>
                  <input
                    type="text"
                    value={artSeoTitle}
                    onChange={(e) => setArtSeoTitle(e.target.value)}
                    placeholder="Judul SEO unik Google search"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[8px] text-gray-400 uppercase mb-1">SEO Meta Description</label>
                  <input
                    type="text"
                    value={artSeoDesc}
                    onChange={(e) => setArtSeoDesc(e.target.value)}
                    placeholder="Ringkasan singkat artikel pencarian Google"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white text-[11px] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[8px] text-gray-400 uppercase mb-1">SEO Meta Keywords</label>
                  <input
                    type="text"
                    value={artSeoKeywords}
                    onChange={(e) => setArtSeoKeywords(e.target.value)}
                    placeholder="kata kunci pencarian dipisahkan koma"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-grow py-3 bg-[#c9a84c] hover:bg-[#b0913c] text-white font-bold uppercase tracking-wider text-[10px] rounded-xl flex justify-center items-center gap-1"
                >
                  <Check size={14} /> Simpan Artikel
                </button>
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
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

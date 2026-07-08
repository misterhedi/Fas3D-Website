# PT FAS Technology Solutions - 3D Interactive Company Profile

Website profil perusahaan (company profile) interaktif 3D modern untuk **PT FAS Technology Solutions** yang dibangun menggunakan Node.js (Express.js) di sisi backend, EJS sebagai templating engine, dan Three.js sebagai mesin rendering grafis 3D interaktif di sisi frontend.

## 🌟 Fitur Utama

- **Latar Belakang 3D Interaktif (Three.js)**: Objek utama berupa logo abstrak "FAS" yang berputar perlahan dengan efek cahaya, lengkap dengan OrbitControls untuk interaksi drag, zoom, dan rotasi.
- **Sistem Partikel Bintang**: 400+ titik cahaya mengambang dinamis yang menambah nuansa teknologi modern pada latar belakang.
- **Glow & Emissive Effects**: Logo 3D dirancang menggunakan material dengan pendaran cahaya (*emissive glow*) berwarna Biru (#1E6BB8), Emas (#C9A84C), dan Sian (#06B6D4) untuk visual premium.
- **Transisi Parallaks Kamera (GSAP)**: Pergerakan halus posisi kamera 3D secara otomatis saat pengguna melakukan scroll menuju section konten yang berbeda.
- **UI Premium Glassmorphism**: Overlay antarmuka bergaya kaca transparan, lengkap dengan bento-grid untuk visi misi, detail produk, dan legalitas.
- **Detail Produk Interaktif (Modals)**: Klik detail untuk 4 produk unggulan (SID, Absensi Perangkat, Sistem Surat, PBB Desa) untuk memunculkan informasi lengkap dengan micro-interaction yang rapi.
- **Synthesizer Ambient Sound (Web Audio API)**: Musik latar drone ambient futuristik yang disintesis langsung di peramban tanpa membebani bandwidth (bebas file MP3 besar).
- **Toggle Tema Gelap/Terang**: Transisi warna antarmuka dan penyesuaian pencahayaan/kabut pada scene 3D secara real-time.
- **Integrasi Hubungi Kami**: Form pesan instan yang dikonversi otomatis menjadi tautan obrolan WhatsApp terformat menuju admin perusahaan.

## 🛠️ Tech Stack yang Digunakan

| Komponen | Teknologi |
| :--- | :--- |
| **Backend** | Node.js dengan Express.js (ES Modules) |
| **Template Engine** | EJS (Embedded JavaScript) |
| **3D Engine** | Three.js (dengan OrbitControls) |
| **Camera Motion** | GSAP (GreenSock Animation Platform) |
| **Styling & UI** | CSS3 Modern dengan Animasi Transisi Kustom |
| **Icon Library** | Lucide Icons (CDN) |

## 📁 Struktur Folder

```text
fas-tech-3d/
├── package.json         # Konfigurasi dependensi dan skrip
├── server.js            # Entry-point backend Express.js
├── public/
│   ├── css/
│   │   └── style.css    # Desain antarmuka premium & Glassmorphism
│   └── js/
│       └── main.js      # Three.js 3D Engine, audio, & animasi GSAP
├── views/
│   └── index.ejs        # Template EJS untuk layout antarmuka
└── README.md            # Dokumentasi proyek
```

## 🚀 Cara Menjalankan Proyek secara Lokal

### Prerequisites
Pastikan Anda sudah menginstal **Node.js** (versi 16 atau lebih baru) di komputer Anda.

### 1. Instal Dependensi
Jalankan perintah berikut di direktori root untuk menginstal Express, EJS, dan Three.js:
```bash
npm install
```

### 2. Jalankan Mode Development
Jalankan server lokal dengan perintah:
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000`. Buka peramban (browser) Anda untuk melihat aplikasi 3D interaktif yang menakjubkan!

---
Dibuat dengan penuh dedikasi untuk **PT FAS Technology Solutions** guna mewujudkan digitalisasi desa modern di seluruh Indonesia.

import { ServicePackage, BankAccount } from "./types";

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: "basic",
    title: "Paket Desa Rintisan (Basic)",
    subtitle: "Ideal untuk langkah awal digitalisasi desa rintisan",
    price: 2500000,
    badge: "Pemula",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    description: "Sistem administrasi kependudukan dasar dan portal publikasi berita desa mandiri.",
    features: [
      "Sistem Informasi Desa (SID) Standard",
      "Database Kependudukan Terintegrasi",
      "Portal Berita & Informasi Desa Online",
      "Template Cetak 5+ Surat Keterangan",
      "Dukungan Teknis via Forum/Email",
    ]
  },
  {
    id: "standard",
    title: "Paket Desa Berkembang (Standard)",
    subtitle: "Paling populer untuk desa berkembang & mandiri",
    price: 5000000,
    badge: "Terpopuler",
    badgeColor: "bg-[#1e6bb8]/20 text-[#1e6bb8] border border-[#1e6bb8]/30",
    description: "Digitalisasi kehadiran nirkertas dengan lokasi GPS dan sistem surat digital cepat kilat.",
    recommended: true,
    features: [
      "Semua Fitur Paket Basic",
      "Absensi Online Perangkat (GPS & Deteksi Wajah)",
      "Sistem Surat Menyurat Desa (30+ Template)",
      "Domain Resmi desa.id & Hosting Cloud",
      "Pelatihan Admin & Perangkat Desa (Virtual)",
      "Dukungan Teknis Prioritas WA Group",
    ]
  },
  {
    id: "professional",
    title: "Paket Desa Maju (Professional)",
    subtitle: "Sistem super lengkap dengan otomatisasi notifikasi",
    price: 10000000,
    badge: "Premium",
    badgeColor: "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30",
    description: "Sistem optimalisasi Pendapatan Asli Daerah (PAD) & penagihan PBB dengan notifikasi WhatsApp pintar.",
    features: [
      "Semua Fitur Paket Standard",
      "Sistem Manajemen Pajak Bumi & Bangunan (PBB-P2)",
      "Gateway Notifikasi WhatsApp Otomatis",
      "Integrasi Tanda Tangan Elektronik (TTE/BSrE)",
      "Portal Layanan Mandiri Warga via Mobile",
      "Dukungan Teknis 24/7 (SLA 98%)",
    ]
  },
  {
    id: "enterprise",
    title: "Paket Desa Mandiri (Enterprise)",
    subtitle: "Ekosistem Smart City Desa sepenuhnya kustom",
    price: 18500000,
    badge: "Lengkap",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    description: "Kustomisasi penuh aplikasi mobile android warga, integrasi anjungan digital mandiri kantor desa.",
    features: [
      "Semua Fitur Paket Professional",
      "Aplikasi Android Desa (White-Label Nama Desa)",
      "Integrasi Hardware Kiosk / Anjungan Mandiri",
      "Kustomisasi Modul & Alur Birokrasi Tanpa Batas",
      "Dedicated Server & SLA Keandalan 99.9%",
      "Kunjungan Pemeliharaan Rutin Lapangan (On-Site)",
    ]
  }
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "1234567890",
    accountHolder: "PT FAS TECHNOLOGY SOLUTIONS"
  },
  {
    bankName: "Bank Mandiri",
    accountNumber: "0987654321",
    accountHolder: "PT FAS TECHNOLOGY SOLUTIONS"
  },
  {
    bankName: "Bank Negara Indonesia (BNI)",
    accountNumber: "1122334455",
    accountHolder: "PT FAS TECHNOLOGY SOLUTIONS"
  },
  {
    bankName: "Bank Rakyat Indonesia (BRI)",
    accountNumber: "5566778899",
    accountHolder: "PT FAS TECHNOLOGY SOLUTIONS"
  }
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

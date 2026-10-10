/** @format */

// Menu sidebar CMS. `judul` tampil di topbar, `cari` jadi placeholder kolom pencarian.
// Angka `badge` masih dummy — nanti dari API (jumlah data tiap modul / pesan baru).
export const adminNavItems = [
  {
    label: "Overview",
    to: "/admin",
    end: true,
    ikon: "dashboard",
    ikonKanan: "chevron_right",
    judul: "Overview Dashboard",
    cari: "Cari artikel, agenda, atau dokumen...",
  },
  {
    label: "Berita & Pengumuman",
    to: "/admin/berita",
    ikon: "newspaper",
    badge: "48",
    judul: "Manajemen Berita & Pengumuman",
    cari: "Cari judul berita, kata kunci, atau penulis...",
  },
  {
    label: "Agenda",
    to: "/admin/agenda",
    ikon: "calendar_month",
    badge: "14",
    judul: "Manajemen Agenda",
    cari: "Cari agenda atau lokasi...",
  },
  {
    label: "Galeri",
    to: "/admin/galeri",
    ikon: "photo_library",
    badge: "64",
    judul: "Manajemen Galeri",
    cari: "Cari foto atau album...",
  },
  {
    label: "Dokumen",
    to: "/admin/dokumen",
    ikon: "folder",
    badge: "28",
    judul: "Manajemen Dokumen",
    cari: "Cari nama dokumen...",
  },
  {
    label: "Profil & Staf",
    to: "/admin/profil-staf",
    ikon: "group",
    badge: "78",
    judul: "Profil Sekolah & Staf",
    cari: "Cari nama staf atau jabatan...",
  },
  {
    label: "Pesan Masuk & Kontak",
    to: "/admin/pesan",
    ikon: "mail",
    badge: "3",
    badgeTone: "merah",
    judul: "Pesan Masuk & Kontak",
    cari: "Cari pengirim atau subjek...",
  },
  {
    label: "Pengaturan",
    to: "/admin/pengaturan",
    ikon: "settings",
    judul: "Pengaturan Sistem & Akun",
    cari: "Cari pengaturan...",
  },
];

// Cari item menu untuk path saat ini (untuk judul & placeholder pencarian di topbar).
export function cariItemNav(pathname) {
  return (
    adminNavItems.find((i) =>
      i.end
        ? pathname === i.to
        : pathname === i.to || pathname.startsWith(`${i.to}/`),
    ) ?? adminNavItems[0]
  );
}

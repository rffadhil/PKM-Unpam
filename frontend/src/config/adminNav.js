/** @format */

// Menu sidebar CMS. `judul` tampil di topbar, `cari` jadi placeholder kolom pencarian.
export const adminNavItems = [
  {
    label: "Overview",
    to: "/admin",
    end: true,
    ikon: "dashboard",
    ikonKanan: "chevron_right",
    judul: "Dashboard Overview & Statistik",
    cari: "Cari data artikel, agenda, pesan...",
  },
  {
    label: "Berita & Pengumuman",
    to: "/admin/berita",
    ikon: "newspaper",
    badge: "",
    judul: "Manajemen Berita & Pengumuman",
    cari: "Cari judul berita, kata kunci, atau penulis...",
  },
  {
    label: "Agenda",
    to: "/admin/agenda",
    ikon: "calendar_month",
    badge: "",
    judul: "Manajemen Agenda",
    cari: "Cari agenda atau lokasi...",
  },
  {
    label: "Galeri",
    to: "/admin/galeri",
    ikon: "photo_library",
    badge: "",
    judul: "Manajemen Galeri",
    cari: "Cari foto atau album...",
  },
  {
    label: "Dokumen",
    to: "/admin/dokumen",
    ikon: "folder",
    badge: "",
    judul: "Manajemen Dokumen",
    cari: "Cari nama dokumen...",
  },
  {
    label: "Profil & Staf",
    to: "/admin/profil-staf",
    ikon: "group",
    badge: "",
    judul: "Manajemen Profil Sekolah",
    cari: "Cari informasi profil...",
    children: [
      {
        label: "Profil Sekolah",
        to: "/admin/profil-staf/profil",
        ikon: "account_balance",
        judul: "Manajemen Profil & Sejarah Sekolah",
        cari: "Cari konten profil atau sejarah...",
      },
      {
        label: "Visi, Misi & Budaya",
        to: "/admin/profil-staf/visi-misi",
        ikon: "flag",
        judul: "Manajemen Visi, Misi & Budaya Sekolah",
        cari: "Cari butir visi atau misi...",
      },
      {
        label: "Guru & Tendik",
        to: "/admin/profil-staf/guru",
        ikon: "badge",
        judul: "Direktori Guru & Tenaga Kependidikan",
        cari: "Cari nama staf, NIP, atau jabatan...",
      },
    ],
  },
  {
    label: "Pesan Masuk & Kontak",
    to: "/admin/pesan",
    ikon: "mail",
    badge: "",
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

// Cari item menu (termasuk sub-menu) untuk path saat ini.
export function cariItemNav(pathname) {
  for (const item of adminNavItems) {
    if (item.children) {
      const subCocok = item.children.find(
        (sub) => pathname === sub.to || pathname.startsWith(`${sub.to}/`),
      );
      if (subCocok) return subCocok;
    }
    const cocok = item.end
      ? pathname === item.to
      : pathname === item.to || pathname.startsWith(`${item.to}/`);
    if (cocok) return item;
  }
  return adminNavItems[0];
}

// Halaman form (tambah/edit) tidak memakai kolom pencarian di topbar.
export function tampilkanPencarian(pathname) {
  return !/\/(baru|edit)$/.test(pathname);
}

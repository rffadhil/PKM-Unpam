import { site } from './site'

// Menu utama. `hash` dipakai untuk item yang menunjuk bagian di halaman yang sama.
export const navItems = [
  { label: 'Beranda', to: '/', end: true },
  { label: 'Profil', to: '/profil', icon: 'expand_more' },
  { label: 'Berita', to: '/berita' },
  { label: 'Agenda', to: '/agenda-galeri', hash: '#agenda-section' },
  { label: 'Galeri', to: '/agenda-galeri', hash: '#galeri-section' },
  { label: 'Kontak', to: '/kontak' },
]

export const footerPenting = [
  { label: 'Profil Sekolah', to: '/profil' },
  { label: 'Visi & Misi', to: '/profil#visi-misi' },
  { label: 'Kurikulum Merdeka', to: '/profil#tentang-sejarah' },
  { label: 'Kalender Akademik', to: '/agenda-galeri#agenda-section' },
  { label: 'PPDB 2026/2027', to: '/ppdb', highlight: true },
]

// `to` = rute internal, `href` = tautan biasa/eksternal. '#' = halaman belum ada.
export const footerLayanan = [
  { label: 'Portal E-Learning SIS', icon: 'open_in_new', href: site.sisUrl },
  { label: 'Kebijakan Privasi', icon: 'shield', href: '#' },
  { label: 'Kontak & Pengaduan', icon: 'support_agent', to: '/kontak#pengaduan-wbs' },
  { label: 'Brosur & Formulir SPTJM', icon: 'download', to: '/kontak#unduh-dokumen' },
  { label: 'E-Library Harapan Jaya', icon: 'local_library', href: '#' },
]

export const footerBawah = [
  { label: 'Portal Siswa', href: site.sisUrl },
  { label: 'PPDB Online', to: '/ppdb' },
  { label: 'Sitemap', href: '#' },
]

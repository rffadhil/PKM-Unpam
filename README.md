<!-- @format -->

# Portal Publikasi SMA Harapan Jaya

Selamat datang di repositori proyek Portal Publikasi SMA Harapan Jaya!
Panduan ini dibuat khusus agar semua anggota tim (baik Front-end maupun Back-end) bisa bekerja sama dengan mudah, meskipun ini adalah pengalaman pertama kalian membangun _website_ secara tim.

Proyek ini menggunakan arsitektur terpisah (Frontend dan Backend) dalam satu _folder_ besar (_monorepo_).

## Teknologi yang Kita Gunakan

- **Frontend (Tampilan):** React.js (Vite), Tailwind CSS **v3.4** (Ingat, kita pakai versi 3, bukan v4), React Router Dom.
- **Backend (Server/API):** Node.js, Express.js.
- **Database:** PostgreSQL (Supabase).
- **Storage (Penyimpanan Foto/File):** Cloudinary / Supabase Storage.

---

## Tahap 1: Persiapan Wajib (Install Aplikasi)

Sebelum menyentuh kode, pastikan 3 aplikasi ini sudah terinstal di laptop kalian:

1.  **Visual Studio Code (VS Code):** Ini adalah aplikasi editor kode kita. [Download di sini](https://code.visualstudio.com/).
    - _Sangat disarankan menginstal Ekstensi VS Code:_ **Prettier - Code formatter** dan **Tailwind CSS IntelliSense**.
2.  **Node.js (Versi LTS):** Ini mesin agar laptop kalian bisa menjalankan React dan Express. [Download di sini](https://nodejs.org/). (Pilih yang versi LTS).
3.  **Git:** Ini sistem penyimpan dan kolaborasi kode kita. [Download di sini](https://git-scm.com/downloads).

---

## Tahap 2: Mengambil Kode ke Laptop Masing-Masing

Buka terminal (bisa pakai Command Prompt, PowerShell, atau terminal bawaan VS Code), lalu jalankan perintah ini secara berurutan:

```bash
# 1. Download proyek dari GitHub ke laptopmu
git clone [https://github.com/rffadhil/PKM-Unpam.git](https://github.com/rffadhil/PKM-Unpam.git)

# 2. Masuk ke dalam folder proyek
cd PKM-Unpam
```

```
portal-sma-harapan-jaya
├─ backend
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  ├─ app.js
│  │  ├─ config
│  │  │  └─ db.js
│  │  ├─ controllers
│  │  │  ├─ agenda.controller.js
│  │  │  ├─ auth.controller.js
│  │  │  ├─ berita.controller.js
│  │  │  ├─ pengaturan.controller.js
│  │  │  ├─ pesan.controller.js
│  │  │  └─ staf.controller.js
│  │  ├─ db
│  │  │  ├─ migrate.js
│  │  │  ├─ migrations
│  │  │  │  └─ 001_init_schema.sql
│  │  │  └─ seed.js
│  │  ├─ middlewares
│  │  │  └─ auth.middleware.js
│  │  ├─ routes
│  │  │  ├─ agenda.routes.js
│  │  │  ├─ auth.routes.js
│  │  │  ├─ berita.routes.js
│  │  │  ├─ pengaturan.routes.js
│  │  │  ├─ pesan.routes.js
│  │  │  ├─ staf.routes.js
│  │  │  └─ upload.routes.js
│  │  ├─ server.js
│  │  ├─ services
│  │  │  ├─ agenda.service.js
│  │  │  ├─ auth.service.js
│  │  │  ├─ berita.service.js
│  │  │  ├─ pengaturan.service.js
│  │  │  ├─ pesan.service.js
│  │  │  └─ staf.service.js
│  │  ├─ utils
│  │  └─ validators
│  │     ├─ agenda.validator.js
│  │     ├─ auth.validator.js
│  │     ├─ berita.validator.js
│  │     ├─ pengaturan.validator.js
│  │     ├─ pesan.validator.js
│  │     └─ staf.validator.js
│  └─ uploads
│     └─ 1793260858485-114827023.webp
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ images
│  │  │  ├─ logo-noBG.png
│  │  │  ├─ logo.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AdminFooter.jsx
│  │  │  │  ├─ AdminSidebar.jsx
│  │  │  │  ├─ AdminTopbar.jsx
│  │  │  │  ├─ ConfirmDialog.jsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AgendaTerdekat.jsx
│  │  │  │  │  ├─ AktivitasTerkini.jsx
│  │  │  │  │  └─ SambutanAdmin.jsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ EditorTeks.jsx
│  │  │  │  │  ├─ EditorTeks.test.jsx
│  │  │  │  │  ├─ Field.jsx
│  │  │  │  │  ├─ gaya.js
│  │  │  │  │  ├─ PratinjauArtikel.jsx
│  │  │  │  │  └─ UnggahCover.jsx
│  │  │  │  ├─ Pagination.jsx
│  │  │  │  └─ TrendChart.jsx
│  │  │  ├─ agenda
│  │  │  │  ├─ AgendaAksi.jsx
│  │  │  │  ├─ AgendaAnnouncement.jsx
│  │  │  │  ├─ AgendaCalendar.jsx
│  │  │  │  ├─ AgendaCard.jsx
│  │  │  │  ├─ AgendaFilters.jsx
│  │  │  │  ├─ AgendaFooter.jsx
│  │  │  │  ├─ AgendaFormModal.jsx
│  │  │  │  ├─ AgendaHeader.jsx
│  │  │  │  ├─ AgendaHero.jsx
│  │  │  │  ├─ AgendaList.jsx
│  │  │  │  ├─ AgendaRow.jsx
│  │  │  │  ├─ AgendaTable.jsx
│  │  │  │  └─ AgendaTanggal.jsx
│  │  │  ├─ auth
│  │  │  │  ├─ LoginBrand.jsx
│  │  │  │  ├─ LoginField.jsx
│  │  │  │  ├─ LoginFooter.jsx
│  │  │  │  ├─ LoginForm.jsx
│  │  │  │  ├─ LoginInfoBox.jsx
│  │  │  │  └─ LoginTopBar.jsx
│  │  │  ├─ berita
│  │  │  │  ├─ BadgeStatus.jsx
│  │  │  │  ├─ BeritaCard.jsx
│  │  │  │  ├─ BeritaFilter.jsx
│  │  │  │  ├─ BeritaFooter.jsx
│  │  │  │  ├─ BeritaHeader.jsx
│  │  │  │  ├─ BeritaHero.jsx
│  │  │  │  ├─ BeritaNotice.jsx
│  │  │  │  ├─ BeritaRow.jsx
│  │  │  │  ├─ BeritaTable.jsx
│  │  │  │  ├─ BeritaUtama.jsx
│  │  │  │  ├─ ChipKategori.jsx
│  │  │  │  ├─ KumpulanBerita.jsx
│  │  │  │  ├─ LayananMedia.jsx
│  │  │  │  └─ PengumumanResmi.jsx
│  │  │  ├─ dokumen
│  │  │  │  ├─ DokumenDetailModal.jsx
│  │  │  │  ├─ DokumenFilter.jsx
│  │  │  │  ├─ DokumenFormModal.jsx
│  │  │  │  ├─ DokumenRow.jsx
│  │  │  │  ├─ DokumenTable.jsx
│  │  │  │  ├─ IkonBerkas.jsx
│  │  │  │  ├─ StatusDokumenBadge.jsx
│  │  │  │  ├─ UnggahDokumenCard.jsx
│  │  │  │  └─ ZonaUnggah.jsx
│  │  │  ├─ galeri
│  │  │  │  ├─ AlbumAksi.jsx
│  │  │  │  ├─ AlbumBadge.jsx
│  │  │  │  ├─ AlbumBaris.jsx
│  │  │  │  ├─ AlbumCard.jsx
│  │  │  │  ├─ AlbumCover.jsx
│  │  │  │  ├─ AlbumField.jsx
│  │  │  │  ├─ AlbumFormModal.jsx
│  │  │  │  ├─ AlbumFotoModal.jsx
│  │  │  │  ├─ AlbumList.jsx
│  │  │  │  ├─ AlbumMeta.jsx
│  │  │  │  ├─ GaleriHeader.jsx
│  │  │  │  ├─ GaleriPagination.jsx
│  │  │  │  ├─ GaleriStats.jsx
│  │  │  │  ├─ GaleriToolbar.jsx
│  │  │  │  ├─ KurasiKiriman.jsx
│  │  │  │  └─ ModalGaleri.jsx
│  │  │  ├─ home
│  │  │  │  ├─ AgendaMendatang.jsx
│  │  │  │  ├─ BeritaPengumuman.jsx
│  │  │  │  ├─ CtaPpdb.jsx
│  │  │  │  ├─ GaleriPreview.jsx
│  │  │  │  ├─ Hero.jsx
│  │  │  │  ├─ QuickAccess.jsx
│  │  │  │  ├─ Sambutan.jsx
│  │  │  │  └─ Statistik.jsx
│  │  │  ├─ layout
│  │  │  │  ├─ AdminLayout.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Navbar.jsx
│  │  │  │  ├─ PublicLayout.jsx
│  │  │  │  └─ TopBar.jsx
│  │  │  ├─ pengaturan
│  │  │  │  ├─ AdminAksesPanel.jsx
│  │  │  │  ├─ AdminFormModal.jsx
│  │  │  │  ├─ AdminRow.jsx
│  │  │  │  ├─ AsetVisualPanel.jsx
│  │  │  │  ├─ BagianPengaturan.jsx
│  │  │  │  ├─ BarisSaklar.jsx
│  │  │  │  ├─ BarSimpan.jsx
│  │  │  │  ├─ FieldPengaturan.jsx
│  │  │  │  ├─ IdentitasSekolahForm.jsx
│  │  │  │  ├─ KartuAset.jsx
│  │  │  │  ├─ KontakFooterForm.jsx
│  │  │  │  ├─ PerananBadge.jsx
│  │  │  │  ├─ PortalStatusPanel.jsx
│  │  │  │  ├─ PratinjauPeran.jsx
│  │  │  │  ├─ SesiAdminPanel.jsx
│  │  │  │  └─ StatusAdminBadge.jsx
│  │  │  ├─ pesan
│  │  │  │  ├─ FieldKontak.jsx
│  │  │  │  ├─ KategoriChip.jsx
│  │  │  │  ├─ KolomKontak.jsx
│  │  │  │  ├─ KontakPublikForm.jsx
│  │  │  │  ├─ PengirimCell.jsx
│  │  │  │  ├─ PesanToolbar.jsx
│  │  │  │  ├─ TiketRow.jsx
│  │  │  │  ├─ TiketTable.jsx
│  │  │  │  └─ TinjauTiketModal.jsx
│  │  │  ├─ staf
│  │  │  │  ├─ BlokTeksProfil.jsx
│  │  │  │  ├─ JabatanBadge.jsx
│  │  │  │  ├─ ProfilSambutan.jsx
│  │  │  │  ├─ StafDetailModal.jsx
│  │  │  │  ├─ StafFilter.jsx
│  │  │  │  ├─ StafFormModal.jsx
│  │  │  │  ├─ StafFoto.jsx
│  │  │  │  ├─ StafRow.jsx
│  │  │  │  ├─ StafStats.jsx
│  │  │  │  ├─ StafTable.jsx
│  │  │  │  ├─ StafTabs.jsx
│  │  │  │  ├─ StafToolbar.jsx
│  │  │  │  ├─ StatusPegawaiBadge.jsx
│  │  │  │  └─ SwitchPublik.jsx
│  │  │  └─ ui
│  │  │     ├─ Avatar.jsx
│  │  │     ├─ FormField.jsx
│  │  │     ├─ Icon.jsx
│  │  │     ├─ KolomForm.jsx
│  │  │     ├─ ModalDialog.jsx
│  │  │     ├─ Paginasi.jsx
│  │  │     ├─ PaginasiNav.jsx
│  │  │     ├─ Saklar.jsx
│  │  │     └─ SectionHeading.jsx
│  │  ├─ config
│  │  │  ├─ adminNav.js
│  │  │  ├─ agenda.js
│  │  │  ├─ berita.js
│  │  │  ├─ dashboard.js
│  │  │  ├─ dokumenAdmin.js
│  │  │  ├─ galeri.js
│  │  │  ├─ galeriAdmin.js
│  │  │  ├─ kategoriBerita.js
│  │  │  ├─ login.js
│  │  │  ├─ navigation.js
│  │  │  ├─ overviewAdmin.js
│  │  │  ├─ pengaturanAdmin.js
│  │  │  ├─ pesan.js
│  │  │  ├─ pesanAdmin.js
│  │  │  ├─ site.js
│  │  │  ├─ staf.js
│  │  │  └─ stafAdmin.js
│  │  ├─ context
│  │  ├─ hooks
│  │  │  ├─ useBerita.js
│  │  │  └─ useNotice.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ mocks
│  │  │  ├─ admin.js
│  │  │  ├─ adminAgenda.js
│  │  │  ├─ adminBerita.js
│  │  │  ├─ adminDashboard.js
│  │  │  ├─ adminDokumen.js
│  │  │  ├─ adminGaleri.js
│  │  │  ├─ adminPengaturan.js
│  │  │  ├─ adminPesan.js
│  │  │  ├─ adminStaf.js
│  │  │  ├─ auth.js
│  │  │  ├─ dashboard.js
│  │  │  ├─ dashboardOverview.js
│  │  │  └─ home.js
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ adminPengaturan.js
│  │  │  │  ├─ AdminPlaceholderPage.jsx
│  │  │  │  ├─ BeritaAdminPage.jsx
│  │  │  │  ├─ BeritaAdminPage.test.jsx
│  │  │  │  ├─ BeritaFormPage.jsx
│  │  │  │  ├─ BeritaFormPage.test.jsx
│  │  │  │  ├─ DashboardMandiri.jsx
│  │  │  │  ├─ DashboardPage.jsx
│  │  │  │  ├─ DashboardPage.test.jsx
│  │  │  │  ├─ KelolaAgendaPage.jsx
│  │  │  │  ├─ KelolaBeritaPage.jsx
│  │  │  │  ├─ KelolaDokumenPage.jsx
│  │  │  │  ├─ KelolaGaleriPage.jsx
│  │  │  │  ├─ KelolaPengaturanPage.jsx
│  │  │  │  ├─ KelolaPesanPage.jsx
│  │  │  │  ├─ KelolaProfilStafPage.jsx
│  │  │  │  └─ LoginPage.jsx
│  │  │  └─ public
│  │  │     ├─ AgendaPage.jsx
│  │  │     ├─ BeritaPage.jsx
│  │  │     ├─ GaleriPage.jsx
│  │  │     ├─ HomePage.jsx
│  │  │     ├─ KontakPage.jsx
│  │  │     └─ PlaceholderPage.jsx
│  │  ├─ routes
│  │  │  └─ index.jsx
│  │  ├─ services
│  │  │  ├─ authService.js
│  │  │  ├─ berita.service.js
│  │  │  ├─ dashboardService.js
│  │  │  └─ upload.service.js
│  │  ├─ styles
│  │  │  └─ index.css
│  │  ├─ test
│  │  │  ├─ setup.js
│  │  │  └─ utils.jsx
│  │  └─ utils
│  │     ├─ agenda.js
│  │     ├─ album.js
│  │     ├─ angka.js
│  │     ├─ csvAman.js
│  │     ├─ dokumen.js
│  │     ├─ form.test.js
│  │     ├─ galeri.js
│  │     ├─ grafik.js
│  │     ├─ grafik.test.js
│  │     ├─ halaman.js
│  │     ├─ html.js
│  │     ├─ overview.js
│  │     ├─ overview.test.js
│  │     ├─ paginasi.js
│  │     ├─ paginasi.test.js
│  │     ├─ pengaturan.js
│  │     ├─ pesan.js
│  │     ├─ ptk.js
│  │     ├─ slug.js
│  │     ├─ staf.js
│  │     ├─ tanggal.js
│  │     ├─ tanggal.test.js
│  │     ├─ tautan.js
│  │     ├─ tiket.js
│  │     ├─ unduh.js
│  │     └─ validasi.js
│  ├─ Tailwind.config
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ project_structure.text
└─ README.md

```
```
portal-sma-harapan-jaya
├─ backend
│  ├─ package-lock.json
│  ├─ package.json
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  └─ db.js
│     ├─ controllers
│     │  ├─ agenda.controller.js
│     │  ├─ auth.controller.js
│     │  ├─ berita.controller.js
│     │  ├─ dashboard.controller.js
│     │  ├─ dokumen.controller.js
│     │  ├─ pengaturan.controller.js
│     │  ├─ pesan.controller.js
│     │  └─ staf.controller.js
│     ├─ db
│     │  ├─ migrate.js
│     │  ├─ migrations
│     │  │  └─ 001_init_schema.sql
│     │  └─ seed.js
│     ├─ middlewares
│     │  └─ auth.middleware.js
│     ├─ routes
│     │  ├─ agenda.routes.js
│     │  ├─ auth.routes.js
│     │  ├─ berita.routes.js
│     │  ├─ dashboard.routes.js
│     │  ├─ dokumen.routes.js
│     │  ├─ pengaturan.routes.js
│     │  ├─ pesan.routes.js
│     │  ├─ staf.routes.js
│     │  └─ upload.routes.js
│     ├─ server.js
│     ├─ services
│     │  ├─ agenda.service.js
│     │  ├─ auth.service.js
│     │  ├─ berita.service.js
│     │  ├─ dashboard.service.js
│     │  ├─ dokumen.service.js
│     │  ├─ pengaturan.service.js
│     │  ├─ pesan.service.js
│     │  └─ staf.service.js
│     ├─ utils
│     │  └─ upload.js
│     └─ validators
│        ├─ agenda.validator.js
│        ├─ auth.validator.js
│        ├─ berita.validator.js
│        ├─ dokumen.validator.js
│        ├─ pengaturan.validator.js
│        ├─ pesan.validator.js
│        └─ staf.validator.js
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ images
│  │  │  ├─ logo-noBG.png
│  │  │  ├─ logo.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ admin
│  │  │  │  ├─ AdminFooter.jsx
│  │  │  │  ├─ AdminSidebar.jsx
│  │  │  │  ├─ AdminTopbar.jsx
│  │  │  │  ├─ ConfirmDialog.jsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ AgendaTerdekat.jsx
│  │  │  │  │  ├─ AktivitasTerkini.jsx
│  │  │  │  │  └─ SambutanAdmin.jsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ EditorTeks.jsx
│  │  │  │  │  ├─ EditorTeks.test.jsx
│  │  │  │  │  ├─ Field.jsx
│  │  │  │  │  ├─ gaya.js
│  │  │  │  │  ├─ PratinjauArtikel.jsx
│  │  │  │  │  └─ UnggahCover.jsx
│  │  │  │  ├─ Pagination.jsx
│  │  │  │  └─ TrendChart.jsx
│  │  │  ├─ agenda
│  │  │  │  ├─ AgendaAksi.jsx
│  │  │  │  ├─ AgendaAnnouncement.jsx
│  │  │  │  ├─ AgendaCalendar.jsx
│  │  │  │  ├─ AgendaCard.jsx
│  │  │  │  ├─ AgendaFilters.jsx
│  │  │  │  ├─ AgendaFooter.jsx
│  │  │  │  ├─ AgendaFormModal.jsx
│  │  │  │  ├─ AgendaHeader.jsx
│  │  │  │  ├─ AgendaHero.jsx
│  │  │  │  ├─ AgendaList.jsx
│  │  │  │  ├─ AgendaRow.jsx
│  │  │  │  ├─ AgendaTable.jsx
│  │  │  │  ├─ AgendaTanggal.jsx
│  │  │  │  └─ AgendaWaktu.jsx
│  │  │  ├─ auth
│  │  │  │  ├─ LoginBrand.jsx
│  │  │  │  ├─ LoginField.jsx
│  │  │  │  ├─ LoginFooter.jsx
│  │  │  │  ├─ LoginForm.jsx
│  │  │  │  ├─ LoginInfoBox.jsx
│  │  │  │  └─ LoginTopBar.jsx
│  │  │  ├─ berita
│  │  │  │  ├─ BadgeStatus.jsx
│  │  │  │  ├─ BeritaCard.jsx
│  │  │  │  ├─ BeritaFilter.jsx
│  │  │  │  ├─ BeritaFooter.jsx
│  │  │  │  ├─ BeritaHeader.jsx
│  │  │  │  ├─ BeritaHero.jsx
│  │  │  │  ├─ BeritaNotice.jsx
│  │  │  │  ├─ BeritaRow.jsx
│  │  │  │  ├─ BeritaTable.jsx
│  │  │  │  ├─ BeritaUtama.jsx
│  │  │  │  ├─ ChipKategori.jsx
│  │  │  │  ├─ KumpulanBerita.jsx
│  │  │  │  ├─ LayananMedia.jsx
│  │  │  │  └─ PengumumanResmi.jsx
│  │  │  ├─ dokumen
│  │  │  │  ├─ DokumenDetailModal.jsx
│  │  │  │  ├─ DokumenFilter.jsx
│  │  │  │  ├─ DokumenFormModal.jsx
│  │  │  │  ├─ DokumenRow.jsx
│  │  │  │  ├─ DokumenTable.jsx
│  │  │  │  ├─ IkonBerkas.jsx
│  │  │  │  ├─ StatusDokumenBadge.jsx
│  │  │  │  ├─ UnggahDokumenCard.jsx
│  │  │  │  └─ ZonaUnggah.jsx
│  │  │  ├─ galeri
│  │  │  │  ├─ AlbumAksi.jsx
│  │  │  │  ├─ AlbumBadge.jsx
│  │  │  │  ├─ AlbumBaris.jsx
│  │  │  │  ├─ AlbumCard.jsx
│  │  │  │  ├─ AlbumCover.jsx
│  │  │  │  ├─ AlbumField.jsx
│  │  │  │  ├─ AlbumFormModal.jsx
│  │  │  │  ├─ AlbumFotoModal.jsx
│  │  │  │  ├─ AlbumList.jsx
│  │  │  │  ├─ AlbumMeta.jsx
│  │  │  │  ├─ GaleriHeader.jsx
│  │  │  │  ├─ GaleriPagination.jsx
│  │  │  │  ├─ GaleriStats.jsx
│  │  │  │  ├─ GaleriToolbar.jsx
│  │  │  │  ├─ KurasiKiriman.jsx
│  │  │  │  └─ ModalGaleri.jsx
│  │  │  ├─ home
│  │  │  │  ├─ AgendaMendatang.jsx
│  │  │  │  ├─ BeritaPengumuman.jsx
│  │  │  │  ├─ CtaPpdb.jsx
│  │  │  │  ├─ GaleriPreview.jsx
│  │  │  │  ├─ Hero.jsx
│  │  │  │  ├─ QuickAccess.jsx
│  │  │  │  ├─ Sambutan.jsx
│  │  │  │  └─ Statistik.jsx
│  │  │  ├─ layout
│  │  │  │  ├─ AdminLayout.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ GuruPage.jsx
│  │  │  │  ├─ Navbar.jsx
│  │  │  │  ├─ PublicLayout.jsx
│  │  │  │  ├─ TopBar.jsx
│  │  │  │  └─ VisiMisiPage.jsx
│  │  │  ├─ pengaturan
│  │  │  │  ├─ AdminAksesPanel.jsx
│  │  │  │  ├─ AdminFormModal.jsx
│  │  │  │  ├─ AdminRow.jsx
│  │  │  │  ├─ AsetVisualPanel.jsx
│  │  │  │  ├─ BagianPengaturan.jsx
│  │  │  │  ├─ BarisSaklar.jsx
│  │  │  │  ├─ BarSimpan.jsx
│  │  │  │  ├─ FieldPengaturan.jsx
│  │  │  │  ├─ IdentitasSekolahForm.jsx
│  │  │  │  ├─ KartuAset.jsx
│  │  │  │  ├─ KontakFooterForm.jsx
│  │  │  │  ├─ PerananBadge.jsx
│  │  │  │  ├─ PortalStatusPanel.jsx
│  │  │  │  ├─ PratinjauPeran.jsx
│  │  │  │  ├─ SesiAdminPanel.jsx
│  │  │  │  └─ StatusAdminBadge.jsx
│  │  │  ├─ pesan
│  │  │  │  ├─ FieldKontak.jsx
│  │  │  │  ├─ KategoriChip.jsx
│  │  │  │  ├─ KolomKontak.jsx
│  │  │  │  ├─ KontakPublikForm.jsx
│  │  │  │  ├─ PengirimCell.jsx
│  │  │  │  ├─ PesanToolbar.jsx
│  │  │  │  ├─ TiketRow.jsx
│  │  │  │  ├─ TiketTable.jsx
│  │  │  │  └─ TinjauTiketModal.jsx
│  │  │  ├─ staf
│  │  │  │  ├─ BlokTeksProfil.jsx
│  │  │  │  ├─ JabatanBadge.jsx
│  │  │  │  ├─ ProfilSambutan.jsx
│  │  │  │  ├─ StafDetailModal.jsx
│  │  │  │  ├─ StafFilter.jsx
│  │  │  │  ├─ StafFormModal.jsx
│  │  │  │  ├─ StafFoto.jsx
│  │  │  │  ├─ StafRow.jsx
│  │  │  │  ├─ StafStats.jsx
│  │  │  │  ├─ StafTable.jsx
│  │  │  │  ├─ StafTabs.jsx
│  │  │  │  ├─ StafToolbar.jsx
│  │  │  │  ├─ StatusPegawaiBadge.jsx
│  │  │  │  └─ SwitchPublik.jsx
│  │  │  └─ ui
│  │  │     ├─ Avatar.jsx
│  │  │     ├─ FormField.jsx
│  │  │     ├─ Icon.jsx
│  │  │     ├─ KolomForm.jsx
│  │  │     ├─ ModalDialog.jsx
│  │  │     ├─ Paginasi.jsx
│  │  │     ├─ PaginasiNav.jsx
│  │  │     ├─ Saklar.jsx
│  │  │     └─ SectionHeading.jsx
│  │  ├─ config
│  │  │  ├─ adminNav.js
│  │  │  ├─ agenda.js
│  │  │  ├─ berita.js
│  │  │  ├─ dashboard.js
│  │  │  ├─ dokumenAdmin.js
│  │  │  ├─ galeri.js
│  │  │  ├─ galeriAdmin.js
│  │  │  ├─ kategoriBerita.js
│  │  │  ├─ login.js
│  │  │  ├─ navigation.js
│  │  │  ├─ overviewAdmin.js
│  │  │  ├─ pengaturanAdmin.js
│  │  │  ├─ pesan.js
│  │  │  ├─ pesanAdmin.js
│  │  │  ├─ site.js
│  │  │  ├─ staf.js
│  │  │  └─ stafAdmin.js
│  │  ├─ context
│  │  ├─ hooks
│  │  │  ├─ useBerita.js
│  │  │  └─ useNotice.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ mocks
│  │  │  ├─ admin.js
│  │  │  ├─ adminAgenda.js
│  │  │  ├─ adminBerita.js
│  │  │  ├─ adminDashboard.js
│  │  │  ├─ adminDokumen.js
│  │  │  ├─ adminGaleri.js
│  │  │  ├─ adminPengaturan.js
│  │  │  ├─ adminPesan.js
│  │  │  ├─ adminStaf.js
│  │  │  ├─ auth.js
│  │  │  ├─ dashboard.js
│  │  │  ├─ dashboardOverview.js
│  │  │  └─ home.js
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ adminPengaturan.js
│  │  │  │  ├─ AdminPlaceholderPage.jsx
│  │  │  │  ├─ BeritaAdminPage.jsx
│  │  │  │  ├─ BeritaAdminPage.test.jsx
│  │  │  │  ├─ BeritaFormPage.jsx
│  │  │  │  ├─ BeritaFormPage.test.jsx
│  │  │  │  ├─ DashboardMandiri.jsx
│  │  │  │  ├─ DashboardPage.jsx
│  │  │  │  ├─ DashboardPage.test.jsx
│  │  │  │  ├─ KelolaAgendaPage.jsx
│  │  │  │  ├─ KelolaBeritaPage.jsx
│  │  │  │  ├─ KelolaDokumenPage.jsx
│  │  │  │  ├─ KelolaGaleriPage.jsx
│  │  │  │  ├─ KelolaPengaturanPage.jsx
│  │  │  │  ├─ KelolaPesanPage.jsx
│  │  │  │  ├─ KelolaProfilStafPage.jsx
│  │  │  │  └─ LoginPage.jsx
│  │  │  └─ public
│  │  │     ├─ AgendaPage.jsx
│  │  │     ├─ BeritaPage.jsx
│  │  │     ├─ GaleriPage.jsx
│  │  │     ├─ HomePage.jsx
│  │  │     ├─ KontakPage.jsx
│  │  │     ├─ PlaceholderPage.jsx
│  │  │     └─ ProfilPage.jsx
│  │  ├─ routes
│  │  │  └─ index.jsx
│  │  ├─ services
│  │  │  ├─ authService.js
│  │  │  ├─ berita.service.js
│  │  │  ├─ dashboardService.js
│  │  │  ├─ dokumenService.js
│  │  │  ├─ pengaturan.service.js
│  │  │  └─ upload.service.js
│  │  ├─ styles
│  │  │  └─ index.css
│  │  ├─ test
│  │  │  ├─ setup.js
│  │  │  └─ utils.jsx
│  │  └─ utils
│  │     ├─ agenda.js
│  │     ├─ agenda.test.js
│  │     ├─ album.js
│  │     ├─ angka.js
│  │     ├─ csvAman.js
│  │     ├─ dokumen.js
│  │     ├─ form.test.js
│  │     ├─ galeri.js
│  │     ├─ grafik.js
│  │     ├─ grafik.test.js
│  │     ├─ halaman.js
│  │     ├─ html.js
│  │     ├─ overview.js
│  │     ├─ overview.test.js
│  │     ├─ paginasi.js
│  │     ├─ paginasi.test.js
│  │     ├─ pengaturan.js
│  │     ├─ pesan.js
│  │     ├─ ptk.js
│  │     ├─ slug.js
│  │     ├─ staf.js
│  │     ├─ tanggal.js
│  │     ├─ tanggal.test.js
│  │     ├─ tautan.js
│  │     ├─ tiket.js
│  │     ├─ unduh.js
│  │     └─ validasi.js
│  ├─ Tailwind.config
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ project_structure.text
└─ README.md

```
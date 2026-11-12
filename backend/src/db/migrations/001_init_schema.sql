-- 1. Tabel Users (Admin & Pengelola CMS)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(150) NOT NULL,
  nip VARCHAR(50) UNIQUE,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Super Admin',
  status VARCHAR(20) NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. Tabel Posts (Berita & Pengumuman)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  ringkasan TEXT,
  konten TEXT NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  nomor_surat VARCHAR(100),
  gambar_cover TEXT,
  file_lampiran TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Terbit',
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. Tabel Agenda (Kalender Kegiatan Sekolah)
CREATE TABLE IF NOT EXISTS agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  kategori VARCHAR(100),
  periode VARCHAR(100) DEFAULT 'Semester Genap 2025/2026',
  deskripsi TEXT,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE,
  waktu VARCHAR(100),
  lokasi VARCHAR(255),
  kapasitas_target VARCHAR(150),
  penyelenggara VARCHAR(150),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 4. Tabel Galeri (Katalog Album Dokumentasi)
CREATE TABLE IF NOT EXISTS galeri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul_foto VARCHAR(255) NOT NULL,
  kategori VARCHAR(100) NOT NULL DEFAULT 'Kegiatan Adiwiyata',
  deskripsi TEXT,
  image_url TEXT NOT NULL,
  jumlah_foto INT NOT NULL DEFAULT 1,
  pengunggah VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'Tayang',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS galeri_foto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  galeri_id UUID NOT NULL REFERENCES galeri(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabel Staf (Direktori Guru & Tenaga Kependidikan)
CREATE TABLE IF NOT EXISTS staf (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(150) NOT NULL,
  nip_nuptk VARCHAR(50),
  jabatan VARCHAR(150) NOT NULL,
  rumpun VARCHAR(100),
  mata_pelajaran VARCHAR(150),
  pendidikan_terakhir VARCHAR(100),
  almamater VARCHAR(150),
  status_kepegawaian VARCHAR(100),
  foto_url TEXT,
  urutan INT NOT NULL DEFAULT 0,
  tampil_publik BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 6. Tabel Dokumen (Pusat Unduhan & Template)
CREATE TABLE IF NOT EXISTS dokumen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_dokumen VARCHAR(255) NOT NULL,
  kategori VARCHAR(100) NOT NULL DEFAULT 'Umum & Siswa',
  deskripsi TEXT,
  file_url TEXT NOT NULL,
  tipe_file VARCHAR(50),
  ukuran_bytes INT NOT NULL DEFAULT 0,
  versi VARCHAR(50) DEFAULT 'Rev 1.0',
  status_publikasi VARCHAR(50) NOT NULL DEFAULT 'Aktif di SIS',
  tampil_tombol_utama BOOLEAN NOT NULL DEFAULT FALSE,
  jumlah_unduhan INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 7. Tabel Pesan Masuk (Tiket Layanan Kontak PTSP)
CREATE TABLE IF NOT EXISTS pesan_masuk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telepon VARCHAR(50),
  kategori_layanan VARCHAR(100) DEFAULT 'Tata Usaha & Akademik',
  subjek VARCHAR(255) NOT NULL,
  pesan TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Belum Dibalas',
  catatan_admin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tabel Pengaturan Sekolah (Key-Value untuk Visi Misi, Sambutan, Kontak, Sistem)
CREATE TABLE IF NOT EXISTS pengaturan_sekolah (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
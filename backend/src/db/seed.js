/** @format */

import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const runSeed = async () => {
  const client = await pool.connect();
  try {
    console.log("⏳ Menjalankan seeder akun Super Admin & Kepala Sekolah...");
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash("SandiRahasia2026!", 10);

    // 1. Masukkan akun Super Admin awal
    await client.query(
      `INSERT INTO users (nama, nip, email, password_hash, role, status)
       VALUES 
         ('Junaidi', '6642741646200002', 'Junaididahlan5@gmail.com', $1, 'Super Admin', 'Aktif'),
         ('Agus Mulyanto', '7633775676130122', 'agusaja442@gmail.com', $1, 'Super Admin', 'Aktif')
       ON CONFLICT (email) DO NOTHING;`,
      [passwordHash],
    );

    // 2. Masukkan pengaturan dasar sekolah (tidak menimpa jika sudah pernah diubah dari Admin)
    await client.query(
      `INSERT INTO pengaturan_sekolah (key, value)
       VALUES
         ('nama_sekolah', 'SMAS Harapan Jaya'),
         ('namaInstitusi', 'SMAS Harapan Jaya'),
         ('npsn', '20104829'),
         ('akreditasi', 'A (Unggul) BAN-S/M'),
         ('predikat_adiwiyata', 'Sekolah Adiwiyata Mandiri Nasional'),
         ('adiwiyata', 'Sekolah Adiwiyata Mandiri Nasional'),
         ('motto', 'Unggul, Berkarakter, Berwawasan Lingkungan Adiwiyata'),
         ('slogan', 'Unggul, Berkarakter, Berwawasan Lingkungan Adiwiyata'),
         ('email_resmi', 'harapanjayasma@gmail.com'),
         ('email', 'harapanjayasma@gmail.com'),
         ('telepon_ptsp', '085813548624 / 0895626288424'),
         ('telepon', '085813548624 / 0895626288424'),
         ('kode_pos', '11730'),
         ('kodePos', '11730'),
         ('alamat_lengkap', 'Kec. Cengkareng, Kota Adm. Jakarta Barat, Prov. D.K.I. Jakarta 11730'),
         ('alamat', 'Kec. Cengkareng, Kota Adm. Jakarta Barat, Prov. D.K.I. Jakarta 11730'),
         ('nama_kepala_sekolah', 'Junaidi'),
         ('sambutan_judul', '“Menyemai Karakter Adiluhung dalam Harmoni Alam dan Perkembangan Teknologi Abad 21”'),
         ('sambutan_kepsek', 'Selamat datang di gerbang digital SMA Harapan Jaya. Kami berkomitmen menyelenggarakan ekosistem pendidikan berwawasan lingkungan hijau Adiwiyata Mandiri, menumbuhkan integritas moral, serta mengantarkan generasi muda meraih prestasi unggul di kancah nasional maupun global.'),
         ('sambutan_kepala_sekolah', 'Selamat datang di gerbang digital SMA Harapan Jaya. Kami berkomitmen menyelenggarakan ekosistem pendidikan berwawasan lingkungan hijau Adiwiyata Mandiri, menumbuhkan integritas moral, serta mengantarkan generasi muda meraih prestasi unggul di kancah nasional maupun global.'),
         ('visi_sekolah', 'Terwujudnya lulusan yang beriman, berakhlak mulia, unggul dalam sains dan teknologi, serta berbudaya lingkungan hidup yang asri dan lestari.'),
         ('maintenance_mode', 'false'),
         ('maintenance', 'false'),
         ('ppdb_online_aktif', 'true'),
         ('ppdb', 'true')
       ON CONFLICT (key) DO NOTHING;`,
    );

    // 3. Reset tabel staf dan masukkan akun Super Admin (Kepala Sekolah Junaidi) sebagai data awal
    await client.query("TRUNCATE TABLE staf RESTART IDENTITY CASCADE;");
    await client.query(
      `INSERT INTO staf (
         nama,
         nip_nuptk,
         jabatan,
         rumpun,
         mata_pelajaran,
         pendidikan_terakhir,
         almamater,
         status_kepegawaian,
         urutan,
         tampil_publik
       )
       VALUES (
         'Junaidi',
         'NUPTK: 6642741646200002',
         'Kepala Sekolah',
         'Pimpinan Sekolah',
         'Manajemen Pendidikan',
         'S2 Manajemen Pendidikan',
         NULL,
         'GTY/PTY',
         1,
         true
       );`,
    );

    await client.query("COMMIT");
    console.log(
      "✅ Seeder berhasil! Super Admin (Kepala Sekolah Junaidi) telah siap di Direktori Guru & Tendik.",
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeder gagal:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

runSeed();

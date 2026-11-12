import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const runSeed = async () => {
  const client = await pool.connect();
  try {
    console.log('⏳ Menjalankan seeder data asli SMAS Harapan Jaya...');
    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash('SandiRahasia2026!', 10);

    // 1. Masukkan akun Super Admin menggunakan data asli Kepala Sekolah & Wakasek
    await client.query(
      `INSERT INTO users (nama, nip, email, password_hash, role, status)
       VALUES 
         ('Junaidi', '6642741646200002', 'Junaididahlan5@gmail.com', $1, 'Super Admin', 'Aktif'),
         ('Agus Mulyanto', '7633775676130122', 'agusaja442@gmail.com', $1, 'Super Admin', 'Aktif')
       ON CONFLICT (email) DO NOTHING;`,
      [passwordHash]
    );

    // 2. Masukkan pengaturan dasar sekolah sesuai data Dapodik asli
    await client.query(
      `INSERT INTO pengaturan_sekolah (key, value)
       VALUES
         ('nama_sekolah', 'SMAS Harapan Jaya'),
         ('npsn', '20104829'),
         ('akreditasi', 'A (Unggul) BAN-S/M'),
         ('predikat_adiwiyata', 'Sekolah Adiwiyata Mandiri Nasional'),
         ('motto', 'Unggul, Berkarakter, Berwawasan Lingkungan Adiwiyata'),
         ('email_resmi', 'harapanjayasma@gmail.com'),
         ('telepon_ptsp', '085813548624 / 0895626288424'),
         ('kode_pos', '11730'),
         ('alamat_lengkap', 'Kec. Cengkareng, Kota Adm. Jakarta Barat, Prov. D.K.I. Jakarta 11730'),
         ('jumlah_siswa_aktif', '173'),
         ('jumlah_rombel', '6'),
         ('jumlah_ptk', '18'),
         ('nama_kepala_sekolah', 'Junaidi'),
         ('sambutan_kepala_sekolah', 'Selamat datang di portal resmi SMAS Harapan Jaya. Kami berkomitmen menghadirkan ekosistem pendidikan yang unggul, berkarakter Pancasila, dan adaptif terhadap perkembangan teknologi.'),
         ('visi_sekolah', 'Terwujudnya lulusan yang beriman, berakhlak mulia, unggul dalam sains dan teknologi, serta berbudaya lingkungan hidup yang asri dan lestari.'),
         ('maintenance_mode', 'false'),
         ('ppdb_online_aktif', 'true')
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();`
    );

    // 3. Masukkan 18 data asli Kepala Sekolah, Guru, dan Tendik ke tabel staf (cek agar tidak duplikat)
    const { rowCount } = await client.query('SELECT 1 FROM staf LIMIT 1');
    if (rowCount === 0) {
      await client.query(
        `INSERT INTO staf (nama, nip_nuptk, jabatan, rumpun, status_kepegawaian, urutan, tampil_publik)
         VALUES
           ('Junaidi', '6642741646200002', 'Kepala Sekolah', 'Manajemen Pimpinan', 'GTY/PTY', 1, true),
           ('Agus Mulyanto', '7633775676130122', 'Wakil Kepala Sekolah Kurikulum', 'Manajemen & Guru', 'GTY/PTY', 2, true),
           ('Lili Yuslianti', '5335760661220003', 'Wakil Kepala Sekolah Kesiswaan', 'Manajemen & Guru', 'GTY/PTY', 3, true),
           ('Epi Yulpiani', '4038749651300033', 'Kepala Perpustakaan', 'Guru & Perpustakaan', 'GTY/PTY', 4, true),
           ('Alfinita Utari', '9651775676230002', 'Guru Wali', 'Tenaga Pendidik', 'GTY/PTY', 5, true),
           ('Dian Nurlatifah', '4548759662300013', 'Guru Wali', 'Tenaga Pendidik', 'GTY/PTY', 6, true),
           ('Dony Aditya Putra', '5549774675130303', 'Guru Wali', 'Tenaga Pendidik', 'GTY/PTY', 7, true),
           ('Luqman Hakim', '1842767668130482', 'Guru Wali', 'Tenaga Pendidik', 'GTY/PTY', 8, true),
           ('Lutfiah Adnania', '6444778679230042', 'Guru Wali', 'Tenaga Pendidik', 'GTY/PTY', 9, true),
           ('Mahfud Sidik', '9553768669130173', 'Guru Mata Pelajaran', 'Tenaga Pendidik', 'GTY/PTY', 10, true),
           ('Muhidin', NULL, 'Guru Wali', 'Tenaga Pendidik', 'GTY/PTY', 11, true),
           ('Nurhayati', '2441768668300002', 'Guru Wali', 'Tenaga Pendidik', 'GTY/PTY', 12, true),
           ('Rahmadani', NULL, 'Guru Wali', 'Tenaga Pendidik', 'Guru Honor Sekolah', 13, true),
           ('Siti Soleha', '0254777678230083', 'Guru Wali', 'Tenaga Pendidik', 'GTY/PTY', 14, true),
           ('Siti Juhroh', '0037753655300033', 'Pelaksana PBJ', 'Tenaga Kependidikan', 'Tenaga Honor Sekolah', 15, true),
           ('Muhamad Rizal', '8433770671130403', 'Tenaga Kependidikan', 'Tenaga Kependidikan', 'GTY/PTY', 16, true),
           ('Sonia', NULL, 'Tenaga Kependidikan', 'Tenaga Kependidikan', 'GTY/PTY', 17, true),
           ('Subchan Aprianto', NULL, 'Tenaga Kependidikan', 'Tenaga Kependidikan', 'Tenaga Honor Sekolah', 18, true);`
      );
    }

    await client.query('COMMIT');
    console.log('✅ Seeder berhasil! 2 Super Admin, Pengaturan Sekolah, & 18 PTK asli telah tersimpan.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeder gagal:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

runSeed();

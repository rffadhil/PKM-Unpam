/** @format */

import { query } from "../config/db.js";

const NAMA_BULAN = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

const formatWaktuRelatif = (dateInput) => {
  if (!dateInput) return "Baru saja";
  const selisihDetik = Math.max(
    0,
    Math.floor((Date.now() - new Date(dateInput).getTime()) / 1000),
  );
  if (selisihDetik < 60) return "Baru saja";
  const menit = Math.floor(selisihDetik / 60);
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.floor(jam / 24);
  return `${hari} hari lalu`;
};

export const getDashboardData = async () => {
  // 1. Hitung total data untuk statistik & badge angka di Sidebar
  const countsResult = await query(`
    SELECT
      (SELECT COUNT(*)::int FROM posts WHERE deleted_at IS NULL) AS total_berita,
      (SELECT COUNT(*)::int FROM agenda WHERE deleted_at IS NULL) AS total_agenda,
      (SELECT COUNT(*)::int FROM agenda WHERE deleted_at IS NULL AND tanggal_mulai >= CURRENT_DATE AND tanggal_mulai <= CURRENT_DATE + INTERVAL '7 days') AS agenda_pekan_ini,
      (SELECT COUNT(*)::int FROM galeri WHERE deleted_at IS NULL) AS total_galeri,
      (SELECT COUNT(*)::int FROM dokumen WHERE deleted_at IS NULL) AS total_dokumen,
      (SELECT COUNT(*)::int FROM staf WHERE deleted_at IS NULL) AS total_staf,
      (SELECT COUNT(*)::int FROM pesan_masuk) AS total_pesan,
      (SELECT COUNT(*)::int FROM pesan_masuk WHERE status = 'Belum Dibalas') AS pesan_belum_dibalas
  `);

  const counts = countsResult.rows[0] || {};

  // 2. Ambil 3 Agenda Kampus Terdekat
  const agendaResult = await query(`
    SELECT id, judul, tanggal_mulai, waktu, lokasi
    FROM agenda
    WHERE deleted_at IS NULL
    ORDER BY
      CASE WHEN tanggal_mulai >= CURRENT_DATE THEN 0 ELSE 1 END,
      ABS(tanggal_mulai - CURRENT_DATE) ASC
    LIMIT 3
  `);

  const agendaFormatted = agendaResult.rows.map((row, idx) => {
    const tglObj = row.tanggal_mulai ? new Date(row.tanggal_mulai) : new Date();
    const bulan = NAMA_BULAN[tglObj.getMonth()] || "JAN";
    const tanggal = String(tglObj.getDate()).padStart(2, "0");
    const waktu = row.waktu || "";
    const lokasi = row.lokasi || "";

    const isOnline = /zoom|online|hybrid|meet/i.test(lokasi);
    const tipe = isOnline ? "online" : waktu ? "jam" : "lokasi";
    const ikon =
      tipe === "jam"
        ? "schedule"
        : tipe === "online"
          ? "videocam"
          : "location_on";
    const info =
      waktu && lokasi ? `${waktu} • ${lokasi}` : lokasi || waktu || "-";
    const warnaBulan =
      idx === 0 ? "bg-[#90B800] text-primary" : "bg-secondary text-white";

    return {
      id: row.id,
      bulan,
      tanggal,
      judul: row.judul,
      waktu,
      lokasi,
      tipe,
      ikon,
      info,
      warnaBulan,
    };
  });

  // 3. Ambil 2 Pesan Masuk Terbaru yang Belum Dibalas
  const pesanResult = await query(`
    SELECT id, nama, subjek, pesan, kategori_layanan, status, created_at
    FROM pesan_masuk
    WHERE status = 'Belum Dibalas'
    ORDER BY created_at DESC
    LIMIT 2
  `);

  const pesanFormatted = pesanResult.rows.map((row, idx) => ({
    id: row.id,
    pengirim: row.nama,
    waktu: formatWaktuRelatif(row.created_at),
    isi: row.pesan,
    kotak: row.kategori_layanan || "PTSP Layanan Siswa",
    mendesak: idx === 0,
  }));

  // 4. Gabungkan 4 Aktivitas Publikasi & Log Sistem Terkini dari tabel Berita, Agenda, Pesan, dan Galeri
  const aktivitasResult = await query(`
    (
      SELECT
        p.id::text AS id,
        'berita' AS jenis,
        p.judul AS sorot,
        COALESCE(u.nama, 'Admin') AS aktor,
        p.kategori AS meta,
        'Diterbitkan' AS status_teks,
        p.created_at AS waktu_kejadian
      FROM posts p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.deleted_at IS NULL
    )
    UNION ALL
    (
      SELECT
        a.id::text AS id,
        'agenda' AS jenis,
        a.judul AS sorot,
        COALESCE(a.penyelenggara, u.nama, 'Humas') AS aktor,
        COALESCE(a.lokasi, 'Kampus SMA Harapan Jaya') AS meta,
        'Terjadwal' AS status_teks,
        a.updated_at AS waktu_kejadian
      FROM agenda a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.deleted_at IS NULL
    )
    UNION ALL
    (
      SELECT
        pm.id::text AS id,
        'pesan' AS jenis,
        pm.subjek AS sorot,
        pm.nama AS aktor,
        COALESCE(pm.kategori_layanan, 'Kotak Masuk PTSP') AS meta,
        pm.status AS status_teks,
        pm.created_at AS waktu_kejadian
      FROM pesan_masuk pm
    )
    UNION ALL
    (
      SELECT
        g.id::text AS id,
        'galeri' AS jenis,
        g.judul_foto AS sorot,
        COALESCE(g.pengunggah, u.nama, 'Admin') AS aktor,
        g.jumlah_foto::text AS meta,
        g.status AS status_teks,
        g.created_at AS waktu_kejadian
      FROM galeri g
      LEFT JOIN users u ON g.created_by = u.id
      WHERE g.deleted_at IS NULL
    )
    ORDER BY waktu_kejadian DESC
    LIMIT 4
  `);

  // Format untuk struktur dashboard.js
  const aktivitasFormatted = aktivitasResult.rows.map((row) => {
    const waktu = formatWaktuRelatif(row.waktu_kejadian);
    if (row.jenis === "berita") {
      return {
        id: row.id,
        jenis: "berita",
        judul: "Admin menambahkan Berita Baru:",
        sorot: row.sorot,
        waktu,
        detail: `Oleh: ${row.aktor} • Kategori: ${row.meta} • Status:`,
        status: { teks: "Diterbitkan", tone: "ok" },
      };
    }
    if (row.jenis === "agenda") {
      return {
        id: row.id,
        jenis: "agenda",
        judul: "Humas memperbarui Agenda:",
        sorot: row.sorot,
        waktu,
        detail: `Oleh: ${row.aktor} • Lokasi: ${row.meta}`,
      };
    }
    if (row.jenis === "pesan") {
      return {
        id: row.id,
        jenis: "pesan",
        judul: "Pesan masuk baru dari Publik:",
        sorot: row.sorot,
        waktu,
        detail: `Pengirim: ${row.aktor} • ${row.meta} • Status:`,
        status: {
          teks: row.status_teks,
          tone: row.status_teks === "Belum Dibalas" ? "bad" : "ok",
        },
      };
    }
    return {
      id: row.id,
      jenis: "galeri",
      judul: "Admin mengunggah Album Foto:",
      sorot: row.sorot,
      waktu,
      detail: `Oleh: ${row.aktor} • Menambahkan ${row.meta} foto dokumentasi ke Galeri`,
    };
  });

  // Format untuk struktur adminDashboard.js (AktivitasTerkini.jsx)
  const aktivitasTerkiniFormatted = aktivitasResult.rows.map((row) => {
    const waktu = formatWaktuRelatif(row.waktu_kejadian);
    if (row.jenis === "berita") {
      return {
        id: row.id,
        ikon: "post_add",
        tone: "hijau",
        judul: "Admin menambahkan Berita Baru: ",
        sorot: `"${row.sorot}"`,
        sorotClass: "text-secondary",
        waktu,
        detail: [
          { teks: "Oleh: " },
          { teks: row.aktor, tebal: true },
          { teks: ` • Kategori: ${row.meta} • Status: ` },
          { teks: "Diterbitkan", kelas: "text-emerald-700 font-semibold" },
        ],
      };
    }
    if (row.jenis === "agenda") {
      return {
        id: row.id,
        ikon: "edit_calendar",
        tone: "biru",
        judul: "Humas memperbarui Agenda: ",
        sorot: `"${row.sorot}"`,
        sorotClass: "text-blue-900",
        waktu,
        detail: [
          { teks: "Oleh: " },
          { teks: row.aktor, tebal: true },
          { teks: ` • Lokasi: ${row.meta}` },
        ],
      };
    }
    if (row.jenis === "pesan") {
      return {
        id: row.id,
        ikon: "inbox",
        tone: "merah",
        judul: "Pesan masuk baru dari Publik: ",
        sorot: `"${row.sorot}"`,
        sorotClass: "text-on-surface",
        waktu,
        detail: [
          { teks: "Pengirim: " },
          { teks: row.aktor, tebal: true },
          { teks: ` • ${row.meta} • Status: ` },
          {
            teks: row.status_teks,
            kelas:
              row.status_teks === "Belum Dibalas"
                ? "text-error font-semibold"
                : "text-emerald-700 font-semibold",
          },
        ],
      };
    }
    return {
      id: row.id,
      ikon: "add_photo_alternate",
      tone: "kuning",
      judul: "Admin mengunggah Album Foto: ",
      sorot: `"${row.sorot}"`,
      sorotClass: "text-on-surface",
      waktu,
      detail: [
        { teks: "Oleh: " },
        { teks: row.aktor, tebal: true },
        { teks: ` • Menambahkan ${row.meta} foto ke Galeri Sekolah` },
      ],
    };
  });

  const todayIso = new Date().toISOString().split("T")[0];

  return {
    tahunPelajaran: "2025/2026",
    tanggal: todayIso,
    statusPortal:
      "Portal berjalan normal. Terakhir sinkronisasi database kurikulum otomatis pukul 04:00 WIB tadi pagi.",
    notifikasi: counts.pesan_belum_dibalas || 0,

    // Badge angka untuk Sidebar & Statistik
    stats: {
      berita: {
        total: counts.total_berita || 0,
        tayang: counts.total_berita || 0,
        draf: 0,
      },
      agenda: {
        total: counts.total_agenda || 0,
        pekanIni: counts.agenda_pekan_ini || 0,
        darurat: 0,
      },
      galeri: { total: counts.total_galeri || 0 },
      dokumen: { total: counts.total_dokumen || 0 },
      staf: { total: counts.total_staf || 0 },
      pesan: {
        belumDibalas: counts.pesan_belum_dibalas || 0,
        total: counts.total_pesan || 0,
        totalDiterima: counts.total_pesan || 0,
      },
    },

    agenda: agendaFormatted,
    agendaTerdekat: agendaFormatted,
    pesan: pesanFormatted,
    pesanTerbaru: pesanFormatted,
    aktivitas: aktivitasFormatted,
    aktivitasTerkini: aktivitasTerkiniFormatted,
  };
};

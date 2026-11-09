/** @format */

import { query } from "../config/db.js";

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

const formatTanggalIso = (dateInput) => {
  if (!dateInput) return new Date().toISOString().split("T")[0];
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDashboardData = async () => {
  // 1. Ambil 3 Agenda Kampus Terdekat (sesuai struktur dashboardOverview.js)
  const agendaResult = await query(`
    SELECT id, judul, tanggal_mulai, waktu, lokasi
    FROM agenda
    WHERE deleted_at IS NULL
    ORDER BY
      CASE WHEN tanggal_mulai >= CURRENT_DATE THEN 0 ELSE 1 END,
      ABS(tanggal_mulai - CURRENT_DATE) ASC
    LIMIT 3
  `);

  const agenda = agendaResult.rows.map((row) => {
    const waktu = row.waktu || "";
    const lokasi = row.lokasi || "";
    const isOnline = /zoom|online|hybrid|meet/i.test(lokasi);
    const ikon = isOnline ? "videocam" : waktu ? "schedule" : "location_on";
    const detail =
      waktu && lokasi ? `${waktu} • ${lokasi}` : lokasi || waktu || "-";

    return {
      id: row.id,
      tanggal: formatTanggalIso(row.tanggal_mulai),
      judul: row.judul,
      ikon,
      detail,
    };
  });

  // 2. Ambil 4 Aktivitas Publikasi & Log Sistem Terkini (gabungan Berita, Agenda, Pesan, Galeri)
  const aktivitasResult = await query(`
    (
      SELECT
        p.id::text AS id,
        'berita' AS jenis,
        p.judul AS objek,
        COALESCE(u.nama, 'Admin') AS oleh,
        p.kategori AS info_utama,
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
        a.judul AS objek,
        COALESCE(a.penyelenggara, u.nama, 'Humas') AS oleh,
        COALESCE(a.lokasi, 'Kampus SMA Harapan Jaya') AS info_utama,
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
        pm.subjek AS objek,
        pm.nama AS oleh,
        COALESCE(pm.kategori_layanan, 'Kotak Masuk PTSP') AS info_utama,
        pm.status AS status_teks,
        pm.created_at AS waktu_kejadian
      FROM pesan_masuk pm
    )
    UNION ALL
    (
      SELECT
        g.id::text AS id,
        'galeri' AS jenis,
        g.judul_foto AS objek,
        COALESCE(g.pengunggah, u.nama, 'Admin') AS oleh,
        g.jumlah_foto::text AS info_utama,
        g.status AS status_teks,
        g.created_at AS waktu_kejadian
      FROM galeri g
      LEFT JOIN users u ON g.created_by = u.id
      WHERE g.deleted_at IS NULL
    )
    ORDER BY waktu_kejadian DESC
    LIMIT 4
  `);

  const aktivitas = aktivitasResult.rows.map((row) => {
    const waktu = formatWaktuRelatif(row.waktu_kejadian);

    if (row.jenis === "berita") {
      return {
        id: `berita-${row.id}`,
        nada: "hijau",
        ikon: "note_add",
        aktor: "Admin",
        aksi: "menambahkan Berita Baru:",
        objek: `"${row.objek}"`,
        objekNada: "hijau",
        waktu,
        meta: [
          { label: "Oleh", nilai: row.oleh },
          { label: "Kategori", nilai: row.info_utama },
          { label: "Status", nilai: "Diterbitkan", tone: "hijau" },
        ],
      };
    }

    if (row.jenis === "agenda") {
      return {
        id: `agenda-${row.id}`,
        nada: "biru",
        ikon: "edit_calendar",
        aktor: "Humas",
        aksi: "memperbarui Agenda:",
        objek: `"${row.objek}"`,
        objekNada: "biru",
        waktu,
        meta: [
          { label: "Oleh", nilai: row.oleh },
          { label: "Lokasi", nilai: row.info_utama },
        ],
      };
    }

    if (row.jenis === "pesan") {
      const belumDibalas = row.status_teks === "Belum Dibalas";
      return {
        id: `pesan-${row.id}`,
        nada: "merah",
        ikon: "inbox",
        aktor: "Pesan masuk baru dari Publik:",
        aksi: "",
        objek: `"${row.objek}"`,
        waktu,
        meta: [
          { label: "Pengirim", nilai: row.oleh },
          { nilai: row.info_utama },
          {
            label: "Status",
            nilai: belumDibalas ? "Belum Dijawab" : row.status_teks,
            tone: belumDibalas ? "merah" : "hijau",
          },
        ],
      };
    }

    return {
      id: `galeri-${row.id}`,
      nada: "kuning",
      ikon: "add_photo_alternate",
      aktor: "Admin Galeri",
      aksi: "mengunggah Album Foto:",
      objek: `"${row.objek}"`,
      waktu,
      meta: [
        { label: "Oleh", nilai: row.oleh },
        { nilai: `Menambahkan ${row.info_utama} foto dokumentasi ke Galeri` },
      ],
    };
  });

  // 3. Ambil 2 Pesan Masuk Terbaru yang Belum Dibalas
  const pesanResult = await query(`
    SELECT id, nama, pesan, kategori_layanan, created_at
    FROM pesan_masuk
    WHERE status = 'Belum Dibalas'
    ORDER BY created_at DESC
    LIMIT 2
  `);

  const pesan = pesanResult.rows.map((row, idx) => ({
    id: row.id,
    nama: row.nama,
    waktu: formatWaktuRelatif(row.created_at),
    isi: row.pesan,
    kategori: row.kategori_layanan || "PTSP Layanan Siswa",
    kategoriNada: idx === 0 ? "hijau" : "oranye",
    baru: idx === 0,
  }));

  return {
    tahunPelajaran: "2026/2027",

    aktivitas,
    agenda,
    pesan,
  };
};

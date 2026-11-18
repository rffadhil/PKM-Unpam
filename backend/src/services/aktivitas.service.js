
/** @format */

import { query } from "../config/db.js";

export const getAktivitasData = async ({
  search = "",
  jenis = "",
  page = 1,
  limit = 10,
  tanggalMulai = "",
  tanggalSelesai = "",
}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (safePage - 1) * safeLimit;

  const sql = `
    SELECT *
    FROM (
      SELECT
        p.id::text AS id,
        'berita' AS jenis,
        p.judul AS objek,
        COALESCE(u.nama, 'Admin') AS aktor,
        p.status AS keterangan,
        p.created_at AS waktu
      FROM posts p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.deleted_at IS NULL

      UNION ALL

      SELECT
        a.id::text AS id,
        'agenda' AS jenis,
        a.judul AS objek,
        COALESCE(u.nama, a.penyelenggara, 'Admin') AS aktor,
        COALESCE(a.lokasi, 'Agenda sekolah') AS keterangan,
        a.updated_at AS waktu
      FROM agenda a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.deleted_at IS NULL

      UNION ALL

      SELECT
        g.id::text AS id,
        'galeri' AS jenis,
        g.judul_foto AS objek,
        COALESCE(u.nama, g.pengunggah, 'Admin') AS aktor,
        g.status AS keterangan,
        g.created_at AS waktu
      FROM galeri g
      LEFT JOIN users u ON g.created_by = u.id
      WHERE g.deleted_at IS NULL

      UNION ALL

      SELECT
        s.id::text AS id,
        'staf' AS jenis,
        s.nama AS objek,
        COALESCE(u.nama, 'Admin') AS aktor,
        s.jabatan AS keterangan,
        s.updated_at AS waktu
      FROM staf s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.deleted_at IS NULL

      UNION ALL

      SELECT
        d.id::text AS id,
        'dokumen' AS jenis,
        d.nama_dokumen AS objek,
        COALESCE(u.nama, 'Admin') AS aktor,
        d.status_publikasi AS keterangan,
        d.created_at AS waktu
      FROM dokumen d
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.deleted_at IS NULL

      UNION ALL

      SELECT
        pm.id::text AS id,
        'pesan' AS jenis,
        pm.subjek AS objek,
        pm.nama AS aktor,
        pm.status AS keterangan,
        pm.created_at AS waktu
      FROM pesan_masuk pm

      UNION ALL

      SELECT
        al.id::text AS id,
        'ekstrakurikuler' AS jenis,
        al.objek AS objek,
        COALESCE(u.nama, 'Admin') AS aktor,
        al.keterangan AS keterangan,
        al.created_at AS waktu
      FROM aktivitas_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.jenis = 'ekstrakurikuler'

    ) AS aktivitas

    WHERE
      ($1 = '' OR objek ILIKE '%' || $1 || '%'
        OR aktor ILIKE '%' || $1 || '%')
      AND ($2 = '' OR jenis = $2)
      AND ($3::date IS NULL OR waktu::date >= $3::date)
      AND ($4::date IS NULL OR waktu::date <= $4::date)
  `;

  const values = [
    search.trim(),
    jenis,
    tanggalMulai || null,
    tanggalSelesai || null,
  ];

  const countResult = await query(
    `SELECT COUNT(*)::int AS total
     FROM (${sql}) AS hasil`,
    values
  );

  const dataResult = await query(
    `${sql}
     ORDER BY waktu DESC
     LIMIT $5 OFFSET $6`,
    [...values, safeLimit, offset]
  );

  const total = countResult.rows[0].total;

  return {
    data: dataResult.rows,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

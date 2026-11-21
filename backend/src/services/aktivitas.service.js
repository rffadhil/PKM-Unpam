
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
        a.id::text,
        'agenda',
        a.judul,
        COALESCE(u.nama, a.penyelenggara, 'Admin'),
        COALESCE(a.lokasi, 'Agenda sekolah'),
        a.updated_at
      FROM agenda a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.deleted_at IS NULL

      UNION ALL

      SELECT
        g.id::text,
        'galeri',
        g.judul_foto,
        COALESCE(u.nama, g.pengunggah, 'Admin'),
        g.status,
        g.created_at
      FROM galeri g
      LEFT JOIN users u ON g.created_by = u.id
      WHERE g.deleted_at IS NULL

      UNION ALL

      SELECT
        s.id::text,
        'staf',
        s.nama,
        COALESCE(u.nama, 'Admin'),
        s.jabatan,
        s.updated_at
      FROM staf s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.deleted_at IS NULL

      UNION ALL

      SELECT
        d.id::text,
        'dokumen',
        d.nama_dokumen,
        COALESCE(u.nama, 'Admin'),
        d.status_publikasi,
        d.created_at
      FROM dokumen d
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.deleted_at IS NULL

      UNION ALL

      SELECT
        pm.id::text,
        'pesan',
        pm.subjek,
        pm.nama,
        pm.status,
        pm.created_at
      FROM pesan_masuk pm
    ) AS aktivitas
    WHERE
      ($1 = '' OR objek ILIKE '%' || $1 || '%' OR aktor ILIKE '%' || $1 || '%')
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
    `SELECT COUNT(*)::int AS total FROM (${sql}) AS hasil`,
    values
  );

  const dataResult = await query(
    `${sql} ORDER BY waktu DESC LIMIT $5 OFFSET $6`,
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

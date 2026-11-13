/** @format */

import { BATAS_FOTO_MB, RUMPUN_PTK, TONE_RUMPUN } from "@/config/stafAdmin";

// Pisahkan tipe nomor (NIP / NUPTK) dan angkanya agar tidak pernah dobel "NIP/NUPTK: NUPTK: ..."
export function ekstrakNomorPtk(raw = "", tipeDefault = "NUPTK") {
  const teks = String(raw ?? "").trim();
  if (!teks) return { tipeNomor: tipeDefault, nomor: "" };

  const cocok = teks.match(/^(NIP\/NUPTK|NUPTK|NIP)\s*[.:]\s*(.*)$/i);
  if (cocok) {
    const prefix = cocok[1].toUpperCase();
    const isi = cocok[2]
      .replace(/^(NIP\/NUPTK|NUPTK|NIP)\s*[.:]\s*/i, "")
      .trim();
    const tipe =
      prefix === "NIP" || prefix === "NUPTK"
        ? prefix
        : isi.replace(/\s+/g, "").length === 18
          ? "NIP"
          : "NUPTK";
    return { tipeNomor: tipe, nomor: isi };
  }

  const hanyaAngka = teks.replace(/\s+/g, "");
  const tipe = hanyaAngka.length === 18 ? "NIP" : tipeDefault;
  return { tipeNomor: tipe, nomor: teks };
}

export function labelNomor(p) {
  const mentah = p?.nomor || p?.nip_nuptk || "";
  const { tipeNomor, nomor } = ekstrakNomorPtk(mentah, p?.tipeNomor || "NUPTK");

  if (!nomor) return "NIP/NUPTK: -";
  return `${tipeNomor}: ${nomor}`;
}

// "Drs. H. Bambang Sudirman, M.Pd" -> "BS" (gelar dilewati)
export function inisialPtk(nama = "") {
  const kata = nama
    .split(/\s+/)
    .filter((k) => k && !/[.,]$/.test(k) && !/^[A-Z][a-z]?\./.test(k));
  const sumber = kata.length ? kata : nama.split(/\s+/);
  return (
    sumber
      .slice(0, 2)
      .map((k) => k[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export function saringPtk(data, { kata = "", rumpun = "", status = "" } = {}) {
  const k = kata.trim().toLowerCase();

  return data.filter((p) => {
    const rumpunData = (p.rumpun ?? "").trim().toLowerCase();
    const rumpunFilter = rumpun.trim().toLowerCase();

    const statusData = (p.statusKepegawaian ?? "").trim().toLowerCase();
    const statusFilter = status.trim().toLowerCase();

    if (rumpunFilter && rumpunData !== rumpunFilter) return false;
    if (statusFilter && statusData !== statusFilter) return false;

    if (!k) return true;

    return [
      p.nama,
      p.nomor,
      p.jabatan,
      p.rumpun,
      p.bidang,
      p.pendidikan,
      p.kampus,
    ].some((t) => (t ?? "").toLowerCase().includes(k));
  });
}

// "Struktur Tertinggi & NIP": urutan kecil dulu, lalu nama.
export function urutkanPtk(data) {
  return [...data].sort(
    (a, b) =>
      (Number(a.urutan) || 99) - (Number(b.urutan) || 99) ||
      (a.nama || "").localeCompare(b.nama || ""),
  );
}

export function ptkKosong() {
  return {
    id: null,
    nama: "",
    tipeNomor: "NUPTK",
    nomor: "",
    rumpun: RUMPUN_PTK[2],
    jabatan: "Guru Mata Pelajaran",
    tone: TONE_RUMPUN[RUMPUN_PTK[2]],
    bidang: "",
    pendidikan: "",
    kampus: "",
    statusKepegawaian: "GTY/PTY",
    urutan: 3,
    tampil: true,
    foto: "",
  };
}

export function validasiPtk(f) {
  const e = {};
  if (!f.nama?.trim()) e.nama = "Nama lengkap wajib diisi.";
  if (f.nomor?.trim() && !/^[\d\s-]+$/.test(f.nomor.trim())) {
    e.nomor = `${f.tipeNomor || "Nomor"} hanya boleh berisi angka dan spasi.`;
  }
  if (!f.jabatan?.trim()) e.jabatan = "Jabatan wajib diisi.";
  return e;
}

// Mengembalikan pesan error, atau '' kalau berkas valid.
export function validasiFoto(file) {
  if (!file.type.startsWith("image/"))
    return "Berkas harus berupa gambar (JPG, PNG, atau WebP).";
  if (file.size > BATAS_FOTO_MB * 1024 * 1024)
    return `Ukuran foto maksimal ${BATAS_FOTO_MB} MB.`;
  return "";
}

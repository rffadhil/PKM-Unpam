/** @format */

import { mockAgenda } from "@/mocks/adminAgenda";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STORAGE_KEY = "cms_agenda_data";

const getHeaders = (isJson = true) => {
  const headers = {};

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  const token = localStorage.getItem("cms_token");

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

function ambilArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;

  return [];
}

export function parseTanggalKeLocalIso(val) {
  if (!val) return "";
  const s = String(val).trim();
  if (s.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return s;
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) return s.slice(0, 10);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatAgendaFrontend(row) {
  if (!row) return {};

  const tMulai = row.tanggal_mulai ?? row.tanggalMulai ?? "";
  const tSelesai = row.tanggal_selesai ?? row.tanggalSelesai ?? "";

  const tanggalMulai = parseTanggalKeLocalIso(tMulai);
  const tanggalSelesai = parseTanggalKeLocalIso(tSelesai);

  // Ambil tanggal hari ini dalam format YYYY-MM-DD lokal
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hariIniIso = `${yyyy}-${mm}-${dd}`;

  const batasTanggal = tanggalSelesai || tanggalMulai;
  const statusOtomatis =
    batasTanggal && batasTanggal < hariIniIso ? "selesai" : "mendatang";

  return {
    ...row,
    id: row.id,
    judul: row.judul || "",
    slug: row.slug || "",
    kategori: row.kategori || "",
    periode: row.periode || "",
    deskripsi: row.deskripsi || "",
    tanggalMulai,
    tanggalSelesai,
    waktu: row.waktu || "",
    lokasi: row.lokasi || "",
    lokasiDetail: row.lokasiDetail || row.lokasi_detail || "",
    ikonLokasi: row.ikonLokasi || row.ikon_lokasi || "location_on",
    kapasitasTarget:
      row.kapasitasTarget || row.kapasitas_target || "",
    penyelenggara: row.penyelenggara || "",
    pic: row.pic || "",
    catatan: row.catatan || "",
    status: row.status || statusOtomatis,
  };
}

export function getLocalAgenda() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(formatAgendaFrontend);
      }
    }
  } catch {
    // Abaikan error parsing JSON
  }

  const inisial = mockAgenda.map(formatAgendaFrontend);
  setLocalAgenda(inisial);
  return inisial;
}

export function setLocalAgenda(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Abaikan error quota
  }
}

export function buatSlug(judul = "") {
  const dasar = String(judul)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return dasar || `agenda-${Date.now()}`;
}

export function formatAgendaBackend(input) {
  const tMulai = input.tanggalMulai || input.tanggal_mulai || null;
  const tSelesai = input.tanggalSelesai || input.tanggal_selesai || null;

  return {
    judul: input.judul?.trim() || "",
    slug:
      (input.slug && String(input.slug).trim()) ||
      buatSlug(input.judul),
    kategori: input.kategori || null,
    periode: input.periode || null,
    deskripsi: input.deskripsi || null,
    tanggal_mulai: tMulai ? parseTanggalKeLocalIso(tMulai) : null,
    tanggal_selesai: tSelesai ? parseTanggalKeLocalIso(tSelesai) : null,
    waktu: input.waktu || null,
    lokasi: input.lokasi || null,
    kapasitas_target:
      input.kapasitasTarget || input.kapasitas_target || null,
    penyelenggara: input.penyelenggara || null,
    pic: input.pic || null,
    catatan: input.catatan || null,
  };
}

function checkIsNetworkError(err) {
  if (!err) return true;
  if (!err.status || err.status === 404 || err.status === 502 || err.status === 503) return true;
  if (err.name === "AbortError" || err.name === "TypeError") return true;
  const msg = String(err.message || "").toLowerCase();
  return (
    msg.includes("fetch") ||
    msg.includes("failed to fetch") ||
    msg.includes("network") ||
    msg.includes("koneksi") ||
    msg.includes("econnrefused")
  );
}

async function requestAgenda(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, {
      credentials: "include",
      signal: controller.signal,
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(
        data.message || data.error || "Terjadi kesalahan pada Agenda.",
      );

      if (data.field) {
        error.field = data.field;
      }
      error.status = response.status;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

// GET /api/agenda
export async function daftarAgenda() {
  try {
    const data = await requestAgenda(`${API_BASE_URL}/api/agenda`);
    const list = ambilArray(data);

    if (Array.isArray(list) && list.length > 0) {
      const formatted = list.map(formatAgendaFrontend);
      setLocalAgenda(formatted);
      return formatted;
    }

    return getLocalAgenda();
  } catch {
    return getLocalAgenda();
  }
}

// GET /api/agenda/:id
export async function ambilAgenda(id) {
  try {
    const data = await requestAgenda(`${API_BASE_URL}/api/agenda/${id}`);
    const row = data?.data?.data ?? data?.data ?? data;
    return formatAgendaFrontend(row);
  } catch {
    const lokal = getLocalAgenda();
    const item = lokal.find((a) => String(a.id) === String(id));
    if (item) return item;
    throw new Error("Agenda tidak ditemukan.");
  }
}

// POST /api/agenda atau PUT /api/agenda/:id
export async function simpanAgenda(input) {
  const isUpdate = Boolean(input.id && !String(input.id).startsWith("local-"));

  const url = isUpdate
    ? `${API_BASE_URL}/api/agenda/${input.id}`
    : `${API_BASE_URL}/api/agenda`;

  const method = isUpdate ? "PUT" : "POST";
  const payload = formatAgendaBackend(input);

  try {
    const data = await requestAgenda(url, {
      method,
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });

    const savedRow = data?.data?.data ?? data?.data ?? data ?? payload;
    const formatted = formatAgendaFrontend({
      ...input,
      ...savedRow,
      id: savedRow.id || input.id,
    });

    const current = getLocalAgenda();
    let updated;
    if (input.id) {
      updated = current.map((item) =>
        String(item.id) === String(input.id) ? formatted : item,
      );
    } else {
      updated = [formatted, ...current];
    }
    setLocalAgenda(updated);

    return formatted;
  } catch (err) {
    if (checkIsNetworkError(err)) {
      const current = getLocalAgenda();
      let formatted;
      let updated;

      if (input.id) {
        formatted = formatAgendaFrontend({ ...input });
        updated = current.map((item) =>
          String(item.id) === String(input.id) ? formatted : item,
        );
      } else {
        formatted = formatAgendaFrontend({
          ...input,
          id: Date.now(),
        });
        updated = [formatted, ...current];
      }

      setLocalAgenda(updated);
      return formatted;
    }

    throw err;
  }
}

// DELETE /api/agenda/:id
export async function hapusAgenda(id) {
  try {
    await requestAgenda(`${API_BASE_URL}/api/agenda/${id}`, {
      method: "DELETE",
      headers: getHeaders(false),
    });

    const current = getLocalAgenda();
    const updated = current.filter(
      (item) => String(item.id) !== String(id),
    );
    setLocalAgenda(updated);

    return { success: true };
  } catch (err) {
    if (checkIsNetworkError(err)) {
      const current = getLocalAgenda();
      const updated = current.filter(
        (item) => String(item.id) !== String(id),
      );
      setLocalAgenda(updated);
      return { success: true };
    }

    throw err;
  }
}

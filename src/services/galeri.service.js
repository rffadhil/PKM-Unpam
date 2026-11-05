/** @format */

import { mockAlbum } from "@/mocks/adminGaleri";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STORAGE_KEY = "cms_galeri_data";

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

export function formatGaleriFrontend(row) {
  if (!row) return {};

  const cover = row.cover || row.image_url || row.gambar || "";
  const jumlahFoto = Number(row.jumlahFoto ?? row.jumlah_foto ?? 1);
  const judul = row.judul || row.judul_foto || "";
  const penyelenggara = row.penyelenggara || row.pengunggah || "";
  const tanggal = row.tanggal || (row.created_at ? String(row.created_at).slice(0, 10) : "");

  return {
    ...row,
    id: row.id,
    judul,
    judul_foto: judul,
    kategori: row.kategori || "Adiwiyata",
    deskripsi: row.deskripsi || "",
    cover,
    gambar: cover,
    image_url: cover,
    jumlahFoto,
    jumlah_foto: jumlahFoto,
    penyelenggara,
    pengunggah: penyelenggara,
    status: (row.status || "tayang").toLowerCase(),
    tanggal,
  };
}

export function getLocalGaleri() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(formatGaleriFrontend);
      }
    }
  } catch {
    // Abaikan error parsing JSON
  }

  const inisial = mockAlbum.map(formatGaleriFrontend);
  setLocalGaleri(inisial);
  return inisial;
}

export function setLocalGaleri(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Abaikan error
  }
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

async function requestGaleri(url, options = {}) {
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
        data.message || data.error || "Terjadi kesalahan pada Galeri."
      );
      if (data.field) error.field = data.field;
      error.status = response.status;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

// GET /api/galeri
export async function daftarGaleri(params = {}) {
  const queryParts = [];
  if (params.kategori && params.kategori !== "Semua" && params.kategori !== "Semua Album") {
    queryParts.push(`kategori=${encodeURIComponent(params.kategori)}`);
  }
  if (params.status) {
    queryParts.push(`status=${encodeURIComponent(params.status)}`);
  }
  if (params.kata || params.q) {
    queryParts.push(`kata=${encodeURIComponent(params.kata || params.q)}`);
  }

  const qs = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  const url = `${API_BASE_URL}/api/galeri${qs}`;

  try {
    const data = await requestGaleri(url);
    const list = ambilArray(data);

    if (Array.isArray(list)) {
      const formatted = list.map(formatGaleriFrontend);
      setLocalGaleri(formatted);
      return formatted;
    }

    return getLocalGaleri();
  } catch {
    return getLocalGaleri();
  }
}

// GET /api/galeri/:id
export async function ambilGaleri(id) {
  try {
    const data = await requestGaleri(`${API_BASE_URL}/api/galeri/${id}`);
    const row = data?.data?.data ?? data?.data ?? data;
    return formatGaleriFrontend(row);
  } catch {
    const lokal = getLocalGaleri();
    const item = lokal.find((a) => String(a.id) === String(id));
    if (item) return item;
    throw new Error("Album galeri tidak ditemukan.");
  }
}

// POST /api/galeri atau PUT /api/galeri/:id
export async function simpanGaleri(input) {
  const isUpdate = Boolean(input.id && !String(input.id).startsWith("local-") && String(input.id).length > 10);

  const url = isUpdate
    ? `${API_BASE_URL}/api/galeri/${input.id}`
    : `${API_BASE_URL}/api/galeri`;

  const method = isUpdate ? "PUT" : "POST";
  const payload = {
    judul: input.judul || input.judul_foto,
    kategori: input.kategori || "Adiwiyata",
    deskripsi: input.deskripsi || "",
    image_url: input.cover || input.gambar || input.image_url || "",
    jumlah_foto: Number(input.jumlahFoto ?? input.jumlah_foto ?? 1),
    pengunggah: input.penyelenggara || input.pengunggah || "Admin Sekolah",
    status: (input.status || "tayang").toLowerCase(),
    tanggal: input.tanggal || new Date().toISOString().slice(0, 10),
  };

  try {
    const data = await requestGaleri(url, {
      method,
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });

    const savedRow = data?.data?.data ?? data?.data ?? data ?? payload;
    const formatted = formatGaleriFrontend({
      ...input,
      ...savedRow,
      id: savedRow.id || input.id,
    });

    const current = getLocalGaleri();
    let updated;
    if (input.id) {
      updated = current.map((item) =>
        String(item.id) === String(input.id) ? formatted : item
      );
    } else {
      updated = [formatted, ...current];
    }
    setLocalGaleri(updated);

    return formatted;
  } catch (err) {
    if (checkIsNetworkError(err)) {
      const current = getLocalGaleri();
      let formatted;
      let updated;

      if (input.id) {
        formatted = formatGaleriFrontend({ ...input });
        updated = current.map((item) =>
          String(item.id) === String(input.id) ? formatted : item
        );
      } else {
        formatted = formatGaleriFrontend({
          ...input,
          id: Date.now(),
        });
        updated = [formatted, ...current];
      }

      setLocalGaleri(updated);
      return formatted;
    }

    throw err;
  }
}

// DELETE /api/galeri/:id
export async function hapusGaleri(id) {
  try {
    await requestGaleri(`${API_BASE_URL}/api/galeri/${id}`, {
      method: "DELETE",
      headers: getHeaders(false),
    });

    const current = getLocalGaleri();
    const updated = current.filter((item) => String(item.id) !== String(id));
    setLocalGaleri(updated);

    return { success: true };
  } catch (err) {
    if (checkIsNetworkError(err)) {
      const current = getLocalGaleri();
      const updated = current.filter((item) => String(item.id) !== String(id));
      setLocalGaleri(updated);
      return { success: true };
    }

    throw err;
  }
}


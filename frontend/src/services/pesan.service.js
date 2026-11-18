
import { getStoredAuth } from "@/services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";

  const { token } = getStoredAuth();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
};

async function bacaRespons(response, pesanGagal) {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.message || pesanGagal);
  }

  return data;
}

// Mengambil daftar pesan masuk.
export async function daftarPesan() {
  const response = await fetch(`${API_BASE_URL}/api/pesan`, {
    method: "GET",
    headers: getHeaders(false),
    credentials: "include",
  });

  const hasil = await bacaRespons(response, "Gagal memuat daftar pesan.");

  // Mendukung respons berbentuk { data: [...] } atau langsung [...].
  return Array.isArray(hasil) ? hasil : hasil.data ?? [];
}

// Mengambil detail pesan berdasarkan ID.
export async function ambilPesan(id) {
  const response = await fetch(`${API_BASE_URL}/api/pesan/${id}`, {
    method: "GET",
    headers: getHeaders(false),
    credentials: "include",
  });

  const hasil = await bacaRespons(response, "Pesan tidak ditemukan.");
  return hasil.data ?? hasil;
}

// Mengubah status dan catatan admin.
export async function ubahStatusPesan({ id, status, catatan }) {
  const response = await fetch(`${API_BASE_URL}/api/pesan/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify({
      status,
      catatan_admin: catatan || null,
    }),
  });

  const hasil = await bacaRespons(response, "Gagal memperbarui status pesan.");
  return hasil.data ?? hasil;
}


// Mengirim pesan dari formulir publik.
export async function kirimPesanPublik(input) {
  const response = await fetch(`${API_BASE_URL}/api/pesan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      nama: input.nama,
      email: input.email,
      telepon: input.telepon,
      kategori_layanan: input.kategori,
      subjek: input.subjek,
      pesan: input.pesan,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengirim pesan.");
  }

  return data;
}

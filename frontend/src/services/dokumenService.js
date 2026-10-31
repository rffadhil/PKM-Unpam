
/** @format */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getHeaders() {
  const token = localStorage.getItem("cms_token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

async function handleResponse(response) {
  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Server memberikan respons yang tidak valid.");
  }

  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan pada server.");
  }

  return result;
}

// Mengambil semua dokumen untuk halaman admin
export async function ambilDokumenAdmin() {
  const response = await fetch(`${API_BASE_URL}/api/dokumen/admin`, {
    method: "GET",
    headers: getHeaders(),
    credentials: "include",
  });

  const result = await handleResponse(response);
  return result.data || [];
}

// Mengunggah file dan menyimpan metadata ke PostgreSQL
export async function unggahDokumen(data) {
  const formData = new FormData();

  formData.append("file", data.berkas);
  formData.append("nama_dokumen", data.judul);
  formData.append("kategori", data.kategori);
  formData.append("deskripsi", data.deskripsi || "");
  formData.append("versi", "Rev 1.0");
  formData.append(
    "status_publikasi",
    data.aktif ? "Aktif di SIS" : "Draft"
  );
  formData.append("tampil_tombol_utama", "false");

  const response = await fetch(`${API_BASE_URL}/api/dokumen`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: formData,
  });

  return handleResponse(response);
}

// Memperbarui metadata dokumen
export async function perbaruiDokumen(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/dokumen/${id}`, {
    method: "PUT",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      nama_dokumen: data.nama,
      kategori: data.kategori,
      deskripsi: data.deskripsi || "",
      status_publikasi: data.aktif ? "Aktif di SIS" : "Draft",
    }),
  });

  return handleResponse(response);
}

// Menghapus dokumen
export async function hapusDokumen(id) {
  const response = await fetch(`${API_BASE_URL}/api/dokumen/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
    credentials: "include",
  });

  return handleResponse(response);
}

export { API_BASE_URL };

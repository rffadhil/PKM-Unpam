/** @format */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("cms_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export async function ambilPengaturanLengkap() {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan`, {
    method: "GET",
    headers: getHeaders(false),
    credentials: "include",
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal memuat pengaturan sekolah.");
  }
  return json;
}

export async function simpanPengaturanPortal(draf) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan`, {
    method: "PUT",
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify(draf),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal menyimpan pengaturan sekolah.");
  }
  return json.portal || draf;
}

export async function tambahAdmin(data) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan/admin`, {
    method: "POST",
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal membuat akun admin.");
  }
  return json.data;
}

export async function ubahAdmin(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan/admin/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal memperbarui data admin.");
  }
  return json.data;
}

export async function hapusAdminById(id) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan/admin/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
    credentials: "include",
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal menghapus akun admin.");
  }
  return true;
}

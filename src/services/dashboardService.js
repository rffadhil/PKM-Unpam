/** @format */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getDashboard() {
  const token = localStorage.getItem("cms_token");

  const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat data dashboard dari server.");
  }

  return res.json();
}

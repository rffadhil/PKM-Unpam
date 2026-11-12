
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getAktivitas(params = {}) {
  const queryParams = new URLSearchParams(params);
  const token = localStorage.getItem("cms_token");

  const response = await fetch(
    `${API_BASE_URL}/api/admin/aktivitas?${queryParams}`,
    {
      method: "GET",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memuat log aktivitas.");
  }

  return data;
}

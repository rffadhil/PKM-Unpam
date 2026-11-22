/** @format */

import { getStoredAuth } from "@/services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://smaharapanjaya.sch.id";

export async function getDashboard() {
  const { token } = getStoredAuth();

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

export async function getAktivitas(page = 1, limit = 5) {
  const { token } = getStoredAuth();

  const res = await fetch(
    `${API_BASE_URL}/api/admin/dashboard/aktivitas?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Gagal memuat data aktivitas dari server.");
  }

  return res.json();
}

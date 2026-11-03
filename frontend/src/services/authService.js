/** @format */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export class AuthError extends Error {}

export async function login({ email, password, ingat = false }) {
  if (!email || !email.trim() || !password) {
    throw new AuthError("Email/NIP dan kata sandi wajib diisi.");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: email.trim(), password, ingat }),
    });
  } catch {
    throw new AuthError(
      "Gagal terhubung ke server backend. Pastikan backend sedang berjalan.",
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new AuthError(
      data.message || "Gagal masuk. Periksa kembali kredensial Anda.",
    );
  }

  if (data.user) {
    localStorage.setItem("cms_user", JSON.stringify(data.user));
  }
  if (data.token) {
    localStorage.setItem("cms_token", data.token);
  }

  return { user: data.user, token: data.token };
}

export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    localStorage.removeItem("cms_user");
    localStorage.removeItem("cms_token");
  }
}

export async function getCurrentUser() {
  const token = localStorage.getItem("cms_token");
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!response.ok) {
    throw new AuthError("Sesi tidak aktif.");
  }

  const data = await response.json();
  return data.user;
}

export function getActiveAdmin(fallbackUser = {}) {
  try {
    const raw = localStorage.getItem("cms_token")
      ? localStorage.getItem("cms_user")
      : null;
    if (!raw) return fallbackUser;
    const saved = JSON.parse(raw);
    if (!saved || !saved.nama) return fallbackUser;

    const parts = String(saved.nama).trim().split(/\s+/).filter(Boolean);
    const inisial =
      parts.length === 0
        ? "AD"
        : parts.length === 1
          ? parts[0].slice(0, 2).toUpperCase()
          : (parts[0][0] + parts[1][0]).toUpperCase();

    const isSuper = /super/i.test(saved.role || "");

    return {
      ...fallbackUser,
      id: saved.id,
      nama: saved.nama,
      namaSingkat: saved.nama,
      inisial,
      foto: saved.foto || "",
      peran: isSuper ? "Super Admin" : "Admin",
      jabatan: isSuper ? "Super Admin" : "Admin",
      email: saved.email || fallbackUser.email,
    };
  } catch {
    return fallbackUser;
  }
}

export function updateActiveAdminStorage(partialUser = {}) {
  try {
    const raw = localStorage.getItem("cms_user");
    const current = raw ? JSON.parse(raw) : {};
    const updated = { ...current, ...partialUser };
    localStorage.setItem("cms_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("cms_user_updated"));
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
}

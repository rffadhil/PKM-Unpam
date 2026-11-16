/** @format */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const REMEMBER_KEY = "cms_remember_me";

export class AuthError extends Error {}

function clearPersistedSessionStore(store) {
  if (!store) return;
  try {
    store.removeItem("cms_user");
    store.removeItem("cms_token");
  } catch {
    // Abaikan bila storage tidak tersedia.
  }
}

export function clearAuthStorage() {
  clearPersistedSessionStore(localStorage);
  clearPersistedSessionStore(sessionStorage);

  try {
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem("cms_last_email");
  } catch {
    // Abaikan bila storage tidak tersedia.
  }

  try {
    sessionStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem("cms_last_email");
  } catch {
    // Abaikan bila storage tidak tersedia.
  }
}

export function getStoredAuth() {
  const stores = [localStorage, sessionStorage];
  for (const store of stores) {
    try {
      const token = store.getItem("cms_token");
      const rawUser = store.getItem("cms_user");
      if (token || rawUser) {
        return {
          token: token || "",
          user: rawUser ? JSON.parse(rawUser) : null,
          remember: store === localStorage,
        };
      }
    } catch {
      // Abaikan bila storage corrupt.
    }
  }

  return { token: "", user: null, remember: false };
}

export function getAuthToken() {
  return getStoredAuth().token || "";
}

export async function login({ email, password, ingat = false }) {
  if (!email || !email.trim() || !password) {
    throw new AuthError("Email/NIP dan kata sandi wajib diisi.");
  }

  const remember = Boolean(ingat);
  const targetStore = remember ? localStorage : sessionStorage;

  clearPersistedSessionStore(localStorage);
  clearPersistedSessionStore(sessionStorage);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: email.trim(), password, ingat: remember }),
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
    targetStore.setItem("cms_user", JSON.stringify(data.user));
  }
  if (data.token) {
    targetStore.setItem("cms_token", data.token);
  }

  try {
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  } catch {
    // Abaikan bila storage tidak tersedia.
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
    clearAuthStorage();
  }
}

export async function getCurrentUser() {
  const token = getAuthToken();
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

export async function changeRequiredPassword(newPassword) {
  const token = getAuthToken();
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ newPassword }),
    });
  } catch {
    throw new AuthError(
      "Gagal terhubung ke server backend. Pastikan backend sedang berjalan.",
    );
  }

  const data = await response.json();
  if (!response.ok) {
    throw new AuthError(data.message || "Gagal memperbarui kata sandi.");
  }
  return data.user;
}

export function getActiveAdmin(fallbackUser = {}) {
  try {
    const { user } = getStoredAuth();
    if (!user || !user.nama) return fallbackUser;

    const parts = String(user.nama).trim().split(/\s+/).filter(Boolean);
    const inisial =
      parts.length === 0
        ? "AD"
        : parts.length === 1
          ? parts[0].slice(0, 2).toUpperCase()
          : (parts[0][0] + parts[1][0]).toUpperCase();

    const isSuper = /super/i.test(user.role || "");

    return {
      ...fallbackUser,
      id: user.id,
      nama: user.nama,
      namaSingkat: user.nama,
      inisial,
      foto: user.foto || "",
      peran: isSuper ? "Super Admin" : "Admin",
      jabatan: isSuper ? "Super Admin" : "Admin",
      email: user.email || fallbackUser.email,
    };
  } catch {
    return fallbackUser;
  }
}

export function updateActiveAdminStorage(partialUser = {}) {
  try {
    const { user: current = {} } = getStoredAuth();
    const updated = { ...current, ...partialUser };

    const targetStore = localStorage.getItem(REMEMBER_KEY) === "1" ? localStorage : sessionStorage;
    targetStore.setItem("cms_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("cms_user_updated"));
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
}

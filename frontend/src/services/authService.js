/** @format */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export class AuthError extends Error {}

export async function login({
  email,
  identifier,
  password,
  ingat = false,
}) {
  const loginIdentifier = String(email || identifier || '').trim()

  if (!loginIdentifier || !password) {
    throw new AuthError("Email/NIP dan kata sandi wajib diisi.")
  }
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
      credentials: "include", // Agar cookie httpOnly tersimpan di browser
      body: JSON.stringify({email: loginIdentifier, password, ingat,}),
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

  // Simpan info dasar user & token di localStorage untuk kemudahan akses komponen UI admin
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

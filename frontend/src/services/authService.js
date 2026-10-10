import { mockAdminAccount as akun } from '@/mocks/auth'

const KEY = 'admin_session'

// Sekarang memakai mock. Nanti ganti isinya dengan:
//   const res = await fetch('/api/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify({ identifier, password }),
//   })
//   if (!res.ok) throw new Error((await res.json()).message ?? 'Gagal masuk.')
export async function login({ identifier, password, remember }) {
  await new Promise((r) => setTimeout(r, 700))
  const id = identifier.trim().toLowerCase()
  const cocok = (id === akun.email || id === akun.nip) && password === akun.password
  if (!cocok) throw new Error('Email/NIP atau kata sandi tidak sesuai. Periksa lagi lalu coba masuk kembali.')

  const session = { user: akun.user }
  const store = remember ? localStorage : sessionStorage
  store.setItem(KEY, JSON.stringify(session))
  return session
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY) ?? 'null')
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}

// Layanan autentikasi. Saat ini masih mock; backend cukup mengganti isi fungsi login().
// TODO: POST /api/auth/login  body: { email, password, ingat }
//       respons: { user } + cookie httpOnly JWT (atau { token, user }).
const JEDA_MOCK = 600

export class AuthError extends Error {}

export async function login({ email, password /*, ingat */ }) {
  await new Promise((r) => setTimeout(r, JEDA_MOCK))
  if (!email.trim() || !password) {
    throw new AuthError('Email/NIP dan kata sandi wajib diisi.')
  }
  // Mock: terima semua kredensial yang terisi.
  return { user: { nama: 'Drs. Arya Dagah, S.Kom', role: 'admin' } }
}

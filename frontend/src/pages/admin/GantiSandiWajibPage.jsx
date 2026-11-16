import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  changeRequiredPassword,
  updateActiveAdminStorage,
} from "@/services/authService";

export default function GantiSandiWajibPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [galat, setGalat] = useState("");
  const [memproses, setMemproses] = useState(false);

  async function simpan(e) {
    e.preventDefault();
    setGalat("");

    if (password.length < 8 || password.length > 72) {
      setGalat("Kata sandi harus terdiri dari 8 sampai 72 karakter.");
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setGalat("Gunakan kombinasi huruf dan angka.");
      return;
    }

    if (password !== konfirmasi) {
      setGalat("Konfirmasi kata sandi tidak sama.");
      return;
    }

    setMemproses(true);
    try {
      await changeRequiredPassword(password);
      updateActiveAdminStorage({ must_change_password: false });
      navigate("/admin", { replace: true });
    } catch (error) {
      setGalat(error.message || "Gagal memperbarui kata sandi.");
    } finally {
      setMemproses(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-light px-4 py-8 text-on-surface">
      <section className="w-full max-w-lg rounded-2xl border border-border-muted bg-surface-white p-6 shadow-lg sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-secondary">
          Keamanan akun
        </p>
        <h1 className="mt-2 text-2xl font-bold text-primary">
          Buat Kata Sandi Baru
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Untuk melanjutkan ke CMS, ganti sandi sementara dengan sandi baru
          yang hanya Anda ketahui.
        </p>

        <form onSubmit={simpan} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="sandi-baru"
              className="mb-1.5 block text-sm font-semibold text-primary"
            >
              Kata sandi baru
            </label>
            <input
              id="sandi-baru"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border-muted px-3 py-2.5 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <div>
            <label
              htmlFor="konfirmasi-sandi"
              className="mb-1.5 block text-sm font-semibold text-primary"
            >
              Konfirmasi kata sandi baru
            </label>
            <input
              id="konfirmasi-sandi"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              className="w-full rounded-lg border border-border-muted px-3 py-2.5 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          <p className="text-xs text-text-muted">
            Minimal 8 karakter dan harus mengandung huruf serta angka.
          </p>

          {galat && (
            <p
              role="alert"
              className="rounded-lg bg-error-container px-3 py-2 text-sm font-medium text-on-error-container"
            >
              {galat}
            </p>
          )}

          <button
            type="submit"
            disabled={memproses}
            className="w-full rounded-xl bg-cta-gold px-5 py-3 text-sm font-bold text-primary hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {memproses ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
          </button>
        </form>
      </section>
    </main>
  );
}

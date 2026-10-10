import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (
        username === "admin.it@smaharapanjaya.sch.id" &&
        password === "SandiRahasia2026!"
      ) {
        localStorage.setItem("isAdminAuth", "true");
        navigate("/admin/dashboard");
      } else if (username === "admin" && password === "admin123") {
        localStorage.setItem("isAdminAuth", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Kredensial tidak valid atau tidak memiliki akses.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-sm selection:bg-primary selection:text-white">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 px-4 md:px-8 flex justify-between items-center text-[11px] sm:text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-cta-gold" />
          <span className="font-bold tracking-wide">
            PORTAL RESMI SATUAN PENDIDIKAN
          </span>
          <span className="hidden sm:inline">&bull; NPSN: 20104829</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-primary-container px-2 py-1 rounded-full border border-secondary/50">
            <div className="w-1.5 h-1.5 bg-cta-gold rounded-full animate-pulse"></div>
            <span>Server Aman SIS v4.2</span>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 hover:text-cta-gold transition-colors">
            <Lock size={12} />
            <span>Bantuan Operator</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-headline-md font-bold text-primary mb-2">
            Portal Admin & CMS
          </h1>
          <p className="text-text-muted">
            SMA Harapan Jaya - Publikasi & Tata Kelola Digital
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-white rounded-2xl shadow-xl w-full max-w-[480px] border border-border-muted/50 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary text-cta-gold rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">
                  Masuk ke Dashboard CMS
                </h2>
                <p className="text-[11px] sm:text-xs text-text-muted mt-0.5">
                  Gunakan kredensial resmi staf IT / Administrator sekolah
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-6 text-sm text-center font-medium border border-error/20">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-primary mb-1.5">
                  Email Pengguna / NIP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-11 pr-10 py-3 bg-surface-white border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all text-primary"
                    placeholder="admin.it@smaharapanjaya.sch.id"
                  />
                  {username && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-primary">
                    Kata Sandi
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary-container/30 text-secondary-dark rounded text-green-700">
                    Otentikasi 2FA Aktif
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-24 py-3 bg-surface-white border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all text-primary"
                    placeholder="SandiRahasia2026!"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-text-muted hover:text-primary transition-colors gap-1.5"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showPassword ? "Sembunyikan" : "Tampilkan"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border-muted text-secondary focus:ring-secondary cursor-pointer"
                  />
                  <span className="text-xs text-text-muted group-hover:text-primary transition-colors">
                    Ingat sesi saya di perangkat ini
                  </span>
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-secondary hover:text-secondary-dark transition-colors"
                >
                  Lupa kata sandi? Hubungi Tim IT
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-primary bg-cta-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
              >
                <span>{isLoading ? "Memproses..." : "Masuk Dashboard"}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-surface-container flex gap-3 items-start">
              <ShieldCheck
                size={18}
                className="text-secondary mt-0.5 flex-shrink-0"
              />
              <p className="text-[11px] leading-relaxed text-text-muted">
                Akses terbatas hanya untuk Kepala Sekolah, Tim Redaksi
                Publikasi, serta Tenaga Administrasi Terdaftar. Semua aktivitas
                login tercatat pada audit log.
              </p>
            </div>
          </div>

          <div className="bg-surface-light border-t border-border-muted p-4 flex justify-between items-center text-[10px] sm:text-[11px] text-text-muted font-medium">
            <div className="flex items-center gap-1.5">
              <Lock size={12} />
              <span>Enkripsi SSL 256-bit terverifikasi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-text-muted rounded-full"></span>
              <span>Khusus Operator Resmi BAN-S/M</span>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 flex items-center gap-2 text-secondary font-bold text-sm hover:text-secondary-dark transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Halaman Publik Sekolah</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-border-muted py-4 px-6 text-[10px] sm:text-[11px] flex justify-between text-text-muted">
        <p>
          &copy; 2026 SMA Harapan Jaya. Hak Cipta Dilindungi Undang-Undang.
          Terakreditasi Unggul (A) BAN-S/M. Sekolah Adiwiyata Mandiri.
        </p>
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">
            Visi Unggul & Adiwiyata
          </span>
          <span className="w-1 h-1 bg-text-muted rounded-full"></span>
          <span className="font-bold text-secondary">
            Biro Teknologi Informasi
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;

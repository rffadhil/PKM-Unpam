import {
  Users,
  Newspaper,
  CalendarDays,
  Mail,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="bg-surface-white p-6 rounded-xl shadow-sm border border-border-muted flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-primary">{value}</h3>
      </div>
      <div className="p-3 rounded-lg bg-primary-container/5 text-secondary">
        <Icon size={24} />
      </div>
    </div>

    <div
      className={`flex items-center gap-1.5 text-xs font-medium ${trendUp ? "text-secondary" : "text-error"}`}
    >
      <TrendingUp size={14} className={trendUp ? "" : "rotate-180"} />
      <span>{trend}</span>
      <span className="text-text-muted font-normal ml-1">dari bulan lalu</span>
    </div>
  </div>
);

const ActivityItem = ({ title, time, type }) => {
  const isPositive = type === "success";
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${isPositive ? "bg-secondary/10 text-secondary" : "bg-primary-container/10 text-primary-container"}`}
        >
          {isPositive ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        </div>
        <div className="w-px h-full bg-border-muted my-1"></div>
      </div>
      <div className="pb-6">
        <p className="text-sm font-semibold text-primary">{title}</p>
        <p className="text-xs text-text-muted mt-1">{time}</p>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  // Dummy data for dashboard stats
  const stats = [
    {
      title: "Total Guru & Staf",
      value: "42",
      icon: Users,
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Berita Aktif",
      value: "24",
      icon: Newspaper,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Agenda Mendatang",
      value: "5",
      icon: CalendarDays,
      trend: "+1",
      trendUp: true,
    },
    {
      title: "Pesan Belum Dibaca",
      value: "12",
      icon: Mail,
      trend: "-3",
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-6 font-body-sm max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Ringkasan data dan aktivitas harian SMA Harapan Jaya
          </p>
        </div>
        <button className="bg-cta-gold hover:bg-yellow-400 text-primary font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm">
          <Download size={18} />
          <span>Tarik Laporan</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section (Left - 2 Cols) */}
        <div className="lg:col-span-2 bg-surface-white p-6 rounded-xl shadow-sm border border-border-muted flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-primary">
              Statistik Pengunjung Website
            </h2>
            <select className="text-sm border border-border-muted rounded-md px-2 py-1 text-text-muted bg-surface-light focus:outline-none focus:border-secondary">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>Tahun Ini</option>
            </select>
          </div>

          {/* Fake Chart Area */}
          <div className="flex-1 min-h-[300px] bg-surface-light rounded-lg border border-dashed border-border-muted flex items-center justify-center relative overflow-hidden">
            {/* Decorative background grid */}
            <div className="absolute inset-0 custom-pattern opacity-50"></div>

            <div className="text-center z-10 p-4">
              <TrendingUp
                size={48}
                className="mx-auto text-border-muted mb-3"
              />
              <p className="text-text-muted font-medium">
                Area Visualisasi Grafik
              </p>
              <p className="text-xs text-text-muted mt-1">
                (Gunakan library seperti Recharts atau Chart.js nanti)
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed (Right - 1 Col) */}
        <div className="bg-surface-white p-6 rounded-xl shadow-sm border border-border-muted">
          <h2 className="text-lg font-bold text-primary mb-6">
            Aktivitas Terakhir
          </h2>

          <div className="space-y-0">
            <ActivityItem
              title="Berita baru dipublikasikan: 'Penerimaan Siswa Baru...'"
              time="Hari ini, 10:45 WIB"
              type="success"
            />
            <ActivityItem
              title="Pesan baru diterima dari 'Budi Santoso'"
              time="Hari ini, 09:12 WIB"
              type="info"
            />
            <ActivityItem
              title="Jadwal agenda 'Ujian Tengah Semester' diperbarui"
              time="Kemarin, 15:30 WIB"
              type="success"
            />
            <ActivityItem
              title="Galeri foto ditambahkan (5 foto baru)"
              time="Kemarin, 11:20 WIB"
              type="success"
            />
            <ActivityItem
              title="Profil staf 'Ibu Ani' telah diupdate"
              time="12 Mei 2026, 08:00 WIB"
              type="info"
            />
          </div>

          <Link
            to="/admin/berita"
            className="block text-center w-full py-2 mt-4 text-sm font-bold text-secondary bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
          >
            Lihat Semua Aktivitas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

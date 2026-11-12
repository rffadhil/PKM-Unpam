
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusCircle,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Newspaper,
  CalendarDays,
  Mail,
  Images,
  Clock,
  MapPin,
  Video,
  Reply,
  ArrowRight,
  ChevronRight,
  HardDrive,
} from 'lucide-react'
import TrendChart from '@/components/admin/TrendChart'
import { currentUser } from '@/mocks/dashboard'
import { getDashboard } from '@/services/dashboardService'

const rupiahAngka = (n) => new Intl.NumberFormat('id-ID').format(n)

const tanggalPanjang = (iso) =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))

function Panel({ className = '', children }) {
  return (
    <section
      className={`rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm ${className}`}
    >
      {children}
    </section>
  )
}

function PanelHeader({
  icon: Icon,
  judul,
  badge,
  badgeClass = 'bg-secondary-container/30 text-secondary',
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border-muted pb-4">
      <Icon size={24} className="shrink-0 text-secondary" />
      <h2 className="flex-1 text-lg font-medium leading-snug text-on-surface">
        {judul}
      </h2>
      {badge && (
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}>
          {badge}
        </span>
      )}
    </div>
  )
}

function StatCard({ label, icon: Icon, iconClass, children }) {
  return (
    <div className="rounded-2xl border border-border-muted bg-surface-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-text-muted">{label}</p>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${iconClass}`}>
          <Icon size={22} />
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

const aktivitasStyle = {
  berita: {
    icon: Newspaper,
    cls: 'bg-green-100 text-green-700',
    sorot: 'text-secondary',
  },
  agenda: {
    icon: CalendarDays,
    cls: 'bg-blue-100 text-blue-700',
    sorot: 'text-blue-800',
  },
  pesan: {
    icon: Mail,
    cls: 'bg-red-100 text-red-600',
    sorot: 'text-primary',
  },
  galeri: {
    icon: Images,
    cls: 'bg-amber-100 text-amber-600',
    sorot: 'text-primary',
  },
}

const agendaIcon = {
  jam: Clock,
  lokasi: MapPin,
  online: Video,
}

export default function DashboardMandiri() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let batal = false

    getDashboard()
      .then((d) => !batal && setData(d))
      .catch(
        () =>
          !batal &&
          setError(
            'Data dashboard gagal dimuat. Muat ulang halaman atau coba lagi nanti.'
          )
      )

    return () => {
      batal = true
    }
  }, [])

  if (error) {
    return (
      <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
        {error}
      </p>
    )
  }

  if (!data) {
    return <p className="text-text-muted">Memuat dashboard…</p>
  }

  const { stats, trend, agenda, pesan, aktivitas, sistem } = data
  const persenStorage = (
    (sistem.storage.terpakaiGB / sistem.storage.totalGB) *
    100
  ).toFixed(1)

  return (
    <div className="mx-auto max-w-7xl space-y-6 font-body-md">
      {/* Sambutan */}
      <Panel className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-text-muted">
              {tanggalPanjang(data.tanggal)}
            </span>
          </div>

          <h2 className="mt-3 font-headline-lg text-headline-lg-mobile text-primary">
            Selamat datang kembali, {currentUser.nama}!
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/berita"
            className="inline-flex items-center gap-2 rounded-full bg-cta-gold px-5 py-3 font-semibold text-primary hover:brightness-95"
          >
            <PlusCircle size={22} />
            Publikasi Cepat
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-secondary px-5 py-3 font-semibold text-secondary hover:bg-secondary-container/30"
          >
            Lihat Portal Publik <ExternalLink size={18} />
          </a>
        </div>
      </Panel>

      {/* Kartu statistik */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Kunjungan Web"
          icon={BarChart3}
          iconClass="bg-green-50 text-green-700"
        >
          <p className="font-headline-lg text-headline-lg text-primary">
            {rupiahAngka(stats.kunjungan.total)}
          </p>

          <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 font-semibold text-green-700">
              <TrendingUp size={16} /> +{stats.kunjungan.persen}%
            </span>
            vs bulan lalu
          </p>
        </StatCard>

        <StatCard
          label="Berita & Pengumuman"
          icon={Newspaper}
          iconClass="bg-blue-50 text-blue-700"
        >
          <p className="font-headline-lg text-headline-lg text-primary">
            {stats.berita.total}
          </p>

          <p className="mt-2 flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-green-700">
              <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
              {stats.berita.tayang} Tayang
            </span>

            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              {stats.berita.draf} Draf
            </span>
          </p>
        </StatCard>

        <StatCard
          label="Agenda Mendatang"
          icon={CalendarDays}
          iconClass="bg-violet-50 text-violet-700"
        >
          <p className="font-headline-lg text-headline-lg text-primary">
            {stats.agenda.total}{' '}
            <span className="text-lg font-normal text-text-muted">
              Acara
            </span>
          </p>

          <p className="mt-2 text-sm text-text-muted">
            <span className="rounded bg-violet-50 px-2 py-0.5 font-semibold text-violet-700">
              {stats.agenda.pekanIni} Pekan Ini
            </span>{' '}
            {stats.agenda.darurat} agenda darurat
          </p>
        </StatCard>

        <StatCard
          label="Pesan Masuk Belum Dibalas"
          icon={Mail}
          iconClass="bg-red-50 text-red-600"
        >
          <p className="font-headline-lg text-headline-lg text-red-700">
            {stats.pesan.belumDibalas}{' '}
            <span className="text-lg font-normal text-text-muted">
              Pesan Baru
            </span>
          </p>

          <p className="mt-2 text-sm text-text-muted">
            dari total {stats.pesan.total} pesan diterima
          </p>
        </StatCard>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Kolom kiri */}
        <div className="space-y-6">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-on-surface">
                  Grafik Tren Pengunjung & Pembaca Artikel 30 Hari Terakhir
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  Analitik lalu lintas web resmi SMA Harapan Jaya
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-secondary" />
                  Pengunjung
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-on-tertiary-container" />
                  Pembaca Berita
                </span>

                <select
                  aria-label="Rentang waktu"
                  className="rounded-lg border border-border-muted bg-surface-white px-3 py-1.5"
                  defaultValue="30"
                >
                  <option value="7">7 Hari Terakhir</option>
                  <option value="30">30 Hari Terakhir</option>
                </select>
              </div>
            </div>

            <div className="mt-5 border-t border-border-muted pt-8">
              <TrendChart
                pengunjung={trend.pengunjung}
                pembaca={trend.pembaca}
                labels={trend.labels}
                puncak={trend.puncak}
              />
            </div>

            <div className="mt-6 grid gap-3 border-t border-border-muted pt-5 sm:grid-cols-3">
              {[
                ['Rata-rata Harian', trend.ringkasan.rataHarian, ''],
                [
                  'Artikel Paling Dibaca',
                  trend.ringkasan.artikelTerbaik,
                  'text-secondary',
                ],
                ['Durasi Sesi Portal', trend.ringkasan.durasi, ''],
              ].map(([label, nilai, cls]) => (
                <div
                  key={label}
                  className="rounded-xl bg-surface-light px-4 py-3 text-center"
                >
                  <p className="text-sm text-text-muted">{label}</p>
                  <p className={`text-lg font-semibold text-primary ${cls}`}>
                    {nilai}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Aktivitas publikasi dan log sistem */}
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-muted pb-4">
              <div>
                <h2 className="text-lg font-medium text-on-surface">
                  Aktivitas Publikasi & Log Sistem Terkini
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  Audit jejak digital editor, staf kehumasan, dan sistem otomatis
                </p>
              </div>
            </div>

            <ul className="divide-y divide-border-muted">
              {aktivitas.map((a) => {
                const s = aktivitasStyle[a.jenis]
                const Icon = s.icon

                return (
                  <li key={a.id} className="flex gap-4 py-4">
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${s.cls}`}
                    >
                      <Icon size={22} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-semibold text-primary">
                          {a.judul}{' '}
                          <span className={s.sorot}>“{a.sorot}”</span>
                        </span>

                        <span className="text-sm text-text-muted">
                          {a.waktu}
                        </span>
                      </p>

                      <p className="mt-0.5 text-sm text-on-surface-variant">
                        {a.detail}{' '}
                        {a.status && (
                          <span
                            className={
                              a.status.tone === 'ok'
                                ? 'text-green-700'
                                : 'text-red-600'
                            }
                          >
                            {a.status.teks}
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Tombol Lihat Selengkapnya dipindahkan ke bawah daftar */}
            <Link
              to="/admin/log"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border-muted py-2.5 font-semibold text-secondary hover:bg-secondary-container/30"
            >
              Lihat Selengkapnya <ArrowRight size={18} />
            </Link>
          </Panel>
        </div>

        {/* Kolom kanan */}
        <div className="space-y-6">
          <Panel>
            <PanelHeader
              icon={CalendarDays}
              judul="Agenda Kampus Terdekat"
              badge={`${agenda.length} Acara`}
            />

            <ul className="mt-4 space-y-3">
              {agenda.map((a) => {
                const Icon = agendaIcon[a.tipe]

                return (
                  <li
                    key={a.id}
                    className="flex gap-3 rounded-xl border border-border-muted p-3"
                  >
                    <div className="w-14 shrink-0 overflow-hidden rounded-lg text-center">
                      <p className="bg-secondary py-0.5 text-xs font-bold text-white">
                        {a.bulan}
                      </p>
                      <p className="bg-primary py-1.5 font-headline-md text-headline-sm text-white">
                        {a.tanggal}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold leading-snug text-primary">
                        {a.judul}
                      </p>
                      <p className="mt-1 flex items-start gap-2 text-sm text-text-muted">
                        <Icon size={18} className="mt-0.5 shrink-0" />
                        {a.waktu ? `${a.waktu} • ${a.lokasi}` : a.lokasi}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <Link
              to="/admin/agenda"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border-muted py-2.5 font-semibold text-secondary hover:bg-secondary-container/30"
            >
              Kelola Semua Agenda <ArrowRight size={18} />
            </Link>
          </Panel>

          <Panel>
            <PanelHeader
              icon={Mail}
              judul="Pesan Masuk Belum Diproses"
              badge={`${stats.pesan.belumDibalas} Menunggu`}
              badgeClass="bg-red-100 text-red-600"
            />

            <ul className="mt-4 space-y-3">
              {pesan.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-border-muted p-4"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-primary">{p.pengirim}</p>
                    <span className="text-xs text-text-muted">{p.waktu}</span>
                  </div>

                  <p className="mt-1 text-sm italic text-text-muted">
                    “{p.isi}”
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-secondary">
                      {p.kotak}
                    </span>

                    <Link
                      to={`/admin/pesan?id=${p.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-container"
                    >
                      <Reply size={18} /> Balas
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              to="/admin/pesan"
              className="mt-4 flex items-center justify-center gap-1 py-2 font-medium text-on-surface-variant hover:text-secondary"
            >
              Buka Kotak Pesan Masuk Lengkap <ChevronRight size={18} />
            </Link>
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <HardDrive size={24} className="text-secondary" />
              <h2 className="flex-1 text-lg font-medium text-on-surface">
                Kapasitas Server & Storage
              </h2>
              <span className="font-semibold text-green-700">
                {sistem.status}
              </span>
            </div>

            <div className="mt-5">
              <div className="flex justify-between gap-3 text-sm">
                <span>Penyimpanan Media & Galeri</span>
                <span>
                  <strong>{sistem.storage.terpakaiGB} GB</strong>{' '}
                  <span className="text-text-muted">
                    / {sistem.storage.totalGB} GB ({persenStorage}%)
                  </span>
                </span>
              </div>

              <div
                className="mt-2 h-2 rounded-full bg-border-muted"
                role="progressbar"
                aria-valuenow={persenStorage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-2 rounded-full bg-secondary"
                  style={{ width: `${persenStorage}%` }}
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span>Database & Cache Kesehatan</span>
                <strong className="text-green-700">
                  {sistem.database.persenSehat}% Sehat
                </strong>
              </div>

              <div className="mt-2 h-2 rounded-full bg-border-muted">
                <div
                  className="h-2 rounded-full bg-on-tertiary-container"
                  style={{
                    width: `${sistem.database.persenSehat}%`,
                  }}
                />
              </div>
            </div>

            <dl className="mt-5 space-y-1.5 rounded-xl bg-surface-light p-4 text-sm">
              {sistem.info.map((i) => (
                <div key={i.label} className="flex justify-between gap-3">
                  <dt className="text-text-muted">{i.label}</dt>
                  <dd
                    className={
                      i.hijau
                        ? 'font-medium text-green-700'
                        : 'font-medium text-on-surface'
                    }
                  >
                    {i.nilai}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  )
}

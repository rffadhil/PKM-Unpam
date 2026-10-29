import { useState } from 'react'
import KartuStatistik from '@/components/admin/dashboard/KartuStatistik'
import SambutanAdmin from '@/components/admin/dashboard/SambutanAdmin'
import GrafikKunjungan from '@/components/admin/dashboard/GrafikKunjungan'
import AktivitasTerkini from '@/components/admin/dashboard/AktivitasTerkini'
import AgendaTerdekat from '@/components/admin/dashboard/AgendaTerdekat'
import PesanBelumDiproses from '@/components/admin/dashboard/PesanBelumDiproses'
import Icon from '@/components/ui/Icon'
import { adminUser } from '@/mocks/admin'
import { useDaftarBerita } from '@/hooks/useBerita'
import {
  statusPortal,
  hitungRingkasanBerita,
  ringkasanLain,
  rentangGrafik,
  agendaTerdekat,
  pesanTerbaru,
  aktivitasTerkini,
} from '@/mocks/adminDashboard'
import { formatAngka } from '@/utils/angka'

// Overview CMS. TODO: ganti mocks dengan satu endpoint ringkasan (mis. GET /api/admin/ringkasan).
export default function DashboardPage() {
  const [hariIni] = useState(() => new Date())
  const { data: artikel } = useDaftarBerita()
  const berita = artikel ? hitungRingkasanBerita(artikel) : null
  const { kunjungan, agenda, pesan } = ringkasanLain

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <SambutanAdmin nama={adminUser.namaSingkat} status={statusPortal} tanggal={hariIni} />

      <section aria-label="Ringkasan statistik" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KartuStatistik
          label="Total Kunjungan Web"
          ikon="monitoring"
          ikonClass="bg-emerald-50 text-secondary"
          nilai={formatAngka(kunjungan.total)}
        >
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center text-xs font-label-sm font-bold text-secondary bg-emerald-50 px-1.5 py-0.5 rounded">
              <Icon name="trending_up" className="text-xs mr-0.5" />
              {kunjungan.perubahan}
            </span>
            <span className="text-[11px] font-body-sm text-text-muted">{kunjungan.pembanding}</span>
          </div>
        </KartuStatistik>

        <KartuStatistik label="Berita & Pengumuman" ikon="article" ikonClass="bg-blue-50 text-blue-700" nilai={berita ? berita.total : '–'}>
          <span className="text-xs font-body-sm text-text-muted">
            {berita ? 'artikel & pengumuman dipublikasikan' : 'Memuat data…'}
          </span>
        </KartuStatistik>

        <KartuStatistik
          label="Agenda Mendatang"
          ikon="event_note"
          ikonClass="bg-purple-50 text-purple-700"
          nilai={agenda.total}
          satuan="Acara"
        >
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center text-xs font-label-sm font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              {agenda.pekanIni} Pekan Ini
            </span>
            <span className="text-[11px] font-body-sm text-text-muted">{agenda.darurat} agenda darurat</span>
          </div>
        </KartuStatistik>

        <KartuStatistik
          label="Pesan Masuk Belum Dibalas"
          ikon="mark_email_unread"
          ikonClass="bg-red-50 text-error"
          nilai={pesan.belumDibalas}
          nilaiClass="text-error"
          satuan="Pesan Baru"
        >
          <span className="text-xs font-body-sm text-text-muted">dari total {pesan.totalDiterima} pesan diterima</span>
        </KartuStatistik>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <GrafikKunjungan rentang={rentangGrafik} />
          <AktivitasTerkini items={aktivitasTerkini} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <AgendaTerdekat items={agendaTerdekat} />
          <PesanBelumDiproses items={pesanTerbaru} jumlah={pesan.belumDibalas} />
        </div>
      </div>
    </div>
  )
}

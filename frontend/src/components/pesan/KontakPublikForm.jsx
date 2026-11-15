
import Icon from '@/components/ui/Icon'
import KolomKontak from '@/components/pesan/KolomKontak'
import FieldKontak from '@/components/pesan/FieldKontak'
import { urlValid } from '@/utils/tiket'

// Konfigurasi jadwal pelayanan PTSP dan lokasi kampus.
export default function KontakPublikForm({
  nilai,
  error,
  berubah,
  onUbah,
  onSimpan,
}) {
  const ubah = (kunci) => (v) => onUbah(kunci, v)

  const peta = String(nilai.peta || '').trim()
  const tautanPeta = peta && urlValid(peta) ? peta : ''

  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 border-b border-border-muted pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary md:text-2xl">
            Konfigurasi Jadwal Pelayanan PTSP &amp; Lokasi Kampus
          </h2>

          <p className="mt-1 text-body-sm text-text-muted">
            Atur jadwal pelayanan dan informasi lokasi kampus. Nomor telepon,
            WhatsApp PPDB, dan email resmi dikelola melalui menu Kontak Resmi
            &amp; Footer Publik.
          </p>
        </div>

        <button
          type="button"
          onClick={onSimpan}
          disabled={!berubah}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="save" className="text-[20px]" />
          Simpan Pengaturan PTSP
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Jadwal pelayanan */}
        <KolomKontak
          ikon="schedule"
          judul="Jam Operasional Layanan PTSP Kampus"
        >
          <FieldKontak
            id="kontak-jam-senkam"
            label="Senin - Kamis (Layanan Tatap Muka):"
            nilai={nilai.jamSenKam}
            onUbah={ubah('jamSenKam')}
            error={error.jamSenKam}
          />

          <FieldKontak
            id="kontak-jam-jumat"
            label="Jumat (Layanan Terbatas):"
            nilai={nilai.jamJumat}
            onUbah={ubah('jamJumat')}
            error={error.jamJumat}
          />
        </KolomKontak>

        {/* Lokasi kampus */}
        <KolomKontak
          ikon="location_on"
          judul="Lokasi Kampus & Tautan Peta Interaktif"
        >
          <FieldKontak
            id="kontak-alamat"
            label="Alamat Resmi Kampus Utama:"
            nilai={nilai.alamat}
            onUbah={ubah('alamat')}
            error={error.alamat}
          />

          <FieldKontak
            id="kontak-peta"
            label="Integrasi Tautan Google Maps Terverifikasi:"
            nilai={nilai.peta}
            onUbah={ubah('peta')}
            error={error.peta}
            mono
            tautan={tautanPeta}
          />
        </KolomKontak>
      </div>
    </section>
  )
}

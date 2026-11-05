import Icon from '@/components/ui/Icon'
import KolomKontak from '@/components/pesan/KolomKontak'
import FieldKontak from '@/components/pesan/FieldKontak'
import { urlValid } from '@/utils/tiket'

// Konfigurasi saluran kontak publik & jadwal pelayanan PTSP (disinkronkan ke halaman Kontak dan footer).
export default function KontakPublikForm({ nilai, error, berubah, onUbah, onSimpan }) {
  const ubah = (kunci) => (v) => onUbah(kunci, v)
  const tautanPeta = nilai.peta.trim() && urlValid(nilai.peta.trim()) ? nilai.peta.trim() : ''

  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 border-b border-border-muted pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary md:text-2xl">Konfigurasi Saluran Kontak Publik &amp; Jadwal Pelayanan PTSP</h2>
          <p className="mt-1 text-body-sm text-text-muted">
            Data berikut disinkronkan secara langsung dengan Halaman Kontak Publik &amp; Footer Portal Resmi SMA Harapan Jaya
          </p>
        </div>
        <button
          type="button"
          onClick={onSimpan}
          disabled={!berubah}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="save" className="text-[20px]" />
          Simpan Perubahan Kontak
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <KolomKontak ikon="call" judul="Nomor Kontak & WhatsApp Gateway">
          <FieldKontak id="kontak-whatsapp" label="Layanan WhatsApp Posko PPDB 2026/2027:" nilai={nilai.whatsapp} onUbah={ubah('whatsapp')} error={error.whatsapp} mono />
          <FieldKontak id="kontak-telepon" label="Hotline Kantor Tata Usaha / Telepon:" nilai={nilai.telepon} onUbah={ubah('telepon')} error={error.telepon} mono />
        </KolomKontak>

        <KolomKontak ikon="schedule" judul="Jam Operasional Layanan PTSP Kampus">
          <FieldKontak id="kontak-jam-senkam" label="Senin - Kamis (Layanan Tatap Muka):" nilai={nilai.jamSenKam} onUbah={ubah('jamSenKam')} error={error.jamSenKam} />
          <FieldKontak id="kontak-jam-jumat" label="Jumat (Layanan Terbatas):" nilai={nilai.jamJumat} onUbah={ubah('jamJumat')} error={error.jamJumat} />
        </KolomKontak>

        <KolomKontak ikon="location_on" judul="Lokasi Kampus & Tautan Peta Interaktif">
          <FieldKontak id="kontak-alamat" label="Alamat Resmi Kampus Utama:" nilai={nilai.alamat} onUbah={ubah('alamat')} error={error.alamat} />
          <FieldKontak id="kontak-peta" label="Integrasi Tautan Google Maps Terverifikasi:" nilai={nilai.peta} onUbah={ubah('peta')} error={error.peta} mono tautan={tautanPeta} />
        </KolomKontak>
      </div>
    </section>
  )
}

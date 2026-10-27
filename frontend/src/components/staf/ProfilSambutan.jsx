import Icon from '@/components/ui/Icon'
import BlokTeksProfil from '@/components/staf/BlokTeksProfil'
import { BATAS_SAMBUTAN, BATAS_VISI } from '@/config/stafAdmin'

// Pembaruan cepat sambutan kepala sekolah & visi (tampil di beranda dan profil publik).
export default function ProfilSambutan({ nilai, penulis, berubah, onUbah, onSimpan }) {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-container text-cta-gold">
          <Icon name="format_quote" filled className="text-[28px]" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-primary">Pembaruan Cepat Sambutan Kepala Sekolah &amp; Visi Misi</h2>
          <p className="text-body-sm text-text-muted">
            Teks ini langsung ditayangkan pada Beranda dan Halaman Profil Publik SMA Harapan Jaya.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 border-t border-border-muted pt-6 lg:grid-cols-2">
        <BlokTeksProfil
          id="profil-sambutan"
          judul="Teks Kutipan Sambutan Kepala Sekolah"
          nilai={nilai.sambutan}
          onUbah={(v) => onUbah('sambutan', v)}
          batas={BATAS_SAMBUTAN}
          serif
          kiri={penulis ? `Penulis Terpaut: ${penulis}` : 'Penulis belum ditentukan'}
          kanan={`${nilai.sambutan.length} Karakter`}
        />
        <BlokTeksProfil
          id="profil-visi"
          judul="Visi Utama Institusi (Singkat Beranda)"
          nilai={nilai.visi}
          onUbah={(v) => onUbah('visi', v)}
          batas={BATAS_VISI}
          kiri="Kurikulum: Kurikulum Merdeka Terintegrasi"
          kanan="Tersinkronisasi ke BAN-S/M"
        />
      </div>

      <div className="mt-6 flex justify-end border-t border-border-muted pt-6">
        <button
          type="button"
          onClick={onSimpan}
          disabled={!berubah}
          className="inline-flex items-center gap-2 rounded-full bg-cta-gold px-6 py-3 text-sm font-bold text-primary shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="cloud_upload" className="text-[20px]" />
          Simpan Perubahan Profil &amp; Tayangkan
        </button>
      </div>
    </section>
  )
}

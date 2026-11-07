import BagianPengaturan from '@/components/pengaturan/BagianPengaturan'
import FieldPengaturan from '@/components/pengaturan/FieldPengaturan'

// Bagian "Kontak Resmi & Footer Publik".
export default function KontakFooterForm({ nilai, error, onUbah }) {
  const ubah = (kunci) => (e) => onUbah(kunci, e.target.value)
  return (
    <BagianPengaturan
      ikon="contact_mail"
      judul="Kontak Resmi & Footer Publik"
      subjudul="Kanal komunikasi langsung untuk orang tua murid, calon pendaftar, dan instansi dinas"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <FieldPengaturan id="set-email" ikon="mail" type="email" label="Email Resmi Institusi" value={nilai.email} onChange={ubah('email')} error={error.email} />
        <FieldPengaturan id="set-telepon" ikon="call" label="Nomor Telepon PTSP / WhatsApp Layanan" value={nilai.telepon} onChange={ubah('telepon')} error={error.telepon} />
        <FieldPengaturan id="set-kodepos" ikon="pin_drop" label="Kode Pos Wilayah" value={nilai.kodePos} onChange={ubah('kodePos')} error={error.kodePos} />
        <FieldPengaturan className="md:col-span-3" id="set-alamat" as="textarea" rows={3} label="Alamat Lengkap Kampus Sekolah" value={nilai.alamat} onChange={ubah('alamat')} error={error.alamat} />
      </div>
    </BagianPengaturan>
  )
}

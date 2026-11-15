
import BagianPengaturan from './BagianPengaturan'
import FieldPengaturan from './FieldPengaturan'

export default function KontakFooterForm({ nilai, error, onUbah }) {
  // Mengirim nama field dan nilai input ke KelolaPengaturanPage
  const ubah = (kunci) => (e) => {
    onUbah(kunci, e.target.value)
  }

  return (
    <BagianPengaturan
      ikon="contact_mail"
      judul="Kontak Resmi & Footer Publik"
      deskripsi="Kanal komunikasi langsung untuk orang tua murid, calon pendaftar, dan instansi dinas"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Baris pertama */}
        <FieldPengaturan
          id="telepon"
          label="Nomor Telepon Kantor Sekolah"
          name="telepon"
          value={nilai.telepon ?? ''}
          error={error.telepon}
          onChange={ubah('telepon')}
          placeholder="Contoh: 02187654321"
        />

        <FieldPengaturan
          id="whatsapp"
          label="WhatsApp PPDB"
          name="whatsapp"
          value={nilai.whatsapp ?? ''}
          error={error.whatsapp}
          onChange={ubah('whatsapp')}
          placeholder="Contoh: 6281234567890"
        />

        <FieldPengaturan
          id="email"
          label="Email Resmi Institusi"
          name="email"
          value={nilai.email ?? ''}
          error={error.email}
          onChange={ubah('email')}
          placeholder="Contoh: info@sekolah.sch.id"
        />

        <div className="md:col-span-3">
          <FieldPengaturan
            id="alamat"
            label="Alamat Lengkap Kampus Sekolah"
            name="alamat"
            value={nilai.alamat ?? ''}
            error={error.alamat}
            onChange={ubah('alamat')}
            placeholder="Masukkan alamat lengkap sekolah"
          />
        </div>

      </div>
    </BagianPengaturan>
  )
}

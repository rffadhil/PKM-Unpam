import { useState } from 'react'
import ModalDialog from '@/components/ui/ModalDialog'
import Icon from '@/components/ui/Icon'
import KategoriChip from '@/components/pesan/KategoriChip'
import { GAYA_INPUT, STATUS_TIKET } from '@/config/pesanAdmin'
import { formatWaktuMasuk, linkEmail, linkWhatsApp } from '@/utils/tiket'

const tombolBalas =
  'inline-flex items-center gap-1.5 rounded-lg border border-border-muted bg-surface-white px-3.5 py-2 text-sm font-semibold text-primary hover:bg-surface-light'

// Peninjauan satu tiket: isi pesan lengkap, ubah status, catatan internal, jalur balasan.
export default function TinjauTiketModal({ tiket, onSimpan, onTutup }) {
  const [status, setStatus] = useState(tiket.status)
  const [catatan, setCatatan] = useState(tiket.catatan ?? '')
  const waktu = formatWaktuMasuk(tiket.diterima)
  const wa = linkWhatsApp(tiket.telepon)

  return (
    <ModalDialog
      judul="Tinjau Tiket"
      lebar="max-w-2xl"
      onTutup={onTutup}
      footer={
        <>
          {!tiket.anonim && tiket.email && (
            <a href={linkEmail(tiket)} className={tombolBalas}>
              <Icon name="mail" className="text-[18px]" />
              Balas via Email
            </a>
          )}
          {!tiket.anonim && wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={tombolBalas}>
              <Icon name="chat" className="text-[18px]" />
              WhatsApp
            </a>
          )}
          <button type="button" onClick={onTutup} className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container">
            Tutup
          </button>
          <button
            type="button"
            onClick={() => onSimpan({ ...tiket, status, catatan: catatan.trim() })}
            className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95"
          >
            Simpan Tindak Lanjut
          </button>
        </>
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {tiket.anonim ? (
            <p className="inline-flex items-center gap-1.5 text-lg font-bold text-indigo-800">
              <Icon name="lock" className="text-[20px]" />
              Anonim Terproteksi
            </p>
          ) : (
            <p className="text-lg font-bold text-primary">{tiket.nama}</p>
          )}
          <p className="text-body-sm text-text-muted">
            {tiket.anonim ? 'Identitas pelapor dirahasiakan. Tidak ada jalur balasan langsung.' : [tiket.instansi, tiket.email, tiket.telepon].filter(Boolean).join(' · ')}
          </p>
        </div>
        <KategoriChip kunci={tiket.kategori} />
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {waktu.tanggal}, {waktu.jam}
        </p>
        <h3 className="mt-1 text-base font-bold text-primary">{tiket.subjek}</h3>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-border-muted bg-surface-light/60 p-4 text-body-md leading-relaxed text-on-surface">
          {tiket.pesan}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="tiket-status" className="mb-1.5 block text-sm font-semibold text-primary">Status</label>
          <select id="tiket-status" value={status} onChange={(e) => setStatus(e.target.value)} className={GAYA_INPUT}>
            {Object.entries(STATUS_TIKET).map(([nilai, s]) => <option key={nilai} value={nilai}>{s.label}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="tiket-catatan" className="mb-1.5 block text-sm font-semibold text-primary">Catatan internal</label>
          <textarea
            id="tiket-catatan"
            rows={3}
            maxLength={300}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Diteruskan ke Wakasek Kesiswaan"
            className={GAYA_INPUT}
          />
        </div>
      </div>
    </ModalDialog>
  )
}

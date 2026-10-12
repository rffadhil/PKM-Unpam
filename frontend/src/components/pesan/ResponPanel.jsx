import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { KANAL, STATUS_PESAN, TEMPLATE_RESPON } from '@/config/pesan'
import { formatWaktuMasuk, isiTemplate } from '@/utils/pesan'

// Panel kanan: detail tiket aktif + form tanggapan.
// `draf` = { templateId, teks, surel, wa }. Pengiriman email/WhatsApp butuh backend (lihat TODO di halaman).
export default function ResponPanel({ tiket, draf, onDraf, onKirim, onSimpanDraf, onTeruskan, onBukaKembali }) {
  const [error, setError] = useState('')

  if (!tiket) {
    return (
      <aside className="rounded-2xl border border-dashed border-border-muted bg-surface-white p-10 text-center text-text-muted">
        <Icon name="mark_email_unread" className="text-[40px]" />
        <p className="mt-2 font-semibold text-primary">Belum ada tiket dipilih</p>
        <p className="text-sm">Pilih tiket pada daftar untuk membaca dan menanggapinya.</p>
      </aside>
    )
  }

  const st = STATUS_PESAN[tiket.status]
  const w = formatWaktuMasuk(tiket.waktuMasuk)
  const selesai = tiket.status === 'selesai'
  const kotak = 'rounded-xl border border-border-muted bg-surface-white p-3'

  function ubahTemplate(id) {
    onDraf({ templateId: id, teks: isiTemplate(id, tiket) })
  }
  function kirim() {
    setError(onKirim() ?? '')
  }

  return (
    <aside className="overflow-hidden rounded-2xl border-2 border-primary bg-surface-white shadow-sm lg:sticky lg:top-0">
      <div className="flex items-start justify-between gap-3 bg-primary p-5 text-white">
        <div className="flex items-start gap-3">
          <Icon name="mark_email_read" className="mt-0.5 text-[26px] text-cta-gold" />
          <div>
            <h2 className="text-headline-sm font-bold leading-snug">Form Respon Cepat PTSP</h2>
            <p className="text-sm text-tertiary-fixed-dim">Tiket Aktif: #{tiket.nomor}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-bold ${st.badge}`}>{st.label}</span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-text-muted">Nama Pemohon / Pengirim:</p>
            <p className="text-lg font-bold text-primary">{tiket.anonim ? 'Anonim Terproteksi' : tiket.pengirim}</p>
          </div>
          <p className="text-right font-mono text-xs text-text-muted">{w.jam} ({w.tanggal})</p>
        </div>
        {tiket.ditugaskanKe && (
          <p className="flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-2 text-sm text-on-surface-variant">
            <Icon name="forward_to_inbox" className="text-[18px]" /> Ditugaskan ke: <strong>{tiket.ditugaskanKe}</strong>
          </p>
        )}

        {tiket.anonim ? (
          <p className="flex items-start gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800">
            <Icon name="lock" className="mt-0.5 text-[18px]" /> Identitas pelapor dirahasiakan. Tanggapan hanya dapat dikirim lewat kanal WBS terenkripsi.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={kotak}><p className="text-xs text-text-muted">Email:</p><p className="break-all font-medium text-primary">{tiket.email || '-'}</p></div>
            <div className={kotak}><p className="text-xs text-text-muted">No. WhatsApp:</p><p className="font-medium text-primary">{tiket.whatsapp || '-'}</p></div>
          </div>
        )}

        <div className="rounded-xl border border-border-muted bg-surface-light/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Isi Pesan / Kebutuhan:</p>
          <p className="mt-2 italic text-primary">“{tiket.isi}”</p>
        </div>

        {selesai ? (
          <div className="rounded-xl bg-secondary-container/40 p-4 text-sm text-secondary-dark">
            <p className="font-bold">Tiket ini sudah selesai.</p>
            {tiket.balasan && <p className="mt-2 whitespace-pre-line text-on-surface-variant">{tiket.balasan.teks}</p>}
            <button onClick={onBukaKembali} className="mt-3 font-semibold text-secondary hover:underline">Buka kembali tiket</button>
          </div>
        ) : (
          <>
            <div className="border-t border-border-muted pt-4">
              <label htmlFor="template" className="mb-1.5 block text-sm font-bold text-primary">Pilih Draf Template Resmi TU:</label>
              <select id="template" value={draf.templateId} onChange={(e) => ubahTemplate(e.target.value)} className="w-full rounded-xl border border-border-muted bg-surface-white px-3 py-2.5 text-sm text-primary focus:border-secondary focus:ring-secondary">
                {TEMPLATE_RESPON.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <p className="mt-1 text-xs text-text-muted">Mengganti template akan menimpa teks tanggapan di bawah.</p>
            </div>

            <div>
              <label htmlFor="teks-respon" className="mb-1.5 block text-sm font-bold text-primary">Teks Tanggapan Resmi:</label>
              <textarea id="teks-respon" rows={7} value={draf.teks} onChange={(e) => onDraf({ teks: e.target.value })} className="w-full rounded-xl border border-border-muted bg-surface-white p-3 text-primary focus:border-secondary focus:ring-secondary" />
            </div>

            {!tiket.anonim && (
              <fieldset className="rounded-xl border border-border-muted bg-surface-light/60 p-4">
                <legend className="px-1 text-sm font-bold text-primary">Kirim Tanggapan Melalui:</legend>
                {[['surel', tiket.email], ['wa', tiket.whatsapp]].map(([k, ada]) => (
                  <label key={k} className={`mt-2 flex items-start gap-2.5 text-sm ${ada ? 'cursor-pointer' : 'opacity-60'}`}>
                    <input type="checkbox" checked={draf[k] && Boolean(ada)} disabled={!ada} onChange={(e) => onDraf({ [k]: e.target.checked })} className="mt-0.5 h-5 w-5 rounded border-border-muted text-primary focus:ring-secondary" />
                    <span>{KANAL[k].label} ({KANAL[k].detail}){!ada && <em className="block text-xs">Pengirim tidak mencantumkan kontak ini.</em>}</span>
                  </label>
                ))}
              </fieldset>
            )}

            {error && <p role="alert" className="rounded-xl bg-error-container px-3 py-2 text-sm text-on-error-container">{error}</p>}

            <button onClick={kirim} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta-gold py-3 font-bold text-primary shadow-sm hover:brightness-95">
              <Icon name="send" className="text-[20px]" /> {tiket.anonim ? 'Kirim via Kanal WBS & Tandai Selesai' : 'Kirim Tanggapan & Tandai Selesai'}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onSimpanDraf} className="rounded-xl border border-border-muted px-3 py-2.5 text-sm font-semibold text-primary hover:bg-surface-light">Simpan Draf Respon</button>
              <button onClick={onTeruskan} className="rounded-xl border border-border-muted px-3 py-2.5 text-sm font-semibold text-primary hover:bg-surface-light">Teruskan ke Staf TU Lain</button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}

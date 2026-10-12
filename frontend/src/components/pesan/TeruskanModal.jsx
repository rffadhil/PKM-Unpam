import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'

export default function TeruskanModal({ tiket, petugas, onTeruskan, onTutup }) {
  const [tujuan, setTujuan] = useState(petugas[0] ?? '')

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onTutup()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onTutup])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onTutup()}>
      <div role="dialog" aria-modal="true" aria-labelledby="judul-modal-teruskan" className="w-full max-w-md rounded-2xl border border-border-muted bg-surface-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border-muted bg-surface-light/60 p-5">
          <h2 id="judul-modal-teruskan" className="text-lg font-bold text-primary">Teruskan Tiket #{tiket.nomor}</h2>
          <button onClick={onTutup} aria-label="Tutup" className="rounded-md p-1 text-text-muted hover:bg-error/10 hover:text-error"><Icon name="close" className="text-[22px]" /></button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label htmlFor="tujuan" className="mb-1.5 block text-sm font-bold text-primary">Teruskan ke staf:</label>
            <select id="tujuan" value={tujuan} onChange={(e) => setTujuan(e.target.value)} className="w-full rounded-xl border border-border-muted bg-surface-light px-4 py-2.5 text-primary focus:border-secondary focus:ring-secondary">
              {petugas.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          {tiket.anonim && <p className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">Tiket WBS: identitas pelapor tetap dirahasiakan dari penerima.</p>}
          <div className="flex justify-end gap-3">
            <button onClick={onTutup} className="rounded-xl border border-border-muted px-4 py-2 font-bold text-primary hover:bg-surface-light">Batal</button>
            <button onClick={() => onTeruskan(tujuan)} className="rounded-xl bg-cta-gold px-4 py-2 font-bold text-primary hover:brightness-95">Teruskan</button>
          </div>
        </div>
      </div>
    </div>
  )
}

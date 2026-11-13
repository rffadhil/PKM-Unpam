
import { useState, useEffect, useCallback } from 'react'
import Icon from '@/components/ui/Icon'
import Paginasi from '@/components/ui/Paginasi'
import { NADA_IKON, NADA_TEKS } from '@/config/overviewAdmin'
import { getAktivitas } from '@/services/dashboardService'

const PER_HALAMAN = 5

// Daftar aktivitas publikasi & log sistem dengan paginasi.
export default function AktivitasTerkini({
  items: itemsAwal = [],
}) {
  const [items, setItems] = useState(itemsAwal)
  const [halaman, setHalaman] = useState(1)
  const [jumlahHalaman, setJumlahHalaman] = useState(1)
  const [sedangMuat, setSedangMuat] = useState(false)

  const muatHalaman = useCallback(async (page) => {
    setSedangMuat(true)
    try {
      const res = await getAktivitas(page, PER_HALAMAN)
      setItems(res.items || [])
      setHalaman(res.halaman || page)
      setJumlahHalaman(res.jumlahHalaman || 1)
    } catch {
      // Tetap di halaman sekarang jika gagal
    } finally {
      setSedangMuat(false)
    }
  }, [])

  // Muat halaman pertama dari API saat mount
  useEffect(() => {
    muatHalaman(1)
  }, [muatHalaman])

  // Sinkron items awal dari props (dashboard awal)
  useEffect(() => {
    if (itemsAwal.length > 0 && halaman === 1) {
      setItems(itemsAwal)
    }
  }, [itemsAwal]) // eslint-disable-line react-hooks/exhaustive-deps

  const gantiHalaman = (page) => {
    if (page < 1 || page > jumlahHalaman || page === halaman) return
    muatHalaman(page)
  }

  return (
    <section
      aria-label="Aktivitas publikasi dan log sistem"
      className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm"
    >
      {/* Header aktivitas */}
      <div className="border-b border-border-muted pb-4">
        <div>
          <h2 className="text-headline-sm font-bold text-primary-container">
            Aktivitas Publikasi &amp; Log Sistem Terkini
          </h2>
          <p className="text-body-sm text-text-muted">
            Audit jejak digital editor, staf kehumasan, dan sistem otomatis
          </p>
        </div>
      </div>

      {/* Daftar aktivitas */}
      {sedangMuat ? (
        <p className="py-10 text-center text-text-muted">Memuat aktivitas...</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-text-muted">
          Belum ada aktivitas tercatat.
        </p>
      ) : (
        <ul className="divide-y divide-border-muted">
          {items.map((a) => (
            <li key={a.id} className="flex items-start gap-4 py-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  NADA_IKON[a.nada] ?? NADA_IKON.hijau
                }`}
              >
                <Icon name={a.ikon} className="text-[22px]" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-body-md text-on-surface">
                    <span className="font-bold">{a.aktor}</span>{' '}
                    {a.aksi && (
                      <span className="font-bold">{a.aksi}</span>
                    )}{' '}
                    <span
                      className={
                        NADA_TEKS[a.objekNada] ?? 'font-semibold'
                      }
                    >
                      {a.objek}
                    </span>
                  </p>

                  <span className="shrink-0 text-body-sm text-text-muted">
                    {a.waktu}
                  </span>
                </div>

                <p className="mt-0.5 text-body-sm text-text-muted">
                  {a.meta?.map((m, i) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-1.5">•</span>}
                      {m.label && `${m.label}: `}
                      <span className={NADA_TEKS[m.tone] ?? ''}>
                        {m.nilai}
                      </span>
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Paginasi */}
      {jumlahHalaman > 1 && (
        <div className="mt-4 flex justify-center">
          <Paginasi
            halaman={halaman}
            jumlahHalaman={jumlahHalaman}
            onHalaman={gantiHalaman}
            label="Halaman aktivitas"
          />
        </div>
      )}
    </section>
  )
}

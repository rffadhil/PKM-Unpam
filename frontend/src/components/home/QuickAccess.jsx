import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useOutletContext } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import ModalDokumen from '@/components/dokumen/ModalDokumen'

const KELAS_KARTU =
  'bg-surface-white rounded-xl border border-secondary/20 border-l-4 border-l-secondary p-5 shadow-[0_10px_28px_-12px_rgba(2,35,0,0.18)] hover:shadow-[0_16px_32px_-12px_rgba(2,35,0,0.25)] hover:border-secondary/45 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between text-left w-full'

function IsiKartu({ item }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="w-11 h-11 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center transition-colors duration-200 group-hover:bg-primary-container group-hover:text-cta-gold">
          <Icon name={item.ikon} className="text-[22px]" />
        </div>
        <span className="w-8 h-8 rounded-full bg-surface-light border border-border-muted flex items-center justify-center text-text-muted group-hover:bg-secondary-container group-hover:text-primary group-hover:border-secondary/30 transition-colors duration-200">
          <Icon
            name="arrow_forward"
            className="text-[16px] group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </span>
      </div>

      <div className="mt-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-primary group-hover:text-secondary transition-colors">
          {item.judul}
        </h3>
        <p className="font-body-sm text-body-sm text-text-muted mt-1.5 leading-relaxed">
          {item.deskripsi}
        </p>
      </div>
    </>
  )
}

// Kotak dokumen dikenali dari `aksi: 'dokumen'` atau id 'unduh'.
const bukaModalDokumen = (item) => item.aksi === 'dokumen' || item.id === 'unduh'

export default function QuickAccess({ items }) {
  const [dokumenOpen, setDokumenOpen] = useState(false)
  const { portal, bukaModalPpdb } = useOutletContext() || {}
  const isPpdbAktif =
    portal?.ppdb !== false &&
    portal?.ppdb_online_aktif !== false &&
    portal?.ppdb !== "false" &&
    portal?.ppdb_online_aktif !== "false";

  const handleKlikPpdb = () => {
    if (bukaModalPpdb) {
      bukaModalPpdb()
    } else {
      window.dispatchEvent(new CustomEvent('buka_modal_ppdb'))
    }
  }

  return (
    <section
      aria-label="Akses Cepat Layanan"
      className="max-w-7xl mx-auto px-4 lg:px-8 -mt-8 relative z-20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => {
          if (bukaModalDokumen(item)) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDokumenOpen(true)}
                aria-haspopup="dialog"
                className={KELAS_KARTU}
              >
                <IsiKartu item={item} />
              </button>
            )
          }

          if ((item.id === 'ppdb' || item.to === '/ppdb') && !isPpdbAktif) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={handleKlikPpdb}
                className={KELAS_KARTU}
              >
                <IsiKartu item={item} />
              </button>
            )
          }

          return (
            <Link key={item.id} to={item.to} className={KELAS_KARTU}>
              <IsiKartu item={item} />
            </Link>
          )
        })}
      </div>

      {dokumenOpen &&
        createPortal(
          <div style={{ position: 'relative', zIndex: 2000 }}>
            <ModalDokumen onTutup={() => setDokumenOpen(false)} />
          </div>,
          document.body,
        )}
    </section>
  )
}
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import ModalDokumen from '@/components/dokumen/ModalDokumen'

const TONE_IKON = {
  gold: 'bg-cta-gold/20 text-primary-container group-hover:bg-cta-gold',
  leaf: 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white',
  forest: 'bg-primary-container/10 text-primary-container group-hover:bg-primary-container group-hover:text-white',
  mint: 'bg-secondary-container text-on-secondary-container group-hover:bg-secondary group-hover:text-white',
}

const KELAS_KARTU =
  'bg-surface-white p-5 rounded-xl border border-border-muted shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between text-left w-full'

function IsiKartu({ item }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${TONE_IKON[item.tone]}`}>
          <Icon name={item.ikon} className="text-2xl" />
        </div>
        <Icon
          name="arrow_forward"
          className="text-text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all"
        />
      </div>
      <div className="mt-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-primary group-hover:text-secondary transition-colors">
          {item.judul}
        </h3>
        <p className="font-body-sm text-body-sm text-text-muted mt-1">{item.deskripsi}</p>
      </div>
    </>
  )
}

// Kotak dokumen dikenali dari `aksi: 'dokumen'` atau id 'unduh'.
const bukaModalDokumen = (item) => item.aksi === 'dokumen' || item.id === 'unduh'

export default function QuickAccess({ items }) {
  const [dokumenOpen, setDokumenOpen] = useState(false)

  return (
    <section
      aria-label="Akses Cepat Layanan"
      className="max-w-7xl mx-auto px-4 lg:px-8 -mt-8 relative z-20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) =>
          bukaModalDokumen(item) ? (
            <button
              key={item.id}
              type="button"
              onClick={() => setDokumenOpen(true)}
              aria-haspopup="dialog"
              className={KELAS_KARTU}
            >
              <IsiKartu item={item} />
            </button>
          ) : (
            <Link key={item.id} to={item.to} className={KELAS_KARTU}>
              <IsiKartu item={item} />
            </Link>
          ),
        )}
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
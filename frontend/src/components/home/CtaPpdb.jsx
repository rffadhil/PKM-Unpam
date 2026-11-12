import { Link, useOutletContext } from 'react-router-dom'

// Sesuai desain: satu tombol utama.
export default function CtaPpdb({ data }) {
  const { portal, bukaModalPpdb } = useOutletContext() || {};
  const isPpdbAktif =
    portal?.ppdb !== false &&
    portal?.ppdb_online_aktif !== false &&
    portal?.ppdb !== "false" &&
    portal?.ppdb_online_aktif !== "false";
  return (
    <section id="ppdb" className="py-12 bg-cta-gold scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-surface-container-lowest flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            <span className="bg-cta-gold text-primary font-bold px-3 py-1 rounded text-label-sm font-label-sm uppercase">
              {data.label}
            </span>
            <h3 className="font-headline-lg text-headline-lg font-bold text-surface-white mt-3">
              {data.judul}
            </h3>
            <p className="font-body-md text-surface-container-low mt-2">{data.deskripsi}</p>
          </div>
          <div className="shrink-0">
            {isPpdbAktif ? (
              <Link
                to="/ppdb"
                className="inline-block px-6 py-3.5 bg-cta-gold text-primary font-bold rounded-lg hover:bg-white transition-all text-center shadow-md"
              >
                {data.tombolUtama}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (bukaModalPpdb) {
                    bukaModalPpdb();
                  } else {
                    window.dispatchEvent(new CustomEvent("buka_modal_ppdb"));
                  }
                }}
                className="inline-block px-6 py-3.5 bg-cta-gold text-primary font-bold rounded-lg hover:bg-white transition-all text-center shadow-md"
              >
                {data.tombolUtama}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

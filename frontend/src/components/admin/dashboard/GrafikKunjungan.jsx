import { useId, useState } from 'react'
import { formatAngka } from '@/utils/angka'
import { petaTitik, kurvaHalus, bidangArea, batasAtas } from '@/utils/grafik'

const GARIS_BANTU = [20, 65, 110, 155]

// Grafik area dua seri (pengunjung & pembaca berita) dengan pilihan rentang waktu.
// Penanda & tooltip dibuat dengan HTML (bukan SVG) agar bulatannya tidak ikut melar.
export default function GrafikKunjungan({ rentang }) {
  const [kunci, setKunci] = useState(rentang[0].kunci)
  const idGradien = useId().replace(/:/g, '')
  const data = rentang.find((r) => r.kunci === kunci)

  const maks = batasAtas(data.pengunjung)
  const titikPengunjung = petaTitik(data.pengunjung, maks)
  const titikPembaca = petaTitik(data.pembaca, maks)

  const nilaiPuncak = Math.max(...data.pengunjung)
  const indeksPuncak = data.pengunjung.indexOf(nilaiPuncak)
  const posPuncak = titikPengunjung[indeksPuncak]
  const kiriPuncak = (posPuncak.x / 700) * 100
  const atasPuncak = (posPuncak.y / 200) * 100
  const kiriTooltip = Math.min(Math.max(kiriPuncak, 16), 84)
  const posAkhir = titikPengunjung[titikPengunjung.length - 1]

  const rataRata = Math.round(data.pengunjung.reduce((a, b) => a + b, 0) / data.pengunjung.length)

  return (
    <div className="bg-surface-white border border-border-muted rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-muted gap-3">
        <div>
          <h3 className="font-headline-sm text-base text-on-surface">
            Grafik Tren Pengunjung &amp; Pembaca Artikel {data.label}
          </h3>
          <p className="text-xs font-body-sm text-text-muted mt-0.5">
            Analitik lalu lintas web resmi SMA Harapan Jaya
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-label-sm text-text-muted">
            <span className="w-3 h-3 rounded-full bg-secondary" /> Pengunjung
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-label-sm text-text-muted">
            <span className="w-3 h-3 rounded-full bg-[#90B800]" /> Pembaca Berita
          </span>
          <select
            aria-label="Rentang waktu grafik"
            value={kunci}
            onChange={(e) => setKunci(e.target.value)}
            className="text-xs font-label-sm border border-border-muted rounded-md px-2 py-1 bg-surface-light text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            {rentang.map((r) => (
              <option key={r.kunci} value={r.kunci}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 pt-2">
        <div className="relative w-full h-56">
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 700 200"
            role="img"
            aria-label={`Grafik tren pengunjung dan pembaca berita, ${data.label}. Puncak ${formatAngka(nilaiPuncak)} pengunjung pada ${data.puncak.tanggal}.`}
          >
            <defs>
              <linearGradient id={`${idGradien}-p`} x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#266210" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#266210" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${idGradien}-b`} x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#90B800" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#90B800" stopOpacity="0" />
              </linearGradient>
            </defs>
            {GARIS_BANTU.map((y) => (
              <line key={y} stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1={y} y2={y} />
            ))}
            <line stroke="#E2E8F0" strokeWidth="1" x1="0" x2="700" y1="195" y2="195" />
            <path d={bidangArea(titikPengunjung)} fill={`url(#${idGradien}-p)`} />
            <path
              d={kurvaHalus(titikPengunjung)}
              fill="none"
              stroke="#266210"
              strokeLinecap="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <path d={bidangArea(titikPembaca)} fill={`url(#${idGradien}-b)`} />
            <path
              d={kurvaHalus(titikPembaca)}
              fill="none"
              stroke="#90B800"
              strokeDasharray="2 2"
              strokeLinecap="round"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Penanda titik puncak & titik terakhir */}
          <span
            aria-hidden="true"
            className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cta-gold border-2 border-primary-container pointer-events-none"
            style={{ left: `${kiriPuncak}%`, top: `${atasPuncak}%` }}
          />
          {indeksPuncak !== data.pengunjung.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary border-2 border-white pointer-events-none"
              style={{ left: '100%', top: `${(posAkhir.y / 200) * 100}%` }}
            />
          )}
          <div
            data-testid="tooltip-puncak"
            className="absolute -translate-x-1/2 -translate-y-[130%] whitespace-nowrap bg-primary-container text-white px-2.5 py-1 rounded-md shadow-md text-[11px] font-label-sm border border-secondary pointer-events-none"
            style={{ left: `${kiriTooltip}%`, top: `${atasPuncak}%` }}
          >
            <p className="font-bold text-cta-gold">
              {data.puncak.teks}: {formatAngka(nilaiPuncak)} Pengunjung
            </p>
            <p className="text-[10px] text-white/80">{data.puncak.tanggal}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] font-label-sm text-text-muted mt-3 px-1 gap-2">
          {data.labelX.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-muted grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-surface-light rounded-lg">
          <span className="text-[11px] font-body-sm text-text-muted block">
            {data.labelRata ?? 'Rata-rata Harian'}
          </span>
          <span className="text-sm font-headline-sm font-bold text-on-surface">
            {formatAngka(rataRata)} {data.satuanRata ?? 'Sesi'}
          </span>
        </div>
        <div className="p-2 bg-surface-light rounded-lg min-w-0">
          <span className="text-[11px] font-body-sm text-text-muted block">Artikel Paling Dibaca</span>
          <span className="text-sm font-headline-sm font-bold text-secondary truncate block">
            {data.artikelPopuler}
          </span>
        </div>
        <div className="p-2 bg-surface-light rounded-lg">
          <span className="text-[11px] font-body-sm text-text-muted block">Durasi Sesi Portal</span>
          <span className="text-sm font-headline-sm font-bold text-on-surface">{data.durasiSesi}</span>
        </div>
      </div>
    </div>
  )
}

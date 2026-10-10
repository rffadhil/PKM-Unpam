import { Headset, Shield } from 'lucide-react'

export default function LoginTopBar({ npsn, versi = 'Server Aman SIS v4.2', bantuanEmail }) {
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-primary-container px-4 py-3 text-white sm:px-6">
      <div className="flex items-center gap-3 text-sm">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-secondary/60 text-cta-gold">
          <Shield size={18} />
        </span>
        <span className="font-bold tracking-wide">PORTAL RESMI SATUAN PENDIDIKAN</span>
        <span className="hidden text-tertiary-fixed-dim sm:inline">• NPSN: {npsn}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full border border-secondary px-3 py-1 text-tertiary-fixed-dim">
          <span className="h-2 w-2 rounded-full bg-cta-gold" /> {versi}
        </span>
        <a href={`mailto:${bantuanEmail}`} className="inline-flex items-center gap-2 hover:underline">
          <Headset size={18} /> <span className="hidden sm:inline">Bantuan Operator</span>
        </a>
      </div>
    </header>
  )
}

// Pil status kepegawaian (PNS Pembina, PPPK Fungsional, ...).
export default function StatusPegawaiBadge({ label }) {
  return (
    <span className="inline-block rounded-full bg-secondary-container px-3 py-1 text-xs font-bold leading-tight text-on-secondary-fixed-variant">
      {label}
    </span>
  )
}

// Saklar "tampil di situs publik".
export default function SwitchPublik({ aktif, onUbah, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={aktif}
      aria-label={label}
      onClick={() => onUbah(!aktif)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
        aktif ? 'bg-secondary' : 'bg-border-muted'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${aktif ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

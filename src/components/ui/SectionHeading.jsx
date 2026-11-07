import clsx from 'clsx'

// Judul section dengan eyebrow kecil di atasnya.
// tone: 'light' (latar terang) | 'dark' (latar hijau tua)
export default function SectionHeading({
  eyebrow,
  title,
  tone = 'light',
  align = 'left',
  className,
}) {
  const dark = tone === 'dark'
  return (
    <div className={clsx(align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <span
          className={clsx(
            'block mb-1 font-bold text-label-sm font-label-sm uppercase tracking-wider',
            dark ? 'text-cta-gold' : 'text-secondary',
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={clsx(
          'font-headline-lg text-headline-lg font-bold',
          dark ? 'text-surface-white' : 'text-primary',
        )}
      >
        {title}
      </h2>
    </div>
  )
}

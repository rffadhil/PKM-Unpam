import DOMPurify from 'dompurify'

// Pratinjau artikel seperti tampilan di portal. HTML disanitasi dulu (cegah XSS).
export default function PratinjauArtikel({ judul, gambar, konten, kategori }) {
  return (
    <article className="px-6 py-6 min-h-[280px]" aria-label="Pratinjau artikel">
      {kategori && (
        <span className="inline-block mb-3 text-xs font-bold px-3 py-1 rounded-full bg-secondary text-surface-white">
          {kategori}
        </span>
      )}
      <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
        {judul || <span className="text-text-muted">Judul artikel</span>}
      </h1>
      {gambar && <img src={gambar} alt="" className="mt-4 w-full aspect-[16/9] object-cover rounded-xl" />}
      {konten ? (
        <div
          className="konten-artikel mt-5"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(konten) }}
        />
      ) : (
        <p className="mt-5 text-text-muted">Belum ada isi artikel.</p>
      )}
    </article>
  )
}

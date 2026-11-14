/**
 * Hero standar untuk semua halaman publik (Berita, Agenda, Galeri, Kontak, dst).
 * Ukuran, font, warna, dan jarak semuanya memakai token dari tailwind.config.js,
 * jadi cukup ubah di satu tempat ini kalau desain hero berubah.
 */
export default function PageHero({ judul, deskripsi, children }) {
  return (
    <section className="border-b border-border-muted bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg">
            {judul}
          </h1>

          {deskripsi && (
            <p className="mt-3 max-w-2xl font-body-md text-body-md text-text-muted">
              {deskripsi}
            </p>
          )}

          {children}
        </div>
      </div>
    </section>
  )
}

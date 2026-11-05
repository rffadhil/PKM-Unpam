// Halaman CMS sementara. Ganti dengan halaman asli di routes/index.jsx.
export default function AdminPlaceholderPage({ judul }) {
  return (
    <section className="bg-surface-white rounded-xl border border-border-muted shadow-sm p-10 text-center">
      <h2 className="font-headline-sm text-headline-sm font-bold text-primary">{judul}</h2>
      <p className="font-body-sm text-body-sm text-text-muted mt-2">Halaman ini sedang dikerjakan.</p>
    </section>
  )
}


import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import Icon from '@/components/ui/Icon'

// URL backend
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '')

const API_URL = `${API_BASE_URL}/api/ekstrakurikuler`

// Tiga ekskul unggulan yang tetap ditampilkan di Beranda.
const EKSKUL_UNGGULAN = [
  'Bola Basket',
  'Marching Band Gita Harapan Jaya',
  'Klub Robotika & IoT',
]

export default function Ekskul() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const muatEkstrakurikuler = async () => {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data. Status: ${response.status}`
          )
        }

        const result = await response.json()

        // Menyesuaikan format respons API.
        const data = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.data)
              ? result.data.data
              : []

        // Ambil seluruh data dengan status tayang.
        const dataTayang = data.filter((item) => {
          const status = String(item.status || '')
            .trim()
            .toLowerCase()

          return status === 'tayang'
        })

        // Pilih hanya tiga ekskul unggulan.
        // Urutannya tetap sama meskipun ada ekskul baru.
        const dataBeranda = EKSKUL_UNGGULAN
          .map((namaUnggulan) =>
            dataTayang.find(
              (item) =>
                String(item.nama || '')
                  .trim()
                  .toLowerCase() === namaUnggulan.toLowerCase()
            )
          )
          .filter(Boolean)

        setItems(dataBeranda)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(
            'Gagal memuat ekstrakurikuler:',
            err
          )

          setItems([])
          setError(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    muatEkstrakurikuler()

    return () => controller.abort()
  }, [])

  return (
    <section className="relative overflow-hidden bg-primary-container py-16 text-surface-container-lowest">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 custom-pattern opacity-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">

        {/* HEADER */}
        <div className="mx-auto mb-12 max-w-3xl">
          <SectionHeading
            tone="dark"
            align="center"
            eyebrow="Bakat, Minat & Karakter"
            title={
              <>
                <span className="block">
                  Ekstrakurikuler Unggulan
                </span>
                <span className="block">
                  SMA Harapan Jaya
                </span>
              </>
            }
          />

          <p className="mt-2 text-center font-body-md text-surface-container-low">
            Wadah siswa mengembangkan minat, bakat, dan karakter di luar kelas.
          </p>
        </div>

        {/* DAFTAR EKSTRAKURIKULER */}
        {loading ? (
          <div className="py-12 text-center text-surface-container-low">
            Memuat ekstrakurikuler...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-surface-container-low">
            Data ekstrakurikuler belum dapat dimuat.
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((e) => (
              <article
                key={e.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1.5 hover:bg-white/10"
              >
                {/* FOTO */}
                <div className="h-56 overflow-hidden">
                  {e.foto_url || e.foto || e.image_url ? (
                    <img
                      className="h-full w-full object-cover"
                      src={e.foto_url || e.foto || e.image_url}
                      alt={e.nama || 'Ekstrakurikuler'}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white/10">
                      <Icon
                        name="image"
                        className="text-5xl"
                      />
                    </div>
                  )}
                </div>

                {/* INFORMASI */}
                <div className="p-5 text-center">
                  <h3 className="font-headline-sm text-lg font-bold text-surface-white">
                    {e.nama}
                  </h3>

                  <p className="mt-1 text-body-sm text-surface-container-low/80">
                    Pembina: {e.pembina || '-'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-surface-container-low">
            Data ekskul unggulan belum tersedia.
          </div>
        )}

        {/* LINK EKSKUL LAINNYA */}
        <div className="mt-8 flex justify-end">
          <Link
            to="/profil#ekskul"
            className="inline-flex items-center gap-1 text-body-sm font-bold text-cta-gold hover:underline"
          >
            Lihat ekskul lainnya
            <Icon
              name="arrow_forward"
              className="text-[16px]"
            />
          </Link>
        </div>

      </div>
    </section>
  )
}

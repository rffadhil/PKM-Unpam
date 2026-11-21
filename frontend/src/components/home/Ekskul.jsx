/** @format */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";

// URL backend
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/ekstrakurikuler`;

const gayaVisualEkskul = `
  .ek-section {
    background: linear-gradient(155deg, #022300 0%, #063b00 58%, #164711 100%);
    border-top: 4px solid #e2eb24;
    border-bottom: 4px solid #e2eb24;
  }

  .ek-card {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(47, 107, 25, 0.24);
    border-radius: 16px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .ek-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2f6b19 0%, #063b00 65%, #E1E100 100%);
    transform: scaleX(0.35);
    transform-origin: left;
    transition: transform 0.28s ease;
    z-index: 10;
  }

  .ek-card:hover {
    transform: translateY(-6px);
    border-color: #e2eb24;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.32);
  }

  .ek-card:hover::before {
    transform: scaleX(1);
  }

  .ek-card:hover .ek-foto {
    transform: scale(1.04);
  }
`;

export default function Ekskul() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const muatEkstrakurikuler = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data. Status: ${response.status}`
          );
        }

        const result = await response.json();

        // Menyesuaikan format respons API
        const data = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.data)
              ? result.data.data
              : [];

        // Ambil semua ekskul yang berstatus tayang
        const dataTayang = data.filter((item) => {
          const status = String(item.status || "")
            .trim()
            .toLowerCase();

          return status === "tayang";
        });

        // Ambil maksimal tiga ekskul terbaru dari API.
        // Urutan mengikuti data yang dikirim backend.
        setItems(dataTayang.slice(0, 3));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(
            "Gagal memuat ekstrakurikuler:",
            err
          );

          setItems([]);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    muatEkstrakurikuler();

    return () => controller.abort();
  }, []);

  return (
    <section className="ek-section relative overflow-hidden py-16 text-surface-container-lowest">
      <style>{gayaVisualEkskul}</style>

      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 custom-pattern opacity-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
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

        {/* Daftar Ekstrakurikuler */}
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
            {items.map((e) => {
              const fotoSrc = e.foto_url || e.foto || e.image_url;

              return (
                <article
                  key={e.id}
                  className="ek-card flex h-full flex-col"
                >
                  {/* Foto */}
                  <div className="h-56 w-full overflow-hidden bg-[#eef4ed]">
                    {fotoSrc ? (
                      <img
                        className="ek-foto h-full w-full object-cover transition-transform duration-500"
                        src={fotoSrc}
                        alt={e.nama || "Ekstrakurikuler"}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{ color: "#063b00" }}
                        className="flex h-full items-center justify-center bg-[#eef7eb]"
                      >
                        <Icon
                          name="image"
                          className="text-5xl text-[#2f6b19]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Informasi */}
                  <div className="p-5 text-center">
                    <h3
                      style={{ color: "#022300" }}
                      className="font-headline-sm text-lg font-bold"
                    >
                      {e.nama}
                    </h3>

                    <p
                      style={{ color: "#5c6d63" }}
                      className="mt-1 text-body-sm"
                    >
                      Pembina: {e.pembina || "-"}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-surface-container-low">
            Belum ada ekstrakurikuler yang ditayangkan.
          </div>
        )}

        {/* Link Ekskul Lainnya */}
        <div className="mt-8 flex justify-end">
          <Link
            to="/profil#ekskul"
            style={{ color: "#e2eb24" }}
            className="inline-flex items-center gap-1 text-body-sm font-bold hover:underline"
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
  );
}
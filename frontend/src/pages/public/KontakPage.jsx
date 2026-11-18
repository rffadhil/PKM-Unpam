import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/config/site";
import { kirimPesanPublik } from "@/services/pesan.service";
import { ambilPengaturanLengkap } from "@/services/pengaturan.service";

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider text-green-800">
      {children}
    </p>
  );
}

function Heading({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="mt-1 text-xl sm:text-2xl font-bold text-green-950">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function PanelTitle({ ikon, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-950 text-lime-300">
        <Icon name={ikon} className="text-xl" />
      </span>
      <h3 className="font-bold text-green-950">{children}</h3>
    </div>
  );
}

export default function KontakPage() {
  // State formulir kontak
  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
    kategori: "",
    subjek: "",
    pesan: "",
    setuju: false,
  });

  const [errorForm, setErrorForm] = useState({
    nama: "",
    telepon: "",
  });

  const [pesanStatus, setPesanStatus] = useState("");
  const [sedangMengirim, setSedangMengirim] = useState(false);

  // State pengaturan portal dari CMS
  const [pengaturan, setPengaturan] = useState({});
  const [sedangMemuatPengaturan, setSedangMemuatPengaturan] = useState(true);

  useEffect(() => {
    let masihAktif = true;

    async function muatPengaturan() {
      try {
        const hasil = await ambilPengaturanLengkap();
        const data = hasil?.portal ?? hasil?.data ?? {};

        if (masihAktif) {
          setPengaturan(data);
        }
      } catch (error) {
        console.error("Gagal mengambil pengaturan kontak:", error);
      } finally {
        if (masihAktif) {
          setSedangMemuatPengaturan(false);
        }
      }
    }

    muatPengaturan();

    return () => {
      masihAktif = false;
    };
  }, []);

  // Data kontak dari CMS Admin
  const nomorTelepon = pengaturan.telepon || "(021) 55755671";
  const nomorWhatsApp = pengaturan.whatsapp || "6285813548624";
  const emailHumas = pengaturan.email || "harapanjayasma@gmail.com";

  // Data PTSP dan lokasi kampus dari CMS Admin
  const alamatKampus = pengaturan.alamat || "";
  const jamSenKam = pengaturan.jamSenKam || "";
  const jamJumat = pengaturan.jamJumat || "";
  const tautanPeta = pengaturan.peta || "";

  // URL peta berdasarkan alamat dari CMS
  const petaEmbed = alamatKampus
    ? `https://maps.google.com/maps?q=${encodeURIComponent(alamatKampus)}&output=embed`
    : "";

  // Format nomor telepon untuk tautan panggilan
  const teleponBersih = String(nomorTelepon).replace(/\D/g, "");
  const teleponLink = teleponBersih.startsWith("0")
    ? `+62${teleponBersih.slice(1)}`
    : `+${teleponBersih}`;

  // Format nomor WhatsApp
  let whatsappBersih = String(nomorWhatsApp).replace(/\D/g, "");

  if (whatsappBersih.startsWith("0")) {
    whatsappBersih = `62${whatsappBersih.slice(1)}`;
  } else if (whatsappBersih.startsWith("8")) {
    whatsappBersih = `62${whatsappBersih}`;
  }

  // Tiga kartu saluran komunikasi
  const saluran = [
    {
      ikon: "call",
      subLabel: "KANTOR PUSAT & RESEPSIONIS",
      judul: "Telepon Kantor Sekolah",
      deskripsi:
        "Hubungi resepsionis sekolah untuk informasi umum, administrasi siswa, dan keperluan mendesak.",
      nilai: nomorTelepon,
      detail: "Senin – Jumat (07.30 – 15.30 WIB)",
      aksi: "Hubungi via Telepon",
      href: teleponBersih ? `tel:${teleponLink}` : "#",
      warna: "bg-green-950 text-yellow-300",
    },
    {
      ikon: "chat",
      subLabel: "KESISWAAN & SPMB",
      judul: "Posko PPDB / SPMB",
      deskripsi:
        "Pusat informasi pendaftaran murid baru, jadwal seleksi, dan konsultasi jalur masuk.",
      nilai: "WhatsApp Panitia PPDB",
      detail: "Layanan informasi calon peserta didik",
      aksi: "Buka WhatsApp",
      href: whatsappBersih ? `https://wa.me/${whatsappBersih}` : "#",
      warna: "bg-green-800 text-white",
    },
    {
      ikon: "mail",
      subLabel: "PUBLIKASI & STAKEHOLDER",
      judul: "Humas & Kemitraan",
      deskripsi:
        "Informasi kerja sama antarlembaga, studi banding, dan korespondensi resmi sekolah.",
      nilai: emailHumas,
      detail: "Untuk pertanyaan dinas dan kerja sama",
      aksi: "Kirim Surat Elektronik",
      href: emailHumas ? `mailto:${emailHumas}` : "#",
      warna: "bg-green-950 text-white",
    },
  ];

  const regexNama = /^[\p{L}\s]+$/u;
  const regexTelepon = /^[0-9]+$/;

  // Mengubah input formulir + validasi
  function ubahForm(event) {
    const { name, value, checked, type } = event.target;

    let nilaiBersih = value;

    if (name === "nama") {
      nilaiBersih = value.replace(/[^\p{L}\s]/gu, "");

      setErrorForm((sebelumnya) => ({
        ...sebelumnya,
        nama:
          nilaiBersih !== value
            ? "Nama hanya boleh berisi huruf dan spasi. Angka dan karakter khusus tidak diperbolehkan."
            : "",
      }));
    }

    if (name === "telepon") {
      nilaiBersih = value.replace(/[^0-9]/g, "");

      setErrorForm((sebelumnya) => ({
        ...sebelumnya,
        telepon:
          nilaiBersih !== value
            ? "Nomor telepon hanya boleh berisi angka, tanpa spasi atau tanda baca."
            : "",
      }));
    }

    setForm((sebelumnya) => ({
      ...sebelumnya,
      [name]: type === "checkbox" ? checked : nilaiBersih,
    }));
  }

  // Mengirim formulir
  async function kirimForm(event) {
    event.preventDefault();

    const namaValid =
      form.nama.trim().length > 0 && regexNama.test(form.nama.trim());

    const teleponValid =
      form.telepon.length > 0 && regexTelepon.test(form.telepon);

    setErrorForm({
      nama: namaValid ? "" : "Nama hanya boleh berisi huruf dan spasi.",
      telepon: teleponValid
        ? ""
        : "Nomor telepon hanya boleh berisi angka, tanpa spasi atau tanda baca.",
    });

    if (!namaValid || !teleponValid) {
      setPesanStatus("Mohon periksa kembali nama dan nomor telepon Anda.");
      return;
    }

    try {
      setSedangMengirim(true);
      setPesanStatus("Mengirim pesan...");

      await kirimPesanPublik(form);

      setPesanStatus(
        "Pesan berhasil dikirim! Terima kasih telah menghubungi pihak sekolah.",
      );

      setForm({
        nama: "",
        email: "",
        telepon: "",
        kategori: "",
        subjek: "",
        pesan: "",
        setuju: false,
      });

      setErrorForm({
        nama: "",
        telepon: "",
      });
    } catch (error) {
      setPesanStatus(
        error.message || "Pesan gagal dikirim. Silakan coba kembali.",
      );
    } finally {
      setSedangMengirim(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100";

  const mapsLink =
    site?.mapsUrl ||
    "https://maps.google.com/?q=Jl.+Daan+Mogot+KM+13,+Cengkareng,+Jakarta+Barat";

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily: "Times New Roman, Times, serif",
      }}
    >
      {/* 1. Header halaman */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-green-950 sm:text-4xl">
            Kontak Resmi & Pusat Informasi Publik
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            Hubungi SMA Harapan Jaya untuk mendapatkan informasi seputar
            sekolah, kegiatan pendidikan, pendaftaran siswa baru, maupun
            pertanyaan lainnya. Kami siap membantu memberikan informasi yang
            jelas dan mudah diakses.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:space-y-14 lg:px-8 lg:py-10">
        {/* 2. Kartu saluran komunikasi */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <Heading
              eyebrow="Layanan Informasi"
              title="Saluran Komunikasi Resmi"
              description="Pilih layanan sesuai kebutuhan pertanyaan Anda."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {saluran.map((item) => (
              <article
                key={item.judul}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    item.warna || "bg-green-950 text-lime-300"
                  }`}
                >
                  <Icon name={item.ikon} className="text-xl" />
                </span>

                {/* Sub-label */}
                {item.subLabel && (
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-green-800">
                    {item.subLabel}
                  </p>
                )}

                {/* Judul kartu */}
                <h3 className="mt-1 font-bold text-green-950">{item.judul}</h3>

                {/* Deskripsi */}
                {item.deskripsi && (
                  <p className="mt-2 flex-grow text-xs leading-5 text-slate-500">
                    {item.deskripsi}
                  </p>
                )}

                {/* Informasi kontak dan waktu */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="break-words text-sm font-bold text-green-950">
                    {sedangMemuatPengaturan
                      ? "Memuat..."
                      : item.nilai || "Belum diatur"}
                  </p>

                  {item.detail && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      {item.detail}
                    </p>
                  )}

                  {/* Tombol kontak */}
                  <a
                    href={item.href}
                    target={
                      item.href.startsWith("https://") ? "_blank" : undefined
                    }
                    rel={
                      item.href.startsWith("https://")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={(e) => {
                      if (item.href === "#") e.preventDefault();
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-600"
                  >
                    {item.aksi}
                    <Icon name="arrow_forward" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Formulir pesan dan informasi sekolah */}
        <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* Formulir kontak */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:col-span-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SectionLabel>Terhubung ke CMS Admin</SectionLabel>
                <h2 className="mt-1 text-xl font-bold text-green-950">
                  Formulir Pesan & Konsultasi Publik
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Silakan lengkapi formulir berikut. Data akan tercatat pada
                  buku register dinas elektronik.
                </p>
              </div>

              <Icon
                name="contact_support"
                className="hidden text-3xl text-green-800 sm:block"
              />
            </div>

            <form onSubmit={kirimForm} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-green-950">
                  Nama Lengkap Pengirim *
                  <input
                    className={`${inputClass} ${
                      errorForm.nama
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={ubahForm}
                    placeholder="Contoh: Arya Ramadhani"
                    autoComplete="name"
                    aria-invalid={Boolean(errorForm.nama)}
                    required
                  />
                  {errorForm.nama && (
                    <span className="mt-1 block text-xs font-medium text-red-600">
                      {errorForm.nama}
                    </span>
                  )}
                </label>

                <label className="text-xs font-semibold text-green-950">
                  Alamat Email Aktif *
                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={ubahForm}
                    placeholder="nama.anda@gmail.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="text-xs font-semibold text-green-950">
                  Nomor Telepon / WhatsApp *
                  <input
                    className={`${inputClass} ${
                      errorForm.telepon
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    type="text"
                    name="telepon"
                    value={form.telepon}
                    onChange={ubahForm}
                    placeholder="Contoh: 081234567890"
                    autoComplete="tel"
                    inputMode="numeric"
                    aria-invalid={Boolean(errorForm.telepon)}
                    required
                  />
                  {errorForm.telepon && (
                    <span className="mt-1 block text-xs font-medium text-red-600">
                      {errorForm.telepon}
                    </span>
                  )}
                </label>

                <label className="text-xs font-semibold text-green-950">
                  Kategori Layanan *
                  <select
                    className={inputClass}
                    name="kategori"
                    value={form.kategori}
                    onChange={ubahForm}
                    required
                  >
                    <option value="Tata Usaha & Akademik">Tata Usaha & Akademik</option>
                    <option value="PPDB/SPMB">PPDB/SPMB</option>
                    <option value="Humas dan Kemitraan">Humas dan Kemitraan</option>
                    <option value="Permohonan Dokumen">Permohonan Dokumen</option>
                    <option value="Aspirasi dan Pengaduan">Aspirasi dan Pengaduan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-semibold text-green-950">
                Subjek Pesan / Judul Permohonan *
                <input
                  className={inputClass}
                  name="subjek"
                  value={form.subjek}
                  onChange={ubahForm}
                  placeholder="Contoh: Konfirmasi Verifikasi Sertifikat Prestasi"
                  required
                />
              </label>

              <label className="block text-xs font-semibold text-green-950">
                Rincian Isi Pesan / Pengajuan Informasi *
                <textarea
                  className={`${inputClass} min-h-32 resize-y`}
                  name="pesan"
                  value={form.pesan}
                  onChange={ubahForm}
                  placeholder="Tuliskan pertanyaan, kronologi kendala administrasi, atau dokumen yang ingin Anda konfirmasikan..."
                  rows={5}
                  required
                />
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <input
                  className="mt-1 accent-green-800"
                  type="checkbox"
                  name="setuju"
                  checked={form.setuju}
                  onChange={ubahForm}
                  required
                />
                <span>
                  Saya menyetujui bahwa data nama, email, dan telepon yang
                  disampaikan digunakan oleh sekolah untuk keperluan verifikasi
                  identitas, balasan korespondensi dinas, dan pengarsipan sesuai
                  standar perlindungan data.
                </span>
              </label>

              <button
                type="submit"
                disabled={sedangMengirim}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-300 px-5 py-3 text-sm font-bold text-green-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sedangMengirim ? "Mengirim Pesan..." : "Kirim Pesan Sekarang"}
                <Icon name="send" />
              </button>

              {pesanStatus && (
                <p
                  role="status"
                  className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                >
                  {pesanStatus}
                </p>
              )}
            </form>
          </div>

          {/* Informasi sekolah dan Google Maps */}
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <PanelTitle ikon="apartment">SMA Harapan Jaya</PanelTitle>

              <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                <div className="flex gap-3">
                  <Icon name="location_on" className="text-xl text-green-800" />

                  <div>
                    <h4 className="text-sm font-bold text-green-950">
                      Alamat Sekolah
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {alamatKampus || "Alamat kampus belum diatur."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon name="schedule" className="text-xl text-green-800" />

                  <div>
                    <h4 className="text-sm font-bold text-green-950">
                      Loket Pelayanan Terpadu Satu Pintu (PTSP)
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Senin - Kamis: {jamSenKam || "Belum diatur"}
                      <br />
                      Jumat: {jamJumat || "Belum diatur"}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-red-600">
                      Sabtu, Minggu dan hari libur nasional: Tutup
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon
                    name="directions_bus"
                    className="shrink-0 text-xl text-green-800"
                  />

                  <div className="min-w-0">
                    <h4 className="mb-1 text-sm font-bold text-green-950">
                      Panduan Akses Transportasi Publik
                    </h4>

                    <ul className="ml-4 list-disc space-y-1.5 pl-1 text-sm leading-relaxed marker:text-green-700 text-slate-600">
                      <li>
                        <strong className="text-green-950">
                          TransJakarta:
                        </strong>{" "}
                        Halte Jembatan Gantung / Samsat Barat (Koridor 3).
                      </li>

                      <li>
                        <strong className="text-green-950">KRL:</strong> Stasiun
                        Rawa Buaya (±10 menit via ojek daring).
                      </li>

                      <li>
                        <strong className="text-green-950">
                          Angkot / JakLingko:
                        </strong>{" "}
                        Jalur utama Jl. Daan Mogot Km. 13.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-2 p-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-green-950">
                  <Icon name="map" className="text-lg text-green-800" />
                  Peta Lokasi Google Maps
                </h3>
              </div>

              {petaEmbed ? (
                <iframe
                  title="Lokasi SMA Harapan Jaya"
                  src="https://www.google.com/maps?q=-6.1538,106.7328&z=16&output=embed"
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-slate-50 text-sm text-slate-500">
                  Lokasi Google Maps belum diatur oleh admin.
                </div>
              )}

              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Periksa lokasi dan petunjuk perjalanan sebelum berkunjung.
                </p>

                {tautanPeta && (
                  <a
                    href={tautanPeta}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-yellow-300 px-3 py-2 text-xs font-bold text-green-950 hover:bg-yellow-400"
                  >
                    Buka Google Maps
                    <Icon name="open_in_new" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

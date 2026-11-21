/** @format */

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/config/site";
import { kirimPesanPublik } from "@/services/pesan.service";
import { ambilPengaturanLengkap } from "@/services/pengaturan.service";

const latarPutihBertekstur = {
  backgroundColor: "#ffffff",
  backgroundImage:
    "radial-gradient(rgba(47, 107, 25, 0.08) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

const gayaVisualKontak = `
  .kp-hero-block {
    position: relative;
    background: #063b00 !important;
    border-bottom: 4px solid #e2eb24 !important;
    color: #ffffff !important;
    box-shadow: 0 10px 24px rgba(2, 35, 0, 0.14);
  }

  .kp-card-saluran {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(47, 107, 25, 0.24);
    border-radius: 16px;
    box-shadow: 0 4px 14px rgba(2, 35, 0, 0.06);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .kp-card-saluran::before {
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
    z-index: 3;
  }

  .kp-card-saluran:hover {
    transform: translateY(-6px);
    border-color: rgba(47, 107, 25, 0.48);
    box-shadow: 0 14px 28px rgba(2, 35, 0, 0.14), 0 5px 10px rgba(2, 35, 0, 0.08);
  }

  .kp-card-saluran:hover::before {
    transform: scaleX(1);
  }

  .kp-panel-seragam {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(47, 107, 25, 0.24);
    border-radius: 18px;
    box-shadow: 0 6px 20px rgba(2, 35, 0, 0.06);
  }

  .kp-panel-seragam::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2f6b19 0%, #063b00 65%, #E1E100 100%);
    z-index: 3;
  }

  .kp-highlight-box {
    background: #f3faf1;
    border-left: 3px solid #2f6b19;
    border-radius: 10px;
    padding: 10px 12px;
  }
`;

function SectionLabel({ children }) {
  return (
    <p className="hidden text-[10px] font-bold uppercase tracking-wider text-green-800">
      {children}
    </p>
  );
}

function Heading({ eyebrow, title, description }) {
  return (
    <div
      style={{
        background: "#063b00",
        borderBottom: "4px solid #e2eb24",
        borderRadius: "14px",
        padding: "18px 24px",
        boxShadow: "0 8px 20px rgba(2, 35, 0, 0.12)",
      }}
      className="mb-6 w-full"
    >
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2
        style={{
          color: "#ffffff",
          borderLeft: "4px solid #e2eb24",
          paddingLeft: "12px",
        }}
        className="text-xl font-bold sm:text-2xl"
      >
        {title}
      </h2>
      {description && (
        <p
          style={{ color: "#e2eb24" }}
          className="mt-2 text-sm leading-relaxed"
        >
          {description}
        </p>
      )}
    </div>
  );
}

function PanelTitle({ ikon, children }) {
  return (
    <div
      style={{
        background: "#063b00",
        borderBottom: "4px solid #e2eb24",
        borderRadius: "12px",
        padding: "14px 18px",
        boxShadow: "0 6px 16px rgba(2, 35, 0, 0.12)",
      }}
      className="flex items-center gap-3"
    >
      <span
        style={{
          background: "rgba(226, 235, 36, 0.16)",
          color: "#e2eb24",
          border: "1px solid rgba(226, 235, 36, 0.45)",
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      >
        <Icon name={ikon} className="text-xl" />
      </span>
      <h3 className="text-lg font-bold text-white">{children}</h3>
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
      warna: "bg-[#063b00] text-[#e2eb24] border border-[#e2eb24]/50",
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
      warna: "bg-[#2f6b19] text-white border border-[#e2eb24]/40",
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
      warna: "bg-[#063b00] text-[#e2eb24] border border-[#e2eb24]/50",
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
    "mt-1.5 w-full rounded-xl border border-[#2f6b19]/25 bg-white px-3.5 py-2.5 text-sm text-[#022300] outline-none transition placeholder:text-slate-400 focus:border-[#2f6b19] focus:ring-2 focus:ring-[#2f6b19]/15";

  const mapsLink =
    site?.mapsUrl ||
    "https://maps.google.com/?q=Jl.+Daan+Mogot+KM+13,+Cengkareng,+Jakarta+Barat";

  return (
    <div
      className="min-h-screen"
      style={{
        ...latarPutihBertekstur,
        fontFamily: "Times New Roman, Times, serif",
      }}
    >
      <style>{gayaVisualKontak}</style>

      {/* 1. Header halaman dengan blok hijau tua */}
      <section className="kp-hero-block">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            Kontak Resmi & Pusat Informasi Publik
          </h1>

          <p
            style={{ color: "#dbe8d8" }}
            className="mt-3 max-w-3xl text-sm leading-6 sm:text-base"
          >
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
          <Heading
            eyebrow="Layanan Informasi"
            title="Saluran Komunikasi Resmi"
            description="Pilih layanan sesuai kebutuhan pertanyaan Anda."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {saluran.map((item) => (
              <article
                key={item.judul}
                className="kp-card-saluran flex flex-col p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
                      item.warna || "bg-[#063b00] text-[#e2eb24]"
                    }`}
                  >
                    <Icon name={item.ikon} className="text-xl" />
                  </span>

                  {item.subLabel && (
                    <span
                      style={{
                        background: "#e9f6e5",
                        color: "#063b00",
                        border: "1px solid rgba(47, 107, 25, 0.22)",
                      }}
                      className="rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider"
                    >
                      {item.subLabel}
                    </span>
                  )}
                </div>

                {/* Judul kartu */}
                <h3
                  style={{ color: "#022300" }}
                  className="mt-4 text-lg font-bold"
                >
                  {item.judul}
                </h3>

                {/* Deskripsi */}
                {item.deskripsi && (
                  <p
                    style={{ color: "#55687a" }}
                    className="mt-2 flex-grow font-sans text-xs leading-5"
                  >
                    {item.deskripsi}
                  </p>
                )}

                {/* Informasi kontak dan waktu */}
                <div
                  style={{ borderColor: "rgba(47, 107, 25, 0.16)" }}
                  className="mt-5 border-t pt-4"
                >
                  <div className="kp-highlight-box">
                    <p
                      style={{ color: "#063b00" }}
                      className="break-words text-sm font-bold"
                    >
                      {sedangMemuatPengaturan
                        ? "Memuat..."
                        : item.nilai || "Belum diatur"}
                    </p>

                    {item.detail && (
                      <p
                        style={{ color: "#2f6b19" }}
                        className="mt-1 font-sans text-[11px] font-semibold"
                      >
                        {item.detail}
                      </p>
                    )}
                  </div>

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
                    style={{ color: "#063b00" }}
                    className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-bold transition-colors hover:text-[#2f6b19]"
                  >
                    <span>{item.aksi}</span>
                    <Icon name="arrow_forward" className="text-[15px]" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Formulir pesan dan informasi sekolah (disamaratakan tinggi & bingkainya) */}
        <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* Formulir kontak */}
          <div className="kp-panel-seragam flex h-full flex-col p-5 sm:p-7 lg:col-span-7">
            <div
              style={{
                background: "#063b00",
                borderBottom: "4px solid #e2eb24",
                borderRadius: "14px",
                padding: "18px 22px",
                boxShadow: "0 8px 20px rgba(2, 35, 0, 0.12)",
              }}
              className="flex items-start justify-between gap-3"
            >
              <div>
                <SectionLabel>Terhubung ke CMS Admin</SectionLabel>
                <h2
                  style={{
                    color: "#ffffff",
                    borderLeft: "4px solid #e2eb24",
                    paddingLeft: "12px",
                  }}
                  className="text-xl font-bold sm:text-2xl"
                >
                  Formulir Pesan & Konsultasi Publik
                </h2>
                <p
                  style={{ color: "#e2eb24" }}
                  className="mt-2 text-sm leading-relaxed"
                >
                  Silakan lengkapi formulir berikut. Data akan tercatat pada
                  buku register dinas elektronik.
                </p>
              </div>

              <Icon
                name="contact_support"
                className="hidden shrink-0 text-3xl text-[#e2eb24] sm:block"
              />
            </div>

            <form
              onSubmit={kirimForm}
              className="mt-6 flex flex-1 flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label
                    style={{ color: "#022300" }}
                    className="font-sans text-xs font-bold"
                  >
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

                  <label
                    style={{ color: "#022300" }}
                    className="font-sans text-xs font-bold"
                  >
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

                  <label
                    style={{ color: "#022300" }}
                    className="font-sans text-xs font-bold"
                  >
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

                  <label
                    style={{ color: "#022300" }}
                    className="font-sans text-xs font-bold"
                  >
                    Kategori Layanan *
                    <select
                      className={inputClass}
                      name="kategori"
                      value={form.kategori}
                      onChange={ubahForm}
                      required
                    >
                      <option value="" disabled>
                        Pilih Kategori Layanan
                      </option>
                      <option value="Tata Usaha & Akademik">
                        Tata Usaha & Akademik
                      </option>
                      <option value="PPDB/SPMB">PPDB/SPMB</option>
                      <option value="Humas dan Kemitraan">
                        Humas dan Kemitraan
                      </option>
                      <option value="Permohonan Dokumen">
                        Permohonan Dokumen
                      </option>
                      <option value="Aspirasi dan Pengaduan">
                        Aspirasi dan Pengaduan
                      </option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </label>
                </div>

                <label
                  style={{ color: "#022300" }}
                  className="block font-sans text-xs font-bold"
                >
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

                <label
                  style={{ color: "#022300" }}
                  className="block font-sans text-xs font-bold"
                >
                  Rincian Isi Pesan / Pengajuan Informasi *
                  <textarea
                    className={`${inputClass} min-h-44 resize-none`}
                    style={{ resize: "none" }}
                    name="pesan"
                    value={form.pesan}
                    onChange={ubahForm}
                    placeholder="Tuliskan pertanyaan, kronologi kendala administrasi, atau dokumen yang ingin Anda konfirmasikan..."
                    rows={7}
                    required
                  />
                </label>
              </div>

              <div className="mt-auto space-y-4 pt-6">
                <label
                  style={{
                    background: "#f3faf1",
                    borderColor: "rgba(47, 107, 25, 0.22)",
                    color: "#263b2c",
                  }}
                  className="flex items-start gap-3 rounded-xl border p-3.5 font-sans text-xs leading-5"
                >
                  <input
                    className="mt-1 accent-[#063b00]"
                    type="checkbox"
                    name="setuju"
                    checked={form.setuju}
                    onChange={ubahForm}
                    required
                  />
                  <span>
                    Saya menyetujui bahwa data nama, email, dan telepon yang
                    disampaikan digunakan oleh sekolah untuk keperluan verifikasi
                    identitas, balasan korespondensi dinas, dan pengarsipan
                    sesuai standar perlindungan data.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={sedangMengirim}
                  style={{
                    background: "#063b00",
                    color: "#e2eb24",
                    border: "1px solid rgba(226, 235, 36, 0.55)",
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-[#2f6b19] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sedangMengirim
                    ? "Mengirim Pesan..."
                    : "Kirim Pesan Sekarang"}
                  <Icon name="send" />
                </button>

                {pesanStatus && (
                  <p
                    role="status"
                    className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 font-sans text-xs font-medium leading-5 text-amber-950"
                  >
                    {pesanStatus}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Informasi sekolah dan Google Maps (disamaratakan tinggi & di-highlight) */}
          <div className="flex h-full flex-col justify-between gap-5 lg:col-span-5">
            <div className="kp-panel-seragam p-5 sm:p-6">
              <PanelTitle ikon="apartment">SMA Harapan Jaya</PanelTitle>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <Icon
                    name="location_on"
                    className="mt-1 shrink-0 text-xl text-[#2f6b19]"
                  />

                  <div className="min-w-0 flex-1">
                    <h4
                      style={{ color: "#022300" }}
                      className="text-sm font-bold"
                    >
                      Alamat Sekolah
                    </h4>
                    <div className="kp-highlight-box mt-1.5">
                      <p
                        style={{ color: "#063b00" }}
                        className="font-sans text-xs font-semibold leading-5"
                      >
                        {alamatKampus || "Alamat kampus belum diatur."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon
                    name="schedule"
                    className="mt-1 shrink-0 text-xl text-[#2f6b19]"
                  />

                  <div className="min-w-0 flex-1">
                    <h4
                      style={{ color: "#022300" }}
                      className="text-sm font-bold"
                    >
                      Loket Pelayanan Terpadu Satu Pintu (PTSP)
                    </h4>
                    <div className="kp-highlight-box mt-1.5">
                      <p
                        style={{ color: "#063b00" }}
                        className="font-sans text-xs font-semibold leading-5"
                      >
                        Senin - Kamis: {jamSenKam || "Belum diatur"}
                        <br />
                        Jumat: {jamJumat || "Belum diatur"}
                      </p>

                      <span className="mt-2 inline-block rounded-md bg-red-50 px-2.5 py-1 font-sans text-[11px] font-bold text-red-700 ring-1 ring-red-200">
                        Sabtu, Minggu dan hari libur nasional: Tutup
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon
                    name="directions_bus"
                    className="mt-1 shrink-0 text-xl text-[#2f6b19]"
                  />

                  <div className="min-w-0 flex-1">
                    <h4
                      style={{ color: "#022300" }}
                      className="mb-1.5 text-sm font-bold"
                    >
                      Panduan Akses Transportasi Publik
                    </h4>

                    <div className="kp-highlight-box">
                      <ul
                        style={{ color: "#263b2c" }}
                        className="ml-4 list-disc space-y-1.5 pl-1 font-sans text-xs font-medium leading-relaxed marker:text-[#2f6b19]"
                      >
                        <li>
                          <strong style={{ color: "#063b00" }}>
                            TransJakarta:
                          </strong>{" "}
                          Halte Jembatan Gantung / Samsat Barat (Koridor 3)
                        </li>

                        <li>
                          <strong style={{ color: "#063b00" }}>KRL:</strong>{" "}
                          Stasiun Rawa Buaya (±10 menit via ojek daring)
                        </li>

                        <li>
                          <strong style={{ color: "#063b00" }}>
                            Angkot / JakLingko:
                          </strong>{" "}
                          Jalur utama Jl. Daan Mogot Km. 13
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="kp-panel-seragam flex flex-1 flex-col justify-between overflow-hidden">
              <div>
                <div
                  style={{ borderColor: "rgba(47, 107, 25, 0.16)" }}
                  className="flex items-center justify-between gap-2 border-b px-5 py-4"
                >
                  <h3
                    style={{ color: "#022300" }}
                    className="flex items-center gap-2 text-base font-bold"
                  >
                    <Icon name="map" className="text-lg text-[#2f6b19]" />
                    Peta Lokasi Google Maps
                  </h3>
                </div>

                {petaEmbed ? (
                  <iframe
                    title="Lokasi SMA Harapan Jaya"
                    src="https://www.google.com/maps?q=-6.1538,106.7328&z=16&output=embed"
                    className="h-60 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center bg-[#f3faf1] font-sans text-sm font-medium text-[#263b2c]">
                    Lokasi Google Maps belum diatur oleh admin.
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "#f3faf1",
                  borderTop: "1px solid rgba(47, 107, 25, 0.18)",
                }}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p
                  style={{ color: "#063b00" }}
                  className="font-sans text-xs font-semibold"
                >
                  Periksa lokasi dan petunjuk perjalanan sebelum berkunjung.
                </p>

                {tautanPeta && (
                  <a
                    href={tautanPeta}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#063b00",
                      color: "#e2eb24",
                      border: "1px solid rgba(226, 235, 36, 0.55)",
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 font-sans text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-[#2f6b19]"
                  >
                    <span>Buka Google Maps</span>
                    <Icon name="open_in_new" className="text-[15px]" />
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
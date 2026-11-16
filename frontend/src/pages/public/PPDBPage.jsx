/** @format */

import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowUpRight, FileText, Phone, Mail, ArrowRight } from "lucide-react";
import ModalDokumen from "@/components/dokumen/ModalDokumen";
import { getPpdbRegistrationStatus, isDateOnlyValid } from "@/utils/ppdb";

const ALUR_PPDB = [
  {
    nomor: "01",
    judul: "Isi Formulir Online",
    deskripsi:
      "Klik tombol pendaftaran dan lengkapi biodata calon siswa pada Google Form resmi sekolah.",
  },
  {
    nomor: "02",
    judul: "Verifikasi Berkas",
    deskripsi:
      "Panitia PPDB akan menghubungi calon siswa untuk penjadwalan verifikasi dokumen di sekolah.",
  },
  {
    nomor: "03",
    judul: "Daftar Ulang",
    deskripsi:
      "Selesaikan proses administrasi dan daftar ulang sesuai arahan dari panitia sekolah.",
  },
];

export default function PPDBPage() {
  const { portal } = useOutletContext() || {};
  const [bukaModalDokumen, setBukaModalDokumen] = useState(false);

  const statusPpdb = getPpdbRegistrationStatus(portal);
  const ppdbDibuka = statusPpdb === "open";
  const tautanForm = String(portal?.ppdbLink || portal?.ppdb_link || "").trim();
  const bisaDaftar = ppdbDibuka && Boolean(tautanForm);
  const tanggalMulaiPpdb = isDateOnlyValid(portal?.ppdbTanggalMulai)
    ? new Date(`${portal.ppdbTanggalMulai}T00:00:00`).toLocaleDateString(
        "id-ID",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : "";
  const tahunAjaranPpdb = String(portal?.ppdbTahunAjaran || "").trim();
  const keteranganPendaftaran =
    statusPpdb === "upcoming"
      ? `Pendaftaran PPDB${
          tahunAjaranPpdb ? ` ${tahunAjaranPpdb}` : ""
        } dijadwalkan dibuka${tanggalMulaiPpdb ? ` pada ${tanggalMulaiPpdb}` : ""}.`
      : statusPpdb === "closed"
        ? "Pendaftaran PPDB saat ini belum dibuka atau telah berakhir."
        : "Pendaftaran calon peserta didik baru dilakukan secara daring melalui formulir resmi sekolah. Silakan klik tombol di bawah untuk mulai mengisi data pendaftaran.";

  const namaSekolah = portal?.namaInstitusi || "SMA Harapan Jaya";
  const nomorTelepon = portal?.telepon || "(021) 7892-3401";
  const alamatEmail = portal?.email || "info@smaharapanjaya.sch.id";
  const jamSenKam = portal?.jamSenKam || "Belum diatur";
  const jamJumat = portal?.jamJumat || "Belum diatur";

  return (
    <div className="min-h-screen w-full bg-[#f7f7f5] text-[#173a1b] overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-8 sm:py-14">
        <section className="mx-auto max-w-[980px] text-center">
          <h1
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
            className="text-3xl font-black leading-[1.08] tracking-[-0.03em] text-[#063f08] sm:text-5xl"
          >
            Penerimaan Peserta Didik Baru (PPDB)
            <span className="mt-1 block text-[#0a4d0e]">{namaSekolah}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[640px] text-base leading-relaxed text-[#5a665d] sm:text-[19px]">
            {keteranganPendaftaran}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {bisaDaftar ? (
              <a
                href={tautanForm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#d6d96a] bg-[#e9f500] px-7 py-4 text-sm font-bold text-[#173a1b] shadow-[0_3px_0_#c8cf07] transition hover:brightness-95 sm:text-[17px]"
              >
                <span>Daftar Sekarang via Google Form</span>
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-slate-200 px-7 py-4 text-sm font-bold text-slate-500 sm:text-[17px]"
              >
                <span>
                  {statusPpdb === "upcoming"
                    ? "Pendaftaran Belum Dibuka"
                    : statusPpdb === "closed"
                      ? "Pendaftaran Ditutup"
                      : "Tautan Pendaftaran Belum Tersedia"}
                </span>
                <ArrowUpRight size={18} strokeWidth={2.2} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setBukaModalDokumen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#0a4d0e] bg-white px-7 py-4 text-sm font-bold text-[#0a4d0e] transition hover:bg-[#0a4d0e]/5 sm:text-[17px]"
            >
              <FileText size={18} strokeWidth={2.2} />
              <span>Brosur &amp; Dokumen</span>
            </button>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <h2
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
            className="mb-8 text-center text-3xl font-bold text-[#063f08] sm:text-4xl"
          >
            Alur Pendaftaran
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {ALUR_PPDB.map((item) => (
              <div
                key={item.nomor}
                className="rounded-[18px] border border-[#dfe5df] bg-[#f5f6f4] p-6 shadow-[0_1px_0_rgba(17,24,39,0.02)] sm:p-7"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#dfe4dc] bg-[#f3f4f2] text-[16px] font-semibold text-[#1b2d1d]">
                  {item.nomor}
                </div>

                <h3
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="mb-3 text-[29px] font-bold leading-tight text-[#0b3712]"
                >
                  {item.judul}
                </h3>

                <p className="text-base leading-relaxed text-[#607264]">
                  {item.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[18px] bg-[#063f08] px-6 py-7 text-white shadow-md sm:px-8 sm:py-8 lg:px-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[520px]">
              <h2
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                className="text-3xl font-bold text-white sm:text-[30px]"
              >
                Pusat Informasi PPDB
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#d7e5d8] sm:text-[15px]">
                Mengalami kendala saat mengisi formulir? Hubungi sekretariat
                sekolah pada jam kerja. Senin–Kamis: {jamSenKam}; Jumat:{" "}
                {jamJumat}.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-[#edf7ee] sm:text-[15px]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/10 text-[#e9f500]">
                  <Phone size={16} />
                </span>
                <span className="font-medium">{nomorTelepon}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/10 text-[#e9f500]">
                  <Mail size={16} />
                </span>
                <span className="font-medium">{alamatEmail}</span>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                to="/kontak"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#e9f500] px-6 py-3.5 text-sm font-extrabold text-[#183c12] no-underline shadow-[0_3px_0_#c8cf07] transition hover:brightness-95 sm:w-auto sm:text-[17px]"
              >
                <span>Hubungi Sekolah</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {bukaModalDokumen && (
        <ModalDokumen onTutup={() => setBukaModalDokumen(false)} />
      )}
    </div>
  );
}

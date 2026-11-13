/** @format */

import { useState } from "react";
import ModalDialog from "@/components/ui/ModalDialog";
import KolomForm from "@/components/ui/KolomForm";
import StafFoto from "@/components/staf/StafFoto";
import Icon from "@/components/ui/Icon";
import { unggahGambar } from "@/services/upload.service";
import {
  BATAS_FOTO_MB,
  GAYA_INPUT,
  RUMPUN_PTK,
  STATUS_PEGAWAI,
  TIPE_NOMOR,
  TONE_RUMPUN,
} from "@/config/stafAdmin";
import {
  ekstrakNomorPtk,
  ptkKosong,
  validasiFoto,
  validasiPtk,
} from "@/utils/ptk";

const ID_FORM = "form-staf";

// Form tambah / edit PTK. `item` null = baru.
export default function StafFormModal({ item, onSimpan, onTutup }) {
  const [isi, setIsi] = useState(() => {
    if (!item) return ptkKosong();
    const { tipeNomor, nomor } = ekstrakNomorPtk(
      item.nomor || item.nip_nuptk || "",
      item.tipeNomor || "NUPTK",
    );
    return {
      ...ptkKosong(),
      ...item,
      tipeNomor: TIPE_NOMOR.includes(tipeNomor) ? tipeNomor : "NUPTK",
      nomor,
      rumpun: RUMPUN_PTK.includes(item.rumpun) ? item.rumpun : RUMPUN_PTK[2],
      statusKepegawaian: item.statusKepegawaian || "GTY/PTY",
    };
  });
  const [error, setError] = useState({});
  const [sedangUnggah, setSedangUnggah] = useState(false);
  const baru = !item;

  const ubah = (kunci, nilai) => setIsi((s) => ({ ...s, [kunci]: nilai }));
  const input = (kunci) => ({
    id: `staf-${kunci}`,
    value: isi[kunci] ?? "",
    onChange: (e) => ubah(kunci, e.target.value),
    "aria-invalid": Boolean(error[kunci]),
    "aria-describedby": error[kunci] ? `staf-${kunci}-error` : undefined,
    className: GAYA_INPUT,
  });

  function ubahRumpun(rumpun) {
    setIsi((s) => {
      let jabatanBaru = s.jabatan;
      if (rumpun === "Pimpinan Sekolah") jabatanBaru = "Kepala Sekolah";
      else if (
        rumpun === "Wakil Kepala Sekolah" &&
        !/wakil|wakasek/i.test(s.jabatan)
      ) {
        jabatanBaru = "Wakil Kepala Sekolah Kurikulum";
      } else if (
        rumpun === "Tenaga Kependidikan / Tata Usaha" &&
        s.jabatan === "Guru Mata Pelajaran"
      ) {
        jabatanBaru = "Tenaga Kependidikan";
      }

      return {
        ...s,
        rumpun,
        jabatan: jabatanBaru,
        tone: TONE_RUMPUN[rumpun] ?? "abu",
      };
    });
  }

  async function pilihFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const pesan = validasiFoto(file);
    if (pesan) return setError((s) => ({ ...s, foto: pesan }));

    setError((s) => ({ ...s, foto: undefined }));
    setSedangUnggah(true);
    try {
      const urlServer = await unggahGambar(file);
      ubah("foto", urlServer);
    } catch (err) {
      setError((s) => ({
        ...s,
        foto: err.message || "Gagal mengunggah foto.",
      }));
    } finally {
      setSedangUnggah(false);
    }
  }

  function kirim(e) {
    e.preventDefault();
    const hasil = validasiPtk(isi);
    setError(hasil);
    if (Object.keys(hasil).length) return;

    const urutanOtomatis =
      isi.rumpun === "Pimpinan Sekolah" ||
      isi.jabatan.trim().toLowerCase() === "kepala sekolah"
        ? 1
        : isi.rumpun === "Wakil Kepala Sekolah" ||
            /wakil kepala|wakasek/i.test(isi.jabatan)
          ? 2
          : 3;

    onSimpan({
      ...isi,
      nama: isi.nama.trim(),
      nomor: isi.nomor.trim(),
      jabatan: isi.jabatan.trim(),
      bidang: isi.bidang.trim(),
      pendidikan: isi.pendidikan.trim(),
      kampus: isi.kampus.trim(),
      statusKepegawaian: isi.statusKepegawaian,
      urutan: urutanOtomatis,
    });
  }

  return (
    <ModalDialog
      judul={baru ? "Tambah Pendidik / Staf" : "Edit Pendidik / Staf"}
      lebar="max-w-2xl"
      onTutup={onTutup}
      footer={
        <>
          <button
            type="button"
            onClick={onTutup}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container"
          >
            Batal
          </button>
          <button
            type="submit"
            form={ID_FORM}
            disabled={sedangUnggah}
            className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95 disabled:opacity-50"
          >
            {sedangUnggah
              ? "Mengunggah..."
              : baru
                ? "Simpan Data"
                : "Simpan Perubahan"}
          </button>
        </>
      }
    >
      <form id={ID_FORM} onSubmit={kirim} noValidate className="space-y-4">
        <KolomForm
          id="staf-nama"
          label="Nama lengkap (beserta gelar)"
          error={error.nama}
        >
          <input
            type="text"
            placeholder="Contoh: Dra. Hj. Siti Nurjanah, M.Si."
            {...input("nama")}
          />
        </KolomForm>

        <div className="grid gap-4 sm:grid-cols-3">
          <KolomForm id="staf-tipeNomor" label="Jenis nomor">
            <select {...input("tipeNomor")}>
              {TIPE_NOMOR.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </KolomForm>
          <div className="sm:col-span-2">
            <KolomForm
              id="staf-nomor"
              label={`Nomor ${isi.tipeNomor} (Opsional)`}
              error={error.nomor}
            >
              <input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 6642741646200002"
                {...input("nomor")}
              />
            </KolomForm>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <KolomForm id="staf-rumpun" label="Rumpun / Kategori Publik">
            <select
              id="staf-rumpun"
              value={isi.rumpun}
              onChange={(e) => ubahRumpun(e.target.value)}
              className={GAYA_INPUT}
            >
              {RUMPUN_PTK.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </KolomForm>
          <KolomForm id="staf-jabatan" label="Jabatan" error={error.jabatan}>
            <input
              type="text"
              placeholder="Contoh: Guru Mata Pelajaran / Wakasek Kurikulum"
              {...input("jabatan")}
            />
          </KolomForm>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <KolomForm id="staf-bidang" label="Bidang / Mata Pelajaran">
            <input
              type="text"
              placeholder="Contoh: Biologi / Matematika / Administrasi"
              {...input("bidang")}
            />
          </KolomForm>
          <KolomForm id="staf-statusKepegawaian" label="Status Kepegawaian">
            <select {...input("statusKepegawaian")}>
              {STATUS_PEGAWAI.map((s) => (
                <option key={s.nilai} value={s.nilai}>
                  {s.label}
                </option>
              ))}
            </select>
          </KolomForm>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <KolomForm id="staf-pendidikan" label="Pendidikan Terakhir">
            <input
              type="text"
              placeholder="Contoh: S1 Pendidikan Biologi"
              {...input("pendidikan")}
            />
          </KolomForm>
          <KolomForm id="staf-kampus" label="Institusi / Universitas">
            <input
              type="text"
              placeholder="Contoh: Universitas Negeri Jakarta"
              {...input("kampus")}
            />
          </KolomForm>
        </div>

        <KolomForm
          id="staf-foto"
          label="Foto Profil"
          error={error.foto}
          bantuan={`JPG, PNG, atau WebP. Maksimal ${BATAS_FOTO_MB} MB.`}
        >
          <div className="flex items-center gap-4">
            <StafFoto
              key={isi.foto}
              nama={isi.nama || "Staf baru"}
              src={isi.foto}
              className="h-16 w-16 text-lg"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-muted bg-surface-white px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-light focus-within:ring-2 focus-within:ring-secondary/30">
              <Icon name="upload" className="text-[18px]" />
              {sedangUnggah
                ? "Mengunggah..."
                : isi.foto
                  ? "Ganti foto"
                  : "Pilih foto"}
              <input
                id="staf-foto"
                type="file"
                accept="image/*"
                onChange={pilihFoto}
                disabled={sedangUnggah}
                className="sr-only"
              />
            </label>
            {isi.foto && (
              <button
                type="button"
                onClick={() => ubah("foto", "")}
                className="text-xs font-semibold text-error hover:underline"
              >
                Hapus foto
              </button>
            )}
          </div>
        </KolomForm>

        <label className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
          <input
            type="checkbox"
            checked={isi.tampil}
            onChange={(e) => ubah("tampil", e.target.checked)}
            className="h-4 w-4 rounded border-border-muted text-secondary focus:ring-secondary"
          />
          Tampilkan di halaman profil publik
        </label>
      </form>
    </ModalDialog>
  );
}

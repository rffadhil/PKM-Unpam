/** @format */

import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

import Icon from "@/components/ui/Icon";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StafToolbar from "@/components/staf/StafToolbar";
import StafTable from "@/components/staf/StafTable";
import StafFormModal from "@/components/staf/StafFormModal";
import StafDetailModal from "@/components/staf/StafDetailModal";
import BlokTeksProfil from "@/components/staf/BlokTeksProfil";
import EkstrakurikulerSection from "@/components/admin/EkstrakurikulerSection";

import { mockProfil } from "@/mocks/adminStaf";

import {
  ambilSemuaStaf,
  tambahStaf,
  editStaf,
  hapusStaf,
} from "@/services/stafService";

import {
  ambilPengaturanLengkap,
  simpanPengaturanPortal,
} from "@/services/pengaturan.service";

import {
  FILTER_STAF_AWAL,
  JABATAN_KEPALA,
  RUMPUN_PTK,
  STAF_PER_HALAMAN,
  TONE_RUMPUN,
} from "@/config/stafAdmin";

import { ekstrakNomorPtk, saringPtk, urutkanPtk } from "@/utils/ptk";

const MISI_DEFAULT = [
  {
    nomor: "01",
    judul: "Penanaman Akhlak & Nilai Religius",
    deskripsi:
      "Menumbuhkembangkan penghayatan spiritual serta pengamalan ajaran agama untuk membentuk karakter pribadi yang jujur, santun, toleran, dan berintegritas.",
    indikator: "Profil Pelajar Pancasila",
  },
  {
    nomor: "02",
    judul: "Keunggulan Literasi Sains & Teknologi",
    deskripsi:
      "Menyelenggarakan proses pembelajaran saintifik interaktif berbasis digital dan riset terapan guna melahirkan talenta unggul di kancah olimpiade dan inovasi internasional.",
    indikator: "Publikasi Riset & Prestasi OSN",
  },
  {
    nomor: "03",
    judul: "Budaya Lingkungan & Konservasi Alam",
    deskripsi:
      "Mengintegrasikan pendidikan lingkungan hidup (Adiwiyata) secara komprehensif dalam kurikulum dan aksi nyata pelestarian hayati serta pengurangan jejak karbon.",
    indikator: "Kampus Zero Plastic & Bank Sampah",
  },
  {
    nomor: "04",
    judul: "Pengembangan Potensi Multitalenta Siswa",
    deskripsi:
      "Memfasilitasi wadah eksplorasi minat, bakat, kepemimpinan organisasi, seni budaya tradisional nusantara, dan kebugaran jasmani secara inklusif.",
    indikator: "24 Cabang Ekstrakurikuler Aktif",
  },
  {
    nomor: "05",
    judul: "Kemitraan Global & Sinergi Masyarakat",
    deskripsi:
      "Membangun jejaring kolaborasi strategis bersama perguruan tinggi bereputasi, dunia usaha dan dunia industri (DUDI), alumni, serta institusi luar negeri.",
    indikator: "Sister School Program & Beasiswa Kuliah Luar Negeri",
  },
];

const PROFIL_AWAL = {
  judulHero:
    "Membangun Insan Cendekia Berwawasan Global dan Berakar Budaya Luhur",
  deskripsiHero:
    "Profil Lengkap, Visi Misi, Fasilitas Unggulan, serta Direktori Pendidik & Tenaga Kependidikan SMA Harapan Jaya. Mendedikasikan keunggulan literasi sains, integritas karakter bangsa, dan pelestarian ekosistem alam bumi nusantara.",
  judulSejarah: "Dari Fondasi Nilai Luhur Menuju Sekolah Berwawasan Masa Depan",
  sejarahParagraf1:
    "SMA Harapan Jaya didirikan pada tanggal 17 Juli 1988 dengan tekad luhur menghadirkan akses pendidikan bermutu bagi masyarakat. Bermula dari tiga ruang kelas, sekolah ini berkembang menjadi lembaga pendidikan yang memadukan prestasi akademik, pembentukan karakter, dan kepedulian terhadap lingkungan.",
  sejarahParagraf2:
    "Dalam kurun waktu lebih dari 35 tahun, SMA Harapan Jaya telah melahirkan lebih dari 12.000 alumni yang kini berkiprah di berbagai perguruan tinggi ternama dunia, lembaga pemerintahan, sains global, dan industri kreatif.",
  sejarahParagraf3:
    "Komitmen nyata terhadap pelestarian bumi tercermin dari predikat Sekolah Adiwiyata Mandiri sejak 2018. Kami percaya bahwa kecerdasan kognitif hanya akan membawa kemaslahatan jika dibarengi kesadaran ekologis yang matang.",
  judulSambutan:
    "Menyemai Karakter Adiluhung dalam Harmoni Alam dan Perkembangan Teknologi Abad 21",
  sambutan: mockProfil.sambutan,
};

const VISI_MISI_AWAL = {
  visi: mockProfil.visi,
  komitmenBudaya:
    "Memandu langkah seluruh civitas akademika menuju pencapaian standar mutu pendidikan global yang berakar pada nilai-nilai kebangsaan Indonesia dan budaya lingkungan Adiwiyata.",
  misi: MISI_DEFAULT,
};

function normalisasiRumpun(rumpun, jabatan = "") {
  const jab = String(jabatan || "").toLowerCase();
  const rum = String(rumpun || "").trim();

  if (jab.includes("kepala sekolah") && !jab.includes("wakil")) {
    return "Pimpinan Sekolah";
  }
  if (jab.includes("wakil kepala") || jab.includes("wakasek")) {
    return "Wakil Kepala Sekolah";
  }
  if (RUMPUN_PTK.includes(rum)) {
    return rum;
  }
  if (/pimpinan/i.test(rum)) return "Pimpinan Sekolah";
  if (/tendik|kependidikan|tata usaha|perpustakaan/i.test(rum)) {
    return "Tenaga Kependidikan / Tata Usaha";
  }
  return rum || "MIPA & Sains";
}

// Mapping data backend ke format frontend.
function mapStafDariApi(staf) {
  const { tipeNomor, nomor } = ekstrakNomorPtk(staf.nip_nuptk ?? "", "NUPTK");
  const rumpunNormal = normalisasiRumpun(staf.rumpun, staf.jabatan);
  const statusBersih =
    String(staf.status_kepegawaian ?? "GTY/PTY")
      .split(" - ")[0]
      .trim() || "GTY/PTY";

  const urutanDefault =
    rumpunNormal === "Pimpinan Sekolah"
      ? 1
      : rumpunNormal === "Wakil Kepala Sekolah"
        ? 2
        : Number(staf.urutan) || 3;

  return {
    ...staf,
    tipeNomor,
    nomor,
    rumpun: rumpunNormal,
    tone: TONE_RUMPUN[rumpunNormal] ?? "abu",
    bidang: staf.mata_pelajaran ?? "",
    foto: staf.foto_url ?? "",
    tampil: staf.tampil_publik ?? true,
    pendidikan: staf.pendidikan_terakhir ?? "",
    kampus: staf.almamater ?? "",
    statusKepegawaian: statusBersih,
    kepegawaian: statusBersih,
    urutan: urutanDefault,
  };
}

// Mapping data frontend ke format backend.
function mapStafKeApi(staf) {
  const { tipeNomor, nomor } = ekstrakNomorPtk(
    staf.nomor ?? "",
    staf.tipeNomor || "NUPTK",
  );
  const nipNuptk = nomor ? `${tipeNomor}: ${nomor}` : null;
  const rumpunNormal = normalisasiRumpun(staf.rumpun, staf.jabatan);

  const urutanSimpan =
    rumpunNormal === "Pimpinan Sekolah"
      ? 1
      : rumpunNormal === "Wakil Kepala Sekolah"
        ? 2
        : Number(staf.urutan ?? 3);

  return {
    nama: staf.nama?.trim() ?? "",
    nip_nuptk: nipNuptk,
    jabatan: staf.jabatan?.trim() ?? "",
    rumpun: rumpunNormal,
    mata_pelajaran: staf.bidang?.trim() || null,
    foto_url: staf.foto?.trim() || null,
    pendidikan_terakhir: staf.pendidikan?.trim() || null,
    almamater: staf.kampus?.trim() || null,
    status_kepegawaian: staf.statusKepegawaian || "GTY/PTY",
    urutan: urutanSimpan,
    tampil_publik: Boolean(staf.tampil),
  };
}

export default function KelolaProfilStafPage() {
  const { sub = "profil" } = useParams();
  const { pencarian: cariTopbar = "" } = useOutletContext() ?? {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState(FILTER_STAF_AWAL);
  const [halaman, setHalaman] = useState(1);
  const [terpilih, setTerpilih] = useState([]);

  const [modalForm, setModalForm] = useState(null);
  const [detail, setDetail] = useState(null);
  const [akanDihapus, setAkanDihapus] = useState(null);

  // State untuk Sub-menu 1: Profil Sekolah (Termasuk Sambutan Kepala Sekolah)
  const [formProfil, setFormProfil] = useState(PROFIL_AWAL);
  const [profilTersimpan, setProfilTersimpan] = useState(PROFIL_AWAL);

  // State untuk Sub-menu 2: Visi, Misi & Budaya
  const [formVisiMisi, setFormVisiMisi] = useState(VISI_MISI_AWAL);
  const [visiMisiTersimpan, setVisiMisiTersimpan] =
    useState(VISI_MISI_AWAL);

  const [menyimpanKonten, setMenyimpanKonten] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 4500);

    return () => clearTimeout(timer);
  }, [notice]);

  // Mengambil data staf & data pengaturan profil/visi-misi dari backend.
  useEffect(() => {
    async function loadSemuaData() {
      try {
        const [resStaf, resPengaturan] = await Promise.all([
          ambilSemuaStaf().catch(() => ({ data: [] })),
          ambilPengaturanLengkap().catch(() => ({ data: [] })),
        ]);

        const dataStaf = (resStaf.data || []).map(mapStafDariApi);
        setData(dataStaf);

        // Petakan baris key-value dari tabel pengaturan_sekolah.
        const map = {};

        if (Array.isArray(resPengaturan.data)) {
          for (const row of resPengaturan.data) {
            if (row?.key) map[row.key] = row.value;
          }
        }

        const profilDariDb = {
          judulHero: map.profil_judul_hero || PROFIL_AWAL.judulHero,
          deskripsiHero:
            map.profil_deskripsi_hero || PROFIL_AWAL.deskripsiHero,
          judulSejarah:
            map.profil_judul_sejarah || PROFIL_AWAL.judulSejarah,
          sejarahParagraf1:
            map.profil_sejarah_p1 || PROFIL_AWAL.sejarahParagraf1,
          sejarahParagraf2:
            map.profil_sejarah_p2 || PROFIL_AWAL.sejarahParagraf2,
          sejarahParagraf3:
            map.profil_sejarah_p3 || PROFIL_AWAL.sejarahParagraf3,
          judulSambutan: map.sambutan_judul || PROFIL_AWAL.judulSambutan,
          sambutan: map.sambutan_kepsek || PROFIL_AWAL.sambutan,
        };

        setFormProfil(profilDariDb);
        setProfilTersimpan(profilDariDb);

        let misiDariDb = MISI_DEFAULT;

        if (map.misi_sekolah_json) {
          try {
            const parsed = JSON.parse(map.misi_sekolah_json);

            if (Array.isArray(parsed) && parsed.length > 0) {
              misiDariDb = parsed;
            }
          } catch {
            // Gunakan default jika JSON tidak valid.
          }
        }

        const visiMisiDariDb = {
          visi: map.visi_sekolah || VISI_MISI_AWAL.visi,
          komitmenBudaya:
            map.komitmen_budaya || VISI_MISI_AWAL.komitmenBudaya,
          misi: misiDariDb,
        };

        setFormVisiMisi(visiMisiDariDb);
        setVisiMisiTersimpan(visiMisiDariDb);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSemuaData();
  }, []);

  const hasil = useMemo(
    () =>
      urutkanPtk(
        saringPtk(data, {
          ...filter,
          kata: filter.kata || cariTopbar,
        }),
      ),
    [data, filter, cariTopbar],
  );

  const jumlahHalaman = Math.max(
    1,
    Math.ceil(hasil.length / STAF_PER_HALAMAN),
  );

  const halamanAman = Math.min(halaman, jumlahHalaman);

  const items = hasil.slice(
    (halamanAman - 1) * STAF_PER_HALAMAN,
    halamanAman * STAF_PER_HALAMAN,
  );

  const adaFilter = Boolean(filter.kata || filter.rumpun || filter.status);

  const kepala = data.find((staf) => staf.jabatan === JABATAN_KEPALA);

  const profilBerubah =
    JSON.stringify(formProfil) !== JSON.stringify(profilTersimpan);

  const visiMisiBerubah =
    JSON.stringify(formVisiMisi) !== JSON.stringify(visiMisiTersimpan);

  function terapkanFilter(nilai) {
    setFilter(nilai);
    setHalaman(1);
  }

  // Simpan perubahan Sub-menu 1: Profil & Sejarah Sekolah ke PostgreSQL.
  async function simpanKontenProfil() {
    setMenyimpanKonten(true);

    try {
      await simpanPengaturanPortal({
        profil_judul_hero: formProfil.judulHero,
        profil_deskripsi_hero: formProfil.deskripsiHero,
        profil_judul_sejarah: formProfil.judulSejarah,
        profil_sejarah_p1: formProfil.sejarahParagraf1,
        profil_sejarah_p2: formProfil.sejarahParagraf2,
        profil_sejarah_p3: formProfil.sejarahParagraf3,
        sambutan_judul: formProfil.judulSambutan,
        sambutan_kepsek: formProfil.sambutan,
      });

      setProfilTersimpan(formProfil);
      setNotice("Perubahan Profil Sekolah berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      setNotice(error.message || "Gagal menyimpan Profil Sekolah.");
    } finally {
      setMenyimpanKonten(false);
    }
  }

  // Simpan perubahan Sub-menu 2: Visi, Misi & Budaya ke PostgreSQL.
  async function simpanKontenVisiMisi() {
    setMenyimpanKonten(true);

    try {
      await simpanPengaturanPortal({
        visi_sekolah: formVisiMisi.visi,
        komitmen_budaya: formVisiMisi.komitmenBudaya,
        misi_sekolah_json: JSON.stringify(formVisiMisi.misi),
      });

      setVisiMisiTersimpan(formVisiMisi);
      setNotice("Perubahan Visi & Misi berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan visi misi:", error);
      setNotice(error.message || "Gagal menyimpan Visi & Misi.");
    } finally {
      setMenyimpanKonten(false);
    }
  }

  function ubahButirMisi(index, field, value) {
    setFormVisiMisi((sebelumnya) => ({
      ...sebelumnya,
      misi: sebelumnya.misi.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  async function simpan(staf) {
    try {
      const payload = mapStafKeApi(staf);

      if (modalForm?.item?.id) {
        await editStaf(modalForm.item.id, payload);
        setNotice("Data staf berhasil diperbarui.");
      } else {
        await tambahStaf(payload);
        setNotice("Data staf berhasil ditambahkan.");
      }

      setModalForm(null);

      const hasilStaf = await ambilSemuaStaf();
      setData((hasilStaf.data || []).map(mapStafDariApi));
    } catch (error) {
      console.error("Gagal menyimpan data staf:", error);
      setNotice(error.message || "Gagal menyimpan data staf.");
    }
  }

  async function konfirmasiHapus() {
    try {
      if (akanDihapus === "terpilih") {
        await Promise.all(terpilih.map((id) => hapusStaf(id)));
        setTerpilih([]);
        setNotice("Data staf terpilih berhasil dihapus.");
      } else if (akanDihapus?.id) {
        await hapusStaf(akanDihapus.id);
        setNotice("Data staf berhasil dihapus.");
      }

      const hasilStaf = await ambilSemuaStaf();
      setData((hasilStaf.data || []).map(mapStafDariApi));
    } catch (error) {
      console.error("Gagal menghapus data staf:", error);
      setNotice(error.message || "Gagal menghapus data staf.");
    } finally {
      setAkanDihapus(null);
    }
  }

  async function ubahTampil(staf) {
    try {
      await editStaf(staf.id, {
        ...mapStafKeApi(staf),
        tampil_publik: !staf.tampil,
      });

      const hasilStaf = await ambilSemuaStaf();
      setData((hasilStaf.data || []).map(mapStafDariApi));
    } catch (error) {
      console.error("Gagal mengubah status tampil:", error);
      setNotice(error.message || "Gagal mengubah status tampil.");
    }
  }

  function pilih(id) {
    setTerpilih((sebelumnya) =>
      sebelumnya.includes(id)
        ? sebelumnya.filter((item) => item !== id)
        : [...sebelumnya, id],
    );
  }

  function pilihSemua() {
    const semuaId = items.map((item) => item.id);

    const semuaTerpilih = semuaId.every((id) => terpilih.includes(id));

    setTerpilih((sebelumnya) =>
      semuaTerpilih
        ? sebelumnya.filter((id) => !semuaId.includes(id))
        : [...new Set([...sebelumnya, ...semuaId])],
    );
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-xl border border-border-muted bg-surface-light px-5 py-3 text-sm font-medium text-primary">
          {notice}
        </div>
      )}

      {/* =====================================================================
          SUB-MENU 1: PROFIL SEKOLAH (/admin/profil-staf/profil)
      ===================================================================== */}
      {sub === "profil" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-container text-cta-gold">
                <Icon name="account_balance" className="text-[26px]" />
              </span>

              <div>
                <h2 className="text-xl font-bold text-primary">
                  Kilas Sejarah &amp; Identitas Halaman Profil Sekolah
                </h2>

                <p className="text-body-sm text-text-muted">
                  Kelola narasi utama dan perjalanan sejarah yang tampil di
                  halaman Profil Sekolah publik.
                </p>
              </div>

              <Link
                to="/profil"
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-lg border border-border-muted px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-light"
              >
                <Icon name="open_in_new" className="text-[18px]" />
                Lihat Halaman Publik
              </Link>
            </div>

            <div className="mt-6 space-y-5 border-t border-border-muted pt-6">
              <div>
                <label
                  htmlFor="profil-judul-hero"
                  className="block font-bold text-primary"
                >
                  Judul Utama (Hero) Halaman Profil
                </label>

                <input
                  id="profil-judul-hero"
                  type="text"
                  value={formProfil.judulHero}
                  onChange={(e) =>
                    setFormProfil((p) => ({ ...p, judulHero: e.target.value }))
                  }
                  className="mt-2 block w-full rounded-xl border border-border-muted bg-surface-light/60 px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <BlokTeksProfil
                id="profil-deskripsi-hero"
                judul="Deskripsi Pengantar Halaman Profil"
                nilai={formProfil.deskripsiHero}
                onUbah={(v) =>
                  setFormProfil((p) => ({ ...p, deskripsiHero: v }))
                }
                batas={400}
                kiri="Ditampilkan tepat di bawah judul utama halaman Profil"
              />

              <div>
                <label
                  htmlFor="profil-judul-sejarah"
                  className="block font-bold text-primary"
                >
                  Judul Seksi Kilas Sejarah &amp; Transformasi
                </label>

                <input
                  id="profil-judul-sejarah"
                  type="text"
                  value={formProfil.judulSejarah}
                  onChange={(e) =>
                    setFormProfil((p) => ({
                      ...p,
                      judulSejarah: e.target.value,
                    }))
                  }
                  className="mt-2 block w-full rounded-xl border border-border-muted bg-surface-light/60 px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <BlokTeksProfil
                  id="sejarah-p1"
                  judul="Paragraf Sejarah 1 (Awal Berdiri)"
                  nilai={formProfil.sejarahParagraf1}
                  onUbah={(v) =>
                    setFormProfil((p) => ({ ...p, sejarahParagraf1: v }))
                  }
                  batas={600}
                  kiri="Bagian 1"
                />

                <BlokTeksProfil
                  id="sejarah-p2"
                  judul="Paragraf Sejarah 2 (Perkembangan & Alumni)"
                  nilai={formProfil.sejarahParagraf2}
                  onUbah={(v) =>
                    setFormProfil((p) => ({ ...p, sejarahParagraf2: v }))
                  }
                  batas={600}
                  kiri="Bagian 2"
                />

                <BlokTeksProfil
                  id="sejarah-p3"
                  judul="Paragraf Sejarah 3 (Komitmen Adiwiyata)"
                  nilai={formProfil.sejarahParagraf3}
                  onUbah={(v) =>
                    setFormProfil((p) => ({ ...p, sejarahParagraf3: v }))
                  }
                  batas={600}
                  kiri="Bagian 3"
                />
              </div>
            </div>
          </section>

          {/* Sambutan Kepala Sekolah */}
          <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-container text-cta-gold">
                <Icon name="format_quote" filled className="text-[28px]" />
              </span>

              <div>
                <h2 className="text-xl font-bold text-primary">
                  Sambutan Kepala Sekolah
                </h2>

                <p className="text-body-sm text-text-muted">
                  Ditayangkan pada Beranda Publik dan halaman Direktori Guru
                  &amp; Staf.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5 border-t border-border-muted pt-6">
              <div>
                <label
                  htmlFor="sambutan-judul"
                  className="block font-bold text-primary"
                >
                  Judul Kutipan Sambutan Kepala Sekolah
                </label>

                <input
                  id="sambutan-judul"
                  type="text"
                  value={formProfil.judulSambutan}
                  onChange={(e) =>
                    setFormProfil((p) => ({
                      ...p,
                      judulSambutan: e.target.value,
                    }))
                  }
                  className="mt-2 block w-full rounded-xl border border-border-muted bg-surface-light/60 px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <BlokTeksProfil
                id="profil-sambutan"
                judul="Isi Teks Sambutan Kepala Sekolah"
                nilai={formProfil.sambutan}
                onUbah={(v) => setFormProfil((p) => ({ ...p, sambutan: v }))}
                batas={900}
                serif
                kiri={
                  kepala?.nama
                    ? `Kepala Sekolah Terpaut: ${kepala.nama}`
                    : "Kepala Sekolah: Junaidi"
                }
                kanan={`${formProfil.sambutan.length} Karakter`}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-border-muted pt-6">
              <button
                type="button"
                disabled={!profilBerubah || menyimpanKonten}
                onClick={() => setFormProfil(profilTersimpan)}
                className="rounded-lg border border-border-muted px-5 py-2.5 text-sm font-semibold text-text-muted hover:bg-surface-light disabled:opacity-40"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={simpanKontenProfil}
                disabled={!profilBerubah || menyimpanKonten}
                className="inline-flex items-center gap-2 rounded-full bg-cta-gold px-6 py-3 text-sm font-bold text-primary shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="cloud_upload" className="text-[20px]" />

                {menyimpanKonten
                  ? "Menyimpan..."
                  : "Simpan Perubahan Profil Sekolah"}
              </button>
            </div>
          </section>

          {/* Ekstrakurikuler berada tepat di bawah Sambutan Kepala Sekolah */}
          <EkstrakurikulerSection />
        </div>
      )}

      {/* =====================================================================
          SUB-MENU 2: VISI, MISI & BUDAYA (/admin/profil-staf/visi-misi)
      ===================================================================== */}
      {sub === "visi-misi" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-container text-cta-gold">
                <Icon name="flag" className="text-[26px]" />
              </span>

              <div>
                <h2 className="text-xl font-bold text-primary">
                  Visi Utama &amp; Komitmen Budaya Sekolah
                </h2>

                <p className="text-body-sm text-text-muted">
                  Teks ini ditampilkan pada halaman publik Visi, Misi &amp;
                  Budaya Sekolah.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 border-t border-border-muted pt-6 lg:grid-cols-2">
              <BlokTeksProfil
                id="visi-utama"
                judul="Visi Utama Institusi"
                nilai={formVisiMisi.visi}
                onUbah={(v) => setFormVisiMisi((p) => ({ ...p, visi: v }))}
                batas={350}
                serif
                kiri="Kurikulum: Kurikulum Merdeka Terintegrasi"
              />

              <BlokTeksProfil
                id="komitmen-budaya"
                judul="Subjudul Komitmen Budaya Karakter"
                nilai={formVisiMisi.komitmenBudaya}
                onUbah={(v) =>
                  setFormVisiMisi((p) => ({ ...p, komitmenBudaya: v }))
                }
                batas={350}
                kiri="Landasan Nilai & Budaya Adiwiyata"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-border-muted pb-5">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  5 Misi Strategis Penyelenggaraan Pendidikan
                </h2>

                <p className="text-body-sm text-text-muted">
                  Kelola kelima butir misi beserta indikator capaiannya.
                </p>
              </div>

              <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-fixed-variant">
                5 Butir Misi
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {formVisiMisi.misi.map((item, idx) => (
                <div
                  key={item.nomor || idx}
                  className="space-y-3 rounded-xl border border-border-muted bg-surface-light/40 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-primary-container px-3 py-1 text-xs font-bold text-cta-gold">
                      Misi {item.nomor || `0${idx + 1}`}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-text-muted">
                      Judul Misi
                    </label>

                    <input
                      type="text"
                      value={item.judul}
                      onChange={(e) =>
                        ubahButirMisi(idx, "judul", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-border-muted bg-surface-white px-3.5 py-2 text-sm font-semibold text-primary focus:border-secondary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-text-muted">
                      Deskripsi Misi
                    </label>

                    <textarea
                      rows={3}
                      value={item.deskripsi}
                      onChange={(e) =>
                        ubahButirMisi(idx, "deskripsi", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-border-muted bg-surface-white p-3 text-sm text-on-surface focus:border-secondary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-text-muted">
                      Indikator Capaian
                    </label>

                    <input
                      type="text"
                      value={item.indikator}
                      onChange={(e) =>
                        ubahButirMisi(idx, "indikator", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-border-muted bg-surface-white px-3.5 py-2 text-sm font-medium text-secondary focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-border-muted pt-6">
              <button
                type="button"
                disabled={!visiMisiBerubah || menyimpanKonten}
                onClick={() => setFormVisiMisi(visiMisiTersimpan)}
                className="rounded-lg border border-border-muted px-5 py-2.5 text-sm font-semibold text-text-muted hover:bg-surface-light disabled:opacity-40"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={simpanKontenVisiMisi}
                disabled={!visiMisiBerubah || menyimpanKonten}
                className="inline-flex items-center gap-2 rounded-full bg-cta-gold px-6 py-3 text-sm font-bold text-primary shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="cloud_upload" className="text-[20px]" />

                {menyimpanKonten
                  ? "Menyimpan..."
                  : "Simpan Perubahan Visi & Misi"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          SUB-MENU 3: GURU & TENAGA KEPENDIDIKAN (/admin/profil-staf/guru)
      ===================================================================== */}
      {sub === "guru" && (
        <>
          <StafToolbar
            filter={filter}
            onFilter={terapkanFilter}
            onReset={() => terapkanFilter(FILTER_STAF_AWAL)}
            adaFilter={adaFilter}
            onTambah={() => setModalForm({ item: null })}
          />

          {loading ? (
            <p className="text-sm text-gray-500">Memuat data staf...</p>
          ) : (
            <StafTable
              items={items}
              total={hasil.length}
              totalTerverifikasi={data.length}
              halaman={halamanAman}
              jumlahHalaman={jumlahHalaman}
              perHalaman={STAF_PER_HALAMAN}
              terpilih={terpilih}
              onPilih={pilih}
              onPilihSemua={pilihSemua}
              onHapusTerpilih={() => setAkanDihapus("terpilih")}
              onHalaman={(nomorHalaman) =>
                setHalaman(
                  Math.min(Math.max(1, nomorHalaman), jumlahHalaman),
                )
              }
              onTampil={ubahTampil}
              onLihat={setDetail}
              onEdit={(item) => setModalForm({ item })}
              onHapus={setAkanDihapus}
            />
          )}
        </>
      )}

      {/* Modal tambah dan edit staf */}
      {modalForm && (
        <StafFormModal
          item={modalForm.item}
          onSimpan={simpan}
          onTutup={() => setModalForm(null)}
        />
      )}

      {/* Modal detail staf */}
      {detail && !modalForm && (
        <StafDetailModal
          staf={detail}
          onEdit={(item) => setModalForm({ item })}
          onTutup={() => setDetail(null)}
        />
      )}

      {/* Dialog konfirmasi hapus */}
      {akanDihapus && (
        <ConfirmDialog
          judul={
            akanDihapus === "terpilih"
              ? `Hapus ${terpilih.length} data terpilih?`
              : "Hapus data ini?"
          }
          pesan={
            akanDihapus === "terpilih"
              ? "Semua data yang dipilih akan dihapus dan tidak tampil lagi di portal."
              : `“${akanDihapus.nama}” akan dihapus dan tidak tampil lagi di portal.`
          }
          labelKonfirmasi={
            akanDihapus === "terpilih" ? `Hapus ${terpilih.length}` : "Hapus"
          }
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </div>
  );
}
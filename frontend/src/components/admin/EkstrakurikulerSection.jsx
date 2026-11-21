
/** @format */

import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { unggahGambar } from "@/services/upload.service";
import Icon from "@/components/ui/Icon";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const API_URL = `${API_BASE_URL}/api/ekstrakurikuler`;

const FORM_AWAL = {
  nama: "",
  pembina: "",
  foto_url: "",
  status: "tayang",
};

// ==========================================
// REQUEST API
// ==========================================

async function requestAPI(url, options = {}) {
  const token = localStorage.getItem("cms_token");

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Permintaan gagal (${response.status}).`
    );
  }

  return result;
}

function ambilData(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.data?.data)) return result.data.data;
  return [];
}

// ==========================================
// MODAL TAMBAH DAN EDIT
// ==========================================

function ModalEkstrakurikuler({
  data,
  loading,
  onTutup,
  onSimpan,
  onNotifikasi,
}) {
  const [form, setForm] = useState(() => ({
    ...FORM_AWAL,
    ...(data || {}),
    status: String(data?.status || "tayang").toLowerCase(),
  }));

  const [fileFoto, setFileFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(
    data?.foto_url || ""
  );

  const [errorFoto, setErrorFoto] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (!fileFoto) {
      setPreviewFoto(data?.foto_url || "");
      return;
    }

    const objectUrl = URL.createObjectURL(fileFoto);
    setPreviewFoto(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [fileFoto, data?.foto_url]);

  function ubahForm(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function pilihFoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formatDiizinkan = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!formatDiizinkan.includes(file.type)) {
      setErrorFoto("Foto harus berformat JPG, PNG, atau WebP.");
      onNotifikasi(
        "warning",
        "Foto harus berformat JPG, PNG, atau WebP."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorFoto("Ukuran foto maksimal 5 MB.");
      onNotifikasi(
        "warning",
        "Ukuran foto maksimal 5 MB."
      );
      event.target.value = "";
      return;
    }

    setErrorFoto("");
    setFileFoto(file);
  }

  async function submit(event) {
    event.preventDefault();

    if (!form.nama.trim() || !form.pembina.trim()) {
      onNotifikasi(
        "warning",
        "Nama ekstrakurikuler dan pembina wajib diisi."
      );
      return;
    }

    if (errorFoto) {
      onNotifikasi("warning", errorFoto);
      return;
    }

    try {
      let fotoUrl = form.foto_url || "";

      if (fileFoto) {
        fotoUrl = await unggahGambar(fileFoto);
      }

      await onSimpan({
        nama: form.nama.trim(),
        pembina: form.pembina.trim(),
        foto_url: fotoUrl,
        status: form.status.toLowerCase(),
      });
    } catch (error) {
      onNotifikasi(
        "error",
        error.message || "Gagal mengunggah foto."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-green-950">
            {data?.id
              ? "Edit Ekstrakurikuler"
              : "Tambah Ekstrakurikuler"}
          </h3>

          <button
            type="button"
            onClick={onTutup}
            disabled={loading}
            className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* FOTO */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Foto Ekstrakurikuler
          </label>

          {previewFoto ? (
            <img
              src={previewFoto}
              alt="Preview ekstrakurikuler"
              className="mb-3 h-44 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="mb-3 flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
              Belum ada foto dipilih
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={pilihFoto}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            {previewFoto ? "Ganti Foto" : "Pilih Foto"}
          </button>

          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG, atau WebP. Maksimal 5 MB.
          </p>

          {errorFoto && (
            <p className="mt-2 text-sm text-red-600">
              {errorFoto}
            </p>
          )}
        </div>

        {/* NAMA */}
        <div>
          <label
            htmlFor="ekskul-nama"
            className="mb-2 block text-sm font-semibold"
          >
            Nama Ekstrakurikuler
          </label>

          <input
            id="ekskul-nama"
            name="nama"
            value={form.nama}
            onChange={ubahForm}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
            placeholder="Contoh: Klub Robotika & IoT"
          />
        </div>

        {/* PEMBINA */}
        <div>
          <label
            htmlFor="ekskul-pembina"
            className="mb-2 block text-sm font-semibold"
          >
            Nama Pembina
          </label>

          <input
            id="ekskul-pembina"
            name="pembina"
            value={form.pembina}
            onChange={ubahForm}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
            placeholder="Nama pembina"
          />
        </div>

        {/* STATUS */}
        <div>
          <label
            htmlFor="ekskul-status"
            className="mb-2 block text-sm font-semibold"
          >
            Status Publikasi
          </label>

          <select
            id="ekskul-status"
            name="status"
            value={form.status}
            onChange={ubahForm}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
          >
            <option value="tayang">Tayang</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* TOMBOL */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onTutup}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Mengunggah dan Menyimpan..."
              : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// MODAL DETAIL EKSTRAKURIKULER
// ==========================================

function ModalDetailEkstrakurikuler({ data, onTutup }) {
  if (!data) return null;

  const statusTayang =
    String(data.status || "tayang").toLowerCase() === "tayang";

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onTutup();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-detail-ekskul"
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h3
            id="judul-detail-ekskul"
            className="text-lg font-bold text-green-950"
          >
            Detail Ekstrakurikuler
          </h3>

          <button
            type="button"
            onClick={onTutup}
            aria-label="Tutup detail"
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6 flex items-center gap-4">
            {data.foto_url ? (
              <img
                src={data.foto_url}
                alt={`Foto ${data.nama || "ekstrakurikuler"}`}
                className="h-24 w-24 shrink-0 rounded-xl border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-center text-xs text-gray-500">
                Belum ada foto
              </div>
            )}

            <div className="min-w-0">
              <h4 className="break-words text-lg font-bold text-gray-900">
                {data.nama || "-"}
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Ekstrakurikuler SMA Harapan Jaya
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-200 border-y border-gray-200">
            <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-4 py-3">
              <span className="text-sm text-gray-500">Nama</span>
              <span className="break-words text-sm font-medium text-gray-900">
                {data.nama || "-"}
              </span>
            </div>

            <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-4 py-3">
              <span className="text-sm text-gray-500">Pembina</span>
              <span className="break-words text-sm font-medium text-gray-900">
                {data.pembina || "-"}
              </span>
            </div>

            <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-4 py-3">
              <span className="text-sm text-gray-500">Status</span>

              <span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    statusTayang
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {statusTayang ? "Tayang" : "Draft"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onTutup}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// KOMPONEN UTAMA
// ==========================================

export default function EkstrakurikulerSection() {
  const {
    tampilkanNotifikasi = () => {},
  } = useOutletContext() ?? {};

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [pencarian, setPencarian] = useState("");

  // ========================================
  // MEMUAT DATA
  // ========================================

  async function muatData() {
    setMemuat(true);
    setError("");

    try {
      const result = await requestAPI(API_URL);
      setItems(ambilData(result));
    } catch (err) {
      setError(
        err.message || "Gagal memuat data ekstrakurikuler."
      );
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatData();
  }, []);

  // ========================================
  // TAMBAH DAN EDIT DATA
  // ========================================

  async function simpanData(payload) {
    setLoading(true);

    try {
      const sedangEdit = Boolean(modal?.id);

      await requestAPI(
        sedangEdit ? `${API_URL}/${modal.id}` : API_URL,
        {
          method: sedangEdit ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setModal(null);

      await muatData();

      tampilkanNotifikasi(
        "success",
        sedangEdit
          ? "Data ekstrakurikuler berhasil diperbarui."
          : "Ekstrakurikuler berhasil ditambahkan."
      );
    } catch (err) {
      tampilkanNotifikasi(
        "error",
        err.message || "Gagal menyimpan data ekstrakurikuler."
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // HAPUS DATA
  // ========================================

  async function hapusData(item) {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus ekstrakurikuler "${item.nama}"?`
    );

    if (!yakin) return;

    try {
      await requestAPI(`${API_URL}/${item.id}`, {
        method: "DELETE",
      });

      await muatData();

      tampilkanNotifikasi(
        "success",
        `Ekstrakurikuler "${item.nama}" berhasil dihapus.`
      );
    } catch (err) {
      tampilkanNotifikasi(
        "error",
        err.message || "Gagal menghapus data ekstrakurikuler."
      );
    }
  }

  // ========================================
  // PENCARIAN
  // ========================================

  const hasilFilter = items.filter((item) => {
    const kata = pencarian.trim().toLowerCase();

    return (
      String(item.nama || "").toLowerCase().includes(kata) ||
      String(item.pembina || "").toLowerCase().includes(kata)
    );
  });

  // ========================================
  // TAMPILAN
  // ========================================

  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm md:p-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-primary">
            Ekstrakurikuler
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Kelola nama, pembina, foto, dan status ekstrakurikuler sekolah.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ ...FORM_AWAL })}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500"
        >
          + Tambah Ekstrakurikuler
        </button>
      </div>

      {/* PENCARIAN */}
      <div className="mt-6">
        <input
          type="search"
          value={pencarian}
          onChange={(event) => setPencarian(event.target.value)}
          placeholder="Cari nama atau pembina..."
          className="w-full rounded-lg border border-border-muted px-4 py-2.5 text-sm sm:max-w-xs"
        />
      </div>

      {/* ERROR MEMUAT DATA */}
      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}

          <button
            type="button"
            onClick={muatData}
            className="ml-3 font-semibold underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* DAFTAR DATA */}
      {memuat ? (
        <p className="py-10 text-center text-sm text-text-muted">
          Memuat data ekstrakurikuler...
        </p>
      ) : hasilFilter.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">
          {pencarian
            ? "Data tidak ditemukan."
            : "Belum ada data ekstrakurikuler."}
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-light text-text-muted">
              <tr>
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Pembina</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-muted">
              {hasilFilter.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    {item.foto_url ? (
                      <img
                        src={item.foto_url}
                        alt={item.nama}
                        className="h-14 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-xs text-text-muted">
                        Belum ada foto
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    {item.nama}
                  </td>

                  <td className="px-4 py-3">
                    {item.pembina}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-primary">
                      {String(item.status || "tayang").toLowerCase() ===
                      "tayang"
                        ? "Tayang"
                        : "Draft"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex min-w-[132px] items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setModal({
                            ...item,
                            status: String(
                              item.status || "tayang"
                            ).toLowerCase(),
                          })
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50 hover:text-green-800"
                        title="Edit"
                        aria-label={`Edit ${item.nama}`}
                      >
                        <Icon name="edit" className="text-xl" />
                      </button>

                      <button
                        type="button"
                        onClick={() => hapusData(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 hover:text-red-700"
                        title="Hapus"
                        aria-label={`Hapus ${item.nama}`}
                      >
                        <Icon name="delete" className="text-xl" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDetailItem(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-sky-700 transition hover:bg-sky-50 hover:text-sky-800"
                        title="Lihat detail"
                        aria-label={`Lihat detail ${item.nama}`}
                      >
                        <Icon name="visibility" className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* JUMLAH DATA */}
      <div className="mt-5 border-t border-border-muted pt-4 text-xs text-text-muted">
        Menampilkan {hasilFilter.length} dari {items.length} data.
      </div>

      {/* MODAL TAMBAH DAN EDIT */}
      {modal && (
        <ModalEkstrakurikuler
          data={modal}
          loading={loading}
          onTutup={() => !loading && setModal(null)}
          onSimpan={simpanData}
          onNotifikasi={tampilkanNotifikasi}
        />
      )}

      {/* MODAL DETAIL */}
      {detailItem && (
        <ModalDetailEkstrakurikuler
          data={detailItem}
          onTutup={() => setDetailItem(null)}
        />
      )}
    </section>
  );
}


/** @format */

import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Icon from "@/components/ui/Icon";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/api/ekstrakurikuler`;

const dataKosong = {
  nama: "",
  pembina: "",
  status: "Tayang",
  foto: null,
};

async function requestAPI(url, options = {}) {
  const token = localStorage.getItem("cms_token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Terjadi kesalahan saat menghubungi server."
    );
  }

  return result;
}

function ambilData(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  if (Array.isArray(result?.ekstrakurikuler)) return result.ekstrakurikuler;
  return [];
}

function ModalEkstrakurikuler({
  data,
  onTutup,
  onSimpan,
  loading,
  tampilkanNotifikasi,
}) {
  const [form, setForm] = useState(() => ({
    nama: data?.nama || "",
    pembina: data?.pembina || "",
    status: data?.status || "Tayang",
    foto: null,
  }));

  const [preview, setPreview] = useState(data?.foto_url || "");
  const fileRef = useRef(null);

  useEffect(() => {
    if (!form.foto) {
      setPreview(data?.foto_url || "");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(form.foto);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.foto, data?.foto_url]);

  const ubahForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const pilihFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      tampilkanNotifikasi(
        "warning",
        "File harus berupa gambar."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      tampilkanNotifikasi(
        "warning",
        "Ukuran foto maksimal 2 MB."
      );

      e.target.value = "";
      return;
    }

    setForm((prev) => ({ ...prev, foto: file }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.nama.trim() || !form.pembina.trim()) {
      tampilkanNotifikasi(
        "warning",
        "Nama ekstrakurikuler dan pembina wajib diisi."
      );

      return;
    }

    onSimpan(form);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/50 p-2 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onTutup();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-modal-ekskul"
        className="flex max-h-[calc(100dvh-1rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]"
      >
        <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h2
              id="judul-modal-ekskul"
              className="text-lg font-bold text-green-950"
            >
              {data?.id ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Lengkapi informasi ekstrakurikuler sekolah.
            </p>
          </div>

          <button
            type="button"
            onClick={onTutup}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Tutup"
          >
            <Icon name="close" className="text-xl" />
          </button>
        </header>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Foto Ekstrakurikuler
              </label>

              <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview ekstrakurikuler"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-gray-400">
                    <Icon name="image" className="text-4xl" />
                    <span className="text-sm">
                      Belum ada foto dipilih
                    </span>
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
                  className="inline-flex items-center gap-2 rounded-lg border border-green-800 px-4 py-2 text-sm font-semibold text-green-900 hover:bg-green-50"
                >
                  <Icon name="upload" />
                  Pilih Foto
                </button>

                <p className="text-xs text-gray-500">
                  JPG, PNG, atau WebP. Maksimal 2 MB.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="nama-ekskul"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Nama Ekstrakurikuler
              </label>

              <input
                id="nama-ekskul"
                name="nama"
                value={form.nama}
                onChange={ubahForm}
                placeholder="Contoh: Klub Robotika & IoT"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="pembina-ekskul"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Nama Pembina
              </label>

              <input
                id="pembina-ekskul"
                name="pembina"
                value={form.pembina}
                onChange={ubahForm}
                placeholder="Contoh: Bpk. Rudi Hartono, S.T."
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="status-ekskul"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Status Publikasi
              </label>

              <select
                id="status-ekskul"
                name="status"
                value={form.status}
                onChange={ubahForm}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              >
                <option value="Tayang">Tayang</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
            <button
              type="button"
              onClick={onTutup}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 sm:w-auto sm:py-2.5"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-900 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-2.5"
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Icon name="save" />
                  Simpan
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default function KelolaEkstrakurikulerPage() {
  const {
    tampilkanNotifikasi = () => {},
  } = useOutletContext() ?? {};

  const [items, setItems] = useState([]);
  const [pencarian, setPencarian] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState("");

  const muatData = async () => {
    setMemuat(true);
    setError("");

    try {
      const result = await requestAPI(API_URL);
      setItems(ambilData(result));
      return true;
    } catch (err) {
      setError(err.message || "Gagal memuat data ekstrakurikuler.");
      return false;
    } finally {
      setMemuat(false);
    }
  };

  useEffect(() => {
    muatData();
  }, []);

  const bukaTambah = () => {
    setDataEdit(null);
    setModalTerbuka(true);
  };

  const bukaEdit = (item) => {
    setDataEdit(item);
    setModalTerbuka(true);
  };

  const tutupModal = () => {
    if (loading) return;

    setModalTerbuka(false);
    setDataEdit(null);
  };

  // Simpan data ekstrakurikuler.
  const simpanData = async (form) => {
    setLoading(true);

    const sedangEdit = Boolean(dataEdit);

    try {
      const body = new FormData();

      body.append("nama", form.nama.trim());
      body.append("pembina", form.pembina.trim());
      body.append("status", form.status);

      if (form.foto instanceof File) {
        body.append("foto", form.foto);
      }

      const url = sedangEdit
        ? `${API_URL}/${dataEdit.id}`
        : API_URL;

      await requestAPI(url, {
        method: sedangEdit ? "PUT" : "POST",
        body,
      });

      setModalTerbuka(false);
      setDataEdit(null);

      const berhasilMuat = await muatData();

      if (berhasilMuat) {
        tampilkanNotifikasi(
          "success",
          sedangEdit
            ? "Ekstrakurikuler berhasil diperbarui."
            : "Ekstrakurikuler berhasil ditambahkan."
        );
      } else {
        tampilkanNotifikasi(
          "warning",
          "Data tersimpan, tetapi daftar gagal dimuat ulang."
        );
      }
    } catch (err) {
      tampilkanNotifikasi(
        "error",
        err.message || "Gagal menyimpan ekstrakurikuler."
      );
    } finally {
      setLoading(false);
    }
  };

  // Hapus data ekstrakurikuler.
  const hapusData = async (item) => {
    const yakin = window.confirm(
      `Yakin ingin menghapus ekstrakurikuler "${item.nama}"?`
    );

    if (!yakin) return;

    try {
      await requestAPI(`${API_URL}/${item.id}`, {
        method: "DELETE",
      });

      const berhasilMuat = await muatData();

      if (berhasilMuat) {
        tampilkanNotifikasi(
          "success",
          `Ekstrakurikuler "${item.nama}" berhasil dihapus.`
        );
      } else {
        tampilkanNotifikasi(
          "warning",
          "Data berhasil dihapus, tetapi daftar gagal dimuat ulang."
        );
      }
    } catch (err) {
      tampilkanNotifikasi(
        "error",
        err.message || "Gagal menghapus ekstrakurikuler."
      );
    }
  };

  const hasilFilter = items.filter((item) => {
    const kataKunci = pencarian.toLowerCase();

    const cocokNama = (item.nama || "")
      .toLowerCase()
      .includes(kataKunci);

    const cocokPembina = (item.pembina || "")
      .toLowerCase()
      .includes(kataKunci);

    const status = item.status || "Tayang";

    const cocokStatus =
      filterStatus === "Semua" || status === filterStatus;

    return (cocokNama || cocokPembina) && cocokStatus;
  });

  return (
    <div className="w-full min-w-0 space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-950">
            Manajemen Ekstrakurikuler
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi kegiatan ekstrakurikuler SMA Harapan Jaya.
          </p>
        </div>

        <button
          type="button"
          onClick={bukaTambah}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 sm:w-auto"
        >
          <Icon name="add" className="text-xl" />
          Tambah Ekstrakurikuler
        </button>
      </div>

      {/* Ringkasan data */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Total Ekstrakurikuler
            </p>

            <Icon name="groups" className="text-2xl text-green-800" />
          </div>

          <p className="mt-3 text-3xl font-bold text-green-950">
            {items.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Tayang</p>

            <Icon name="visibility" className="text-2xl text-green-700" />
          </div>

          <p className="mt-3 text-3xl font-bold text-green-800">
            {items.filter(
              (item) => (item.status || "Tayang") === "Tayang"
            ).length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Draft</p>

            <Icon name="edit_note" className="text-2xl text-amber-600" />
          </div>

          <p className="mt-3 text-3xl font-bold text-amber-600">
            {items.filter((item) => item.status === "Draft").length}
          </p>
        </div>
      </div>

      {/* Daftar ekstrakurikuler */}
      <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-bold text-green-950">
              Daftar Ekstrakurikuler
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Data kegiatan ekstrakurikuler sekolah.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-64">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={pencarian}
                onChange={(e) => setPencarian(e.target.value)}
                placeholder="Cari ekstrakurikuler..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-green-700"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-700 sm:w-auto"
            >
              <option value="Semua">Semua Status</option>
              <option value="Tayang">Tayang</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Error memuat data tetap ditampilkan di halaman */}
        {error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center justify-between gap-3">
              <span>{error}</span>

              <button
                type="button"
                onClick={muatData}
                className="font-semibold underline"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {memuat ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
            <Icon
              name="progress_activity"
              className="animate-spin text-3xl"
            />

            <p className="text-sm">
              Memuat data ekstrakurikuler...
            </p>
          </div>
        ) : hasilFilter.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-800">
              <Icon name="school" className="text-3xl" />
            </div>

            <h3 className="font-bold text-gray-800">
              Belum ada data ekstrakurikuler
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {pencarian || filterStatus !== "Semua"
                ? "Tidak ada data yang sesuai dengan pencarian atau filter."
                : "Tambahkan data ekstrakurikuler sekolah melalui tombol Tambah Ekstrakurikuler."}
            </p>

            {!pencarian && filterStatus === "Semua" && (
              <button
                type="button"
                onClick={bukaTambah}
                className="mt-4 rounded-lg bg-green-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                + Tambah Ekstrakurikuler
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tampilan desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Foto</th>
                    <th className="px-5 py-4">
                      Nama Ekstrakurikuler
                    </th>
                    <th className="px-5 py-4">Pembina</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {hasilFilter.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        {item.foto_url ? (
                          <img
                            src={item.foto_url}
                            alt={item.nama}
                            className="h-14 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                            <Icon name="image" className="text-2xl" />
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        {item.nama}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {item.pembina || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            (item.status || "Tayang") === "Tayang"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status || "Tayang"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => bukaEdit(item)}
                            title="Edit ekstrakurikuler"
                            aria-label={`Edit ${item.nama}`}
                            className="rounded-lg p-1.5 text-green-700 transition hover:bg-green-50 hover:text-green-800"
                          >
                            <Icon name="edit" className="text-xl" />
                          </button>

                          <button
                            type="button"
                            onClick={() => hapusData(item)}
                            title="Hapus ekstrakurikuler"
                            aria-label={`Hapus ${item.nama}`}
                            className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50"
                          >
                            <Icon name="delete" className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tampilan mobile */}
            <div className="space-y-3 p-3 sm:p-4 md:hidden">
              {hasilFilter.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  {item.foto_url && (
                    <img
                      src={item.foto_url}
                      alt={item.nama}
                      className="h-40 w-full object-cover sm:h-44"
                    />
                  )}

                  <div className="min-w-0 space-y-3 p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-green-950">
                          {item.nama}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Pembina: {item.pembina || "-"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                          (item.status || "Tayang") === "Tayang"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status || "Tayang"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() => bukaEdit(item)}
                        title="Edit ekstrakurikuler"
                        aria-label={`Edit ${item.nama}`}
                        className="rounded-lg p-2 text-green-700 transition hover:bg-green-50 hover:text-green-800"
                      >
                        <Icon name="edit" className="text-xl" />
                      </button>

                      <button
                        type="button"
                        onClick={() => hapusData(item)}
                        title="Hapus ekstrakurikuler"
                        aria-label={`Hapus ${item.nama}`}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      >
                        <Icon name="delete" className="text-xl" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="border-t border-gray-200 px-5 py-4 text-xs text-gray-500">
          Menampilkan {hasilFilter.length} dari {items.length} data ekstrakurikuler.
        </div>
      </div>

      {/* Modal tambah dan edit */}
      {modalTerbuka && (
        <ModalEkstrakurikuler
          data={dataEdit}
          onTutup={tutupModal}
          onSimpan={simpanData}
          loading={loading}
          tampilkanNotifikasi={tampilkanNotifikasi}
        />
      )}
    </div>
  );
}


import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Edit, Trash2, Search, X, Filter } from "lucide-react";
import { mockBerita } from "@/mocks/berita";

const KelolaBeritaPage = () => {
  const outletContext = useOutletContext() ?? {};
  const tampilkanNotifikasi = outletContext.tampilkanNotifikasi;

  const [data, setData] = useState(mockBerita);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const beriNotifikasi = (tipe, pesan) => {
    if (typeof tampilkanNotifikasi === "function") {
      tampilkanNotifikasi(tipe, pesan);
    } else {
      console.error(
        "tampilkanNotifikasi tidak ditemukan. Periksa AdminLayout.jsx."
      );
    }
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      return;
    }

    setData((prevData) => prevData.filter((item) => item.id !== id));

    beriNotifikasi("success", "Berita berhasil dihapus.");
  };

  const openModal = (item = null) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentItem(null);
    setIsModalOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const newItem = {
      id: currentItem ? currentItem.id : Date.now(),
      title: formData.get("title"),
      category: formData.get("category"),
      date: formData.get("date"),
      status: formData.get("status"),
    };

    if (currentItem) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentItem.id ? newItem : item
        )
      );

      beriNotifikasi("success", "Berita berhasil diperbarui.");
    } else {
      setData((prevData) => [newItem, ...prevData]);

      beriNotifikasi("success", "Berita berhasil ditambahkan.");
    }

    closeModal();
  };

  return (
    <div className="space-y-6 font-body-sm max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Kelola Berita
          </h1>

          <p className="text-sm text-text-muted mt-1">
            Manajemen publikasi berita dan pengumuman sekolah
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-cta-gold hover:bg-yellow-400 text-primary font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Tambah Berita</span>
        </button>
      </div>

      {/* Tabel Berita */}
      <div className="bg-surface-white rounded-xl shadow-sm border border-border-muted overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-muted flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-light/50">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari berita berdasarkan judul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-muted bg-surface-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
            />

            <Search
              className="absolute left-3 top-2.5 text-text-muted"
              size={18}
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-border-muted rounded-lg text-text-muted hover:bg-surface-light bg-surface-white w-full sm:w-auto justify-center transition-colors"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">
              Filter Kategori
            </span>
          </button>
        </div>

        {/* Isi Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-light text-text-muted text-xs uppercase tracking-wider border-b border-border-muted">
                <th className="p-4 font-bold">Judul Berita</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Tanggal</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-muted">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-light/50 transition-colors group"
                  >
                    <td className="p-4 text-sm text-primary font-semibold max-w-md truncate">
                      {item.title}
                    </td>

                    <td className="p-4 text-sm">
                      <span className="px-2.5 py-1 rounded-md bg-surface-container text-primary text-xs font-medium border border-border-muted">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-text-muted">
                      {item.date}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === "Published"
                            ? "bg-secondary-container/50 text-secondary-dark"
                            : item.status === "Draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-surface-container text-text-muted"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal(item)}
                          className="p-2 text-text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-text-muted"
                  >
                    Tidak ada data berita ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-muted flex justify-between items-center text-sm text-text-muted bg-surface-light/50">
          <span>
            Menampilkan 1 hingga {filteredData.length} dari {data.length} entri
          </span>

          <div className="flex gap-1">
            <button
              className="px-3 py-1 border border-border-muted rounded-md bg-surface-white hover:bg-surface-light disabled:opacity-50"
              disabled
            >
              Sebelumnya
            </button>

            <button className="px-3 py-1 border border-border-muted rounded-md bg-primary text-white">
              1
            </button>

            <button className="px-3 py-1 border border-border-muted rounded-md bg-surface-white hover:bg-surface-light">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border-muted">
            <div className="flex justify-between items-center p-6 border-b border-border-muted bg-surface-light/50">
              <h2 className="text-xl font-bold text-primary">
                {currentItem ? "Edit Berita" : "Tambah Berita Baru"}
              </h2>

              <button
                onClick={closeModal}
                className="text-text-muted hover:text-error transition-colors p-1 rounded-md hover:bg-error/10"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-primary mb-1.5">
                  Judul Berita
                </label>

                <input
                  type="text"
                  name="title"
                  defaultValue={currentItem?.title}
                  required
                  placeholder="Masukkan judul berita"
                  className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1.5">
                    Kategori
                  </label>

                  <select
                    name="category"
                    defaultValue={currentItem?.category || "Berita"}
                    className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan">Kegiatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-1.5">
                    Status
                  </label>

                  <select
                    name="status"
                    defaultValue={currentItem?.status || "Draft"}
                    className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-1.5">
                  Tanggal Publikasi
                </label>

                <input
                  type="date"
                  name="date"
                  defaultValue={
                    currentItem?.date ||
                    new Date().toISOString().split("T")[0]
                  }
                  required
                  className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary"
                />
              </div>

              {/* Editor Konten */}
              <div>
                <label className="block text-sm font-bold text-primary mb-1.5">
                  Isi Konten
                </label>

                <textarea
                  rows="4"
                  placeholder="Tulis konten berita di sini..."
                  className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border-muted mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-border-muted rounded-xl text-primary font-bold hover:bg-surface-light transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cta-gold text-primary font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-sm"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaBeritaPage;

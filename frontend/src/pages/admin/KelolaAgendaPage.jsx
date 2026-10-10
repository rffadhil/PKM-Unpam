import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
} from "lucide-react";
import { mockAgenda } from "@/mocks/agenda";

const KelolaAgendaPage = () => {
  const [data, setData] = useState(mockAgenda);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus agenda ini?")) {
      setData(data.filter((item) => item.id !== id));
    }
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
      location: formData.get("location"),
      date: formData.get("date"),
      time: formData.get("time"),
      status: formData.get("status"),
    };

    if (currentItem) {
      setData(
        data.map((item) => (item.id === currentItem.id ? newItem : item)),
      );
    } else {
      setData([newItem, ...data]);
    }
    closeModal();
  };

  return (
    <div className="space-y-6 font-body-sm max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Kelola Agenda</h1>
          <p className="text-sm text-text-muted mt-1">
            Manajemen kegiatan dan jadwal acara sekolah
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-cta-gold hover:bg-yellow-400 text-primary font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Tambah Agenda</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-surface-white rounded-xl shadow-sm border border-border-muted overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border-muted flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-light/50">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari agenda kegiatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-muted bg-surface-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
            />
            <Search
              className="absolute left-3 top-2.5 text-text-muted"
              size={18}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-light text-text-muted text-xs uppercase tracking-wider border-b border-border-muted">
                <th className="p-4 font-bold">Nama Kegiatan</th>
                <th className="p-4 font-bold">Waktu & Tanggal</th>
                <th className="p-4 font-bold">Lokasi</th>
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
                    <td className="p-4 text-sm text-primary font-semibold max-w-sm truncate">
                      {item.title}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-primary font-medium">
                          <CalendarIcon
                            size={14}
                            className="mr-1.5 text-secondary"
                          />
                          {item.date}
                        </div>
                        <div className="flex items-center text-xs text-text-muted">
                          <Clock size={14} className="mr-1.5" />
                          {item.time}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-muted">
                      <div className="flex items-center">
                        <MapPin
                          size={16}
                          className="mr-1.5 text-border-muted"
                        />
                        {item.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === "Selesai"
                            ? "bg-surface-container text-text-muted"
                            : item.status === "Akan Datang"
                              ? "bg-secondary-container/50 text-secondary-dark"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end space-x-2 h-full items-center">
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-text-muted hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors mt-2"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors mt-2"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">
                    Tidak ada data agenda ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-muted flex justify-between items-center text-sm text-text-muted bg-surface-light/50">
          <span>Menampilkan {filteredData.length} agenda</span>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border-muted">
            <div className="flex justify-between items-center p-6 border-b border-border-muted bg-surface-light/50">
              <h2 className="text-xl font-bold text-primary">
                {currentItem ? "Edit Agenda" : "Tambah Agenda Baru"}
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
                  Nama Kegiatan
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={currentItem?.title}
                  required
                  placeholder="Contoh: Rapat Wali Murid"
                  className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-1.5">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={currentItem?.location}
                  required
                  placeholder="Contoh: Aula Utama"
                  className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1.5">
                    Tanggal
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
                <div>
                  <label className="block text-sm font-bold text-primary mb-1.5">
                    Waktu (Jam)
                  </label>
                  <input
                    type="text"
                    name="time"
                    defaultValue={currentItem?.time}
                    placeholder="08:00 - 12:00"
                    required
                    className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-1.5">
                  Status Pelaksanaan
                </label>
                <select
                  name="status"
                  defaultValue={currentItem?.status || "Akan Datang"}
                  className="w-full px-4 py-2.5 bg-surface-light border border-border-muted rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary text-primary"
                >
                  <option value="Akan Datang">Akan Datang</option>
                  <option value="Direncanakan">Direncanakan</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaAgendaPage;

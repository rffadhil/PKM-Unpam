
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AgendaHeader from "@/components/agenda/AgendaHeader";
import AgendaFilters from "@/components/agenda/AgendaFilters";
import AgendaTable from "@/components/agenda/AgendaTable";
import AgendaFormModal from "@/components/agenda/AgendaFormModal";

import { mockAgenda } from "@/mocks/adminAgenda";
import { PERIODE_AKADEMIK } from "@/config/agenda";
import { saringAgenda, urutkanAgenda } from "@/utils/agenda";

const PER_HALAMAN = 5;

const FILTER_AWAL = {
  kategori: "",
  status: "",
  periode: PERIODE_AKADEMIK[0],
  kata: "",
};

export default function KelolaAgendaPage() {
  const { pencarian: cariTopbar = "" } = useOutletContext() ?? {};

  // Menggunakan data dummy agenda dari tim frontend.
  const [data, setData] = useState(mockAgenda);

  const [filter, setFilter] = useState(FILTER_AWAL);
  const [halaman, setHalaman] = useState(1);
  const [modal, setModal] = useState(null);
  const [akanDihapus, setAkanDihapus] = useState(null);
  const [notice, setNotice] = useState("");

  // Menghilangkan notifikasi setelah beberapa detik.
  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => {
      setNotice("");
    }, 4500);

    return () => clearTimeout(timer);
  }, [notice]);

  // Filter dan urutkan agenda.
  const hasil = useMemo(() => {
    return urutkanAgenda(
      saringAgenda(data, {
        ...filter,
        kata: filter.kata || cariTopbar,
      }),
    );
  }, [data, filter, cariTopbar]);

  // Pagination.
  const jumlahHalaman = Math.max(
    1,
    Math.ceil(hasil.length / PER_HALAMAN),
  );

  const halamanAman = Math.min(halaman, jumlahHalaman);

  const items = hasil.slice(
    (halamanAman - 1) * PER_HALAMAN,
    halamanAman * PER_HALAMAN,
  );

  function terapkanFilter(nilai) {
    setFilter(nilai);
    setHalaman(1);
  }

  // Tambah atau edit agenda secara lokal.
  function simpan(agenda) {
    if (agenda.id) {
      setData((dataLama) =>
        dataLama.map((item) =>
          String(item.id) === String(agenda.id)
            ? agenda
            : item,
        ),
      );

      setNotice("Agenda berhasil diperbarui.");
    } else {
      const agendaBaru = {
        ...agenda,
        id: Date.now(),
      };

      setData((dataLama) => [
        agendaBaru,
        ...dataLama,
      ]);

      setNotice("Agenda baru berhasil ditambahkan.");
    }

    setModal(null);
  }

  // Hapus agenda secara lokal.
  function konfirmasiHapus() {
    if (!akanDihapus) return;

    setData((dataLama) =>
      dataLama.filter(
        (item) =>
          String(item.id) !== String(akanDihapus.id),
      ),
    );

    setAkanDihapus(null);
    setNotice("Agenda berhasil dihapus.");
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header dan filter agenda */}
      <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
        <AgendaHeader
          onTambah={() => setModal({ item: null })}
        />

        <div className="mt-6 border-t border-border-muted pt-6">
          <AgendaFilters
            nilai={filter}
            onTerapkan={terapkanFilter}
          />
        </div>
      </section>

      {/* Notifikasi */}
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark"
        >
          {notice}
        </p>
      )}

      {/* Tabel agenda */}
      <AgendaTable
        items={items}
        total={hasil.length}
        halaman={halamanAman}
        jumlahHalaman={jumlahHalaman}
        perHalaman={PER_HALAMAN}
        onHalaman={(n) =>
          setHalaman(
            Math.min(
              Math.max(n, 1),
              jumlahHalaman,
            ),
          )
        }
        onEdit={(item) => setModal({ item })}
        onHapus={setAkanDihapus}
      />

      {/* Modal tambah dan edit */}
      {modal && (
        <AgendaFormModal
          item={modal.item}
          onSimpan={simpan}
          onTutup={() => setModal(null)}
        />
      )}

      {/* Dialog konfirmasi hapus */}
      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus agenda ini?"
          pesan={`“${akanDihapus.judul}” akan dihapus dan tidak tampil lagi di portal.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </div>
  );
}

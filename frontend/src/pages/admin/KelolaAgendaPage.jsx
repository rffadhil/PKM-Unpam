import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AgendaHeader from "@/components/agenda/AgendaHeader";
import AgendaFilters from "@/components/agenda/AgendaFilters";
import AgendaTable from "@/components/agenda/AgendaTable";
import AgendaFormModal from "@/components/agenda/AgendaFormModal";
import Icon from "@/components/ui/Icon";

import {
  useDaftarAgenda,
  useSimpanAgenda,
  useHapusAgenda,
} from "@/hooks/useAgenda";
import { saringAgenda, urutkanAgenda } from "@/utils/agenda";

const PER_HALAMAN = 5;

const FILTER_AWAL = {
  kategori: "",
  kata: "",
};

export default function KelolaAgendaPage() {
  const {
    pencarian: cariTopbar = "",
    tampilkanNotifikasi = () => {},
  } = useOutletContext() ?? {};

  // Mengambil data agenda melalui React Query.
  const {
    data: dataAgenda = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDaftarAgenda();

  const simpanMutation = useSimpanAgenda();
  const hapusMutation = useHapusAgenda();

  const [filter, setFilter] = useState(FILTER_AWAL);
  const [halaman, setHalaman] = useState(1);
  const [modal, setModal] = useState(null);
  const [akanDihapus, setAkanDihapus] = useState(null);
  const [galatServer, setGalatServer] = useState("");

  // Reset ke halaman pertama saat filter atau pencarian berubah.
  useEffect(() => {
    setHalaman(1);
  }, [filter, cariTopbar]);

  // Filter dan urutkan agenda berdasarkan kriteria dan pencarian.
  const hasil = useMemo(() => {
    const kataKunci = (filter.kata || cariTopbar || "").trim();

    return urutkanAgenda(
      saringAgenda(dataAgenda, {
        ...filter,
        kata: kataKunci,
      }),
    );
  }, [dataAgenda, filter, cariTopbar]);

  // Pagination yang aman dari batas indeks.
  const totalItem = hasil.length;
  const jumlahHalaman = Math.max(1, Math.ceil(totalItem / PER_HALAMAN));
  const halamanAman = Math.max(1, Math.min(halaman, jumlahHalaman));

  const items = hasil.slice(
    (halamanAman - 1) * PER_HALAMAN,
    halamanAman * PER_HALAMAN,
  );

  function terapkanFilter(nilai) {
    setFilter(nilai);
    setHalaman(1);
  }

  // Tambah atau edit agenda menggunakan mutasi.
  function simpan(agendaInput) {
    setGalatServer("");
    const isEdit = Boolean(agendaInput.id);

    simpanMutation.mutate(agendaInput, {
      onSuccess: () => {
        tampilkanNotifikasi(
          "success",
          isEdit
            ? "Agenda berhasil diperbarui."
            : "Agenda baru berhasil ditambahkan.",
        );
        setModal(null);
        setGalatServer("");
      },
      onError: (err) => {
        const pesan = err.message || "Gagal menyimpan agenda.";
        setGalatServer(pesan);
        tampilkanNotifikasi("error", pesan);
      },
    });
  }

  // Hapus agenda menggunakan mutasi.
  function konfirmasiHapus() {
    if (!akanDihapus) return;

    const id = akanDihapus.id;
    const judul = akanDihapus.judul;

    hapusMutation.mutate(id, {
      onSuccess: () => {
        tampilkanNotifikasi(
          "success",
          `Agenda “${judul}” berhasil dihapus.`,
        );
        setAkanDihapus(null);
      },
      onError: (err) => {
        tampilkanNotifikasi(
          "error",
          `Gagal menghapus agenda: ${err.message || "Terjadi kesalahan."}`,
        );
        setAkanDihapus(null);
      },
    });
  }

  function bukaModalTambah() {
    setGalatServer("");
    setModal({ item: null });
  }

  function bukaModalEdit(item) {
    setGalatServer("");
    setModal({ item });
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header dan filter agenda */}
      <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
        <AgendaHeader onTambah={bukaModalTambah} />

        <div className="mt-6 border-t border-border-muted pt-6">
          <AgendaFilters
            nilai={filter}
            onTerapkan={terapkanFilter}
          />
        </div>
      </section>

      {/* Notifikasi kesalahan pengambilan data tetap tampil di halaman. */}
      {isError && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
        >
          <div className="flex items-center gap-2">
            <Icon name="error" className="text-[20px]" />
            <span>Gagal memuat agenda: {error?.message}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-error px-3 py-1 text-xs font-bold text-white hover:opacity-90"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Indikator Loading */}
      {isLoading ? (
        <section className="flex flex-col items-center justify-center rounded-2xl border border-border-muted bg-surface-white py-16 shadow-sm">
          <Icon
            name="progress_activity"
            className="animate-spin text-[36px] text-secondary"
          />
          <p className="mt-3 text-sm font-medium text-text-muted">
            Memuat daftar agenda...
          </p>
        </section>
      ) : (
        <AgendaTable
          items={items}
          total={totalItem}
          halaman={halamanAman}
          jumlahHalaman={jumlahHalaman}
          perHalaman={PER_HALAMAN}
          onHalaman={(n) =>
            setHalaman(
              Math.max(1, Math.min(n, jumlahHalaman)),
            )
          }
          onEdit={bukaModalEdit}
          onHapus={setAkanDihapus}
        />
      )}

      {/* Modal tambah dan edit */}
      {modal && (
        <AgendaFormModal
          item={modal.item}
          sedangMenyimpan={simpanMutation.isPending}
          galatServer={galatServer}
          onSimpan={simpan}
          onTutup={() => {
            if (!simpanMutation.isPending) {
              setModal(null);
              setGalatServer("");
            }
          }}
        />
      )}

      {/* Dialog konfirmasi hapus */}
      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus agenda ini?"
          pesan={`“${akanDihapus.judul}” akan dihapus dan tidak tampil lagi di portal.`}
          sedangMemproses={hapusMutation.isPending}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => !hapusMutation.isPending && setAkanDihapus(null)}
        />
      )}
    </div>
  );
}

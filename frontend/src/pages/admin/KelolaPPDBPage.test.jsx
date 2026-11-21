import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import KelolaPPDBPage from "./KelolaPPDBPage";

vi.mock("@/services/authService", () => ({
  getActiveAdmin: () => ({ peran: "Admin" }),
  logout: vi.fn(),
}));

vi.mock("@/services/pengaturan.service", () => ({
  ambilPengaturanLengkap: vi.fn(),
  simpanPengaturanPortal: vi.fn(),
}));

import {
  ambilPengaturanLengkap,
  simpanPengaturanPortal,
} from "@/services/pengaturan.service";

const portal = {
  namaInstitusi: "SMA Harapan Jaya",
  npsn: "20104829",
  email: "info@smaharapanjaya.sch.id",
  telepon: "02187654321",
  whatsapp: "6281234567890",
  alamat: "Jl. Pendidikan Raya 45",
  ppdb: true,
  ppdbLink: "https://forms.gle/daftar",
  ppdbTahunAjaran: "2026/2027",
  ppdbTanggalTayang: "2026-05-01",
  ppdbTanggalMulai: "2026-05-15",
  ppdbTanggalSelesai: "2026-06-15",
  ppdbPengumuman: "Pendaftaran PPDB resmi dibuka.",
  ppdbAlurJson: "",
};

function AdminOutlet() {
  const [notice, setNotice] = useState("");

  return (
    <>
      {notice && <p>{notice}</p>}
      <Outlet
        context={{
          tampilkanNotifikasi: (_jenis, pesan) => setNotice(pesan),
        }}
      />
    </>
  );
}

function renderAdminPage() {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<AdminOutlet />}>
          <Route path="*" element={<KelolaPPDBPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("Admin · Pengaturan PPDB", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ambilPengaturanLengkap.mockResolvedValue({ portal });
    simpanPengaturanPortal.mockImplementation(async (settings) => ({
      ...portal,
      ...settings,
    }));
  });

  it("menambahkan tautan PPDB di navigasi admin", () => {
    render(
      <MemoryRouter>
        <AdminSidebar terbuka={false} onTutup={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "PPDB" })).toHaveAttribute(
      "href",
      "/admin/ppdb",
    );
  });

  it("mengizinkan Admin biasa menyimpan hanya konfigurasi PPDB", async () => {
    const user = userEvent.setup();
    renderAdminPage();

    const tahunAjaran = await screen.findByLabelText("Tahun ajaran");
    await user.clear(tahunAjaran);
    await user.type(tahunAjaran, "2027/2028");
    await user.click(
      screen.getByRole("button", { name: "Simpan Perubahan Pengaturan" }),
    );

    await waitFor(() => expect(simpanPengaturanPortal).toHaveBeenCalledTimes(1));
    const [dataTersimpan] = simpanPengaturanPortal.mock.calls[0];
    expect(Object.keys(dataTersimpan).sort()).toEqual(
      [
        "ppdb",
        "ppdbLink",
        "ppdbTahunAjaran",
        "ppdbTanggalTayang",
        "ppdbTanggalMulai",
        "ppdbTanggalSelesai",
        "ppdbPengumuman",
        "ppdbAlurJson",
      ].sort(),
    );
    expect(dataTersimpan).toMatchObject({
      ppdbTahunAjaran: "2027/2028",
      ppdbLink: "https://forms.gle/daftar",
    });
    expect(
      await screen.findByText(
        "Pengaturan PPDB berhasil disimpan dan diterapkan ke halaman publik.",
      ),
    ).toBeInTheDocument();
  });

  it("menolak tautan pendaftaran yang bukan URL", async () => {
    const user = userEvent.setup();
    renderAdminPage();

    const linkForm = await screen.findByLabelText(
      "Tautan Google Form Pendaftaran PPDB",
    );
    await user.clear(linkForm);
    await user.type(linkForm, "bukan-url");
    await user.click(
      screen.getByRole("button", { name: "Simpan Perubahan Pengaturan" }),
    );

    expect(
      await screen.findByText("Tautan Google Form harus berupa URL yang valid."),
    ).toBeInTheDocument();
    expect(simpanPengaturanPortal).not.toHaveBeenCalled();
  });

  it("mengizinkan alur pendaftaran ditambah, diedit, dihapus, dan disimpan", async () => {
    const user = userEvent.setup();
    renderAdminPage();

    await screen.findByRole("button", { name: "Tambah Langkah" });

    await user.click(screen.getByRole("button", { name: "Tambah Langkah" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Langkah alur pendaftaran berhasil ditambahkan.",
    );

    const judulBaru = screen.getAllByLabelText("Judul langkah").at(-1);
    await user.type(judulBaru, "Pengumuman Hasil");
    await user.type(
      screen.getAllByLabelText("Deskripsi langkah").at(-1),
      "Cek hasil seleksi melalui portal sekolah.",
    );
    await user.click(screen.getByRole("button", { name: "Hapus Langkah 2" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Langkah alur pendaftaran berhasil dihapus.",
    );

    await user.click(
      screen.getByRole("button", { name: "Simpan Perubahan Pengaturan" }),
    );

    await waitFor(() => expect(simpanPengaturanPortal).toHaveBeenCalledTimes(1));
    const [dataTersimpan] = simpanPengaturanPortal.mock.calls[0];
    expect(JSON.parse(dataTersimpan.ppdbAlurJson)).toHaveLength(3);
    expect(JSON.parse(dataTersimpan.ppdbAlurJson)[2]).toEqual({
      judul: "Pengumuman Hasil",
      deskripsi: "Cek hasil seleksi melalui portal sekolah.",
    });
  });
});

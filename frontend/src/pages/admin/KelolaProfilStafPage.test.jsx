import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import KelolaProfilStafPage from "./KelolaProfilStafPage";

vi.mock("@/services/stafService", () => ({
  ambilSemuaStaf: vi.fn(),
  tambahStaf: vi.fn(),
  editStaf: vi.fn(),
  hapusStaf: vi.fn(),
}));

vi.mock("@/services/pengaturan.service", () => ({
  ambilPengaturanLengkap: vi.fn(),
  simpanPengaturanPortal: vi.fn(),
}));

vi.mock("@/services/upload.service", () => ({
  unggahGambar: vi.fn(),
}));

vi.mock("@/components/admin/EkstrakurikulerSection", () => ({
  default: () => null,
}));

import { ambilSemuaStaf } from "@/services/stafService";
import {
  ambilPengaturanLengkap,
  simpanPengaturanPortal,
} from "@/services/pengaturan.service";
import { unggahGambar } from "@/services/upload.service";

describe("Admin · Profil Sekolah", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ambilSemuaStaf.mockResolvedValue({ data: [] });
    ambilPengaturanLengkap.mockResolvedValue({ data: [] });
    simpanPengaturanPortal.mockResolvedValue({});
    unggahGambar.mockImplementation(async (file) => `/uploads/${file.name}`);
  });

  it("mengunggah gambar dan menyimpan teks yang tampil pada kartu profil publik", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/admin/profil-staf/profil"]}>
        <Routes>
          <Route
            path="/admin/profil-staf/:sub"
            element={<KelolaProfilStafPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByLabelText("Teks pada gambar utama");
    expect(
      screen.queryByAltText("Gambar bawaan halaman profil"),
    ).not.toBeInTheDocument();

    const file = new File(["image"], "kampus.png", { type: "image/png" });
    await user.upload(
      document.getElementById("profil-gambar-hero"),
      file,
    );
    const gambarSejarah = new File(["history"], "sejarah.png", {
      type: "image/png",
    });
    await user.upload(
      document.getElementById("profil-gambar-sejarah"),
      gambarSejarah,
    );
    await waitFor(() => {
      expect(
        document.querySelectorAll('img[alt="Pratinjau gambar cover"]'),
      ).toHaveLength(2);
    });
    await user.clear(screen.getByLabelText("Teks pada gambar utama"));
    await user.type(
      screen.getByLabelText("Teks pada gambar utama"),
      "Kampus hijau SMA Harapan Jaya",
    );
    await user.clear(screen.getByLabelText("Judul kartu sejarah"));
    await user.type(
      screen.getByLabelText("Judul kartu sejarah"),
      "Perjalanan sekolah kami",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Simpan Perubahan Profil Sekolah",
      }),
    );

    await waitFor(() => expect(simpanPengaturanPortal).toHaveBeenCalledTimes(1));
    expect(unggahGambar).toHaveBeenNthCalledWith(1, file);
    expect(unggahGambar).toHaveBeenNthCalledWith(2, gambarSejarah);
    expect(simpanPengaturanPortal).toHaveBeenCalledWith(
      expect.objectContaining({
        profil_gambar_hero: "/uploads/kampus.png",
        profil_teks_gambar_hero: "Kampus hijau SMA Harapan Jaya",
        profil_gambar_sejarah: "/uploads/sejarah.png",
        profil_label_kartu_sejarah: "PERJALANAN BERSEJARAH",
        profil_judul_kartu_sejarah: "Perjalanan sekolah kami",
        profil_deskripsi_kartu_sejarah:
          "Berawal dari 3 ruang kelas perintis hingga menjadi barometer rujukan pendidikan menengah nasional berbudaya lingkungan.",
      }),
    );
    expect(
      await screen.findByText("Perubahan Profil Sekolah berhasil disimpan."),
    ).toBeInTheDocument();
  });

  it("menampilkan daftar guru dan tendik tanpa checkbox pilihan", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/profil-staf/guru"]}>
        <Routes>
          <Route
            path="/admin/profil-staf/:sub"
            element={<KelolaProfilStafPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Daftar Tenaga Pendidik & Civitas Akademika"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

const tahunIni = new Date().getFullYear();
const pengaturanPpdb = {
  ppdbTahunAjaran: "2026/2027",
  ppdbPengumuman: "Pendaftaran PPDB resmi.",
  ppdbTanggalTayang: `${tahunIni}-01-01`,
  ppdbTanggalMulai: `${tahunIni}-01-01`,
  ppdbTanggalSelesai: `${tahunIni}-12-31`,
};

function renderNavbar(portal, onBukaModalPpdb = vi.fn()) {
  render(
    <MemoryRouter>
      <Navbar portal={portal} onBukaModalPpdb={onBukaModalPpdb} />
    </MemoryRouter>,
  );
  return onBukaModalPpdb;
}

describe("Navbar PPDB announcement", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens the unavailable-registration modal when the announcement is clicked", async () => {
    const user = userEvent.setup();
    const onBukaModalPpdb = renderNavbar({
      ...pengaturanPpdb,
      ppdb: false,
    });

    await user.click(
      screen.getByRole("button", { name: /Lihat Panduan & Syarat/ }),
    );

    expect(onBukaModalPpdb).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("link", { name: /Lihat Panduan & Syarat/ }),
    ).not.toBeInTheDocument();
  });

  it("links to the PPDB page when registration is enabled", () => {
    renderNavbar({
      ...pengaturanPpdb,
      ppdb: true,
    });

    expect(
      screen.getByRole("link", { name: /Lihat Panduan & Syarat/ }),
    ).toHaveAttribute("href", "/ppdb");
  });
});

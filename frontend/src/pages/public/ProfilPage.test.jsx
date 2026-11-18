import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import ProfilPage from "./ProfilPage";

function PublicLayoutStub() {
  return (
    <Outlet
      context={{
        portal: {
          profil_gambar_hero: "",
          profil_gambar_sejarah: "",
        },
      }}
    />
  );
}

describe("ProfilPage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not show default images when profile image settings are empty", async () => {
    render(
      <MemoryRouter initialEntries={["/profil"]}>
        <Routes>
          <Route element={<PublicLayoutStub />}>
            <Route path="/profil" element={<ProfilPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Membangun Insan Cendekia Berwawasan Global dan Berakar Budaya Luhur",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Kampus SMA Harapan Jaya" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Sejarah SMA Harapan Jaya" }),
    ).not.toBeInTheDocument();
  });
});

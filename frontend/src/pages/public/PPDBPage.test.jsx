import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PPDBPage from "./PPDBPage";

function renderPage(portal) {
  render(
    <MemoryRouter initialEntries={["/ppdb"]}>
      <Routes>
        <Route element={<Outlet context={{ portal }} />}>
          <Route path="/ppdb" element={<PPDBPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("PPDBPage contact hours", () => {
  it("uses the operational hours configured in admin contacts", () => {
    renderPage({
      jamSenKam: "08.00 - 16.00 WIB",
      jamJumat: "08.00 - 11.00 WIB",
    });

    expect(
      screen.getByText(
        /Senin–Kamis: 08\.00 - 16\.00 WIB; Jumat: 08\.00 - 11\.00 WIB\./,
      ),
    ).toBeInTheDocument();
  });

  it("shows a clear fallback when operational hours are not configured", () => {
    renderPage({ jamSenKam: "", jamJumat: "" });

    expect(
      screen.getByText(/Senin–Kamis: Belum diatur; Jumat: Belum diatur\./),
    ).toBeInTheDocument();
  });
});

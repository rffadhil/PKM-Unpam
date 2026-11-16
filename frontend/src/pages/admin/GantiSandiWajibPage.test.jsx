import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GantiSandiWajibPage from "./GantiSandiWajibPage";

vi.mock("@/services/authService", () => ({
  changeRequiredPassword: vi.fn(),
  updateActiveAdminStorage: vi.fn(),
}));

import {
  changeRequiredPassword,
  updateActiveAdminStorage,
} from "@/services/authService";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/admin/ganti-sandi"]}>
      <Routes>
        <Route
          path="/admin/ganti-sandi"
          element={<GantiSandiWajibPage />}
        />
        <Route path="/admin" element={<p>Dashboard CMS</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("GantiSandiWajibPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    changeRequiredPassword.mockResolvedValue({
      must_change_password: false,
    });
  });

  it("mengganti sandi sementara sebelum membuka dashboard", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText("Kata sandi baru"),
      "SandiBaru123",
    );
    await user.type(
      screen.getByLabelText("Konfirmasi kata sandi baru"),
      "SandiBaru123",
    );
    await user.click(
      screen.getByRole("button", { name: "Simpan Kata Sandi Baru" }),
    );

    expect(await screen.findByText("Dashboard CMS")).toBeInTheDocument();
    expect(changeRequiredPassword).toHaveBeenCalledWith("SandiBaru123");
    expect(updateActiveAdminStorage).toHaveBeenCalledWith({
      must_change_password: false,
    });
  });

  it("menolak konfirmasi yang tidak cocok", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText("Kata sandi baru"),
      "SandiBaru123",
    );
    await user.type(
      screen.getByLabelText("Konfirmasi kata sandi baru"),
      "SandiLain123",
    );
    await user.click(
      screen.getByRole("button", { name: "Simpan Kata Sandi Baru" }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Konfirmasi kata sandi tidak sama.");
    await waitFor(() => expect(changeRequiredPassword).not.toHaveBeenCalled());
  });
});

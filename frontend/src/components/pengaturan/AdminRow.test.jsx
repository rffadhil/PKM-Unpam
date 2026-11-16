import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminRow from "./AdminRow";

function renderRow(role) {
  return render(
    <table>
      <tbody>
        <AdminRow
          admin={{
            id: "admin-1",
            nama: "Admin Contoh",
            tipeNomor: "NIP",
            nomor: "123456",
            email: "admin@example.test",
            role,
            aktif: true,
          }}
          saya={false}
          alasanTerkunci=""
          onEdit={vi.fn()}
          onHapus={vi.fn()}
          onResetSandi={vi.fn()}
        />
      </tbody>
    </table>,
  );
}

describe("AdminRow", () => {
  it("menampilkan aksi reset sandi hanya untuk Admin biasa", () => {
    const { unmount } = renderRow("subadmin");
    expect(
      screen.getByRole("button", { name: "Reset sandi Admin Contoh" }),
    ).toBeInTheDocument();

    unmount();
    renderRow("superadmin");
    expect(
      screen.queryByRole("button", { name: "Reset sandi Admin Contoh" }),
    ).not.toBeInTheDocument();
  });
});

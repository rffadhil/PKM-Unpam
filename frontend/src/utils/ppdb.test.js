import { describe, expect, it } from "vitest";
import {
  getPpdbRegistrationStatus,
  isPpdbAnnouncementActive,
} from "./ppdb";
import { validasiPengaturan } from "./pengaturan";

const pengaturanValid = {
  namaInstitusi: "SMA Harapan Jaya",
  npsn: "20104829",
  email: "info@example.com",
  telepon: "021123456",
  alamat: "Jl. Pendidikan 1",
  whatsapp: "08123456",
  ppdb: true,
  ppdbTahunAjaran: "2026/2027",
  ppdbTanggalTayang: "2026-05-01",
  ppdbTanggalMulai: "2026-05-15",
  ppdbTanggalSelesai: "2026-06-15",
  ppdbPengumuman: "Pendaftaran PPDB resmi dibuka.",
};

describe("PPDB announcement schedule", () => {
  it("shows before registration opens through its inclusive end date", () => {
    expect(
      isPpdbAnnouncementActive(
        pengaturanValid,
        new Date(2026, 4, 1, 12),
      ),
    ).toBe(true);
    expect(
      isPpdbAnnouncementActive(
        pengaturanValid,
        new Date(2026, 5, 15, 12),
      ),
    ).toBe(true);
    expect(
      isPpdbAnnouncementActive(
        pengaturanValid,
        new Date(2026, 3, 30, 12),
      ),
    ).toBe(false);
    expect(
      isPpdbAnnouncementActive(
        pengaturanValid,
        new Date(2026, 5, 16, 12),
      ),
    ).toBe(false);
    expect(
      isPpdbAnnouncementActive(
        { ...pengaturanValid, ppdbTanggalTayang: "" },
        new Date(2026, 4, 14, 12),
      ),
    ).toBe(false);
    expect(
      isPpdbAnnouncementActive(
        { ...pengaturanValid, ppdbTanggalTayang: "" },
        new Date(2026, 4, 15, 12),
      ),
    ).toBe(true);
    expect(
      isPpdbAnnouncementActive(
        { ...pengaturanValid, ppdb: false },
        new Date(2026, 4, 14, 12),
      ),
    ).toBe(true);
  });

  it("shows the upcoming state while registration is not yet open", () => {
    expect(
      getPpdbRegistrationStatus(
        { ...pengaturanValid, ppdb: false },
        new Date(2026, 4, 14, 12),
      ),
    ).toBe("upcoming");
    expect(
      getPpdbRegistrationStatus(
        { ...pengaturanValid, ppdb: false },
        new Date(2026, 4, 15, 12),
      ),
    ).toBe("closed");
  });

  it("validates the full announcement schedule before saving", () => {
    expect(validasiPengaturan(pengaturanValid)).toEqual({});

    const errors = validasiPengaturan({
      ...pengaturanValid,
      ppdbTanggalSelesai: "2026-05-14",
    });

    expect(errors.ppdbTanggalSelesai).toBe(
      "Tanggal selesai harus sama atau setelah tanggal mulai.",
    );
  });

  it("requires the announcement date to be on or before registration", () => {
    const errors = validasiPengaturan({
      ...pengaturanValid,
      ppdbTanggalTayang: "2026-05-16",
    });

    expect(errors.ppdbTanggalTayang).toBe(
      "Tanggal tayang harus sama atau sebelum tanggal mulai pendaftaran.",
    );
  });
});

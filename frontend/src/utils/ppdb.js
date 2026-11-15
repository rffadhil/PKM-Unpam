export function isDateOnlyValid(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""))) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function tanggalHariIni(now) {
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function pendaftaranDiizinkan(settings) {
  return (
    settings?.ppdb !== false &&
    settings?.ppdb_online_aktif !== false &&
    settings?.ppdb !== "false" &&
    settings?.ppdb_online_aktif !== "false"
  );
}

export function getPpdbRegistrationStatus(settings, now = new Date()) {
  const today = tanggalHariIni(now);
  const tanggalMulai = settings?.ppdbTanggalMulai;
  const tanggalSelesai = settings?.ppdbTanggalSelesai;

  if (isDateOnlyValid(tanggalMulai) && today < tanggalMulai) {
    return "upcoming";
  }
  if (isDateOnlyValid(tanggalSelesai) && today > tanggalSelesai) {
    return "closed";
  }
  return pendaftaranDiizinkan(settings) ? "open" : "closed";
}

export function isPpdbAnnouncementActive(settings, now = new Date()) {
  if (!settings) return false;
  const { ppdbTanggalMulai, ppdbTanggalSelesai } = settings;
  if (
    !settings.ppdbTahunAjaran?.trim() ||
    !settings.ppdbPengumuman?.trim() ||
    !isDateOnlyValid(ppdbTanggalMulai) ||
    !isDateOnlyValid(ppdbTanggalSelesai)
  ) {
    return false;
  }

  const tanggalTayang = settings.ppdbTanggalTayang || ppdbTanggalMulai;
  if (
    !isDateOnlyValid(tanggalTayang) ||
    tanggalTayang > ppdbTanggalMulai
  ) {
    return false;
  }

  const today = tanggalHariIni(now);
  return tanggalTayang <= today && today <= ppdbTanggalSelesai;
}

/** @format */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("cms_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Mengubah array [{ key, value }] atau object dari backend menjadi object portal yang seragam
export function normalisasiPortal(res) {
  const map = { ...(res?.portal || {}) };

  if (Array.isArray(res?.data)) {
    for (const row of res.data) {
      if (
        row?.key &&
        row.value !== null &&
        row.value !== undefined &&
        row.value !== ""
      ) {
        map[row.key] = row.value;
      }
    }
  } else if (res?.data && typeof res.data === "object") {
    Object.assign(map, res.data);
  }

  const rawMaint = map.maintenance ?? map.maintenance_mode ?? false;
  const isMaintenance = rawMaint === true || rawMaint === "true";

  const rawPpdb = map.ppdb ?? map.ppdb_online_aktif ?? true;
  const isPpdb = rawPpdb !== false && rawPpdb !== "false";

  const ppdbLink = String(map.ppdbLink ?? map.ppdb_link ?? "").trim();

  const profilJudulHero =
    map.profilJudulHero ||
    map.profil_judul_hero ||
    "Membangun Insan Cendekia Berwawasan Global dan Berakar Budaya Luhur";

  const profilDeskripsiHero =
    map.profilDeskripsiHero ||
    map.profil_deskripsi_hero ||
    "Profil Lengkap, Visi Misi, Fasilitas Unggulan, serta Direktori Pendidik & Tenaga Kependidikan SMA Harapan Jaya. Mendedikasikan keunggulan literasi sains, integritas karakter bangsa, dan pelestarian ekosistem alam bumi nusantara.";

  const profilJudulSejarah =
    map.profilJudulSejarah ||
    map.profil_judul_sejarah ||
    "Dari Fondasi Nilai Luhur Menuju Sekolah Berwawasan Masa Depan";

  const profilSejarahP1 =
    map.profilSejarahP1 ||
    map.profil_sejarah_p1 ||
    "SMA Harapan Jaya didirikan pada tanggal 17 Juli 1988 dengan tekad luhur menghadirkan akses pendidikan bermutu bagi masyarakat. Bermula dari tiga ruang kelas, sekolah ini berkembang menjadi lembaga pendidikan yang memadukan prestasi akademik, pembentukan karakter, dan kepedulian terhadap lingkungan.";

  const profilSejarahP2 =
    map.profilSejarahP2 ||
    map.profil_sejarah_p2 ||
    "Dalam kurun waktu lebih dari 35 tahun, SMA Harapan Jaya telah melahirkan lebih dari 12.000 alumni yang kini berkiprah di berbagai perguruan tinggi ternama dunia, lembaga pemerintahan, sains global, dan industri kreatif.";

  const profilSejarahP3 =
    map.profilSejarahP3 ||
    map.profil_sejarah_p3 ||
    "Komitmen nyata terhadap pelestarian bumi tercermin dari predikat Sekolah Adiwiyata Mandiri sejak 2018. Kami percaya bahwa kecerdasan kognitif hanya akan membawa kemaslahatan jika dibarengi kesadaran ekologis yang matang.";

  const sambutanJudul =
    map.sambutanJudul ||
    map.sambutan_judul ||
    "“Menyemai Karakter Adiluhung dalam Harmoni Alam dan Perkembangan Teknologi Abad 21”";

  const sambutanKepsek =
    map.sambutanKepsek ||
    map.sambutan_kepsek ||
    map.sambutan_kepala_sekolah ||
    "Selamat datang di portal resmi SMAS Harapan Jaya. Kami berkomitmen menghadirkan ekosistem pendidikan yang unggul, berkarakter Pancasila, cinta terhadap lingkungan lestari, dan adaptif terhadap perkembangan teknologi.";

  const visiSekolah =
    map.visiSekolah ||
    map.visi_sekolah ||
    "Terwujudnya lulusan yang beriman, berakhlak mulia, unggul dalam sains dan teknologi, serta berbudaya lingkungan hidup yang asri dan lestari.";

  const komitmenBudaya =
    map.komitmenBudaya ||
    map.komitmen_budaya ||
    "Memandu langkah seluruh civitas akademika menuju pencapaian standar mutu pendidikan global yang berakar pada nilai-nilai kebangsaan Indonesia dan budaya lingkungan Adiwiyata.";

  const misiSekolahJson = map.misiSekolahJson || map.misi_sekolah_json || "";

  return {
    ...map,
    namaInstitusi: map.namaInstitusi || map.nama_sekolah || "SMAS Harapan Jaya",
    nama_sekolah: map.namaInstitusi || map.nama_sekolah || "SMAS Harapan Jaya",
    npsn: map.npsn || "20104829",
    akreditasi: map.akreditasi || "A (Unggul) BAN-S/M",
    adiwiyata:
      map.adiwiyata ||
      map.predikat_adiwiyata ||
      "Sekolah Adiwiyata Mandiri Nasional",
    predikat_adiwiyata:
      map.adiwiyata ||
      map.predikat_adiwiyata ||
      "Sekolah Adiwiyata Mandiri Nasional",
    slogan:
      map.slogan ||
      map.motto ||
      "Unggul, Berkarakter, Berwawasan Lingkungan Adiwiyata",
    motto:
      map.slogan ||
      map.motto ||
      "Unggul, Berkarakter, Berwawasan Lingkungan Adiwiyata",
    email: map.email || map.email_resmi || "harapanjayasma@gmail.com",
    email_resmi: map.email || map.email_resmi || "harapanjayasma@gmail.com",
    telepon: map.telepon || map.telepon_ptsp || "085813548624 / 0895626288424",
    telepon_ptsp:
      map.telepon || map.telepon_ptsp || "085813548624 / 0895626288424",
    kodePos: map.kodePos || map.kode_pos || "11730",
    kode_pos: map.kodePos || map.kode_pos || "11730",
    alamat:
      map.alamat ||
      map.alamat_lengkap ||
      "Kec. Cengkareng, Kota Adm. Jakarta Barat, Prov. D.K.I. Jakarta 11730",
    alamat_lengkap:
      map.alamat ||
      map.alamat_lengkap ||
      "Kec. Cengkareng, Kota Adm. Jakarta Barat, Prov. D.K.I. Jakarta 11730",
    maintenance: isMaintenance,
    maintenance_mode: isMaintenance,
    ppdb: isPpdb,
    ppdb_online_aktif: isPpdb,
    ppdbLink,
    ppdb_link: ppdbLink,

    // Profil & Sejarah
    profilJudulHero,
    profil_judul_hero: profilJudulHero,
    profilDeskripsiHero,
    profil_deskripsi_hero: profilDeskripsiHero,
    profilJudulSejarah,
    profil_judul_sejarah: profilJudulSejarah,
    profilSejarahP1,
    profil_sejarah_p1: profilSejarahP1,
    profilSejarahP2,
    profil_sejarah_p2: profilSejarahP2,
    profilSejarahP3,
    profil_sejarah_p3: profilSejarahP3,

    // Sambutan Kepala Sekolah
    sambutanJudul,
    sambutan_judul: sambutanJudul,
    sambutanKepsek,
    sambutan_kepsek: sambutanKepsek,
    sambutan_kepala_sekolah: sambutanKepsek,

    // Visi, Misi & Budaya
    visiSekolah,
    visi_sekolah: visiSekolah,
    komitmenBudaya,
    komitmen_budaya: komitmenBudaya,
    misiSekolahJson,
    misi_sekolah_json: misiSekolahJson,
  };
}

export async function ambilPengaturanLengkap() {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan`, {
    method: "GET",
    headers: getHeaders(false),
    credentials: "include",
    cache: "no-store",
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal memuat pengaturan sekolah.");
  }

  const portal = normalisasiPortal(json);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cms_portal_pengaturan", JSON.stringify(portal));
    } catch {
      // Abaikan error localStorage
    }
  }

  return {
    ...json,
    portal,
  };
}

export async function simpanPengaturanPortal(draf) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan`, {
    method: "PUT",
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify(draf),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal menyimpan pengaturan sekolah.");
  }

  let sebelumnya = {};
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("cms_portal_pengaturan");
      if (raw) sebelumnya = JSON.parse(raw);
    } catch {
      // Abaikan error pembacaan localStorage
    }
  }

  const portalTerbaru = normalisasiPortal({
    ...json,
    portal: { ...sebelumnya, ...draf, ...(json.portal || {}) },
  });

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "cms_portal_pengaturan",
        JSON.stringify(portalTerbaru),
      );
      window.dispatchEvent(new Event("portal_pengaturan_updated"));
    } catch {
      // Abaikan error localStorage
    }
  }
  return portalTerbaru;
}

export async function tambahAdmin(data) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan/admin`, {
    method: "POST",
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal membuat akun admin.");
  }
  return json.data;
}

export async function ubahAdmin(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan/admin/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal memperbarui data admin.");
  }
  return json.data;
}

export async function hapusAdminById(id) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan/admin/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
    credentials: "include",
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Gagal menghapus akun admin.");
  }
  return true;
}

export async function simpanKontakPTSP(kontak) {
  const response = await fetch(`${API_BASE_URL}/api/pengaturan`, {
    method: "PUT",
    headers: getHeaders(true),
    credentials: "include",
    body: JSON.stringify({
      whatsapp: kontak.whatsapp,
      telepon: kontak.telepon,
      jamSenKam: kontak.jamSenKam,
      jamJumat: kontak.jamJumat,
      alamat: kontak.alamat,
      peta: kontak.peta,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Gagal menyimpan kontak PTSP.");
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("portal_pengaturan_updated"));
  }

  return json;
}

/** @format */

export const validateStaf = (data) => {
  const errors = [];

  // Nama wajib diisi
  if (
    !data.nama ||
    typeof data.nama !== "string" ||
    data.nama.trim() === ""
  ) {
    errors.push("Nama wajib diisi");
  }

  // Jabatan wajib diisi
  if (
    !data.jabatan ||
    typeof data.jabatan !== "string" ||
    data.jabatan.trim() === ""
  ) {
    errors.push("Jabatan wajib diisi");
  }

  // Field teks opsional
  const optionalTextFields = [
    "nip_nuptk",
    "rumpun",
    "mata_pelajaran",
    "foto_url",
  ];

  optionalTextFields.forEach((field) => {
    if (
      data[field] !== undefined &&
      data[field] !== null &&
      typeof data[field] !== "string"
    ) {
      errors.push(`${field} harus berupa teks`);
    }
  });

  // Urutan harus berupa angka bulat nonnegatif
  if (
    data.urutan !== undefined &&
    (!Number.isInteger(data.urutan) || data.urutan < 0)
  ) {
    errors.push("Urutan harus berupa angka bulat dan tidak boleh negatif");
  }

  // Tampil publik harus boolean
  if (
    data.tampil_publik !== undefined &&
    typeof data.tampil_publik !== "boolean"
  ) {
    errors.push("tampil_publik harus berupa boolean");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
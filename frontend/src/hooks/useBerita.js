
/** @format */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ambilBerita,
  ambilBeritaPublik,
  daftarBerita,
  daftarBeritaPublik,
  hapusBerita,
  simpanBerita,
} from "@/services/berita.service";

export const kunciBerita = ["berita"];

// Mengambil seluruh daftar berita untuk admin.
export function useDaftarBerita() {
  return useQuery({
    queryKey: [...kunciBerita, "admin"],
    queryFn: daftarBerita,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

// Mengambil daftar berita Terbit untuk halaman publik.
export function useDaftarBeritaPublik() {
  return useQuery({
    queryKey: [...kunciBerita, "publik"],
    queryFn: daftarBeritaPublik,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

// Mengambil detail berita admin berdasarkan ID.
export function useArtikel(id) {
  return useQuery({
    queryKey: [...kunciBerita, "admin", String(id)],
    queryFn: () => ambilBerita(id),
    enabled: id != null && id !== "",
    retry: false,
  });
}

// Mengambil detail berita publik berdasarkan slug.
export function useArtikelPublik(slug) {
  return useQuery({
    queryKey: [...kunciBerita, "publik", String(slug)],
    queryFn: () => ambilBeritaPublik(slug),
    enabled: slug != null && slug !== "",
    retry: false,
  });
}

// Menyimpan berita baru atau memperbarui berita.
export function useSimpanBerita() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: simpanBerita,
    onSuccess: () => {
      klien.invalidateQueries({
        queryKey: kunciBerita,
      });
    },
  });
}

// Menghapus berita.
export function useHapusBerita() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: hapusBerita,
    onSuccess: () => {
      klien.invalidateQueries({
        queryKey: kunciBerita,
      });
    },
  });
}

/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ambilBerita,
  daftarBerita,
  hapusBerita,
  simpanBerita,
} from "@/services/berita.service";

export const kunciBerita = ["berita"];

export function useDaftarBerita() {
  return useQuery({ queryKey: kunciBerita, queryFn: daftarBerita });
}

export function useArtikel(id) {
  return useQuery({
    queryKey: [...kunciBerita, String(id)],
    queryFn: () => ambilBerita(id),
    enabled: id != null,
    retry: false,
  });
}

export function useSimpanBerita() {
  const klien = useQueryClient();
  return useMutation({
    mutationFn: simpanBerita,
    onSuccess: () => klien.invalidateQueries({ queryKey: kunciBerita }),
  });
}

export function useHapusBerita() {
  const klien = useQueryClient();
  return useMutation({
    mutationFn: hapusBerita,
    onSuccess: () => klien.invalidateQueries({ queryKey: kunciBerita }),
  });
}

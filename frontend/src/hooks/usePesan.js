
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  daftarPesan,
  ambilPesan,
  ubahStatusPesan,
  hapusPesan,
} from "@/services/pesan.service";

export const kunciPesan = ["pesan"];

export function useDaftarPesan() {
  return useQuery({
    queryKey: kunciPesan,
    queryFn: daftarPesan,
  });
}

export function useDetailPesan(id) {
  return useQuery({
    queryKey: [...kunciPesan, String(id)],
    queryFn: () => ambilPesan(id),
    enabled: id != null,
    retry: false,
  });
}

export function useUbahStatusPesan() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: ubahStatusPesan,
    onSuccess: () => {
      klien.invalidateQueries({ queryKey: kunciPesan });
    },
  });
}

export function useHapusPesan() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: hapusPesan,
    onSuccess: () => {
      klien.invalidateQueries({ queryKey: kunciPesan });
    },
  });
}

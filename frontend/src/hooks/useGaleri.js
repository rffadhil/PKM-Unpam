/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  daftarGaleri,
  ambilGaleri,
  simpanGaleri,
  hapusGaleri,
  tambahFotoGaleri,
} from "@/services/galeri.service";

export const kunciGaleri = ["galeri"];

export function useDaftarGaleri(params = {}) {
  return useQuery({
    queryKey: [...kunciGaleri, params],
    queryFn: () => daftarGaleri(params),
  });
}

export function useDetailGaleri(id) {
  return useQuery({
    queryKey: [...kunciGaleri, id],
    queryFn: () => ambilGaleri(id),
    enabled: Boolean(id),
  });
}

export function useSimpanGaleri() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: simpanGaleri,
    onSuccess: (savedItem) => {
      if (savedItem && savedItem.id) {
        klien.setQueriesData({ queryKey: kunciGaleri }, (old = []) => {
          const list = Array.isArray(old) ? old : [];
          const exists = list.some((it) => String(it.id) === String(savedItem.id));
          if (exists) {
            return list.map((it) =>
              String(it.id) === String(savedItem.id) ? savedItem : it
            );
          }
          return [savedItem, ...list];
        });
      }
      klien.invalidateQueries({ queryKey: kunciGaleri });
    },
  });
}

export function useHapusGaleri() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: hapusGaleri,
    onSuccess: (_, id) => {
      if (id != null) {
        klien.setQueriesData({ queryKey: kunciGaleri }, (old = []) => {
          const list = Array.isArray(old) ? old : [];
          return list.filter((it) => String(it.id) !== String(id));
        });
      }
      klien.invalidateQueries({ queryKey: kunciGaleri });
    },
  });
}

export function useTambahFotoGaleri() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: ({ id, files }) => tambahFotoGaleri(id, files),

    onSuccess: (savedItem) => {
      if (savedItem?.id) {
        // Perbarui cache detail album
        klien.setQueryData(
          [...kunciGaleri, savedItem.id],
          savedItem
        );
      }

      // Perbarui daftar album
      klien.invalidateQueries({
        queryKey: kunciGaleri,
      });
    },
  });
}   
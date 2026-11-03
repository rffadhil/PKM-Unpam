/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  daftarAgenda,
  hapusAgenda,
  simpanAgenda,
} from "@/services/agenda.service";

export const kunciAgenda = ["agenda"];

export function useDaftarAgenda() {
  return useQuery({
    queryKey: kunciAgenda,
    queryFn: daftarAgenda,
  });
}

export function useSimpanAgenda() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: simpanAgenda,
    onSuccess: (savedItem) => {
      if (savedItem && savedItem.id) {
        klien.setQueryData(kunciAgenda, (old = []) => {
          const list = Array.isArray(old) ? old : [];
          const exists = list.some(
            (it) => String(it.id) === String(savedItem.id),
          );
          if (exists) {
            return list.map((it) =>
              String(it.id) === String(savedItem.id) ? savedItem : it,
            );
          }
          return [savedItem, ...list];
        });
      }
      klien.invalidateQueries({ queryKey: kunciAgenda });
    },
  });
}

export function useHapusAgenda() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: hapusAgenda,
    onSuccess: (_, id) => {
      if (id != null) {
        klien.setQueryData(kunciAgenda, (old = []) => {
          const list = Array.isArray(old) ? old : [];
          return list.filter((it) => String(it.id) !== String(id));
        });
      }
      klien.invalidateQueries({ queryKey: kunciAgenda });
    },
  });
}

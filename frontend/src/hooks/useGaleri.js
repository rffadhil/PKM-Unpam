
/** @format */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  daftarGaleri,
  ambilGaleri,
  simpanGaleri,
  hapusGaleri,
  tambahFotoGaleri,
  hapusFotoGaleri,
} from "@/services/galeri.service";

export const kunciGaleri = ["galeri"];

// Mengambil daftar album.
export function useDaftarGaleri(params = {}) {
  return useQuery({
    queryKey: [...kunciGaleri, params],
    queryFn: () => daftarGaleri(params),
  });
}

// Mengambil detail album beserta foto.
export function useDetailGaleri(id) {
  return useQuery({
    queryKey: [...kunciGaleri, id],
    queryFn: () => ambilGaleri(id),
    enabled: Boolean(id),
  });
}

// Menyimpan album baru atau memperbarui album.
export function useSimpanGaleri() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: simpanGaleri,

    onSuccess: (savedItem) => {
      if (savedItem?.id) {
        klien.setQueriesData(
          { queryKey: kunciGaleri },
          (old) => {
            if (!Array.isArray(old)) return old;

            const exists = old.some(
              (item) =>
                String(item.id) === String(savedItem.id)
            );

            if (exists) {
              return old.map((item) =>
                String(item.id) === String(savedItem.id)
                  ? savedItem
                  : item
              );
            }

            return [savedItem, ...old];
          }
        );
      }

      klien.invalidateQueries({
        queryKey: kunciGaleri,
      });
    },
  });
}

// Menghapus album.
export function useHapusGaleri() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: hapusGaleri,

    onSuccess: (_, id) => {
      if (id != null) {
        klien.setQueriesData(
          { queryKey: kunciGaleri },
          (old) => {
            if (!Array.isArray(old)) return old;

            return old.filter(
              (item) => String(item.id) !== String(id)
            );
          }
        );
      }

      klien.invalidateQueries({
        queryKey: kunciGaleri,
      });
    },
  });
}

// Menambahkan banyak foto ke album.
export function useTambahFotoGaleri() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: ({ id, files }) =>
      tambahFotoGaleri(id, files),

    onSuccess: (savedItem) => {
      if (savedItem?.id) {
        klien.setQueryData(
          [...kunciGaleri, savedItem.id],
          savedItem
        );
      }

      klien.invalidateQueries({
        queryKey: kunciGaleri,
      });
    },
  });
}

// Menghapus satu foto dari album.
export function useHapusFotoGaleri() {
  const klien = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fotoId }) =>
      hapusFotoGaleri(id, fotoId),

    onSuccess: (savedItem) => {
      if (savedItem?.id) {
        klien.setQueryData(
          [...kunciGaleri, savedItem.id],
          savedItem
        );
      }

      klien.invalidateQueries({
        queryKey: kunciGaleri,
      });
    },
  });
}

import { useCallback, useEffect, useState } from 'react'

// Pesan status sementara (hilang otomatis). const [notice, info] = useNotice(); info('Tersimpan.') / info('Gagal', true)
export default function useNotice(ms = 4500) {
  const [notice, setNotice] = useState(null)
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), ms)
    return () => clearTimeout(t)
  }, [notice, ms])
  const info = useCallback((teks, error = false) => setNotice({ teks, error }), [])
  return [notice, info]
}

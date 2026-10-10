import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AdminFooter from '@/components/admin/AdminFooter'
import { cariItemNav } from '@/config/adminNav'

// Kerangka semua halaman CMS. Kata kunci pencarian di topbar dikirim ke halaman lewat
// useOutletContext() → const { pencarian } = useOutletContext()
// TODO: bungkus dengan <ProtectedRoute> (cek login JWT) saat modul auth selesai.
export default function AdminLayout() {
  const { pathname } = useLocation()
  const item = cariItemNav(pathname)
  const [menuTerbuka, setMenuTerbuka] = useState(false)
  // Kata kunci disimpan per menu supaya pindah halaman tidak membawa pencarian lama.
  const [cari, setCari] = useState({})
  const pencarian = cari[item.to] ?? ''

  return (
    <div className="flex h-screen overflow-hidden bg-surface-light text-on-surface antialiased font-body-md text-body-md">
      <AdminSidebar terbuka={menuTerbuka} onTutup={() => setMenuTerbuka(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar
          judul={item.judul}
          placeholderCari={item.cari}
          pencarian={pencarian}
          onCari={(nilai) => setCari((c) => ({ ...c, [item.to]: nilai }))}
          onBukaMenu={() => setMenuTerbuka(true)}
        />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 lg:p-6 space-y-6">
            <Outlet context={{ pencarian }} />
          </div>
          <AdminFooter />
        </main>
      </div>
    </div>
  )
}

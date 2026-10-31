import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AdminFooter from '@/components/admin/AdminFooter'
import { cariItemNav } from '@/config/adminNav'

// Kerangka semua halaman CMS.
// TODO: bungkus dengan <ProtectedRoute> (cek login JWT) saat modul auth selesai.
export default function AdminLayout() {
  const { pathname } = useLocation()
  const item = cariItemNav(pathname)
  const [menuTerbuka, setMenuTerbuka] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-light text-on-surface antialiased font-body-md text-body-md">
      <AdminSidebar terbuka={menuTerbuka} onTutup={() => setMenuTerbuka(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar judul={item.judul} onBukaMenu={() => setMenuTerbuka(true)} />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 lg:p-6 space-y-6">
            {/* pencarian dikosongkan agar halaman yang masih membaca context tidak error */}
            <Outlet context={{ pencarian: '' }} />
          </div>
          <AdminFooter />
        </main>
      </div>
    </div>
  )
}
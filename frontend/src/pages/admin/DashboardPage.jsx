import { useState } from 'react'
import SambutanAdmin from '@/components/admin/dashboard/SambutanAdmin'
import AktivitasTerkini from '@/components/admin/dashboard/AktivitasTerkini'
import AgendaTerdekat from '@/components/admin/dashboard/AgendaTerdekat'
import { adminUser } from '@/mocks/admin'
import { dashboardOverview } from '@/mocks/dashboardOverview'

// Overview CMS: sambutan, log aktivitas, dan agenda terdekat (kartu statistik & grafik sudah
// tidak ada di desain baru). TODO: ganti mock dengan satu endpoint ringkasan (mis. GET /api/admin/overview).
export default function DashboardPage() {
  const [hariIni] = useState(() => new Date())

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SambutanAdmin nama={adminUser.namaSingkat} catatan={dashboardOverview.catatan} tanggal={hariIni} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AktivitasTerkini items={dashboardOverview.aktivitas} />
        </div>
        <AgendaTerdekat items={dashboardOverview.agenda} />
      </div>
    </div>
  )
}

import SambutanAdmin from '@/components/admin/dashboard/SambutanAdmin'
import AktivitasTerkini from '@/components/admin/dashboard/AktivitasTerkini'
import AgendaTerdekat from '@/components/admin/dashboard/AgendaTerdekat'
import PesanBelumDiproses from '@/components/admin/dashboard/PesanBelumDiproses'
import { dashboardOverview as d } from '@/mocks/dashboardOverview'

// Overview CMS: hanya perakit layout. TODO: ganti `d` dengan hasil service ke API.
export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SambutanAdmin nama={d.sapaan} tahunPelajaran={d.tahunPelajaran} catatan={d.catatan} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AktivitasTerkini items={d.aktivitas} />
        </div>
        <div className="space-y-6">
          <AgendaTerdekat items={d.agenda} />
          <PesanBelumDiproses items={d.pesan} />
        </div>
      </div>
    </div>
  )
}

/** @format */

import { useEffect, useState } from "react";
import SambutanAdmin from "@/components/admin/dashboard/SambutanAdmin";
import AktivitasTerkini from "@/components/admin/dashboard/AktivitasTerkini";
import AgendaTerdekat from "@/components/admin/dashboard/AgendaTerdekat";
import { adminUser } from "@/mocks/admin";
import { dashboardOverview } from "@/mocks/dashboardOverview";
import { getDashboard } from "@/services/dashboardService";
import { getActiveAdmin } from "@/services/authService";

export default function DashboardPage() {
  const [hariIni] = useState(() => new Date());
  const [overview, setOverview] = useState(dashboardOverview);
  const profil = getActiveAdmin(adminUser);

  useEffect(() => {
    let aktif = true;
    getDashboard()
      .then((res) => {
        if (aktif && res) {
          setOverview((prev) => ({
            ...prev,
            ...res,
            aktivitas: Array.isArray(res.aktivitas)
              ? res.aktivitas
              : prev.aktivitas,
            agenda: Array.isArray(res.agenda) ? res.agenda : prev.agenda,
          }));
        }
      })
      .catch(() => {
        // Jika gagal memuat (mis. saat unit test), tetap gunakan fallback dashboardOverview
      });
    return () => {
      aktif = false;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SambutanAdmin
        nama={profil.namaSingkat}
        catatan={overview.catatan}
        tanggal={hariIni}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AktivitasTerkini items={overview.aktivitas} />
        </div>
        <AgendaTerdekat items={overview.agenda} />
      </div>
    </div>
  );
}

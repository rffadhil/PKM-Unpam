/** @format */

import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Wrench, Phone, Mail, ShieldAlert, ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ModalPeringatanPpdb from "@/components/ppdb/ModalPeringatanPpdb";
import { mockPengaturan } from "@/mocks/adminPengaturan";
import { ambilPengaturanLengkap } from "@/services/pengaturan.service";
import { applyBrowserBranding } from "@/utils/browserBranding";

export default function PublicLayout() {
  const [portal, setPortal] = useState(() => {
    try {
      const cached = localStorage.getItem("cms_portal_pengaturan");
      if (cached) {
        return { ...mockPengaturan, ...JSON.parse(cached) };
      }
    } catch { }
    return mockPengaturan;
  });
  const [modalPpdbOpen, setModalPpdbOpen] = useState(false);

  useEffect(() => {
    let aktif = true;

    const muatPengaturan = () => {
      try {
        const cached = localStorage.getItem("cms_portal_pengaturan");
        if (cached && aktif) {
          const parsed = JSON.parse(cached);
          setPortal((prev) => ({ ...prev, ...parsed }));
          applyBrowserBranding({
            title: "SMA Harapan Jaya",
            favicon: parsed.favicon || undefined,
          });
        }
      } catch { }

      ambilPengaturanLengkap()
        .then((res) => {
          if (aktif && res?.portal) {
            setPortal((prev) => ({ ...prev, ...res.portal }));
            try {
              localStorage.setItem(
                "cms_portal_pengaturan",
                JSON.stringify(res.portal)
              );
            } catch { }

            applyBrowserBranding({
              title: "SMA Harapan Jaya",
              favicon: res.portal.favicon || undefined,
            });
          }
        })
        .catch(() => {
          applyBrowserBranding({
            title: "SMA Harapan Jaya",
          });
        });
    };

    applyBrowserBranding({
      title: "SMA Harapan Jaya",
    });

    muatPengaturan();
    window.addEventListener("focus", muatPengaturan);
    window.addEventListener("portal_pengaturan_updated", muatPengaturan);
    window.addEventListener("storage", muatPengaturan);
    const handleBukaModal = () => setModalPpdbOpen(true);
    window.addEventListener("buka_modal_ppdb", handleBukaModal);
    return () => {
      aktif = false;
      window.removeEventListener("focus", muatPengaturan);
      window.removeEventListener("portal_pengaturan_updated", muatPengaturan);
      window.removeEventListener("storage", muatPengaturan);
      window.removeEventListener("buka_modal_ppdb", handleBukaModal);
    };
  }, []);

  // Tampilan saat Mode Pemeliharaan (Maintenance Mode) Diaktifkan oleh Super Admin
  if (portal.maintenance) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #042b06 0%, #063f08 60%, #145218 100%)",
          color: "#ffffff",
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "620px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(229, 240, 0, 0.3)",
            borderRadius: "20px",
            padding: "40px 32px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "#e5f000",
              color: "#063b00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Wrench size={32} />
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(229, 240, 0, 0.15)",
              color: "#e5f000",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.4px",
            }}
          >
            <ShieldAlert size={14} />
            PEMELIHARAAN SISTEM TERJADWAL
          </span>

          <h1
            style={{
              margin: "16px 0 12px",
              fontSize: "28px",
              fontWeight: 800,
              lineHeight: 1.25,
            }}
          >
            Portal {portal.namaInstitusi} Sedang Dalam Pemeliharaan
          </h1>

          <p
            style={{
              margin: "0 auto 28px",
              color: "#d4e3d0",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            Kami sedang melakukan pembaruan dan optimalisasi server untuk
            meningkatkan kualitas layanan informasi publik. Silakan kunjungi
            kembali beberapa saat lagi.
          </p>

          <div
            style={{
              background: "rgba(0, 0, 0, 0.25)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#e2ece0",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Phone size={15} color="#e5f000" />
              {portal.telepon}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Mail size={15} color="#e5f000" />
              {portal.email}
            </span>
          </div>

          <Link
            to="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#e5f000",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Akses Panel CMS Administrator <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        margin: 0,
        padding: 0,
      }}
    >
      <Navbar portal={portal} onBukaModalPpdb={() => setModalPpdbOpen(true)} />

      <main
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
        }}
      >
        <Outlet context={{ portal, bukaModalPpdb: () => setModalPpdbOpen(true) }} />
      </main>

      <Footer portal={portal} />
      {modalPpdbOpen && (
        <ModalPeringatanPpdb onTutup={() => setModalPpdbOpen(false)} />
      )}
    </div>
  );
}

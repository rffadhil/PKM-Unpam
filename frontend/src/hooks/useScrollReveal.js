import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Animasi muncul saat scroll untuk semua <section> di dalam <main>.
 * - Section yang sudah terlihat saat halaman dibuka tidak dianimasikan
 *   (tidak ada kedip pada hero).
 * - Section bersarang (section di dalam section) diabaikan.
 * - Konten yang dimuat belakangan dari API ikut terdeteksi.
 */
export default function useScrollReveal(aktif = true) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!aktif) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const main = document.querySelector("main");
    if (!main) return;

    const diproses = new WeakSet();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "tampil");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );

    const pindai = () => {
      main.querySelectorAll("section").forEach((el) => {
        if (diproses.has(el)) return;
        diproses.add(el);

        // abaikan section bersarang
        if (el.parentElement?.closest("section")) return;

        // abaikan yang sudah terlihat di layar saat dimuat
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

        el.setAttribute("data-reveal", "tunggu");
        observer.observe(el);
      });
    };

    pindai();

    let timer;
    const mo = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(pindai, 100);
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      mo.disconnect();
      observer.disconnect();
    };
  }, [pathname, aktif]);
}
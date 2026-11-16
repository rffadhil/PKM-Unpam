import PageHero from "@/components/ui/PageHero";

function BeritaHero() {
  return (
    <div className="[&_h1]:!font-['Times_New_Roman',Times,serif] [&_p]:!font-['Times_New_Roman',Times,serif]">
      <PageHero
        judul="Berita & Informasi Sekolah Harapan Jaya"
        deskripsi="Temukan berbagai informasi terbaru seputar SMA Harapan Jaya, mulai dari kegiatan sekolah, prestasi siswa, berbagai acara, hingga pengumuman penting lainnya."
      />
    </div>
  );
}

export default BeritaHero;
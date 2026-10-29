import React from 'react'
import AgendaAnnouncement from '../../components/agenda/AgendaAnnouncement'
import {
  ShieldCheck,
  Clock3,
  Phone,
  MapPin,
  LogIn,
  Download,
  Headset,
  Award,
  Users,
  Accessibility,
  Footprints,
  CheckCircle2,
  FolderOpen,
  FileText,
  MessageSquare,
  Mail,
  ArrowRight,
  CalendarDays,
  Building2,
  BadgeCheck,
  GraduationCap,
} from 'lucide-react'

const GREEN = '#064b08'
const DARK_GREEN = '#073b12'
const YELLOW = '#e4e900'
const LIGHT_GREEN = '#e7f8df'
const TEXT = '#193b21'
const MUTED = '#84909d'
const BORDER = '#e5e9ed'
const BG = '#faf9ff'

const sectionStyle = {
  padding: '76px 3%',
  borderBottom: `1px solid ${BORDER}`,
}

const containerStyle = {
  maxWidth: 1320,
  margin: '0 auto',
  width: '100%',
}

const eyebrowStyle = {
  color: '#527b45',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  marginBottom: 16,
}

const headingStyle = {
  color: DARK_GREEN,
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 'clamp(28px, 3.2vw, 42px)',
  lineHeight: 1.2,
  fontWeight: 700,
  margin: '0 0 14px',
}

const subheadingStyle = {
  color: MUTED,
  fontSize: 16,
  lineHeight: 1.75,
  maxWidth: 760,
  margin: '0 auto',
}

const cardStyle = {
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: 18,
  padding: 26,
  boxSizing: 'border-box',
}

const buttonBase = {
  minHeight: 52,
  borderRadius: 13,
  padding: '14px 22px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  fontWeight: 700,
  fontSize: 14,
  textDecoration: 'none',
  cursor: 'pointer',
  boxSizing: 'border-box',
}

const jalurPPDB = [
  {
    nama: 'Jalur Zonasi & Domisili',
    kuota: '50%',
    icon: MapPin,
    deskripsi:
      'Diperuntukkan bagi calon murid yang berdomisili di dalam wilayah zonasi terdekat dengan satuan pendidikan.',
    syarat: [
      'KK diterbitkan minimal 1 tahun sebelum tanggal pendaftaran',
      'Titik koordinat rumah tervalidasi di portal resmi',
    ],
    dayaTampung: '180 Peserta Didik',
  },
  {
    nama: 'Jalur Prestasi',
    kuota: '30%',
    icon: Award,
    deskripsi:
      'Mengakomodasi prestasi nilai rapor akademik maupun sertifikat kejuaraan sains, seni, dan olahraga.',
    syarat: [
      'Rata-rata rapor smt 1–5 minimal 85.00',
      'Juara OSN/O2SN/FLS2N minimal tingkat Kota/Kabupaten',
    ],
    dayaTampung: '108 Peserta Didik',
    unggulan: true,
  },
  {
    nama: 'Jalur Afirmasi',
    kuota: '15%',
    icon: Users,
    deskripsi:
      'Dukungan pendidikan bagi keluarga ekonomi tidak mampu dan penyandang disabilitas non-hambatan belajar.',
    syarat: [
      'Terdaftar aktif dalam DTKS Kemensos RI',
      'Kepemilikan KIP, KJP Plus, atau PKH valid',
    ],
    dayaTampung: '54 Peserta Didik',
  },
  {
    nama: 'Jalur Mutasi & PTK',
    kuota: '5%',
    icon: Footprints,
    deskripsi:
      'Bagi calon peserta didik yang mengikuti perpindahan tugas orang tua/wali serta anak guru kandung.',
    syarat: [
      'SK Penugasan resmi instansi/BUMN/TNI/Polri',
      'SK Mengajar aktif bagi anak tenaga pendidik',
    ],
    dayaTampung: '18 Peserta Didik',
    iconKhusus: Accessibility,
  },
]

const jadwalPPDB = [
  {
    tanggal: '15 APR - 10 MEI 2026',
    judul: 'Sosialisasi & Juknis',
    deskripsi:
      'Penyampaian informasi aturan teknis, panduan pemilihan jalur, dan pembukaan helpdesk daring.',
  },
  {
    tanggal: '15 MEI - 10 JUN 2026',
    judul: 'Pengambilan PIN & Berkas Fisik',
    deskripsi:
      'Verifikasi dokumen asli oleh panitia di sekolah dan penerbitan kode PIN aktivasi akun pendaftar.',
  },
  {
    tanggal: '12 - 20 JUNI 2026',
    judul: 'Pendaftaran Online Mandiri',
    deskripsi:
      'Pemilihan sekolah tujuan secara mandiri melalui web sistem PPDB resmi 24 jam nonstop.',
  },
  {
    tanggal: '25 JUNI 2026',
    judul: 'Pengumuman Kelulusan',
    deskripsi:
      'Penetapan hasil seleksi final secara transparan melalui portal resmi pukul 10.00 WIB.',
  },
  {
    tanggal: '01 - 05 JULI 2026',
    judul: 'Daftar Ulang & MPLS',
    deskripsi:
      'Penyerahan berkas final peserta diterima dan pembukaan Masa Pengenalan Lingkungan Sekolah Adiwiyata.',
  },
]

const berkasUmum = [
  'Akta Kelahiran Calon Siswa (Asli)',
  'Kartu Keluarga (KK) terbit > 1 tahun',
  'Buku Rapor SMP/MTs Semester 1 s.d 5',
  'Ijazah / Surat Keterangan Lulus (SKL)',
  'Pas Foto Berwarna Terbaru (3×4 background merah)',
]

const berkasKhusus = [
  'SPTJM bermaterai Rp 10.000 (Format resmi terlampir)',
  'Sertifikat OSN / O2SN / FLS2N (Jalur Prestasi)',
  'Kartu KIP / KJP / Terdaftar DTKS (Jalur Afirmasi)',
  'SK Pindah Tugas Orang Tua (Jalur Mutasi)',
  'Surat Keterangan Sehat & Bebas Buta Warna (Peminatan MIPA)',
]

function SectionHeading({ label, title, description }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 44 }}>
      <div style={eyebrowStyle}>{label}</div>
      <h2 style={headingStyle}>{title}</h2>
      {description && (
        <p style={subheadingStyle}>{description}</p>
      )}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        ...cardStyle,
        padding: '17px 16px',
        borderRadius: 14,
        minHeight: 82,
      }}
    >
      <div
        style={{
          color: '#78828d',
          fontSize: 11,
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 21,
          lineHeight: 1.2,
          fontWeight: 800,
          color: GREEN,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function JalurCard({ item }) {
  const Icon = item.iconKhusus || item.icon

  return (
    <article
      style={{
        ...cardStyle,
        position: 'relative',
        padding: 27,
        border: item.unggulan
          ? '2px solid #5d8651'
          : `1px solid ${BORDER}`,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        boxShadow: item.unggulan
          ? '0 0 0 1px rgba(65,112,48,.05)'
          : 'none',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,.10)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = item.unggulan
          ? '0 0 0 1px rgba(65,112,48,.05)'
          : 'none'
      }}
    >
      {item.unggulan && (
        <div
          style={{
            position: 'absolute',
            top: -13,
            left: '50%',
            transform: 'translateX(-50%)',
            background: YELLOW,
            color: '#183c08',
            padding: '5px 17px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 900,
            whiteSpace: 'nowrap',
          }}
        >
          UNGGULAN
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 23,
        }}
      >
        <div
          style={{
            width: 55,
            height: 55,
            borderRadius: 15,
            background: item.unggulan ? GREEN : '#eef3e9',
            color: item.unggulan ? YELLOW : '#477644',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={25} strokeWidth={2.4} />
        </div>

        <span
          style={{
            background: item.unggulan ? GREEN : '#b7f39b',
            color: item.unggulan ? '#dfff58' : '#34702c',
            borderRadius: 20,
            padding: '6px 13px',
            fontSize: 12,
            fontWeight: 800,
            whiteSpace: 'nowrap',
          }}
        >
          Kuota {item.kuota}
        </span>
      </div>

      <h3
        style={{
          color: '#18351f',
          fontSize: 21,
          lineHeight: 1.35,
          margin: '0 0 8px',
          letterSpacing: '-0.5px',
          fontWeight: 700,
        }}
      >
        {item.nama}
      </h3>

      <p
        style={{
          color: MUTED,
          fontSize: 14,
          lineHeight: 1.65,
          margin: '0 0 14px',
          minHeight: 92,
        }}
      >
        {item.deskripsi}
      </p>

      <div
        style={{
          height: 1,
          background: '#e9ece9',
          marginBottom: 16,
        }}
      />

      <div
        style={{
          color: TEXT,
          fontSize: 13,
          fontWeight: 800,
          marginBottom: 12,
        }}
      >
        Kriteria & Syarat:
      </div>

      <div style={{ display: 'grid', gap: 12, marginBottom: 22 }}>
        {item.syarat.map((syarat) => (
          <div
            key={syarat}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 9,
              color: '#68747c',
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            <CheckCircle2
              size={18}
              color="#67925d"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span>{syarat}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 'auto',
          borderTop: '1px solid #e9ece9',
          paddingTop: 17,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          fontSize: 12,
        }}
      >
        <span style={{ color: '#7d8791', fontWeight: 700 }}>
          Daya Tampung:
        </span>
        <strong style={{ color: '#23462a' }}>
          {item.dayaTampung}
        </strong>
      </div>
    </article>
  )
}

function TimelineCard({ item, index }) {
  return (
    <article
      style={{
        background: '#f9fafc',
        border: index === 1
          ? '2px solid #91a98b'
          : `1px solid ${BORDER}`,
        borderRadius: 15,
        padding: 22,
        minWidth: 0,
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,.10)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          background: index === 1 ? '#387d24' : GREEN,
          borderRadius: '50%',
          color: YELLOW,
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          margin: '0 auto 17px',
        }}
      >
        {index + 1}
      </div>

      <div
        style={{
          color: '#608154',
          fontSize: 11,
          fontWeight: 900,
          lineHeight: 1.5,
          marginBottom: 9,
        }}
      >
        {item.tanggal}
      </div>

      <h3
        style={{
          color: '#193d22',
          fontSize: 17,
          lineHeight: 1.45,
          margin: '0 0 10px',
          fontWeight: 700,
        }}
      >
        {item.judul}
      </h3>

      <p
        style={{
          color: MUTED,
          fontSize: 13,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {item.deskripsi}
      </p>
    </article>
  )
}

function DocumentList({ title, items, icon: Icon }) {
  return (
    <div style={{ minWidth: 0 }}>
      <h3
        style={{
          color: '#203b29',
          fontSize: 20,
          lineHeight: 1.35,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingBottom: 14,
          borderBottom: `1px solid ${BORDER}`,
          margin: '0 0 17px',
          fontWeight: 700,
        }}
      >
        <Icon size={24} color="#648d5d" />
        {title}
      </h3>

      <div style={{ display: 'grid', gap: 15 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: 13,
              color: '#59656b',
              lineHeight: 1.6,
            }}
          >
            <CheckCircle2
              size={19}
              color="#42833b"
              fill="#42833b"
              stroke="white"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactRow({ icon: Icon, label, value, href }) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        padding: '16px 14px',
        color: 'inherit',
        textDecoration: 'none',
        marginTop: 12,
      }}
    >
      <Icon size={23} color="#47764a" style={{ flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 3 }}>
          {label}
        </div>
        <strong
          style={{
            display: 'block',
            color: '#203b28',
            fontSize: 14,
            overflowWrap: 'anywhere',
          }}
        >
          {value}
        </strong>
      </div>

      <ArrowRight size={19} color="#8b9699" />
    </a>
  )
}

export default function AgendaPage() {
  return (
    <main style={{ background: BG, color: TEXT, overflow: 'hidden' }}>
      <AgendaAnnouncement />

      {/* HERO PPDB */}
      <section
        style={{
          ...sectionStyle,
          paddingTop: 40,
          paddingBottom: 65,
          background:
            'radial-gradient(circle at 87% 12%, #e0f9d9 0, transparent 28%), radial-gradient(circle at 17% 85%, #eaf8d7 0, transparent 24%), #faf9ff',
        }}
      >
        <div style={containerStyle}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              border: '1px solid #91bd80',
              background: '#e6f8dc',
              borderRadius: 30,
              padding: '9px 16px',
              color: '#27552b',
              fontSize: 14,
              fontWeight: 800,
              marginBottom: 25,
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: '#428637',
              }}
            />
            Gelombang 1 Dibuka - Kuota Terbatas (360 Kursi / 10 Rombel)
          </div>

          <h1
            style={{
              ...headingStyle,
              fontSize: 'clamp(32px, 3.5vw, 43px)',
              maxWidth: 800,
              marginBottom: 22,
            }}
          >
            Penerimaan Peserta Didik Baru (PPDB)
            <br />
            Tahun Ajaran 2026/2027
          </h1>

          <p
            style={{
              color: '#84909d',
              fontSize: 19,
              lineHeight: 1.65,
              maxWidth: 850,
              margin: '0 0 29px',
            }}
          >
            Mewujudkan generasi berkarakter luhur, berprestasi akademik
            unggul, dan berwawasan lingkungan hidup berkelanjutan di bawah
            naungan Sekolah Adiwiyata Mandiri & Kurikulum Merdeka.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
              gap: 16,
              maxWidth: 960,
              marginBottom: 46,
            }}
          >
            <StatCard label="AKREDITASI BAN-S/M" value="Nilai 98 (A)" />
            <StatCard label="RASIO DITERIMA PTN" value="87.4%" />
            <StatCard label="EKSTRAKURIKULER" value="28 Cabang" />
            <StatCard label="STATUS LINGKUNGAN" value="Adiwiyata" />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <a
              href="/dokumen/petunjuk-teknis-ppdb-2026.pdf"
              download
              style={{
                ...buttonBase,
                background: GREEN,
                color: '#fff',
                boxShadow: '0 4px 8px rgba(0,0,0,.12)',
              }}
            >
              <Download size={18} />
              Unduh Petunjuk Teknis & Brosur (PDF)
            </a>

            <a
              href="https://wa.me/6281298765432"
              target="_blank"
              rel="noreferrer"
              style={{
                ...buttonBase,
                border: '1px solid #73916e',
                background: '#fff',
                color: '#294b2d',
              }}
            >
              <Headset size={18} />
              Konsultasi WhatsApp Posko PPDB
            </a>
          </div>
        </div>
      </section>

      {/* INFORMASI INTEGRITAS */}
      <section
        style={{
          padding: '0 3% 60px',
          background: BG,
        }}
      >
        <div
          style={{
            ...containerStyle,
            border: '2px solid #b4c9af',
            borderRadius: 18,
            background: '#fff',
            padding: '27px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 22,
            flexWrap: 'wrap',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 17,
              flex: '1 1 520px',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: '#b8fa9e',
                color: GREEN,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={30} fill={GREEN} color="#b8fa9e" />
            </div>

            <div>
              <h2
                style={{
                  color: '#1b3a22',
                  fontSize: 17,
                  margin: '0 0 6px',
                  lineHeight: 1.4,
                  fontWeight: 700,
                }}
              >
                Integritas PPDB: 100% Bebas Pungutan Liar & Biaya Registrasi
              </h2>
              <p
                style={{
                  color: MUTED,
                  fontSize: 13,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Seluruh rangkaian pendaftaran, seleksi berkas, dan verifikasi
                faktual SMA Harapan Jaya dibiayai penuh oleh Dana BOS & BOPD.
                Waspadai segala bentuk penipuan yang mengatasnamakan panitia
                sekolah.
              </p>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${BORDER}`,
              background: '#f8fafc',
              borderRadius: 13,
              padding: '13px 21px',
              textAlign: 'center',
              minWidth: 185,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                color: '#87919c',
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 5,
              }}
            >
              BIAYA FORMULIR
            </div>
            <strong style={{ color: '#477c37', fontSize: 22 }}>
              Rp 0,- (GRATIS)
            </strong>
          </div>
        </div>
      </section>

      {/* KATEGORI & ALOKASI KURSI */}
      <section style={{ ...sectionStyle, background: BG }}>
        <div style={containerStyle}>
          <SectionHeading
            label="KATEGORI & ALOKASI KURSI"
            title="4 Jalur Penerimaan PPDB 2026/2027"
            description="Pilih jalur yang sesuai dengan kualifikasi prestasi akademik, jarak zonasi pemukiman, atau kondisi latar belakang peserta didik."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 255px), 1fr))',
              gap: 25,
              alignItems: 'stretch',
              paddingTop: 10,
            }}
          >
            {jalurPPDB.map((item) => (
              <JalurCard key={item.nama} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* JADWAL RESMI */}
      <section
        style={{
          ...sectionStyle,
          background: '#fff',
        }}
      >
        <div style={containerStyle}>
          <SectionHeading
            label="ALUR & WAKTU"
            title="Jadwal Resmi Pelaksanaan PPDB"
            description="Catat setiap tahapan penting agar berkas administrasi dan proses verifikasi berjalan tepat waktu."
          />

          <div style={{ position: 'relative', paddingTop: 2 }}>
            <div
              style={{
                position: 'absolute',
                left: '5%',
                right: '5%',
                top: '68px',
                height: 4,
                background: '#e5e9eb',
                zIndex: 0,
              }}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: 22,
              }}
            >
              {jadwalPPDB.map((item, index) => (
                <TimelineCard
                  key={item.judul}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PERSYARATAN DOKUMEN */}
      <section
        style={{
          ...sectionStyle,
          background: '#faf9ff',
        }}
      >
        <div
          style={{
            ...containerStyle,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            alignItems: 'center',
            gap: 42,
          }}
        >
          <div>
            <div style={eyebrowStyle}>VERIFIKASI KELENGKAPAN</div>

            <h2
              style={{
                ...headingStyle,
                fontSize: 'clamp(29px, 3vw, 40px)',
                marginBottom: 19,
              }}
            >
              Persyaratan Dokumen & Berkas Administrasi
            </h2>

            <p
              style={{
                color: MUTED,
                fontSize: 16,
                lineHeight: 1.7,
                margin: '0 0 18px',
              }}
            >
              Calon peserta didik wajib menyiapkan berkas scan format PDF/JPG
              asli (bukan fotokopi buram) dengan ukuran berkas maksimal 1.5 MB
              per lampiran.
            </p>

            <div
              style={{
                border: '1px solid #8fb18a',
                background: '#e7f8e2',
                borderRadius: 15,
                padding: 19,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  color: '#254b2a',
                  fontWeight: 800,
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                <BadgeCheck size={21} />
                Validasi Keabsahan Dokumen
              </div>

              <p
                style={{
                  color: '#4d6751',
                  fontSize: 13,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Setiap dokumen yang diunggah akan melalui verifikasi sistem
                Dapodik Dukcapil secara sinkron untuk mencegah pemalsuan
                identitas.
              </p>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              padding: '31px',
              borderRadius: 20,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: 30,
              boxShadow: '0 2px 8px rgba(18,48,28,.025)',
            }}
          >
            <DocumentList
              title="Berkas Umum (Wajib)"
              items={berkasUmum}
              icon={FolderOpen}
            />

            <DocumentList
              title="Berkas Khusus & Hukum"
              items={berkasKhusus}
              icon={FileText}
            />
          </div>
        </div>
      </section>

      {/* POSKO INFORMASI */}
      <section
        style={{
          padding: '62px 3% 88px',
          background: '#fff',
        }}
      >
        <div
          style={{
            ...containerStyle,
            borderRadius: 25,
            background:
              'radial-gradient(circle at 4% 95%, rgba(116,163,25,.23), transparent 20%), radial-gradient(circle at 92% 10%, rgba(35,112,37,.3), transparent 25%), #063e06',
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
            gap: 42,
            alignItems: 'center',
            boxSizing: 'border-box',
            color: '#fff',
            boxShadow: '0 14px 30px rgba(0,0,0,.10)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(91,139,22,.3)',
                color: YELLOW,
                borderRadius: 30,
                padding: '8px 13px',
                fontSize: 12,
                fontWeight: 900,
                marginBottom: 24,
              }}
            >
              <MapPin size={15} />
              GEDUNG PELAYANAN SATU PINTU
            </div>

            <h2
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(28px, 3vw, 40px)',
                lineHeight: 1.25,
                margin: '0 0 18px',
                color: '#fff',
              }}
            >
              Posko Informasi & Verifikasi Fisik PPDB
            </h2>

            <p
              style={{
                color: '#d3e2d2',
                fontSize: 15,
                lineHeight: 1.7,
                margin: '0 0 30px',
              }}
            >
              Butuh asistensi pendaftaran online atau ingin berkonsultasi
              mengenai jalur prestasi? Silakan berkunjung langsung ke Posko
              Layanan SMA Harapan Jaya.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: 25,
              }}
            >
              <div style={{ display: 'flex', gap: 13 }}>
                <div
                  style={{
                    width: 43,
                    height: 43,
                    borderRadius: 12,
                    background: 'rgba(127,172,50,.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: YELLOW,
                    flexShrink: 0,
                  }}
                >
                  <Clock3 size={24} />
                </div>
                <div>
                  <strong style={{ fontSize: 16 }}>Jam Operasional</strong>
                  <p
                    style={{
                      color: '#d3e2d2',
                      fontSize: 13,
                      lineHeight: 1.6,
                      margin: '7px 0 0',
                    }}
                  >
                    Senin - Jumat: 08.00 - 15.00 WIB
                    <br />
                    Sabtu: 08.00 - 12.00 WIB
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 13 }}>
                <div
                  style={{
                    width: 43,
                    height: 43,
                    borderRadius: 12,
                    background: 'rgba(127,172,50,.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: YELLOW,
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={24} />
                </div>
                <div>
                  <strong style={{ fontSize: 16 }}>Lokasi Helpdesk</strong>
                  <p
                    style={{
                      color: '#d3e2d2',
                      fontSize: 13,
                      lineHeight: 1.6,
                      margin: '7px 0 0',
                    }}
                  >
                    Ruang Serbaguna & Lab Komputer 1, Gedung Sayap Barat
                    Kampus SMA Harapan Jaya
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '29px',
              color: TEXT,
              boxSizing: 'border-box',
            }}
          >
            <h3
              style={{
                fontSize: 22,
                lineHeight: 1.3,
                margin: '0 0 13px',
                color: '#203c29',
                fontWeight: 700,
              }}
            >
              Kanal Komunikasi Terverifikasi
            </h3>

            <p
              style={{
                color: MUTED,
                fontSize: 13,
                lineHeight: 1.65,
                margin: '0 0 16px',
              }}
            >
              Untuk pertanyaan cepat mengenai kuota zonasi dan sinkronisasi
              NISN, hubungi layanan hotline resmi:
            </p>

            <ContactRow
              icon={MessageSquare}
              label="WhatsApp Hotline 1"
              value="+62 812-9876-5432"
              href="https://wa.me/6281298765432"
            />

            <ContactRow
              icon={Phone}
              label="Telepon Kantor Tata Usaha"
              value="(021) 781-9230 ext. 104"
              href="tel:+62217819230"
            />

            <ContactRow
              icon={Mail}
              label="Email Panitia Seleksi"
              value="ppdb@smaharapanjaya.sch.id"
              href="mailto:ppdb@smaharapanjaya.sch.id"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
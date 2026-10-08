# Portal Publikasi SMA Harapan Jaya

Selamat datang di repositori proyek Portal Publikasi SMA Harapan Jaya! 
Panduan ini dibuat khusus agar semua anggota tim (baik Front-end maupun Back-end) bisa bekerja sama dengan mudah, meskipun ini adalah pengalaman pertama kalian membangun *website* secara tim.

Proyek ini menggunakan arsitektur terpisah (Frontend dan Backend) dalam satu *folder* besar (*monorepo*).

## Teknologi yang Kita Gunakan
*   **Frontend (Tampilan):** React.js (Vite), Tailwind CSS **v3.4** (Ingat, kita pakai versi 3, bukan v4), React Router Dom.
*   **Backend (Server/API):** Node.js, Express.js.
*   **Database:** PostgreSQL (Supabase).
*   **Storage (Penyimpanan Foto/File):** Cloudinary / Supabase Storage.

---

## Tahap 1: Persiapan Wajib (Install Aplikasi)
Sebelum menyentuh kode, pastikan 3 aplikasi ini sudah terinstal di laptop kalian:

1.  **Visual Studio Code (VS Code):** Ini adalah aplikasi editor kode kita. [Download di sini](https://code.visualstudio.com/).
    *   *Sangat disarankan menginstal Ekstensi VS Code:* **Prettier - Code formatter** dan **Tailwind CSS IntelliSense**.
2.  **Node.js (Versi LTS):** Ini mesin agar laptop kalian bisa menjalankan React dan Express. [Download di sini](https://nodejs.org/). (Pilih yang versi LTS).
3.  **Git:** Ini sistem penyimpan dan kolaborasi kode kita. [Download di sini](https://git-scm.com/downloads).

---

## Tahap 2: Mengambil Kode ke Laptop Masing-Masing
Buka terminal (bisa pakai Command Prompt, PowerShell, atau terminal bawaan VS Code), lalu jalankan perintah ini secara berurutan:

```bash
# 1. Download proyek dari GitHub ke laptopmu
git clone [https://github.com/rffadhil/PKM-Unpam.git](https://github.com/rffadhil/PKM-Unpam.git)

# 2. Masuk ke dalam folder proyek
cd PKM-Unpam/portal-sma-harapan-jaya

/** @format */

import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Membaca konfigurasi dari file .env di folder backend
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = pg;

// Pastikan tipe DATE (OID 1082) dari PostgreSQL dikembalikan sebagai string murni 'YYYY-MM-DD'
// tanpa konversi zona waktu UTC yang menggeser tanggal mundur 1 hari.
pg.types.setTypeParser(1082, (val) => val);

// Membuat koneksi pool ke PostgreSQL menggunakan DATABASE_URL di .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Fungsi bantuan untuk menjalankan query SQL di seluruh service
export const query = (text, params) => pool.query(text, params);

export default pool;

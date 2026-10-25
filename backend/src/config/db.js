/** @format */

import pg from "pg";
import dotenv from "dotenv";

// Membaca konfigurasi dari file .env
dotenv.config();

const { Pool } = pg;

// Membuat koneksi pool ke PostgreSQL menggunakan DATABASE_URL di .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Fungsi bantuan untuk menjalankan query SQL di seluruh service nantinya
export const query = (text, params) => pool.query(text, params);

export default pool;

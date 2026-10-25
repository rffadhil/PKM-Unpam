/** @format */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
  const client = await pool.connect();
  try {
    console.log("⏳ Menjalankan migrasi database...");
    const sqlPath = path.join(__dirname, "migrations", "001_init_schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");

    console.log(
      "✅ Migrasi berhasil! Ke-8 tabel utama telah siap di database.",
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migrasi gagal:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

runMigration();

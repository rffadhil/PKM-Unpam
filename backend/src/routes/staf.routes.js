
/** @format */

import express from "express";

import {
  getStaf,
  getStafDetail,
  tambahStaf,
  ubahStaf,
  hapusStaf,
} from "../controllers/staf.controller.js";

const router = express.Router();

// GET semua data staf
router.get("/", getStaf);

// GET detail staf berdasarkan ID
router.get("/:id", getStafDetail);

// POST tambah data staf
router.post("/", tambahStaf);

// PUT ubah data staf
router.put("/:id", ubahStaf);

// DELETE hapus data staf
router.delete("/:id", hapusStaf);

export default router;

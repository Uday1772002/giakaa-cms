const express = require("express");
const router = express.Router();
const {
  getActiveSlides,
  getAllSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
} = require("../controllers/heroController");

// public - anyone can fetch active slides
router.get("/", getActiveSlides);

// admin routes (no auth required per spec but keeping them separate for clarity)
router.get("/admin/all", getAllSlides);
router.get("/admin/:id", getSlideById);
router.post("/admin", createSlide);
router.put("/admin/:id", updateSlide);
router.delete("/admin/:id", deleteSlide);

module.exports = router;

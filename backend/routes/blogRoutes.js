const express = require("express");
const router = express.Router();
const {
  getPublishedPosts,
  getPostBySlug,
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/blogController");

// public routes - what the website visitors see
router.get("/", getPublishedPosts);
router.get("/slug/:slug", getPostBySlug);

// admin routes - CRUD for the CMS panel
router.get("/admin/all", getAllPosts);
router.get("/admin/:id", getPostById);
router.post("/admin", createPost);
router.put("/admin/:id", updatePost);
router.delete("/admin/:id", deletePost);

module.exports = router;

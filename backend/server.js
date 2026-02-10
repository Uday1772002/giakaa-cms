require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const heroRoutes = require("./routes/heroRoutes");
const blogRoutes = require("./routes/blogRoutes");
const { generateSitemap } = require("./routes/sitemapRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // generous limit for blog content with images
app.use(express.urlencoded({ extended: true }));

// connect to mongodb first, then start the server
connectDB().then(() => {
  // routes
  app.use("/api/hero", heroRoutes);
  app.use("/api/blog", blogRoutes);

  // sitemap lives here - see sitemapRoutes for the xml generation
  app.get("/api/sitemap.xml", generateSitemap);

  // basic health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 404 handler for api routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({ success: false, message: "API endpoint not found" });
  });

  // global error handler - catches anything that slips through
  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  });

  // in production, serve the built frontend files
  // this way we only need one server for everything
  if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "..", "frontend", "dist");
    app.use(express.static(frontendPath));

    // any route that isnt /api/* gets the index.html (for client-side routing)
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
});

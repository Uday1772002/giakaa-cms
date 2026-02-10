const BlogPost = require("../models/BlogPost");

/*
  Sitemap generator - creates XML sitemap for SEO
  includes all published blog posts + static pages
  
  this runs on-demand rather than being pre-generated
  for a high-traffic site you'd want to cache this or generate it on a cron
  but for our scale its fine to do it on every request
*/
async function generateSitemap(req, res) {
  try {
    const baseUrl = req.query.baseUrl || "http://localhost:5173";

    // grab all published post slugs so we can list them
    const posts = await BlogPost.find({ status: "published" })
      .select("slug updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // static pages first
    const staticPages = ["/", "/blog"];
    for (const page of staticPages) {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}${page}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${page === "/" ? "1.0" : "0.8"}</priority>\n`;
      xml += "  </url>\n";
    }

    // then all blog posts
    for (const post of posts) {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += "  </url>\n";
    }

    xml += "</urlset>";

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    res.status(500).send("Failed to generate sitemap");
  }
}

module.exports = { generateSitemap };

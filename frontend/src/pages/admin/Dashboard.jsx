import { Link, useLocation } from "react-router-dom";
import SEOHead from "../../components/SEOHead";

/*
  Admin dashboard - main entry point for the CMS
  shows overview and navigation to hero/blog management
*/
function Dashboard() {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <SEOHead
        title="CMS Admin"
        description="Content Management System admin panel"
      />

      <div className="container">
        <div className="admin-header">
          <h1>CMS Admin Panel</h1>
        </div>

        <div className="admin-nav">
          <Link
            to="/admin"
            className={location.pathname === "/admin" ? "active" : ""}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/hero"
            className={location.pathname === "/admin/hero" ? "active" : ""}
          >
            Hero Slider
          </Link>
          <Link
            to="/admin/blog"
            className={
              location.pathname.startsWith("/admin/blog") ? "active" : ""
            }
          >
            Blog Posts
          </Link>
        </div>

        {/* the two big cards linking to hero + blog management */}
        <div
          className="features-grid"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <Link
            to="/admin/hero"
            className="feature-card"
            style={{ textDecoration: "none" }}
          >
            <div className="feature-icon">🖼️</div>
            <h3>Hero Slider</h3>
            <p>
              Manage the hero section slides. Add, edit, or remove slides with
              images/videos, headlines, and call-to-action buttons.
            </p>
          </Link>

          <Link
            to="/admin/blog"
            className="feature-card"
            style={{ textDecoration: "none" }}
          >
            <div className="feature-icon">📝</div>
            <h3>Blog Posts</h3>
            <p>
              Create and manage blog content. Write in Markdown, set SEO meta
              tags, and control draft/published status.
            </p>
          </Link>
        </div>

        {/* some helpful info */}
        <div
          style={{
            marginTop: "40px",
            padding: "24px",
            background: "var(--bg-card)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
          }}
        >
          <h3 style={{ marginBottom: "12px", fontSize: "1.1rem" }}>
            Quick Guide
          </h3>
          <ul
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              lineHeight: "1.8",
              paddingLeft: "20px",
            }}
          >
            <li style={{ listStyle: "disc" }}>
              Use the <strong>Hero Slider</strong> section to manage the landing
              page carousel
            </li>
            <li style={{ listStyle: "disc" }}>
              Blog posts support <strong>Markdown</strong> content - headings,
              bold, lists, code blocks, etc.
            </li>
            <li style={{ listStyle: "disc" }}>
              Set posts as <strong>Draft</strong> to save work-in-progress
              without publishing
            </li>
            <li style={{ listStyle: "disc" }}>
              SEO fields (meta title, description) are auto-generated but can be
              customized
            </li>
            <li style={{ listStyle: "disc" }}>
              Slugs are auto-generated from titles but you can override them
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

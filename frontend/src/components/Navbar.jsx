import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// top nav bar - handles mobile hamburger menu + active link highlighting
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Giak<span>aa</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={isActive("/")}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/blog"
            className={isActive("/blog")}
            onClick={() => setMobileOpen(false)}
          >
            Insights
          </Link>
          <Link
            to="/admin"
            className={isActive("/admin")}
            onClick={() => setMobileOpen(false)}
          >
            CMS
          </Link>
        </div>

        <div className="navbar-cta">
          <Link to="/admin" className="btn btn-primary btn-sm">
            Admin Panel
          </Link>
          {/* hamburger menu for mobile */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

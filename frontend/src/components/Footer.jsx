import { Link } from "react-router-dom";

// footer layout loosely follows giakaa.com
// services, industries, company columns
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>
              Giak<span>aa</span>
            </h3>
            <p>
              AI-first consulting firm delivering high-impact solutions that
              drive measurable growth across 40+ industries.
            </p>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <a href="#">Strategy & Digital Transformation</a>
            <a href="#">Application Services</a>
            <a href="#">Cloud Services</a>
            <a href="#">Data & AI</a>
            <a href="#">Cybersecurity</a>
            <a href="#">Blockchain & Web3</a>
          </div>

          <div className="footer-col">
            <h4>Industries</h4>
            <a href="#">Banking & Finance</a>
            <a href="#">Healthcare</a>
            <a href="#">Real Estate</a>
            <a href="#">Retail & Ecommerce</a>
            <a href="#">Energy & Utilities</a>
            <a href="#">Education</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/">Home</Link>
            <Link to="/blog">Insights</Link>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <Link to="/admin">CMS Admin</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Giakaa. All rights reserved.</span>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
            <a href="#" aria-label="LinkedIn">
              in
            </a>
            <a href="#" aria-label="Telegram">
              ✈
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

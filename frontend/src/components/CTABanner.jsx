import { Link } from "react-router-dom";

// CTA banner - the big purple section
function CTABanner() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <h2>
            At Giakaa, we help businesses thrive by upgrading their tech,
            simplifying workflows, and creating amazing experiences that keep
            them ahead of the curve.
          </h2>
          <Link to="/contact" className="btn">
            Innovate with Giakaa →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;

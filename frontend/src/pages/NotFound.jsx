import { Link } from "react-router-dom";

// 404 page - shows up when someone hits a route that doesnt exist
function NotFound() {
  return (
    <div
      style={{
        paddingTop: "120px",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "6rem",
            fontWeight: "800",
            color: "var(--primary)",
            marginBottom: "8px",
            lineHeight: "1",
          }}
        >
          404
        </h1>
        <h2 style={{ marginBottom: "12px", fontSize: "1.5rem" }}>
          Page Not Found
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "32px",
            maxWidth: "400px",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/contact" className="btn btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

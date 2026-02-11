import { useState } from "react";
import SEOHead from "../components/SEOHead";

// contact page - simple form UI, doesnt actually send emails
// in a real app youd hook this up to an email service or backend endpoint
function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // not wired to a backend - just shows a success message
    setSubmitted(true);
  }

  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh" }}>
      <SEOHead
        title="Contact Us"
        description="Get in touch with the Giakaa team. Let's talk about how we can help transform your business with AI-first solutions."
        slug="contact"
      />

      <div className="container" style={{ maxWidth: "700px" }}>
        <div className="section-header">
          <h2>Let's Talk</h2>
          <p>
            Have a project in mind? We'd love to hear from you. Fill out the
            form below and our team will get back to you within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
            <h3 style={{ marginBottom: "8px" }}>Message Sent!</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Thanks for reaching out. We'll get back to you soon.
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: "24px" }}
              onClick={() => {
                setSubmitted(false);
                setForm({ name: "", email: "", company: "", message: "" });
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              background: "var(--bg-card)",
              padding: "32px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="john@company.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                Company
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Acme Inc."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Tell us about your project..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", padding: "12px 32px" }}
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;

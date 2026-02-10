import { useState } from "react";

// newsletter signup - doesnt actually send anywhere, just a UI thing for now
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // not actually sending anywhere - just a UI demo
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  }

  return (
    <section className="newsletter">
      <div className="container">
        <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Newsletter</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
          Subscribe to stay up-to-date on the technologies defining today and
          shaping tomorrow
        </p>

        {submitted ? (
          <p style={{ color: "var(--success)" }}>Thanks for subscribing! 🎉</p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;

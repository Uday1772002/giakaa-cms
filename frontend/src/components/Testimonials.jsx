// just one testimonial for now - could make this a carousel if we get more
function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Proven Excellence</h2>
          <p>
            Partners who've experienced the Giakaa difference share their
            success stories
          </p>
        </div>

        <div className="testimonial-card">
          <p className="quote">
            "Always a great experience working with the Giakaa team. Very happy
            once again. They are easy to communicate with, always willing to go
            above and beyond and most importantly deliver great work!"
          </p>
          <p className="testimonial-author">Alex Costa</p>
          <p className="testimonial-role">CEO, Partner Company</p>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

// Stats section - matches the "Empowering Enterprise" numbers section on giakaa
function StatsSection() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stats-text">
            <h2>Empowering Enterprise</h2>
            <p>
              At Giakaa, we empower enterprises to compete with industry giants
              by delivering world-class technology solutions, streamlined
              operations, and specialized expertise, without the overhead of
              building it all in-house.
            </p>
          </div>

          <div className="stats-numbers">
            <div className="stat-item">
              <h3>40+</h3>
              <p>Industries Expertise</p>
            </div>
            <div className="stat-item">
              <h3>4</h3>
              <p>Countries</p>
              <span className="stat-sub">+5 This Year</span>
            </div>
            <div className="stat-item">
              <h3>Global</h3>
              <p>Scale. Local Expertise.</p>
            </div>
            <div className="stat-item">
              <h3>100+</h3>
              <p>Projects Delivered</p>
              <span className="stat-sub">+20% Growth YoY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;

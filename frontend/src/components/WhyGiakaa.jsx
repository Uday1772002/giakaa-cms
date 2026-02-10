// "Why Giakaa" section - three feature cards
// content taken from the actual site
function WhyGiakaa() {
  const features = [
    {
      icon: "🤖",
      title: "Built for the AI Era",
      description:
        "Unlike legacy firms retrofitting AI into outdated methodologies, Giakaa was purpose-built with artificial intelligence at our core. Every solution leverages AI, machine learning, and intelligent automation.",
    },
    {
      icon: "⚡",
      title: "Rapid, High-Impact Delivery",
      description:
        "We combine agile methodologies, pre-built AI accelerators, and modern engineering practices to deliver production-ready solutions 3-5x faster than traditional consultancies.",
    },
    {
      icon: "📈",
      title: "ROI-Focused Results",
      description:
        "Every engagement is designed with clear KPIs and success metrics. We focus relentlessly on outcomes that matter: revenue growth, cost reduction, operational efficiency.",
    },
  ];

  return (
    <section className="section" id="why-giakaa">
      <div className="container">
        <div className="section-header">
          <h2>Why Giakaa</h2>
          <p>The intelligent partner for your digital transformation</p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyGiakaa;

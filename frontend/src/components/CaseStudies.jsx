// case studies - hardcoded for now, could pull from CMS later
function CaseStudies() {
  const cases = [
    {
      title: "Blocktrack",
      description:
        "Scales global skill development to millions of learners through on-chain credentials and AI-driven educational pathways.",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
    },
    {
      title: "Giakaa Realty",
      description:
        "Delivering comprehensive solutions tailored to smart cities, focusing on land advisory, financial services, and investment planning.",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    },
    {
      title: "TokeX",
      description:
        "A pioneering real estate tokenization platform designed to provide a seamless and efficient process for digitizing property assets.",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    },
  ];

  return (
    <section className="section" id="case-studies">
      <div className="container">
        <div className="section-header">
          <h2>Case Studies</h2>
          <p>
            Our offerings are designed to drive meaningful outcomes, enhance
            customer experiences, and revolutionize industries.
          </p>
        </div>

        <div className="case-studies-grid">
          {cases.map((caseStudy, i) => (
            <div className="case-study-card" key={i}>
              <img src={caseStudy.image} alt={caseStudy.title} loading="lazy" />
              <div className="case-study-info">
                <h3>{caseStudy.title}</h3>
                <p>{caseStudy.description}</p>
                <a href="#" className="btn-ghost">
                  View Case Study →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStudies;

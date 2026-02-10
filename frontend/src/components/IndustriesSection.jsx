// Industries section - tag/pill layout like giakaa
function IndustriesSection() {
  const industries = [
    "Aerospace",
    "Agriculture",
    "Automotive & Mobility",
    "Aviation",
    "Banking & Finance",
    "Chemical Manufacturing",
    "Communication & Telecom",
    "Consumer Goods",
    "Dairy",
    "Defense",
    "Education",
    "Energy & Utilities",
    "Healthcare",
    "High Technology",
    "Insurance",
    "Life Sciences",
    "Logistics & Supply Chain",
    "Media & Entertainment",
    "Mining & Metals",
    "Oil & Gas",
    "Real Estate",
    "Retail & Ecommerce",
    "Semiconductor",
    "Smart Cities",
    "Sports",
    "Travel & Hospitality",
  ];

  return (
    <section className="section" id="industries">
      <div className="container">
        <div className="section-header">
          <h2>Industries</h2>
          <p>
            Our comprehensive experience across these sectors enables us to
            deliver tailored solutions that drive innovation and efficiency.
          </p>
        </div>

        <div className="industries-tags">
          {industries.map((industry, i) => (
            <span className="industry-tag" key={i}>
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IndustriesSection;

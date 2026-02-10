// Services section - image cards like on giakaa.com
function ServicesSection() {
  const services = [
    {
      title: "Strategy & Digital Transformation",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    },
    {
      title: "Application Services",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    },
    {
      title: "Cloud Services",
      image:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
    },
    {
      title: "Data, Analytics & AI",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    },
    {
      title: "Cybersecurity",
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&q=80",
    },
    {
      title: "Sustainability & ESG",
      image:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",
    },
  ];

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-header">
          <h2>Services</h2>
          <p>
            Our offerings are designed to drive meaningful outcomes, enhance
            customer experiences, and revolutionize industries with efficiency
            and speed.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, i) => (
            <div className="service-card" key={i}>
              <img src={service.image} alt={service.title} loading="lazy" />
              <div className="service-card-overlay">
                <h3>{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;

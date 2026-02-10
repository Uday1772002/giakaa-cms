// The GIAKAA Approach section - GATHER, IDEATE, etc.
function Approach() {
  const steps = [
    {
      letter: "G",
      name: "GATHER",
      description: "Deep Discovery & Alignment",
    },
    {
      letter: "I",
      name: "IDEATE",
      description: "Strategic Solution Design",
    },
    {
      letter: "A",
      name: "ARCHITECT",
      description: "Technical Blueprint & Planning",
    },
    {
      letter: "K",
      name: "KICK-OFF",
      description: "Agile Development Sprint",
    },
    {
      letter: "A",
      name: "ACCELERATE",
      description: "Scale & Optimize",
    },
    {
      letter: "A",
      name: "ADVANCE",
      description: "Continuous Innovation",
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>The GIAKAA Approach</h2>
        </div>

        <div className="approach-steps">
          {steps.map((step, i) => (
            <div className="approach-step" key={i}>
              <div className="step-number">{step.letter}</div>
              <h3>{step.name}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Approach;

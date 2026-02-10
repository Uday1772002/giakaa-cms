// Tech stack section - shows tech categories and logos
function TechStack() {
  const categories = [
    {
      name: "Frontend",
      techs: ["React", "Angular", "Vue.js", "Next.js", "HTML5", "CSS3"],
    },
    {
      name: "Backend",
      techs: ["Node.js", "Python", "Java", "Go", ".NET", "Ruby"],
    },
    {
      name: "Mobile",
      techs: ["React Native", "Flutter", "Swift", "Kotlin"],
    },
    {
      name: "Cloud & DevOps",
      techs: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"],
    },
    {
      name: "Databases",
      techs: ["MongoDB", "PostgreSQL", "Redis", "MySQL", "DynamoDB"],
    },
  ];

  // simple emoji-based icons for tech items
  const techIcons = {
    React: "⚛️",
    Angular: "🅰️",
    "Vue.js": "💚",
    "Next.js": "▲",
    HTML5: "🌐",
    CSS3: "🎨",
    "Node.js": "💚",
    Python: "🐍",
    Java: "☕",
    Go: "🔵",
    ".NET": "🔷",
    Ruby: "💎",
    "React Native": "📱",
    Flutter: "🦋",
    Swift: "🍎",
    Kotlin: "🟣",
    AWS: "☁️",
    Azure: "🔷",
    GCP: "🌩️",
    Docker: "🐳",
    Kubernetes: "☸️",
    MongoDB: "🍃",
    PostgreSQL: "🐘",
    Redis: "🔴",
    MySQL: "🐬",
    DynamoDB: "⚡",
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Technology</h2>
          <p>
            Tech capabilities driving digital transformation for our clients
          </p>
        </div>

        {categories.map((category, i) => (
          <div key={i} style={{ marginBottom: "32px" }}>
            <h3
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {category.name}
            </h3>
            <div className="tech-grid">
              {category.techs.map((tech, j) => (
                <div className="tech-item" key={j}>
                  <span>{techIcons[tech] || "🔧"}</span>
                  {tech}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TechStack;

/*
  Seed script - populates the database with some initial content
  so you dont have to manually create everything through the CMS
  
  run with: npm run seed
*/
require("dotenv").config();
const mongoose = require("mongoose");
const HeroSlide = require("./models/HeroSlide");
const BlogPost = require("./models/BlogPost");

const heroSlides = [
  {
    title: "Empowering Enterprise",
    description:
      "AI-first consulting firm delivering high-impact solutions that drive measurable growth across 40+ industries",
    mediaUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
    mediaType: "image",
    ctaText: "Let's Talk",
    ctaLink: "/contact",
    displayOrder: 0,
    isActive: true,
  },
  {
    title: "Digital Transformation",
    description:
      "We combine agile methodologies, pre-built AI accelerators, and modern engineering practices to deliver production-ready solutions",
    mediaUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    mediaType: "image",
    ctaText: "Our Services",
    ctaLink: "/services",
    displayOrder: 1,
    isActive: true,
  },
  {
    title: "Innovation at Scale",
    description:
      "From strategy to execution, we build intelligent systems that learn and improve over time",
    mediaUrl:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200",
    mediaType: "image",
    ctaText: "View Case Studies",
    ctaLink: "/case-studies",
    displayOrder: 2,
    isActive: true,
  },
];

const blogPosts = [
  {
    title: "AI Workflows Transform Finance, Banking & Insurance",
    slug: "ai-workflows-transform-finance-banking-insurance",
    content: `## The Rise of AI in Financial Services\n\nThe financial services industry stands at the inflection point of a revolutionary transformation. Artificial Intelligence is no longer a futuristic concept—it's a present-day reality reshaping how banks, insurance companies, and financial institutions operate.\n\n### Key Areas of Impact\n\n**1. Automated Risk Assessment**\nAI-powered risk models can analyze thousands of data points in milliseconds, providing more accurate risk profiles than traditional methods.\n\n**2. Fraud Detection**\nMachine learning algorithms can identify suspicious patterns in real-time, reducing fraud losses by up to 60%.\n\n**3. Customer Experience**\nChatbots and virtual assistants are handling routine queries, freeing up human agents for complex interactions.\n\n### The Path Forward\n\nOrganizations that embrace AI early will gain a significant competitive advantage. The key is to start with well-defined use cases and scale gradually.\n\n> "The question is no longer whether to adopt AI, but how fast you can implement it." - Industry Expert`,
    excerpt:
      "The financial services industry stands at the inflection point of a revolutionary transformation driven by AI.",
    metaTitle: "AI Workflows Transform Finance & Banking | Giakaa Insights",
    metaDescription:
      "Discover how AI workflows are revolutionizing finance, banking, and insurance industries with automated risk assessment and fraud detection.",
    featuredImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    status: "published",
    tags: ["AI", "Finance", "Banking", "Insurance"],
    author: "Giakaa Team",
  },
  {
    title: "The Future of Cloud-Native Architecture",
    slug: "future-of-cloud-native-architecture",
    content: `## Cloud-Native: More Than Just Cloud\n\nCloud-native architecture represents a fundamental shift in how we build and deploy applications. It's not just about running apps in the cloud—it's about designing them to fully leverage cloud capabilities.\n\n### Core Principles\n\n**Microservices**\nBreaking applications into small, independent services that can be developed, deployed, and scaled independently.\n\n**Containers**\nPackaging applications with their dependencies for consistent deployment across environments.\n\n**Orchestration**\nUsing tools like Kubernetes to manage container lifecycles, scaling, and networking.\n\n**CI/CD**\nAutomating the build, test, and deployment pipeline for faster, more reliable releases.\n\n### Benefits\n\n- **Scalability**: Scale individual services based on demand\n- **Resilience**: Failure in one service doesn't bring down the entire application\n- **Agility**: Teams can work independently on different services\n- **Cost Efficiency**: Pay only for the resources you use`,
    excerpt:
      "Cloud-native architecture represents a fundamental shift in how we build and deploy applications.",
    metaTitle: "Future of Cloud-Native Architecture | Giakaa Insights",
    metaDescription:
      "Learn about cloud-native architecture principles including microservices, containers, orchestration, and CI/CD pipelines.",
    featuredImage:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
    status: "published",
    tags: ["Cloud", "Architecture", "DevOps"],
    author: "Giakaa Team",
  },
  {
    title: "Blockchain Beyond Cryptocurrency",
    slug: "blockchain-beyond-cryptocurrency",
    content: `## Blockchain's Real-World Applications\n\nWhile blockchain technology gained fame through cryptocurrency, its potential extends far beyond digital currency.\n\n### Supply Chain Transparency\nBlockchain provides an immutable record of product journey from manufacturer to consumer, ensuring authenticity and reducing counterfeiting.\n\n### Healthcare Records\nSecure, interoperable health records that patients control, reducing administrative overhead and improving care coordination.\n\n### Digital Identity\nSelf-sovereign identity solutions that give individuals control over their personal data.\n\n### Smart Contracts\nAutomated, trustless agreements that execute when predefined conditions are met, reducing the need for intermediaries.\n\n### The Enterprise Perspective\nEnterprises are increasingly exploring permissioned blockchains for internal processes, finding value in transparency, auditability, and automation.`,
    excerpt:
      "While blockchain technology gained fame through cryptocurrency, its potential extends far beyond digital currency.",
    metaTitle: "Blockchain Beyond Crypto - Enterprise Applications | Giakaa",
    metaDescription:
      "Explore blockchain applications beyond cryptocurrency including supply chain, healthcare, digital identity, and smart contracts.",
    featuredImage:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    status: "published",
    tags: ["Blockchain", "Web3", "Enterprise"],
    author: "Giakaa Team",
  },
  {
    title: "Draft Post - Upcoming Webinar Series",
    slug: "upcoming-webinar-series",
    content:
      "## Coming Soon\n\nWe are planning a series of webinars covering digital transformation strategies for mid-market enterprises. Stay tuned for more details.",
    excerpt: "Upcoming webinar series on digital transformation.",
    metaTitle: "Upcoming Webinars | Giakaa",
    metaDescription:
      "Join our upcoming webinar series on digital transformation strategies.",
    featuredImage: "",
    status: "draft",
    tags: ["Webinar", "Events"],
    author: "Admin",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // wipe everything first so we start fresh
    await HeroSlide.deleteMany({});
    await BlogPost.deleteMany({});
    console.log("Cleared existing data");

    // dump in the sample content
    await HeroSlide.insertMany(heroSlides);
    console.log(`Inserted ${heroSlides.length} hero slides`);

    await BlogPost.insertMany(blogPosts);
    console.log(`Inserted ${blogPosts.length} blog posts`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();

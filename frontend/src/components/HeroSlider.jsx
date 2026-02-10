import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { heroAPI } from "../utils/api";

function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    try {
      const res = await heroAPI.getActive();
      if (res.data && res.data.length > 0) {
        setSlides(res.data);
      } else {
        // fallback slides if CMS has no data yet
        setSlides(getDefaultSlides());
      }
    } catch (err) {
      console.warn("Could not load hero slides from API, using defaults");
      setSlides(getDefaultSlides());
    } finally {
      setLoading(false);
    }
  }

  // auto-advance the slider every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // memoized so it doesnt recreate on every render
  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  if (loading) {
    return (
      <section className="hero">
        <div className="container">
          <div className="loading-screen" style={{ minHeight: "50vh" }}>
            <div className="loader"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={slide._id || index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            >
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <Link
                  to={slide.ctaLink || "/contact"}
                  className="btn btn-primary"
                >
                  {slide.ctaText || "Let's Talk"} →
                </Link>
              </div>
              <div className="hero-media">
                {slide.mediaType === "video" ? (
                  <video
                    src={slide.mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={slide.mediaUrl}
                    alt={slide.title}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* the little dots at the bottom */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* slide labels like on giakaa.com - Services, Industries, Solutions */}
        <div className="hero-labels">
          {slides.map((slide, index) => (
            <button
              key={index}
              className={`hero-label ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            >
              {slide.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// fallback content when the CMS is empty / API unreachable
function getDefaultSlides() {
  return [
    {
      _id: "default-1",
      title: "Empowering Enterprise",
      description:
        "AI-first consulting firm delivering high-impact solutions that drive measurable growth across 40+ industries",
      mediaUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
      mediaType: "image",
      ctaText: "Let's Talk",
      ctaLink: "/contact",
    },
    {
      _id: "default-2",
      title: "Digital Transformation",
      description:
        "We combine agile methodologies, pre-built AI accelerators, and modern engineering practices to deliver production-ready solutions",
      mediaUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
      mediaType: "image",
      ctaText: "Our Services",
      ctaLink: "#services",
    },
    {
      _id: "default-3",
      title: "Innovation at Scale",
      description:
        "From strategy to execution, we build intelligent systems that learn and improve over time",
      mediaUrl:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&q=80",
      mediaType: "image",
      ctaText: "Case Studies",
      ctaLink: "#case-studies",
    },
  ];
}

export default HeroSlider;

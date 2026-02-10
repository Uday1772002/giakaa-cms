import SEOHead from "../components/SEOHead";
import HeroSlider from "../components/HeroSlider";
import StatsSection from "../components/StatsSection";
import WhyGiakaa from "../components/WhyGiakaa";
import ServicesSection from "../components/ServicesSection";
import IndustriesSection from "../components/IndustriesSection";
import CaseStudies from "../components/CaseStudies";
import Approach from "../components/Approach";
import CTABanner from "../components/CTABanner";
import Testimonials from "../components/Testimonials";
import TechStack from "../components/TechStack";
import Newsletter from "../components/Newsletter";

// Home page - assembles all the landing page sections
// order matches giakaa.com layout roughly
function Home() {
  return (
    <>
      <SEOHead
        title="Empowering Enterprise"
        description="AI-first consulting firm delivering high-impact solutions that drive measurable growth across 40+ industries"
      />

      <HeroSlider />
      <StatsSection />
      <WhyGiakaa />
      <ServicesSection />
      <IndustriesSection />
      <CaseStudies />
      <Approach />
      <CTABanner />
      <Testimonials />
      <TechStack />
      <Newsletter />
    </>
  );
}

export default Home;

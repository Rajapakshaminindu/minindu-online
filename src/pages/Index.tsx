import Navbar from "@/components/Navbar";
import Background3D from "@/components/Background3D";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import CertificatesSection from "@/components/CertificatesSection";
import ProjectsSection from "@/components/ProjectsSection";
import InterestsSection from "@/components/InterestsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Background3D />
    <Navbar />
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <CertificatesSection />
    <ProjectsSection />
    <InterestsSection />
    <ContactSection />
    <Footer />
  </>
);

export default Index;

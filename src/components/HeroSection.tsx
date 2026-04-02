import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import profileImg from "@/assets/profile-placeholder.png";

const HeroSection = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="min-h-screen flex items-center justify-center section-padding pt-32">
      <div className="max-w-6xl mx-auto w-full flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
        {/* Text */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
            Welcome to my portfolio
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-4">
            Minindu<br />
            <span className="text-gradient">Rajapaksha</span>
          </h1>
          <p className="text-base font-medium text-muted-foreground mb-2">
            Software Engineering Undergraduate&nbsp;|&nbsp;Aspiring Data Scientist &amp; AI Enthusiast
          </p>
          <p className="text-muted-foreground max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
            Passionate about transforming data into intelligent solutions through code and creativity.
          </p>
          <div className="flex gap-3 justify-center md:justify-start">
            <button
              onClick={() => scrollTo("projects")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              View Projects <ArrowDown size={16} />
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              Contact Me <Mail size={16} />
            </button>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
            <img src={profileImg} alt="Minindu Rajapaksha" width={288} height={288} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

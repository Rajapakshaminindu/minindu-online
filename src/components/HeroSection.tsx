import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Sparkles, Database, Brain, Cpu } from "lucide-react";
import profileImg from "@/assets/minindu-profile-new.png";

const HeroSection = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center section-padding pt-32 pb-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse text-primary" />
            <span>Actively Seeking Data Science & Engineering Internships</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground mb-4">
            Minindu <span className="text-gradient">Rajapaksha</span>
          </h1>

          <p className="text-lg font-semibold text-primary/90 mb-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span>Software Engineering Undergraduate</span>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="text-foreground">Data Science & AI Specialist</span>
          </p>

          <p className="text-muted-foreground max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed text-sm md:text-base">
            Architecting end-to-end <strong>Medallion Lakehouses</strong> (Databricks + PySpark), engineering <strong>Multimodal AI Systems</strong> (OpenCV, MediaPipe, Qwen2-VL), and turning clinical data into actionable business intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-10">
            <button
              onClick={() => scrollTo("projects")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
            >
              Explore Featured Projects <ArrowDown size={16} />
            </button>
            <a
              href="https://github.com/Rajapakshaminindu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card/60 text-foreground font-semibold text-sm hover:bg-secondary transition-all hover:scale-[1.02] backdrop-blur-sm shadow-sm"
            >
              GitHub Profile <Github size={16} />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60 max-w-md mx-auto md:mx-0">
            <div className="text-center md:text-left">
              <p className="text-2xl font-extrabold text-foreground font-heading">6+</p>
              <p className="text-xs text-muted-foreground font-medium">Core Projects</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-extrabold text-foreground font-heading">3D CV</p>
              <p className="text-xs text-muted-foreground font-medium">Landmark AI</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-extrabold text-foreground font-heading">Medallion</p>
              <p className="text-xs text-muted-foreground font-medium">Delta Lakehouse</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Image with Glowing Aura */}
        <motion.div
          className="flex-shrink-0 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-xl animate-pulse"></div>
          <div className="w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden ring-4 ring-primary/30 ring-offset-4 ring-offset-background relative shadow-2xl">
            <img src={profileImg} alt="Minindu Rajapaksha" width={320} height={320} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

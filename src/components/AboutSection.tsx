import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Target, Award, Sparkles } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const AboutSection = () => (
  <section id="about" className="section-padding">
    <div className="max-w-5xl mx-auto">
      <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">About Me</p>
        <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-center mb-4 text-foreground">
          Engineering & Academic Background
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-sm md:text-base">
          Driven by a passion for large-scale data systems, computer vision, and building intelligent software.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: GraduationCap,
            title: "Education",
            subtitle: "BSc (Hons) Software Engineering",
            desc: "Undergraduate at University of Kelaniya, with foundational academic training at SLIIT Campus and Lumbini College Colombo 05.",
            badge: "Undergraduate"
          },
          {
            icon: Briefcase,
            title: "Industry Experience",
            subtitle: "Commercial Bank Internship",
            desc: "Gained real-world operational exposure, corporate communication, software integration workflows, and enterprise systems management.",
            badge: "Corporate Exposure"
          },
          {
            icon: Target,
            title: "Career Objective",
            subtitle: "Data Science & Lakehouse Engineer",
            desc: "Actively seeking challenging Data Engineering and AI internships to architect high-throughput data pipelines and intelligent applications.",
            badge: "Actively Seeking"
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            className="rounded-2xl p-6 card-elevated bg-card border border-border/70 flex flex-col justify-between relative overflow-hidden"
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <item.icon size={22} className="text-primary" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl mb-1 text-foreground">{item.title}</h3>
              <p className="text-xs font-semibold text-primary mb-3">{item.subtitle}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;

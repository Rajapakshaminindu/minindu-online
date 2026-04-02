import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Target } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const AboutSection = () => (
  <section id="about" className="section-padding">
    <div className="max-w-4xl mx-auto">
      <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">About Me</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Get to Know Me
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: GraduationCap,
            title: "Education",
            desc: "Software Engineering undergraduate at the University of Kelaniya, with prior studies at Lumbini College Colombo 05 and SLIIT Campus.",
          },
          {
            icon: Briefcase,
            title: "Experience",
            desc: "Internship at Commercial Bank, gaining exposure to professional environments, teamwork, and software-related operations.",
          },
          {
            icon: Target,
            title: "Goal",
            desc: "Becoming a data-driven software engineer by continuously learning Data Science, AI, and Machine Learning fundamentals.",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            className="rounded-xl p-6 card-elevated bg-card"
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <item.icon size={20} className="text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;

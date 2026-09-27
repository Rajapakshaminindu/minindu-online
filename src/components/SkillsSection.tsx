import { motion } from "framer-motion";
import { Database, Brain, Cpu, Code2, Server, Terminal, Shield, Workflow } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const skillCategories = [
  {
    title: "Data Engineering & Lakehouse",
    icon: Database,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    skills: ["Databricks", "Apache Spark (PySpark)", "Delta Lake", "Medallion Architecture", "PostgreSQL / MySQL", "Microsoft Fabric", "Azure Cloud"]
  },
  {
    title: "Applied AI & Computer Vision",
    icon: Cpu,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    skills: ["OpenCV (v4.8+)", "MediaPipe 3D Tracking", "Alibaba Qwen2-VL", "PyTorch", "PyAutoGUI", "Google Antigravity IDE", "Scikit-Learn"]
  },
  {
    title: "Data Science & Analytics",
    icon: Brain,
    color: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/30",
    skills: ["Python 3.12", "Pandas", "NumPy", "Power BI & DAX", "Matplotlib / Seaborn", "Feature Engineering", "Statistical Risk Modeling"]
  },
  {
    title: "Software & Mobile Engineering",
    icon: Code2,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    skills: ["Kotlin (Android SDK)", "Room Database / MVVM", "TypeScript & React", "C++ Fundamentals", "Git & GitHub Actions", "Docker", "Linux / Bash"]
  }
];

const SkillsSection = () => (
  <section id="skills" className="section-padding bg-muted/20">
    <div className="max-w-5xl mx-auto">
      <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">Technical Toolkit</p>
        <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-center mb-4 text-foreground">
          Skills & Technologies
        </h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto mb-12 text-sm md:text-base">
          Specialized in Lakehouse Architecture, Real-Time Computer Vision, Multimodal AI, and Full-Stack Engineering.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {skillCategories.map((cat, i) => {
          const IconComponent = cat.icon;
          return (
            <motion.div
              key={cat.title}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-2xl p-6 bg-card border ${cat.borderColor} card-elevated flex flex-col justify-between group hover:scale-[1.01] transition-transform`}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center border border-border/50`}>
                    <IconComponent size={22} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground">{cat.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-secondary/70 text-xs font-semibold text-foreground border border-border/40 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default SkillsSection;

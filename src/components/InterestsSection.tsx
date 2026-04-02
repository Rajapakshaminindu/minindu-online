import { motion } from "framer-motion";
import { BrainCircuit, Database, Code2 } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const items = [
  { icon: Database, title: "Data Science", desc: "Exploring datasets, finding patterns, and turning raw data into meaningful insights." },
  { icon: BrainCircuit, title: "AI & Machine Learning", desc: "Learning to build intelligent models that solve real-world problems." },
  { icon: Code2, title: "Software Engineering", desc: "Building clean, maintainable software with modern development practices." },
];

const InterestsSection = () => (
  <section id="interests" className="section-padding">
    <div className="max-w-4xl mx-auto">
      <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">Focus Areas</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          What Drives Me
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            className="rounded-xl p-6 card-elevated bg-card text-center"
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon size={24} className="text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default InterestsSection;

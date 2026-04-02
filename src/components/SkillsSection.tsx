import { motion } from "framer-motion";

const skills = [
  { name: "Python Programming", level: 70 },
  { name: "Basic Machine Learning", level: 45 },
  { name: "Data Science Fundamentals", level: 55 },
  { name: "Data Analysis", level: 60 },
];

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const SkillsSection = () => (
  <section id="skills" className="section-padding">
    <div className="max-w-3xl mx-auto">
      <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">My Skills</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          What I Work With
        </h2>
      </motion.div>

      <div className="space-y-6">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{skill.name}</span>
              <span className="text-sm text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--hero-gradient)" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;

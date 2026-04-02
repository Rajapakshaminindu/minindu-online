import { motion } from "framer-motion";
import { BarChart3, ExternalLink } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const ProjectsSection = () => (
  <section id="projects" className="section-padding bg-card">
    <div className="max-w-4xl mx-auto">
      <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">Portfolio</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Featured Project
        </h2>
      </motion.div>

      <motion.div
        className="bg-background rounded-2xl overflow-hidden card-elevated"
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative header */}
        <div className="h-48 flex items-center justify-center" style={{ background: "var(--hero-gradient)" }}>
          <BarChart3 size={64} className="text-primary-foreground opacity-80" />
        </div>

        <div className="p-6 md:p-8">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">Data Science · Python</span>
          <h3 className="font-heading text-xl font-bold mt-2 mb-3 text-foreground">
            Apple Global Sales Data Analysis
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A beginner-level EDA project using Python in Google Colab. Explored dataset structure,
            generated statistical summaries, detected missing values, and built visualizations with
            Matplotlib &amp; Seaborn to extract actionable business insights.
          </p>

          <ul className="flex flex-wrap gap-2 mb-6">
            {["Python", "Google Colab", "Pandas", "Matplotlib", "Seaborn"].map((t) => (
              <li key={t} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                {t}
              </li>
            ))}
          </ul>

          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            View on GitHub <ExternalLink size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProjectsSection;

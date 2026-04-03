import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import appleGlobalSales from "@/assets/apple-global-sales-3d.jpg";
import titanicMl from "@/assets/titanic-ml-3d.jpg";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const projects = [
  {
    image: appleGlobalSales,
    alt: "Apple Global Sales Data Analysis",
    category: "Data Science · Python",
    title: "Apple Global Sales Data Analysis",
    description:
      "A beginner-level EDA project using Python in Google Colab. Explored dataset structure, generated statistical summaries, detected missing values, and built visualizations with Matplotlib & Seaborn to extract actionable business insights.",
    tags: ["Python", "Google Colab", "Pandas", "Matplotlib", "Seaborn"],
    status: "completed" as const,
    link: "https://github.com/Rajapakshaminindu/Apple-Global-Sales-Data-Analysis",
  },
  {
    image: titanicMl,
    alt: "Titanic - Machine Learning from Disaster",
    category: "Machine Learning · Python",
    title: "Titanic – ML from Disaster",
    description:
      "A Kaggle competition project predicting passenger survival using machine learning. Building classification models with feature engineering, data preprocessing, and model evaluation to achieve competitive accuracy.",
    tags: ["Python", "Scikit-learn", "Pandas", "Kaggle", "Classification"],
    status: "in-progress" as const,
    link: "https://www.kaggle.com/competitions/titanic",
  },
];

const ProjectsSection = () => (
  <section id="projects" className="section-padding">
    <div className="max-w-5xl mx-auto">
      <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">Portfolio</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Featured Projects
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            className="rounded-2xl overflow-hidden card-elevated bg-card relative"
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            {project.status === "in-progress" && (
              <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold backdrop-blur-sm border border-primary/30">
                <Clock size={12} className="animate-pulse" /> In Progress
              </span>
            )}

            <div className="h-48 md:h-56 flex items-center justify-center overflow-hidden">
              <img src={project.image} alt={project.alt} className="w-full h-full object-cover" loading="lazy" width={1024} height={512} />
            </div>

            <div className="p-6">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">{project.category}</span>
              <h3 className="font-heading text-lg font-bold mt-2 mb-3 text-foreground">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>

              <ul className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((t) => (
                  <li key={t} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                    {t}
                  </li>
                ))}
              </ul>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {project.status === "in-progress" ? "View on Kaggle" : "View on GitHub"} <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;

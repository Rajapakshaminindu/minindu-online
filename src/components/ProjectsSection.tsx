import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Sparkles, Clock, CheckCircle2, Layers, Cpu, ShieldAlert, Activity, Smartphone, BarChart3 } from "lucide-react";

import gestureMouseImg from "@/assets/gesture-mouse.jpg";
import medallionLakehouseImg from "@/assets/medallion-lakehouse.jpg";
import scamshieldAiImg from "@/assets/scamshield-ai.jpg";
import diabetesPowerBiImg from "@/assets/diabetes-powerbi.jpg";
import appleGlobalSalesImg from "@/assets/apple-global-sales-3d.jpg";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export interface ProjectItem {
  id: string;
  image: string;
  alt: string;
  category: "AI & Computer Vision" | "Data Engineering" | "Healthcare Analytics" | "Mobile & Web";
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  tags: string[];
  status: "featured" | "completed" | "in-progress";
  github: string;
  pitchVideo?: string;
  icon: any;
}

const projects: ProjectItem[] = [
  {
    id: "ai-gesture-mouse",
    image: gestureMouseImg,
    alt: "AI Gesture Mouse Prototype",
    category: "AI & Computer Vision",
    title: "AI Gesture Mouse",
    subtitle: "Software-Only Touchless AI Control System",
    description:
      "A high-precision, software-only touchless mouse system using MediaPipe 21 3D hand landmark tracking, OpenCV, Exponential Moving Average (EMA) jitter suppression, and custom action keybindings. Developed for HackX 11.0 Startup Challenge.",
    highlights: [
      "MediaPipe 21 3D Landmark Tracking & EMA Filter",
      "Custom Action Mapper (Palm Stop Pause, Swipe Nav)",
      "Interactive Sensitivity Calibration Tool & Telemetry HUD"
    ],
    tags: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI", "pytest", "Computer Vision"],
    status: "featured",
    github: "https://github.com/Rajapakshaminindu/AI-Gesture-Mouse",
    pitchVideo: "https://youtu.be/F9Yy4gpLEBk?si=3HNrJborli19yi6s",
    icon: Cpu
  },
  {
    id: "databricks-healthcare",
    image: medallionLakehouseImg,
    alt: "Databricks Healthcare Medallion Pipeline",
    category: "Data Engineering",
    title: "Healthcare Medallion Lakehouse",
    subtitle: "Bronze ➔ Silver ➔ Gold Clinical Pipeline",
    description:
      "End-to-end Enterprise Data Engineering Lakehouse Architecture built with Databricks, PySpark, and Delta Lake. Processes real-time patient telemetry with schema enforcement, Delta ACID reliability, and gold analytics aggregates.",
    highlights: [
      "Multi-stage Medallion Architecture (Bronze ➔ Silver ➔ Gold)",
      "PySpark Streaming, Schema Evolution & ACID Delta Logs",
      "Executive Clinical Dashboards & Feature Store"
    ],
    tags: ["Databricks", "PySpark", "Delta Lake", "Python", "SQL", "Medallion Architecture"],
    status: "featured",
    github: "https://github.com/Rajapakshaminindu/databricks-healthcare-medallion-pipeline",
    icon: Layers
  },
  {
    id: "scamshield-ai",
    image: scamshieldAiImg,
    alt: "ScamShield AI Platform",
    category: "AI & Computer Vision",
    title: "ScamShield AI",
    subtitle: "Multimodal Fraud & Scam Prevention Engine",
    description:
      "An intelligent AI-driven multimodal cybersecurity platform utilizing fine-tuned Alibaba Qwen2-VL vision models, OCR text scanner, and audio transcript telemetry to identify phishing, vishing, and fraudulent content in real time.",
    highlights: [
      "Alibaba Qwen2-VL Multimodal Vision Model",
      "OCR Document & Message Image Threat Scanner",
      "Real-time Threat Risk Scoring Dashboard"
    ],
    tags: ["Python", "Qwen2-VL", "PyTorch", "OCR", "FastAPI", "Multimodal AI"],
    status: "featured",
    github: "https://github.com/Rajapakshaminindu/ScamShield-AI",
    icon: ShieldAlert
  },
  {
    id: "diabetes-risk-powerbi",
    image: diabetesPowerBiImg,
    alt: "Diabetes Risk Power BI Analysis",
    category: "Healthcare Analytics",
    title: "Diabetes Risk Analytics",
    subtitle: "Clinical Intelligence & Predictive Power BI Dashboard",
    description:
      "Clinical healthcare data pipeline and interactive Power BI executive dashboard for diabetic risk modeling, patient stratification heatmaps, statistical correlation analysis, and early clinical intervention metrics.",
    highlights: [
      "Predictive Risk Stratification Heatmap",
      "Power BI Interactive KPI Dashboard",
      "Clinical Correlation & Factor Modeling"
    ],
    tags: ["Power BI", "DAX", "SQL", "Python", "Healthcare Analytics", "Data Modeling"],
    status: "completed",
    github: "https://github.com/Rajapakshaminindu/diabetes-risk-powerbi-analysis",
    icon: Activity
  },
  {
    id: "studentdb-android",
    image: appleGlobalSalesImg,
    alt: "StudentDB Native Android Application",
    category: "Mobile & Web",
    title: "StudentDB Native Android",
    subtitle: "Modern Student Record Management App",
    description:
      "Native Android application designed with Kotlin, Room Persistence Library, LiveData, MVVM clean architecture, and Material Design 3 for managing student academic records and course enrollments.",
    highlights: [
      "MVVM Clean Architecture & Room Database",
      "Material Design 3 Dynamic UI",
      "Offline Sync & Reactive LiveData Observers"
    ],
    tags: ["Kotlin", "Android SDK", "Room DB", "MVVM", "Material Design 3"],
    status: "completed",
    github: "https://github.com/Rajapakshaminindu/StudentDB-Android",
    icon: Smartphone
  },
  {
    id: "apple-global-sales",
    image: appleGlobalSalesImg,
    alt: "Apple Global Sales Data Analysis",
    category: "Healthcare Analytics",
    title: "Apple Global Sales Analysis",
    subtitle: "Exploratory Data Analysis & Business Intelligence",
    description:
      "Comprehensive Python data analysis project exploring international hardware sales metrics, revenue distributions, regional growth trends, and visual statistical summaries using Pandas, Matplotlib, and Seaborn.",
    highlights: [
      "Statistical Summary & Data Cleaning",
      "Seaborn & Matplotlib Visualization",
      "Regional Revenue Trend Insights"
    ],
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
    status: "completed",
    github: "https://github.com/Rajapakshaminindu/Apple-Global-Sales-Data-Analysis",
    icon: BarChart3
  }
];

const categories = ["All", "AI & Computer Vision", "Data Engineering", "Healthcare Analytics", "Mobile & Web"] as const;

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">Portfolio Showcase</p>
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-center mb-4 text-foreground">
            Featured Projects & Engineering Work
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10 text-sm md:text-base">
            From touchless computer vision interfaces to multi-stage Medallion Lakehouses and multimodal AI detection systems.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                  : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => {
              const IconComp = project.icon;
              return (
                <motion.div
                  key={project.id}
                  layout
                  variants={fade}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl overflow-hidden card-elevated bg-card border border-border/70 flex flex-col group hover:border-primary/50 transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="h-52 overflow-hidden relative bg-muted/40">
                    <img
                      src={project.image}
                      alt={project.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />

                    {/* Top Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 text-foreground text-xs font-semibold backdrop-blur-md border border-border/50 shadow-sm">
                        <IconComp size={12} className="text-primary" />
                        {project.category}
                      </span>
                      {project.status === "featured" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold shadow-md">
                          <Sparkles size={11} /> Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-semibold text-primary/80 mb-3">{project.subtitle}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Bullet Highlights */}
                      <ul className="space-y-1.5 mb-5">
                        {project.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-foreground/90 font-medium">
                            <CheckCircle2 size={13} className="text-primary flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tags.map((t) => (
                          <span key={t} className="px-2.5 py-0.5 rounded-md bg-secondary/80 text-[11px] font-medium text-secondary-foreground border border-border/40">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                        >
                          Repository <Github size={14} />
                        </a>
                        {project.pitchVideo && (
                          <a
                            href={project.pitchVideo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold transition-colors"
                            title="Watch Pitch Video"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

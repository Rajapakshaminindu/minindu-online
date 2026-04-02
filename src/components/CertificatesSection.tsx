import { motion } from "framer-motion";
import certGettingStartedData from "@/assets/cert-getting-started-data.png";
import certEnterpriseDS from "@/assets/cert-enterprise-data-science.png";
import certPandas from "@/assets/cert-pandas-kaggle.png";
import certGenAI from "@/assets/cert-gen-ai-analytics.png";
import certSQL from "@/assets/cert-sql-intermediate.png";

const certificates = [
  {
    title: "Getting Started with Data",
    issuer: "IBM SkillsBuild",
    image: certGettingStartedData,
    tags: ["IBM", "DATA SCIENCE"],
  },
  {
    title: "Enterprise Data Science in Practice",
    issuer: "IBM SkillsBuild",
    image: certEnterpriseDS,
    tags: ["IBM", "DATA SCIENCE"],
  },
  {
    title: "Supercharge Data Analytics with Generative AI",
    issuer: "IBM SkillsBuild",
    image: certGenAI,
    tags: ["IBM", "GENERATIVE AI"],
  },
  {
    title: "Pandas",
    issuer: "Kaggle",
    image: certPandas,
    tags: ["KAGGLE", "PYTHON"],
  },
  {
    title: "SQL (Intermediate)",
    issuer: "HackerRank",
    image: certSQL,
    tags: ["HACKERRANK", "SQL"],
  },
];

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const CertificatesSection = () => (
  <section id="certificates" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">
          Achievements
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Certificates
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.title}
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group rounded-xl border border-border bg-card overflow-hidden transition-shadow duration-300 hover:shadow-[var(--card-shadow-hover)]"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3] bg-secondary">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-1">
                {cert.issuer}
              </p>
              <h3 className="text-base font-semibold text-foreground mb-3 leading-tight">
                {cert.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cert.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded border border-primary/40 text-primary bg-primary/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CertificatesSection;

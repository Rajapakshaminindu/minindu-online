import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Github, Linkedin, Facebook, MapPin, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    toast({ title: "Message Sent!", description: "Thank you for reaching out. I'll get back to you shortly." });
    setForm({ name: "", email: "", message: "" });
    setErrors({});
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">Let's Connect</p>
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-center mb-4 text-foreground">Get In Touch</h2>
          <p className="text-center text-muted-foreground max-w-lg mx-auto mb-12 text-sm md:text-base">
            Open for Data Science, Data Engineering, and Multimodal AI internship opportunities and project collaborations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Contact Information & Social Badges */}
          <motion.div
            className="md:col-span-2 space-y-6"
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl p-6 bg-card border border-border/70 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Direct Email</p>
                  <a href="mailto:rajapakshaminidu@gmail.com" className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                    rajapakshaminidu@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Location</p>
                  <p className="text-sm font-bold text-foreground">Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="rounded-2xl p-6 bg-card border border-border/70">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Connect Across Platforms</p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/Rajapakshaminindu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 hover:bg-primary/10 hover:text-primary transition-colors group border border-border/40"
                >
                  <Github size={18} className="text-foreground group-hover:text-primary" />
                  <span className="text-xs font-bold text-foreground group-hover:text-primary">GitHub Profile</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/minindu-rajapaksha-38a69a336/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 hover:bg-primary/10 hover:text-primary transition-colors group border border-border/40"
                >
                  <Linkedin size={18} className="text-foreground group-hover:text-primary" />
                  <span className="text-xs font-bold text-foreground group-hover:text-primary">LinkedIn Network</span>
                </a>
                <a
                  href="https://www.facebook.com/share/1Dbr3JKpCk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 hover:bg-primary/10 hover:text-primary transition-colors group border border-border/40"
                >
                  <Facebook size={18} className="text-foreground group-hover:text-primary" />
                  <span className="text-xs font-bold text-foreground group-hover:text-primary">Facebook Profile</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 space-y-4 rounded-2xl p-6 bg-card border border-border/70"
          >
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Message</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="How can I help you?"
              />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Send Message <Send size={16} />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

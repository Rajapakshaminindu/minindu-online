import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
    setForm({ name: "", email: "", message: "" });
    setErrors({});
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-xl mx-auto">
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-2 text-center">Get In Touch</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Contact Me</h2>
          <p className="text-center text-muted-foreground mb-8 flex items-center justify-center gap-2">
            <Mail size={16} /> rajapakshaminidu@gmail.com
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {(["name", "email", "message"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-foreground mb-1.5 capitalize">{field}</label>
              {field === "message" ? (
                <textarea
                  rows={4}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Your message..."
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={field === "email" ? "you@example.com" : "Your name"}
                />
              )}
              {errors[field] && <p className="text-xs text-destructive mt-1">{errors[field]}</p>}
            </div>
          ))}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Send Message <Send size={16} />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;

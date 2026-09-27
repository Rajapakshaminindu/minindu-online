import { Github, Linkedin, Facebook, Heart } from "lucide-react";

const Footer = () => (
  <footer className="py-10 text-center border-t border-border/60 bg-card/40">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-center md:text-left">
        <p className="font-heading font-bold text-lg text-foreground">
          Minindu Rajapaksha<span className="text-primary">.</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Software Engineering Undergraduate | Data Science & AI Specialist
        </p>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground">
        <a href="https://github.com/Rajapakshaminindu" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
          <Github size={18} />
        </a>
        <a href="https://www.linkedin.com/in/minindu-rajapaksha-38a69a336/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
          <Linkedin size={18} />
        </a>
        <a href="https://www.facebook.com/share/1Dbr3JKpCk/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
          <Facebook size={18} />
        </a>
      </div>

      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
        © {new Date().getFullYear()} Minindu Rajapaksha. Built with React, Vite & Tailwind.
      </p>
    </div>
  </footer>
);

export default Footer;

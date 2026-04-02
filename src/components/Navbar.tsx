import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = ["Home", "About", "Skills", "Projects", "Interests", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => scrollTo("home")} className="font-heading font-bold text-xl text-foreground">
          MR<span className="text-gradient">.</span>
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l}>
              <button
                onClick={() => scrollTo(l)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {l}
              </button>
            </li>
          ))}
        </ul>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-2">
              {links.map((l) => (
                <li key={l}>
                  <button
                    onClick={() => scrollTo(l)}
                    className="w-full text-left py-2 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

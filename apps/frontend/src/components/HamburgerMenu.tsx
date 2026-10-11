import { motion, MotionConfig } from "motion/react";
import { useState } from "react";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <MotionConfig
      transition={{
        duration: 0.2,
      }}
    >
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="outline-dev-neutral-100 flex cursor-pointer flex-col items-center justify-center gap-1.5 p-2.5 outline md:hidden"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          className="bg-dev-neutral-100 h-0.5 w-8"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="bg-dev-neutral-100 h-0.5 w-8"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          className="bg-dev-neutral-100 h-0.5 w-8"
        />
      </button>
    </MotionConfig>
  );
}

export default HamburgerMenu;

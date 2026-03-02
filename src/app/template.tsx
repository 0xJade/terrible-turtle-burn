"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";

interface RouteTransition {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  transition: Transition;
}

const defaultTransition: RouteTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const clipReveal: RouteTransition = {
  initial: { clipPath: "circle(0% at 50% 50%)" },
  animate: { clipPath: "circle(150% at 50% 50%)" },
  exit: { clipPath: "circle(0% at 50% 50%)" },
  transition: { duration: 0.6, ease: "easeInOut" },
};

const routeTransitions: Record<string, RouteTransition> = {
  "/volunteer": clipReveal,
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = routeTransitions[pathname] ?? defaultTransition;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={t.initial}
        animate={t.animate}
        exit={t.exit}
        transition={t.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

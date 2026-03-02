"use client";

import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function StaggerReveal({
  children,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
}) {
  const variants =
    staggerDelay === 0.08
      ? containerVariants
      : {
          hidden: {},
          visible: {
            transition: { staggerChildren: staggerDelay },
          },
        };

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {React.Children.map(children, (child) => (
        <motion.div variants={childVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

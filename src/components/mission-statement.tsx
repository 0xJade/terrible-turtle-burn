"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MISSION_TEXT =
  "We're a community of artists, engineers, and AI enthusiasts building an immersive Burning Man camp where technology meets radical creative expression. Come help us shape a space where code becomes canvas and the desert becomes our studio.";

export default function MissionStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const words = MISSION_TEXT.split(" ");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.4"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] items-center justify-center px-6 py-32 sm:px-12"
    >
      <div className="max-w-3xl">
        <h2 className="sr-only">Our Mission</h2>
        <p className="text-2xl leading-relaxed font-medium sm:text-3xl md:text-4xl md:leading-snug">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <motion.span
      style={{ opacity, y, display: "inline-block", willChange: "transform, opacity" }}
      className="mr-[0.3em] text-foreground"
    >
      {word}
    </motion.span>
  );
}

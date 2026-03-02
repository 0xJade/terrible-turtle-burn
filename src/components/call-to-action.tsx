"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-turtle-gradient px-6 py-24 sm:px-12 md:py-32">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-turtle-navy sm:text-5xl md:text-6xl">
            Ready to Bite?
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-turtle-navy/80">
            We need artists, engineers, builders, and dreamers. Whether you weld,
            code, cook, or just want to make something weird in the desert —
            there&apos;s a spot in the shell for you.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-turtle-navy px-8 text-base font-semibold text-turtle-cream hover:bg-turtle-navy/90"
            >
              <Link href="/volunteer">Volunteer With Us</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-turtle-navy/70 hover:text-turtle-navy"
            >
              <Link href="/about">Learn more about the camp &rarr;</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

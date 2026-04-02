"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EVENTS = [
  {
    title: "Terrible Turtle Camp #1",
    date: "April 25, 2026",
    description:
      "Round two at The Gulch. Come connect with the crew, meet new turtles, and help shape what we're bringing to the playa this year.",
    href: "/events",
    featured: true,
  },
];

export default function EventsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-turtle-gradient mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Upcoming Events
        </h2>

        <div className="mx-auto grid max-w-md gap-8">
          {EVENTS.map((event, i) => (
            <EventCard
              key={event.title}
              event={event}
              index={i}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({
  event,
  index,
  progress,
}: {
  event: (typeof EVENTS)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(
    progress,
    [0, 0.5, 1],
    [80 + index * 40, 0, -30 - index * 20]
  );

  return (
    <motion.div style={{ y, willChange: "transform" }}>
      <Link href={event.href} className="group block h-full" {...(event.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        <Card className="h-full border-turtle-copper/20 transition-shadow duration-300 hover:glow-orange">
          <CardHeader>
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant={event.featured ? "default" : "outline"}
                className={
                  event.featured
                    ? "bg-turtle-orange text-white"
                    : "border-turtle-copper/40 text-turtle-gold"
                }
              >
                {event.featured ? "Featured" : "Coming Soon"}
              </Badge>
            </div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <CardDescription className="text-turtle-cream/60">
              {event.date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-sm font-medium text-turtle-orange transition-colors group-hover:text-turtle-gold">
              {event.href.startsWith("http") ? "Register" : "Details Coming Soon"}
            </span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

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
    title: "Pi Day Playa Meetup",
    date: "March 14, 2026",
    description:
      "Our first burn community meetup — pie, introductions, and camp planning. Come meet the turtles, share your skills, and help us dream up what we're building on the playa.",
    href: "/events",
    featured: true,
  },
  {
    title: "Build Weekend #1",
    date: "TBD — Spring 2026",
    description:
      "Hands-on weekend to prototype our interactive installations. Welders, coders, and dreamers welcome.",
    href: "/events",
    featured: false,
  },
  {
    title: "AI Art Workshop",
    date: "TBD — Summer 2026",
    description:
      "Explore generative art, real-time AI visuals, and creative coding. No experience needed — just curiosity.",
    href: "/events",
    featured: false,
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

        <div className="grid gap-8 md:grid-cols-3">
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
      <Link href={event.href} className="group block h-full">
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
              Learn More &rarr;
            </span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

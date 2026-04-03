"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useAnimation,
  type PanInfo,
} from "framer-motion";

interface Slide {
  src: string;
  alt: string;
  isVideo?: boolean;
  poster?: string;
  webm?: string;
  position: string;
}

const SLIDES: Slide[] = [
  {
    src: "/events/camp-0/gulch_032126_6.mp4",
    alt: "Terrible Turtle Camp #0 — fire performance",
    isVideo: true,
    poster: "/events/camp-0/gulch_032126_6_poster.jpg",
    webm: "/events/camp-0/gulch_032126_6.webm",
    position: "object-center",
  },
  { src: "/events/camp-0/gulch_032126_1.jpg", alt: "Terrible Turtle Camp #0 — community gathering", position: "object-center" },
  { src: "/events/camp-0/gulch_032126_2.jpg", alt: "Terrible Turtle Camp #0 — meetup vibes", position: "object-[center_25%]" },
];

const AUTOPLAY_INTERVAL = 5000;
const AUTOPLAY_RESUME_DELAY = 3000;
const DRAG_THRESHOLD = 30;
const VELOCITY_THRESHOLD = 300;

const SNAP_TRANSITION = { type: "spring" as const, stiffness: 400, damping: 35 };

export default function EventGallery() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slideWidth, setSlideWidth] = useState(400);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calcSlideWidth = useCallback(() => {
    if (!containerRef.current) return 400;
    const w = containerRef.current.offsetWidth;
    if (w >= 1024) return w / 3;
    if (w >= 640) return w / 2;
    return w;
  }, []);

  // Recalculate on mount and resize
  useEffect(() => {
    function update() {
      setSlideWidth(calcSlideWidth());
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [calcSlideWidth]);

  const snapTo = useCallback(
    (i: number) => {
      controls.start({
        x: -i * slideWidth,
        transition: SNAP_TRANSITION,
      });
    },
    [controls, slideWidth]
  );

  const pauseWithDelay = useCallback(() => {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const resumeWithDelay = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
    }, AUTOPLAY_RESUME_DELAY);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [paused]);

  // Snap when index or slideWidth changes
  useEffect(() => {
    snapTo(index);
  }, [index, snapTo]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (
      (offset < -DRAG_THRESHOLD || velocity < -VELOCITY_THRESHOLD) &&
      index < SLIDES.length - 1
    ) {
      setIndex(index + 1);
    } else if (
      (offset > DRAG_THRESHOLD || velocity > VELOCITY_THRESHOLD) &&
      index > 0
    ) {
      setIndex(index - 1);
    } else {
      snapTo(index);
    }

    resumeWithDelay();
  }

  return (
    <section className="relative px-6 py-24 sm:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-turtle-gradient mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Most Recent Events
        </h2>
        <p className="mb-12 text-center text-lg text-turtle-cream/70">
          Terrible Turtle Camp #0
        </p>

        {/* Photo carousel */}
        <div
          ref={containerRef}
          className="overflow-x-hidden overflow-y-visible"
          style={{ touchAction: "pan-y" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={pauseWithDelay}
          onTouchEnd={resumeWithDelay}
        >
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            style={{ x, touchAction: "pan-y" }}
            animate={controls}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.src}
                className="w-full shrink-0 px-1 sm:w-1/2 sm:px-2 lg:w-1/3"
              >
                <div className="overflow-hidden rounded-xl border border-turtle-copper/20 shadow-lg">
                  {slide.isVideo ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={slide.poster}
                      className={`aspect-[4/3] w-full object-cover ${slide.position}`}
                    >
                      <source src={slide.webm} type="video/webm" />
                      <source src={slide.src} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={600}
                      height={450}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={i <= 2}
                      className={`aspect-[4/3] w-full object-cover ${slide.position}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-turtle-copper/40 hover:bg-turtle-copper/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

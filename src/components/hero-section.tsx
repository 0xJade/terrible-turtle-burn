"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    const particles = particlesRef.current;
    if (!section || !logo || !text || !particles) return;

    // Generate particle elements
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < particleCount; i++) {
      const dot = document.createElement("div");
      dot.className = "absolute rounded-full";
      const size = Math.random() * 3 + 1;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.backgroundColor =
        Math.random() > 0.5
          ? "oklch(0.65 0.19 35)"
          : "oklch(0.73 0.13 70)";
      dot.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
      dot.style.top = `${50 + (Math.random() - 0.5) * 30}%`;
      dot.style.opacity = "0";
      dot.style.willChange = "transform, opacity";
      fragment.appendChild(dot);
    }
    particles.appendChild(fragment);

    const dots = particles.children;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    // Phase 1: Logo dissolves — scale up, fade out, particles scatter
    tl.to(
      logo,
      {
        scale: 1.2,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      0
    );

    // Particles appear and scatter outward
    tl.to(
      Array.from(dots),
      {
        opacity: (i) => 0.4 + Math.random() * 0.6,
        x: () => (Math.random() - 0.5) * 600,
        y: () => (Math.random() - 0.5) * 400,
        duration: 0.4,
        stagger: { amount: 0.1, from: "center" },
        ease: "power2.out",
      },
      0.1
    );

    // Phase 2: Particles converge into horizontal lines (circuit traces)
    tl.to(
      Array.from(dots),
      {
        x: () => (Math.random() - 0.5) * 300,
        y: () => (Math.random() - 0.5) * 20,
        opacity: 0.3,
        duration: 0.3,
        ease: "power2.inOut",
      },
      0.5
    );

    // Phase 3: Text reveals, particles fade
    tl.to(
      Array.from(dots),
      {
        opacity: 0,
        duration: 0.2,
        ease: "power1.out",
      },
      0.7
    );

    tl.fromTo(
      text,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      0.7
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
      particles.innerHTML = "";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background"
    >
      {/* Particles layer */}
      <div
        ref={particlesRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      {/* Logo */}
      <div
        ref={logoRef}
        className="relative z-10 flex items-center justify-center"
        style={{ willChange: "transform, opacity" }}
      >
        <Image
          src="/terrible-turtle.png"
          alt="Terrible Turtle Camp logo"
          width={360}
          height={360}
          priority
          className="h-auto w-[240px] sm:w-[320px] md:w-[360px]"
        />
      </div>

      {/* Text reveal (hidden initially) */}
      <div
        ref={textRef}
        className="absolute z-10 flex flex-col items-center gap-4 px-6 text-center opacity-0"
      >
        <h1 className="text-turtle-gradient text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Terrible Turtle Camp
        </h1>
        <p className="text-lg font-medium tracking-wide text-turtle-cream sm:text-xl md:text-2xl">
          Move Slow &amp; Bite Things
        </p>
      </div>
    </section>
  );
}

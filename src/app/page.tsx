"use client";

import HeroSection from "@/components/hero-section";
import MissionStatement from "@/components/mission-statement";
import EventsSection from "@/components/events-section";
import CallToAction from "@/components/call-to-action";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <MissionStatement />
        <EventsSection />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}

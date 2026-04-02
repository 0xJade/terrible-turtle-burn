"use client";

import HeroSection from "@/components/hero-section";
import MissionStatement from "@/components/mission-statement";
import EventsSection from "@/components/events-section";
import EventGallery from "@/components/event-gallery";
import CallToAction from "@/components/call-to-action";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <MissionStatement />
        <EventGallery />
        <EventsSection />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}

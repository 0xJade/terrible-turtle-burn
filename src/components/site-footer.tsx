"use client";

import NewsletterForm from "@/components/newsletter-form";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12">
        <div className="mb-6">
          <h3 className="text-lg font-semibold tracking-tight">
            Stay in the Shell
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Updates, build progress, and camp news — no spam, just turtle vibes.
          </p>
        </div>
        <NewsletterForm />
      </div>
      <div className="border-t border-border/40 px-6 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Terrible Turtle Camp. Move Slow &amp; Bite Things.
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import {
  volunteerSchema,
  COUNTRY_CODES,
  type VolunteerFormData,
} from "@/lib/schemas/volunteer";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StaggerReveal from "@/components/stagger-reveal";

export default function ApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneCountryCode: "United States (+1)",
      phone: "",
      association: "",
      consent: false,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: VolunteerFormData) {
    setServerError(null);
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-24">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-turtle-gradient text-4xl font-bold tracking-tight sm:text-5xl">
            You&apos;re in the shell.
          </h1>
          <p className="mt-4 text-lg text-turtle-cream/80">
            We received your application. Keep an eye on your inbox — we&apos;ll
            send you a Calendly link to schedule your initial interview soon. 🐢
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-full bg-primary px-8 text-base font-semibold hover:glow-orange"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="mx-auto w-full max-w-lg">
        <StaggerReveal>
          <div className="mb-10 text-center">
            <h1 className="text-turtle-gradient text-3xl font-bold tracking-tight sm:text-4xl">
              Camp Application — 2026
            </h1>
            <p className="mt-4 text-turtle-cream/80">
              The 2026 application is open. Fill it out now, early pricing
              disappears faster than your campmates&apos; sunscreen. This form
              is also how you stay in the loop for future announcements,
              whether or not 2026 is your year.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-8">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Phone *</FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="phoneCountryCode"
                        render={({ field }) => (
                          <FormItem className="w-48 shrink-0">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-64">
                                {COUNTRY_CODES.map((c) => (
                                  <SelectItem
                                    key={c.label}
                                    value={c.label}
                                  >
                                    {c.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="555 000 0000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="association"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group, Person, or Project Association * <span className="font-normal text-turtle-cream/50">(if none, put N/A)</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Who referred you or what group are you with?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 space-y-0 rounded-lg border border-primary/30 bg-primary/5 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Application consent *</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            I acknowledge that I am submitting an application
                            to join Terrible Turtle camp.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {serverError && (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full bg-primary text-base font-semibold hover:glow-orange"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending your application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>

              <p className="text-center text-sm text-turtle-cream/50">
                Once you submit your application, we&apos;ll reach out with a
                Calendly link to schedule an initial interview.
              </p>
            </form>
          </Form>
        </StaggerReveal>
      </div>
    </main>
  );
}

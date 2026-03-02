"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import {
  volunteerSchema,
  ROLE_OPTIONS,
  AVAILABILITY_OPTIONS,
  type VolunteerFormData,
} from "@/lib/schemas/volunteer";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: "",
      email: "",
      playaName: "",
      roles: [],
      skills: "",
      experience: "",
      availability: "",
      message: "",
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
            Welcome to the Shell
          </h1>
          <p className="mt-4 text-lg text-turtle-cream/80">
            We got your sign-up. Keep an eye on your inbox — we&apos;ll be in
            touch as plans come together.
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
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-turtle-gradient text-3xl font-bold tracking-tight sm:text-4xl">
            Volunteer With Us
          </h1>
          <p className="mt-2 text-turtle-cream/70">
            Help us build something weird in the desert.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Playa Name */}
            <FormField
              control={form.control}
              name="playaName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playa Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your desert alter-ego" {...field} />
                  </FormControl>
                  <FormDescription>
                    If you have one. If you don&apos;t, the playa will give you
                    one.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Roles */}
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>What can you help with? *</FormLabel>
                  <FormDescription>Select all that apply.</FormDescription>
                  <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                    {ROLE_OPTIONS.map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(role)}
                                onCheckedChange={(checked) => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    checked
                                      ? [...current, role]
                                      : current.filter((r) => r !== role)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {role}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills */}
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills / Superpowers</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Welding, Python, sourdough bread, emotional support..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Burning Man Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="First timer? Ten-year vet? Tell us about it."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Availability */}
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="When can you be there?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anything Else?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Questions, ideas, bad puns about turtles..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
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
                  Sending...
                </>
              ) : (
                "Join the Shell"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}

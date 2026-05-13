"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import {
  volunteerSchema,
  VOLUNTEERING_OPTIONS,
  ROLE_OPTIONS,
  EXPERIENCE_OPTIONS,
  AVAILABILITY_OPTIONS,
  SKILLS_OPTIONS,
  PRONOUNS_OPTIONS,
  HOW_DID_YOU_HEAR_OPTIONS,
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
import StaggerReveal from "@/components/stagger-reveal";

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 border-b border-turtle-copper/20 pb-4">
      <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-turtle-copper/70">
        {number}
      </p>
      <h2 className="text-xl font-bold text-turtle-cream">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-turtle-cream/60">{description}</p>
      )}
    </div>
  );
}

export default function ApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pronouns: "",
      playaName: "",
      cityStateCountry: "",
      mailingAddress: "",
      volunteering: "",
      experience: "",
      rolesInterested: [],
      firstChoiceRole: "",
      skills: [],
      availability: "",
      joiningWithGroup: false,
      groupName: "",
      groupRole: "",
      groupSize: undefined,
      crewMemberNames: "",
      intentions: "",
      contribution: "",
      mostRecentCamp: "",
      howDidYouHear: "",
      anythingElse: "",
      under18: "",
      newsletter: false,
      consent: false,
    },
  });

  const { isSubmitting } = form.formState;
  const volunteering = form.watch("volunteering");
  const isVolunteering = volunteering === "Yes";
  const joiningWithGroup = form.watch("joiningWithGroup");

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
            We received your application and we&apos;ll be in touch soon. 🐢
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
      <div className="mx-auto w-full max-w-2xl">
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
            <p className="mt-3 text-turtle-cream/60">
              Terrible Turtle is built by the people in it. Fill out this form
              and let&apos;s figure out how you fit in the shell.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-10"
            >
              {/* ── Section 1: Personal Information ── */}
              <section className="rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-8">
                <SectionHeader
                  number="01"
                  title="Personal Information"
                  description="How we'll reach you. Your data is only used to coordinate camp."
                />

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

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="pronouns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pronouns *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your pronouns" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PRONOUNS_OPTIONS.map((option) => (
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

                    <FormField
                      control={form.control}
                      name="playaName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Playa Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your desert alter-ego"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            If you don&apos;t have one yet, the playa will provide.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cityStateCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City, State, Country *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="San Francisco, CA, USA"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mailingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mailing Address *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Street address, city, state, zip"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* ── Section 2: About Your Burn ── */}
              <section className="rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-8">
                <SectionHeader
                  number="02"
                  title="About Your Burn"
                  description="Tell us where you're at and what kind of involvement you're looking for."
                />

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="volunteering"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Are you looking to volunteer? *</FormLabel>
                        <FormDescription>
                          Either way, you&apos;re welcome here. Selecting &quot;just staying
                          connected&quot; keeps you in the loop for future camps.
                        </FormDescription>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select one" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VOLUNTEERING_OPTIONS.map((option) => (
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

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Burning Man experience *</FormLabel>
                        <FormDescription>
                          No judgment — we&apos;ve all been the wide-eyed virgin at some point.
                        </FormDescription>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="How many burns?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXPERIENCE_OPTIONS.map((option) => (
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
                </div>
              </section>

              {/* ── Section 3: Roles & Skills (conditional) ── */}
              {isVolunteering && (
                <section className="rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-8">
                  <SectionHeader
                    number="03"
                    title="Roles & Skills"
                    description="What do you want to build, fix, cook, or facilitate? Pick everything that sparks something."
                  />

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="rolesInterested"
                      render={() => (
                        <FormItem>
                          <FormLabel>Roles of Interest *</FormLabel>
                          <FormDescription>
                            Select all that apply. We&apos;ll use this to match you with the right crew.
                          </FormDescription>
                          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {ROLE_OPTIONS.map((role) => (
                              <FormField
                                key={role}
                                control={form.control}
                                name="rolesInterested"
                                render={({ field }) => (
                                  <FormItem className="flex items-center gap-2.5 space-y-0">
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
                                    <FormLabel className="cursor-pointer text-sm font-normal">
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

                    <FormField
                      control={form.control}
                      name="firstChoiceRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Choice Role *</FormLabel>
                          <FormDescription>
                            If we can only place you in one spot, where do you most want to be?
                          </FormDescription>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pick your top role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ROLE_OPTIONS.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
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
                      name="skills"
                      render={() => (
                        <FormItem>
                          <FormLabel>Skills & Superpowers</FormLabel>
                          <FormDescription>
                            Any specialized skills you bring to the table — select all that apply.
                          </FormDescription>
                          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {SKILLS_OPTIONS.map((skill) => (
                              <FormField
                                key={skill}
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                  <FormItem className="flex items-center gap-2.5 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(skill)}
                                        onCheckedChange={(checked) => {
                                          const current = field.value ?? [];
                                          field.onChange(
                                            checked
                                              ? [...current, skill]
                                              : current.filter((s) => s !== skill)
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer text-sm font-normal">
                                      {skill}
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
                  </div>
                </section>
              )}

              {/* ── Section 4: Availability (conditional) ── */}
              {isVolunteering && (
                <section className="rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-8">
                  <SectionHeader
                    number="04"
                    title="Availability"
                    description="When can you be on playa?"
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                </section>
              )}

              {/* ── Section 5: Your Crew (always shown) ── */}
              <section className="rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-8">
                <SectionHeader
                  number={isVolunteering ? "05" : "03"}
                  title="Your Crew"
                  description="Are you rolling in with a group, project, or art installation team?"
                />

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="joiningWithGroup"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 space-y-0 rounded-lg border border-border/40 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Are you joining with a group?</FormLabel>
                          <FormDescription>
                            Check this if you&apos;re coming with a crew, project, or art installation team.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {joiningWithGroup && (
                    <div className="space-y-5 rounded-lg border border-turtle-gold/20 bg-turtle-gold/5 p-5">
                      <FormField
                        control={form.control}
                        name="groupName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Group or project name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Turtle Squadron, The Solder Sisters"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="groupRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your role within the group</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Lead builder, DJ, organizer"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="groupSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Approximate group size</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                placeholder="e.g. 5"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  field.onChange(
                                    val === "" ? undefined : parseInt(val, 10)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="crewMemberNames"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Crew member names</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List the names of people coming with you"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* ── Section 6: Intentions & Gifts ── */}
              <section className="rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-8">
                <SectionHeader
                  number={isVolunteering ? "06" : "04"}
                  title="Intentions & Gifts"
                  description="Burning Man is about radical participation and gifting. Tell us what you're bringing."
                />

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="intentions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What are your intentions for this burn? *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What do you hope to experience, create, or give?"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What can you contribute to camp?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Skills, energy, equipment, ideas, chaos — all welcome."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mostRecentCamp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Most recent camp or project</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Camp Sunrise, The Funky Slug Collective"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The last camp you were part of, if any.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="howDidYouHear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How did you hear about Terrible Turtle?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select one" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {HOW_DID_YOU_HEAR_OPTIONS.map((option) => (
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
                </div>
              </section>

              {/* ── Section 7: Final Details ── */}
              <section className="rounded-2xl border border-turtle-copper/20 bg-card p-6 shadow-xl sm:p-8">
                <SectionHeader
                  number={isVolunteering ? "07" : "05"}
                  title="Final Details"
                  description="Almost done. A few housekeeping items before you hit send."
                />

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="anythingElse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anything else you want us to know?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Questions, accommodations, turtle puns, vibes..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="under18"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Will you be under 18 during burn week? *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select one" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 space-y-0 rounded-lg border border-border/40 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Subscribe to our newsletter</FormLabel>
                          <FormDescription>
                            Camp updates, build progress, and playa prep tips
                            delivered to your inbox.
                          </FormDescription>
                        </div>
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
                          <FormLabel>Data collection consent *</FormLabel>
                          <FormDescription>
                            I agree that Terrible Turtle may store and use the
                            information I&apos;ve shared in this form to coordinate
                            camp participation. Your data will not be shared
                            with third parties.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

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
            </form>
          </Form>
        </StaggerReveal>
      </div>
    </main>
  );
}

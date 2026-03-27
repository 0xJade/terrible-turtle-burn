"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import SkillCombobox from "@/components/skill-combobox";

import {
  volunteerSchema,
  ROLE_OPTIONS,
  EXPERIENCE_OPTIONS,
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
import StaggerReveal from "@/components/stagger-reveal";

interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [skillOptions, setSkillOptions] = useState<Skill[]>([]);
  const [showOtherRole, setShowOtherRole] = useState(false);
  const [otherRoleInput, setOtherRoleInput] = useState("");

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Skill[]) => {
        const roleSet = new Set<string>(ROLE_OPTIONS);
        setSkillOptions(data.filter((s) => !roleSet.has(s.name)));
      })
      .catch(() => setSkillOptions([]));
  }, []);

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      playaName: "",
      experience: "",
      skills: [],
      rolesInterested: [],
      customRoles: [],
      firstChoiceRole: "",
      availability: "",
      message: "",
      newsletter: false,
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
            You&apos;re in the shell.
          </h1>
          <p className="mt-4 text-lg text-turtle-cream/80">
            We&apos;ll be in touch. 🐢
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
        <StaggerReveal>
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
              {/* First Name */}
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

              {/* Last Name */}
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
                      If you have one. If you don&apos;t, the playa will give you one.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Burning Man Experience */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Burning Man Experience *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

              {/* Skills & Superpowers */}
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills &amp; Superpowers</FormLabel>
                    <FormDescription>
                      Search for skills or type your own.
                    </FormDescription>
                    <FormControl>
                      <SkillCombobox
                        skills={skillOptions}
                        selected={field.value ?? []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Which roles interest you? */}
              <FormField
                control={form.control}
                name="rolesInterested"
                render={() => (
                  <FormItem>
                    <FormLabel>Which roles interest you?</FormLabel>
                    <FormDescription>Select all that apply.</FormDescription>
                    <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                      {ROLE_OPTIONS.map((role) => (
                        <FormField
                          key={role}
                          control={form.control}
                          name="rolesInterested"
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

                    {/* Other checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox
                        checked={showOtherRole}
                        onCheckedChange={(checked) => {
                          setShowOtherRole(!!checked);
                          if (!checked) {
                            setOtherRoleInput("");
                          }
                        }}
                      />
                      <span className="text-sm">Other</span>
                    </div>

                    {/* Add custom roles */}
                    {showOtherRole && (
                      <FormField
                        control={form.control}
                        name="customRoles"
                        render={({ field }) => {
                          const customRoles = field.value ?? [];
                          return (
                            <div className="space-y-3 pt-1">
                              {customRoles.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {customRoles.map((role) => (
                                    <span
                                      key={role}
                                      className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-sm text-primary"
                                    >
                                      {role}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          field.onChange(customRoles.filter((r) => r !== role))
                                        }
                                        className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                                      >
                                        <X className="size-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Input
                                  placeholder="Type a role and press Add"
                                  value={otherRoleInput}
                                  onChange={(e) => setOtherRoleInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const trimmed = otherRoleInput.trim();
                                      if (trimmed && !customRoles.includes(trimmed)) {
                                        field.onChange([...customRoles, trimmed]);
                                        setOtherRoleInput("");
                                      }
                                    }
                                  }}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="shrink-0"
                                  onClick={() => {
                                    const trimmed = otherRoleInput.trim();
                                    if (trimmed && !customRoles.includes(trimmed)) {
                                      field.onChange([...customRoles, trimmed]);
                                      setOtherRoleInput("");
                                    }
                                  }}
                                >
                                  <Plus className="mr-1 size-4" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          );
                        }}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* What is your first choice role? */}
              <FormField
                control={form.control}
                name="firstChoiceRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your first choice role?</FormLabel>
                    <FormDescription>
                      If we need to place you in one role, where would you most want to contribute?
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

              {/* Availability */}
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
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

              {/* Anything Else */}
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
                    <FormDescription>
                      Anything you want us to know about you, your skills, or your vision for camp.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Newsletter */}
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
                        Get camp updates, build progress, and news delivered to your inbox.
                      </FormDescription>
                    </div>
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
        </StaggerReveal>
      </div>
    </main>
  );
}

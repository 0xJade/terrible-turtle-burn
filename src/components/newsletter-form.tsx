"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  async function onSubmit(data: FormData) {
    setStatus("idle");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-medium text-primary">
        You&apos;re subscribed! We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="First name"
            {...register("firstName")}
            aria-invalid={!!errors.firstName}
            className="h-10 bg-background/5 placeholder:text-muted-foreground/60"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Input
            placeholder="Last name"
            {...register("lastName")}
            aria-invalid={!!errors.lastName}
            className="h-10 bg-background/5 placeholder:text-muted-foreground/60"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            aria-invalid={!!errors.email}
            className="h-10 bg-background/5 placeholder:text-muted-foreground/60"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 shrink-0 rounded-full bg-primary px-6 font-semibold hover:glow-orange"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-destructive">{errorMsg}</p>
      )}
    </form>
  );
}

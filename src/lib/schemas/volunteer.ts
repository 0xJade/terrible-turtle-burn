import { z } from "zod";

export const ROLE_OPTIONS = [
  "Build / Fabrication",
  "Art / Design",
  "Tech / Electronics",
  "Kitchen / Food",
  "Music / Sound",
  "Logistics / Planning",
  "First Aid / Safety",
  "Greeter / Vibes",
] as const;

export const AVAILABILITY_OPTIONS = [
  "Full burn (arriving early, staying late)",
  "Most of the week",
  "A few days",
  "Build week only",
  "Strike (teardown) only",
  "Not sure yet",
] as const;

export const volunteerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  playaName: z.string().optional(),
  roles: z.array(z.string()).min(1, "Please select at least one role"),
  skills: z.string().optional(),
  experience: z.string().optional(),
  availability: z.string().min(1, "Please select your availability"),
  message: z.string().optional(),
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;

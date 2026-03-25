import { z } from "zod";

export const ROLE_OPTIONS = [
  "Build / Fabrication",
  "Tech / Electronics",
  "Music / Sound",
  "First Aid / Safety",
  "Art / Design",
  "Kitchen / Food",
  "Logistics / Planning",
  "Greeter / Vibes",
  "Power & Infrastructure",
  "Community Care",
  "Media & Documentation",
  "Programming & Workshops",
  "Camp Experience / Décor",
  "Leave No Trace & Strike",
] as const;

export const EXPERIENCE_OPTIONS = [
  "Virgin (never attended)",
  "Once or Twice",
  "Seasoned Burner (3–5x)",
  "Veteran (6x+)",
] as const;

export const AVAILABILITY_OPTIONS = [
  "Full Burn (arriving early, staying late)",
  "Most of the Week",
  "A Few Days",
  "Build Week Only",
  "Strike Only",
  "Not Sure Yet",
] as const;

export const volunteerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  playaName: z.string().optional(),
  experience: z.string().min(1, "Please select your Burning Man experience"),
  skills: z.array(z.string()).optional(),
  rolesInterested: z.array(z.string()).optional(),
  customRoles: z.array(z.string()).optional(),
  firstChoiceRole: z.string().optional(),
  availability: z.string().optional(),
  message: z.string().optional(),
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;

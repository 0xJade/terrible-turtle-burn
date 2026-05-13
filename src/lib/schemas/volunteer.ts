import { z } from "zod";

export const VOLUNTEERING_OPTIONS = [
  "Yes",
  "No",
] as const;

export const ROLE_OPTIONS = [
  "Greeter/Vibes",
  "Tech/Electronics",
  "Kitchen/Food",
  "Community Care",
  "Build/Fabrication",
  "Programming & Workshops",
  "Music/Sound",
  "Logistics/Planning",
  "First Aid/Safety",
  "Leave No Trace & Strike",
  "Art/Design",
  "Power & Infrastructure",
  "Media & Documentation",
  "Camp Experience/Décor",
] as const;

export const EXPERIENCE_OPTIONS = [
  "Virgin (never attended)",
  "Once or Twice",
  "Seasoned Burner (3–5x)",
  "Veteran (6x+)",
] as const;

export const AVAILABILITY_OPTIONS = [
  "Build Week",
  "Full Burn (arriving early, staying late)",
  "Event Week",
  "Breakdown/Strike",
  "Not Sure Yet",
] as const;

export const SKILLS_OPTIONS = [
  "Workshop/Panel Facilitation",
  "Data & Analytics",
  "Construction",
  "Emotional Holding & Active Listening",
  "Software Development",
  "Machine Learning/AI",
  "Hardware & Electrical Engineering",
] as const;

export const PRONOUNS_OPTIONS = [
  "she/her",
  "he/him",
  "they/them",
  "other",
] as const;

export const HOW_DID_YOU_HEAR_OPTIONS = [
  "Participation Fair",
  "Word of mouth",
  "Social media",
  "Other",
] as const;

export const volunteerSchema = z
  .object({
    // ── Personal Info (Contact) ──
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(1, "Phone number is required"),
    pronouns: z.string().min(1, "Pronouns are required"),
    playaName: z.string().optional(),
    cityStateCountry: z.string().min(1, "City, state, and country are required"),
    mailingAddress: z.string().min(1, "Mailing address is required"),

    // ── About Your Burn ──
    volunteering: z.string().min(1, "Please let us know if you're volunteering"),
    experience: z.string().min(1, "Please select your Burning Man experience"),

    // ── Roles & Skills (conditional: required if volunteering = "Yes") ──
    rolesInterested: z.array(z.string()).optional(),
    firstChoiceRole: z.string().optional(),
    skills: z.array(z.string()).optional(),

    // ── Availability (conditional: required if volunteering = "Yes") ──
    availability: z.string().optional(),

    // ── Group ──
    joiningWithGroup: z.boolean().optional(),
    groupName: z.string().optional(),
    groupRole: z.string().optional(),
    groupSize: z.number().int().positive().optional(),
    crewMemberNames: z.string().optional(),

    // ── Intentions & Gifts ──
    intentions: z.string().min(1, "Please share your intentions for this burn"),
    contribution: z.string().optional(),
    mostRecentCamp: z.string().optional(),
    howDidYouHear: z.string().optional(),

    // ── Final Details ──
    anythingElse: z.string().optional(),
    under18: z.string().min(1, "Please indicate if you'll be under 18 during burn week"),
    newsletter: z.boolean().optional(),
    consent: z.boolean().refine((val) => val === true, {
      message: "You must agree to the data collection consent to submit",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.volunteering === "Yes") {
      if (!data.rolesInterested || data.rolesInterested.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select at least one role",
          path: ["rolesInterested"],
        });
      }
      if (!data.firstChoiceRole || data.firstChoiceRole.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select your first choice role",
          path: ["firstChoiceRole"],
        });
      }
      if (!data.availability || data.availability.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select your availability",
          path: ["availability"],
        });
      }
    }
    if (data.joiningWithGroup) {
      if (!data.groupName || data.groupName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group or project name is required",
          path: ["groupName"],
        });
      }
    }
  });

export type VolunteerFormData = z.infer<typeof volunteerSchema>;

import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/schemas/volunteer";
import {
  listRecords,
  createRecord,
  updateRecord,
} from "@/lib/airtable/client";

const MAX_BODY_SIZE = 10 * 1024; // 10KB

export async function POST(request: NextRequest) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: "Request body too large" },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const result = volunteerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 400 }
    );
  }

  const data = result.data;

  try {
    // Build the Contacts table fields (names must match Airtable exactly)
    const contactFields: Record<string, unknown> = {
      "First Name": data.firstName,
      "Last Name": data.lastName,
      "Email": data.email,
      "Date Added": new Date().toISOString().split("T")[0],
    };

    if (data.playaName) contactFields["Playa Name"] = data.playaName;
    if (data.experience) contactFields["Burning Man Experience"] = data.experience;
    const allRoles = [
      ...(data.rolesInterested ?? []),
      ...(data.customRoles ?? []),
    ];
    if (allRoles.length > 0) {
      contactFields["Which roles interest you?"] = allRoles;
    }
    if (data.firstChoiceRole) {
      contactFields["What is your first choice role?"] = data.firstChoiceRole;
    }
    if (data.availability) contactFields["Availability"] = data.availability;
    if (data.message) contactFields["Anything Else?"] = data.message;

    // Look up skill record IDs and create any custom skills
    const allSelectedSkills = [
      ...(data.skills ?? []),
      ...(data.customSkills ?? []),
    ];

    if (allSelectedSkills.length > 0) {
      const skillRecords = await listRecords("Skills", {
        fields: ["Skill Name"],
      });

      const existingByName = new Map(
        skillRecords.map((r) => [r.fields["Skill Name"] as string, r.id])
      );

      const skillIds: string[] = [];

      for (const skillName of allSelectedSkills) {
        const existingId = existingByName.get(skillName);
        if (existingId) {
          skillIds.push(existingId);
        } else {
          // Create new skill record for custom entries
          const newRecord = await createRecord("Skills", {
            "Skill Name": skillName,
          });
          skillIds.push(newRecord.id);
        }
      }

      if (skillIds.length > 0) {
        contactFields["Skills & Superpowers"] = skillIds;
      }
    }

    // Check if a contact with this email already exists
    const existing = await listRecords("Contacts", {
      filterByFormula: `{Email}='${data.email.replace(/'/g, "\\'")}'`,
      fields: ["Email"],
    });

    if (existing.length > 0) {
      // Update existing record — don't overwrite Date Added
      delete contactFields["Date Added"];
      await updateRecord("Contacts", existing[0].id, contactFields);
    } else {
      await createRecord("Contacts", contactFields);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Airtable error:", err);
    return NextResponse.json(
      { error: "Failed to save volunteer registration" },
      { status: 500 }
    );
  }
}

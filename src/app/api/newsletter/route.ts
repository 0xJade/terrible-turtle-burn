import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  listRecords,
  createRecord,
  updateRecord,
} from "@/lib/airtable/client";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 400 }
    );
  }

  const data = result.data;

  try {
    const existing = await listRecords("Contacts", {
      filterByFormula: `{Email}='${data.email.replace(/'/g, "\\'")}'`,
      fields: ["Email"],
    });

    if (existing.length > 0) {
      await updateRecord("Contacts", existing[0].id, {
        "Newsletter Subscription": true,
      });
    } else {
      await createRecord("Contacts", {
        "First Name": data.firstName,
        "Last Name": data.lastName,
        "Email": data.email,
        "Newsletter Subscription": true,
        "Date Added": new Date().toISOString().split("T")[0],
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

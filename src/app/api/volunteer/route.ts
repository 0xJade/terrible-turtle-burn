import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema, COUNTRY_CODES } from "@/lib/schemas/volunteer";
import {
  listRecords,
  createRecord,
  updateRecord,
} from "@/lib/airtable/client";

const MAX_BODY_SIZE = 10 * 1024;

const CONTACTS_TABLE = "tbl1IifyhJZy22bTa";
const APPLICATIONS_TABLE = "tblgoAYSjSXIsnDLB";

const CF = {
  email: "fld2nq8rjo2jrXCY0",
  firstName: "fldgjX2s2MigTxk4v",
  lastName: "fldqzBFjp9AMYDdZX",
  phone: "fldy1x815qyWFDueN",
  dateAdded: "fldVRLnVCaRjJoCyj",
  status: "fldUT3GdrUpwvUtH3",
} as const;

const AF = {
  contact: "fldklcVsX2r83at6z",
  groupOrProjectName: "fldtNpDT3mNRHHOpX",
  year: "fldoeHNmXV72Ebyih",
  status: "fldsQkbGCE8WSY3q5",
  dateSubmitted: "fldwf7xYDRMHq0CDp",
} as const;

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
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = volunteerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 400 }
    );
  }

  const data = result.data;
  const today = new Date().toISOString().split("T")[0];

  try {
    // ── Step 1: Find or create Contact ──

    const escapedEmail = data.email.replace(/'/g, "\\'");
    const existingContacts = await listRecords(CONTACTS_TABLE, {
      filterByFormula: `{Email}='${escapedEmail}'`,
      fields: [CF.email],
    });

    const contactFields: Record<string, unknown> = {
      [CF.firstName]: data.firstName,
      [CF.lastName]: data.lastName,
      [CF.phone]: `${COUNTRY_CODES.find((c) => c.label === data.phoneCountryCode)?.code ?? ""}${data.phone}`,
    };

    let contactRecordId: string;

    if (existingContacts.length > 0) {
      contactRecordId = existingContacts[0].id;
      await updateRecord(CONTACTS_TABLE, contactRecordId, contactFields);
    } else {
      contactFields[CF.email] = data.email;
      contactFields[CF.dateAdded] = today;
      contactFields[CF.status] = "interested";
      const contactRecord = await createRecord(CONTACTS_TABLE, contactFields);
      contactRecordId = contactRecord.id;
    }

    // ── Step 2: Create Application ──

    const appFields: Record<string, unknown> = {
      [AF.contact]: [contactRecordId],
      [AF.year]: "2026",
      [AF.status]: "Interested",
      [AF.dateSubmitted]: today,
    };
    appFields[AF.groupOrProjectName] = data.association;

    await createRecord(APPLICATIONS_TABLE, appFields);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[volunteer] ERROR:", message);
    return NextResponse.json(
      { error: "Failed to save your application", detail: message },
      { status: 500 }
    );
  }
}

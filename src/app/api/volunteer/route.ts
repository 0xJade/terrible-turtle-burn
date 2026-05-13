import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/schemas/volunteer";
import {
  listRecords,
  createRecord,
  updateRecord,
} from "@/lib/airtable/client";

const MAX_BODY_SIZE = 10 * 1024; // 10KB

const CONTACTS_TABLE = "tbl1IifyhJZy22bTa";
const APPLICATIONS_TABLE = "tblgoAYSjSXIsnDLB";

// Contacts field IDs
const CF = {
  email: "fld2nq8rjo2jrXCY0",
  firstName: "fldgjX2s2MigTxk4v",
  lastName: "fldqzBFjp9AMYDdZX",
  phone: "fldy1x815qyWFDueN",
  pronouns: "fldYtDKWj7jtsSXRn",
  playaName: "fldsW4jduzxaDjyuL",
  cityStateCountry: "fldHSoOb97Bc04ZgZ",
  mailingAddress: "fld5L5Jpf9zjwv1O4",
  newsletter: "fldJjdGSqWe8mKyAR",
  dateAdded: "fldVRLnVCaRjJoCyj",
  status: "fldUT3GdrUpwvUtH3",
} as const;

// Applications field IDs
// VOLUNTEERING_FIELD_ID: add the "Volunteering?" single-select field in Airtable,
// then paste the generated field ID (starts with "fld") here and uncomment AF.volunteering.
const VOLUNTEERING_FIELD_ID = "fldBn0sT0T3LHG9m9"; // e.g. "fldXXXXXXXXXXXXXXXX"

// MOST_RECENT_CAMP_FIELD_ID: the field ID in the original spec ("fld249Z") appears
// truncated. Verify the correct 17-char ID in Airtable and paste it here.
const MOST_RECENT_CAMP_FIELD_ID = "fldFJwrCFW0frAfgU"; // e.g. "fldXXXXXXXXXXXXXXXX"

const AF = {
  contact: "fldklcVsX2r83at6z",
  experience: "fldm7AgZsWk9q2e0b",
  rolesInterested: "fld3jn7QceYjxlMOe",
  firstChoiceRole: "fldzF8yQFZ8FTfT6a",
  availability: "fldVcZerFLVAkDLBe",
  skills: "fldVlAZeTMTLHK2Yt",
  joiningWithGroup: "fldgzxdvmfVthrrBG",
  groupName: "fldtNpDT3mNRHHOpX",
  groupRole: "fldGHMcGLppmuChwf",
  groupSize: "fld8JWwaLjX0FgO5I",
  howDidYouHear: "fldkZPXINW2h9S40a",
  crewMemberNames: "fldVF05mRCM0tFCMD",
  intentions: "fldyvgMqGqsFgarLT",
  contribution: "fldDQnvrF7WMvKs0J",
  anythingElse: "fld3oLQXIPgiP7RAo",
  under18: "fldo3cC464vegzCXL",
  newsletterOptIn: "fldaMhMlTgd5yTBts",
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
      [CF.newsletter]: data.newsletter ?? false,
    };
    if (data.phone) contactFields[CF.phone] = data.phone;
    if (data.pronouns) contactFields[CF.pronouns] = data.pronouns;
    if (data.playaName) contactFields[CF.playaName] = data.playaName;
    if (data.cityStateCountry) contactFields[CF.cityStateCountry] = data.cityStateCountry;
    if (data.mailingAddress) contactFields[CF.mailingAddress] = data.mailingAddress;

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

    // ── Step 2: Always create a new Application ──

    const isVolunteering = data.volunteering === "Yes";

    const appFields: Record<string, unknown> = {
      [AF.contact]: [contactRecordId],
      [AF.experience]: data.experience,
      [AF.joiningWithGroup]: data.joiningWithGroup ?? false,
      [AF.under18]: data.under18,
      [AF.newsletterOptIn]: data.newsletter ? "Yes" : "Not at this time",
      [AF.year]: "2026",
      [AF.status]: "Interested",
      [AF.dateSubmitted]: today,
    };

    if (isVolunteering) {
      if (data.rolesInterested && data.rolesInterested.length > 0) {
        appFields[AF.rolesInterested] = data.rolesInterested;
      }
      if (data.firstChoiceRole) appFields[AF.firstChoiceRole] = data.firstChoiceRole;
      if (data.availability) appFields[AF.availability] = data.availability;
      if (data.skills && data.skills.length > 0) {
        appFields[AF.skills] = data.skills;
      }
    }
    if (data.joiningWithGroup) {
      if (data.groupName) appFields[AF.groupName] = data.groupName;
      if (data.groupRole) appFields[AF.groupRole] = data.groupRole;
      if (data.groupSize) appFields[AF.groupSize] = data.groupSize;
      if (data.crewMemberNames) appFields[AF.crewMemberNames] = data.crewMemberNames;
    }
    if (VOLUNTEERING_FIELD_ID) appFields[VOLUNTEERING_FIELD_ID] = data.volunteering;
    if (data.howDidYouHear) appFields[AF.howDidYouHear] = data.howDidYouHear;
    if (MOST_RECENT_CAMP_FIELD_ID && data.mostRecentCamp) {
      appFields[MOST_RECENT_CAMP_FIELD_ID] = data.mostRecentCamp;
    }
    if (data.intentions) appFields[AF.intentions] = data.intentions;
    if (data.contribution) appFields[AF.contribution] = data.contribution;
    if (data.anythingElse) appFields[AF.anythingElse] = data.anythingElse;

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

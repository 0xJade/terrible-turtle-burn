import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/schemas/volunteer";
import {
  listRecords,
  createRecord,
  updateRecord,
} from "@/lib/airtable/client";

const MAX_BODY_SIZE = 10 * 1024; // 10KB

// Airtable table IDs
const CONTACTS_TABLE = "tbl1IifyhJZy22bTa";
const VOLUNTEERS_TABLE = "tblgoAYSjSXIsnDLB";

// Contacts field IDs
const CF = {
  email: "fld2nq8rjo2jrXCY0",
  firstName: "fldgjX2s2MigTxk4v",
  lastName: "fldqzBFjp9AMYDdZX",
  playaName: "fldsW4jduzxaDjyuL",
  newsletter: "fldJjdGSqWe8mKyAR",
} as const;

// Volunteers field IDs
const VF = {
  contact: "fldklcVsX2r83at6z",
  status: "fldsQkbGCE8WSY3q5",
  dateSubmitted: "fldwf7xYDRMHq0CDp",
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
  notes: "fldC4B0CA7OGUW20z",
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

  try {
    // ── Step 1: Query and Create/Update Contact ──

    console.log("[volunteer] Step 1: Looking up contact by email…");
    const escapedEmail = data.email.replace(/'/g, "\\'");
    const existingContacts = await listRecords(CONTACTS_TABLE, {
      filterByFormula: `{Email}='${escapedEmail}'`,
      fields: [CF.email],
    });
    console.log("[volunteer] Found", existingContacts.length, "existing contacts");

    let contactRecordId: string;

    if (existingContacts.length > 0) {
      contactRecordId = existingContacts[0].id;
      const updateFields: Record<string, unknown> = {
        [CF.firstName]: data.firstName,
        [CF.lastName]: data.lastName,
        [CF.newsletter]: data.newsletter ?? false,
      };
      if (data.playaName) updateFields[CF.playaName] = data.playaName;

      console.log("[volunteer] Updating contact", contactRecordId, updateFields);
      await updateRecord(CONTACTS_TABLE, contactRecordId, updateFields);
    } else {
      const createFields: Record<string, unknown> = {
        [CF.email]: data.email,
        [CF.firstName]: data.firstName,
        [CF.lastName]: data.lastName,
        [CF.newsletter]: data.newsletter ?? false,
      };
      if (data.playaName) createFields[CF.playaName] = data.playaName;

      console.log("[volunteer] Creating contact", createFields);
      const contactRecord = await createRecord(CONTACTS_TABLE, createFields);
      contactRecordId = contactRecord.id;
    }
    console.log("[volunteer] Contact record ID:", contactRecordId);

    // ── Step 2: Query and Create/Update Volunteer ──

    console.log("[volunteer] Step 2: Looking up volunteer by contact link…");
    const existingVolunteers = await listRecords(VOLUNTEERS_TABLE, {
      filterByFormula: `SEARCH("${contactRecordId}", ARRAYJOIN({${VF.contact}}))`,
      fields: [VF.contact],
    });
    console.log("[volunteer] Found", existingVolunteers.length, "existing volunteers");

    // Build shared volunteer fields
    const volunteerFields: Record<string, unknown> = {};

    if (data.experience) {
      volunteerFields[VF.experience] = data.experience;
    }

    if (data.rolesInterested && data.rolesInterested.length > 0) {
      volunteerFields[VF.rolesInterested] = data.rolesInterested;
    }

    if (data.firstChoiceRole) {
      volunteerFields[VF.firstChoiceRole] = data.firstChoiceRole;
    }

    if (data.availability) {
      volunteerFields[VF.availability] = data.availability;
    }

    if (data.skills && data.skills.length > 0) {
      const skillRecords = await listRecords("tblojRk9vzqzGkq6I", {
        fields: ["Skill Name"],
      });
      const existingByName = new Map(
        skillRecords.map((r) => [r.fields["Skill Name"] as string, r.id])
      );
      const skillIds: string[] = [];
      for (const skillName of data.skills) {
        const existingId = existingByName.get(skillName);
        if (existingId) {
          skillIds.push(existingId);
        } else {
          const newRecord = await createRecord("tblojRk9vzqzGkq6I", {
            "Skill Name": skillName,
          });
          skillIds.push(newRecord.id);
        }
      }
      if (skillIds.length > 0) {
        volunteerFields[VF.skills] = skillIds;
      }
    }

    volunteerFields[VF.joiningWithGroup] = data.joiningWithGroup ?? false;

    if (data.joiningWithGroup) {
      if (data.groupName) volunteerFields[VF.groupName] = data.groupName;
      if (data.groupRole) volunteerFields[VF.groupRole] = data.groupRole;
      if (data.groupSize) volunteerFields[VF.groupSize] = data.groupSize;
    }

    if (data.howDidYouHear) {
      volunteerFields[VF.howDidYouHear] = data.howDidYouHear;
    }

    if (data.message) {
      volunteerFields[VF.notes] = data.message;
    }

    if (existingVolunteers.length > 0) {
      console.log("[volunteer] Updating volunteer", existingVolunteers[0].id, volunteerFields);
      await updateRecord(
        VOLUNTEERS_TABLE,
        existingVolunteers[0].id,
        volunteerFields
      );
    } else {
      volunteerFields[VF.contact] = [contactRecordId];
      volunteerFields[VF.status] = "Interested";
      volunteerFields[VF.dateSubmitted] = new Date()
        .toISOString()
        .split("T")[0];

      console.log("[volunteer] Creating volunteer", volunteerFields);
      await createRecord(VOLUNTEERS_TABLE, volunteerFields);
    }

    console.log("[volunteer] Done — success");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[volunteer] ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save volunteer registration" },
      { status: 500 }
    );
  }
}

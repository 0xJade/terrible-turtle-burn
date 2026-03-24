import { NextResponse } from "next/server";
import { listRecords } from "@/lib/airtable/client";

export async function GET() {
  try {
    const records = await listRecords("Skills", {
      fields: ["Skill Name", "Category"],
    });

    const skills = records
      .map((r) => ({
        id: r.id,
        name: r.fields["Skill Name"] as string,
        category: (r.fields["Category"] as string) ?? null,
      }))
      .filter((s) => s.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(skills);
  } catch (err) {
    console.error("Failed to fetch skills:", err);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

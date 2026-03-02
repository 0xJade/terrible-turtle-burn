import { NextRequest, NextResponse } from "next/server";
import { volunteerSchema } from "@/lib/schemas/volunteer";
import { createServiceClient } from "@/lib/supabase/server";

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
    const supabase = createServiceClient();
    const { error } = await supabase.from("volunteers").insert({
      name: data.name,
      email: data.email,
      playa_name: data.playaName ?? null,
      roles: data.roles,
      skills: data.skills ?? null,
      experience: data.experience ?? null,
      availability: data.availability,
      message: data.message ?? null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save volunteer registration" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

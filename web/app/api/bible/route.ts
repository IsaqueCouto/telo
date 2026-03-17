import { type NextRequest, NextResponse } from "next/server";
import { fetchDailyChapters } from "@/lib/bible";
import type { Translation } from "@/lib/bible";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const translation = (searchParams.get("translation") ?? "nvi") as Translation;
  const chaptersText = searchParams.get("chapters") ?? "";

  if (!chaptersText) {
    return NextResponse.json({ error: "Missing chapters" }, { status: 400 });
  }

  const supabase = await createClient();
  const chapters = await fetchDailyChapters(translation, chaptersText, supabase);
  return NextResponse.json({ chapters });
}

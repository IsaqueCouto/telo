import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PerfilClient } from "./PerfilClient";

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");
  if (!profile.onboarding_completed) redirect("/onboarding");

  // Past 16 weeks of reading history for heatmap
  const sixteenWeeksAgo = new Date();
  sixteenWeeksAgo.setDate(sixteenWeeksAgo.getDate() - 112);

  const [{ data: streak }, { data: progressRows }] = await Promise.all([
    supabase.from("streaks").select("current_streak, longest_streak, last_read_date").eq("user_id", user.id).single(),
    supabase
      .from("reading_progress")
      .select("completed_at")
      .eq("user_id", user.id)
      .gte("completed_at", sixteenWeeksAgo.toISOString()),
  ]);

  // Total chapters ever read (not limited to 16 weeks)
  const { count: totalChaptersRead } = await supabase
    .from("reading_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Unique active days from heatmap window
  const heatmapDates = [
    ...new Set(
      (progressRows ?? []).map((r) => r.completed_at.split("T")[0])
    ),
  ];

  // Unique active days total (for "Dias ativos" stat)
  const { data: allProgress } = await supabase
    .from("reading_progress")
    .select("completed_at")
    .eq("user_id", user.id);

  const daysActive = new Set((allProgress ?? []).map((r) => r.completed_at.split("T")[0])).size;

  return (
    <PerfilClient
      profile={profile}
      email={user.email ?? ""}
      streak={streak}
      totalChaptersRead={totalChaptersRead ?? 0}
      daysActive={daysActive}
      heatmapDates={heatmapDates}
    />
  );
}

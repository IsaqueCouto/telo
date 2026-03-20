import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push";

// Called daily by Vercel Cron at 12:00 UTC (09:00 Brasília)
export async function POST(req: NextRequest) {
  // Protect the endpoint — only Vercel Cron or our own secret can call it
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Get all push subscriptions with their user's profile + today's reading
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select(`
      endpoint, p256dh, auth,
      profiles!inner(id, pace, start_date, full_name, plan_type)
    `);

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const today = new Date();
  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      type ProfileRow = { id: string; pace: string; start_date: string; full_name: string | null; plan_type: string };
      const profile = (sub as unknown as { profiles: ProfileRow }).profiles;
      const start = new Date(profile.start_date);
      const diffMs =
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
        Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
      const dayNumber = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

      // Get today's devotional for this user's pace
      const { data: devotional } = await supabase
        .from("devotionals")
        .select("chapters_text, key_verse, key_verse_reference")
        .eq("day_number", dayNumber)
        .eq("pace", profile.pace)
        .single();

      // Get streak
      const { data: streak } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", profile.id)
        .single();

      const firstName = profile.full_name?.split(" ")[0] ?? "você";
      const streakCount = streak?.current_streak ?? 0;

      let body = devotional?.chapters_text
        ? `Leitura de hoje: ${devotional.chapters_text}`
        : "Sua leitura de hoje te espera.";

      if (devotional?.key_verse && devotional?.key_verse_reference) {
        body = `"${devotional.key_verse}" — ${devotional.key_verse_reference}`;
      }

      const streakText =
        streakCount >= 3
          ? ` 🔥 ${streakCount} dias seguidos!`
          : streakCount === 1
          ? " Primeiro dia — continue!"
          : "";

      const subscription: Parameters<typeof sendPushNotification>[0] = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      };

      return sendPushNotification(subscription, {
        title: `Olá, ${firstName}! Hora da Palavra.${streakText}`,
        body,
        url: "/hoje",
      });
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  // Clean up expired subscriptions
  const expiredEndpoints: string[] = results
    .map((r, i) => {
      if (r.status === "rejected") {
        const err = r.reason as { statusCode?: number };
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          return subscriptions[i].endpoint;
        }
      }
      return null;
    })
    .filter((e): e is string => e !== null);

  if (expiredEndpoints.length > 0) {
    await supabase.from("push_subscriptions").delete().in("endpoint", expiredEndpoints);
  }

  return NextResponse.json({ sent, failed });
}

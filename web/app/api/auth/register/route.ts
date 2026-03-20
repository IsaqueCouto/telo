import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin client — bypasses email confirmation
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  const { email, password, full_name, phone } = await req.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  // Create user already confirmed
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Update phone in profile if provided
  if (data.user && phone) {
    await supabaseAdmin.from("profiles").update({ phone }).eq("id", data.user.id);
  }

  return NextResponse.json({ ok: true });
}

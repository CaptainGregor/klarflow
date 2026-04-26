import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email fehlt." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .select("insight")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      insight: data?.insight || null,
    });
  } catch {
    return Response.json(
      { error: "Fehler beim Laden des letzten Klarflows." },
      { status: 500 }
    );
  }
}
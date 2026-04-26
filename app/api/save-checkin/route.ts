import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, returningAnswers } = await req.json();

    if (!email) {
      return Response.json({ error: "Email fehlt." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .select("id, checkin_count")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data?.id) {
      return Response.json({ error: "Lead nicht gefunden." }, { status: 404 });
    }

    const currentCount = data.checkin_count || 0;

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        returned_at: new Date().toISOString(),
        last_checkin_at: new Date().toISOString(),
        checkin_count: currentCount + 1,
        returning_answers: JSON.stringify(returningAnswers || []),
      })
      .eq("id", data.id);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Fehler beim Speichern des Check-ins." },
      { status: 500 }
    );
  }
}
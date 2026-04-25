import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildEmailDay2(insight: string) {
  return `
  <div style="font-family: Arial; line-height:1.6; max-width:600px; margin:auto;">
    
    <h2>Der Moment davor</h2>

    <p>Hallo,</p>

    <p>
    gestern hast du etwas Wichtiges erkannt.
    </p>

    <p>
    Nicht viele bleiben an diesem Punkt stehen.
    </p>

    <p>
    Heute geht es nicht darum, etwas zu verändern.
    </p>

    <p>
    Nur darum, einen Moment zu bemerken:
    <br/>
    den Moment <strong>bevor</strong> du automatisch reagierst.
    </p>

    <p>
    Er ist oft sehr kurz.
    <br/>
    Fast unsichtbar.
    </p>

    <p>
    Wenn du ihn heute siehst,
    <br/>
    halte für eine Sekunde inne.
    </p>

    <p>
    Mehr ist nicht nötig.
    </p>

    <p>
    — Klarflow
    </p>

  </div>
  `;
}

function buildEmailDay3() {
  return `
  <div style="font-family: Arial; line-height:1.6; max-width:600px; margin:auto;">
    
    <h2>Du musst das nicht perfekt machen</h2>

    <p>Hallo,</p>

    <p>
    viele denken, Veränderung bedeutet,
    alles sofort richtig zu machen.
    </p>

    <p>
    Das stimmt nicht.
    </p>

    <p>
    Veränderung beginnt viel früher:
    <br/>
    in einem einzigen bewussten Moment.
    </p>

    <p>
    Und genau dort hast du bereits angesetzt.
    </p>

    <p>
    Wenn du heute wieder in ein altes Muster fällst:
    </p>

    <p>
    → das ist kein Fehler<br/>
    → das ist Teil des Weges
    </p>

    <p>
    Komm einfach wieder zurück.
    </p>

    <p>
    Ruhig. Ohne Druck.
    </p>

    <p>
    — Klarflow
    </p>

  </div>
  `;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();

  const { data: leads, error } = await supabase.from("leads").select("*");

  if (error) {
    console.error("Supabase fetch error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  for (const lead of leads || []) {
    const created = new Date(lead.created_at);
    const diffHours =
      (now.getTime() - created.getTime()) / (1000 * 60 * 60);

    if (diffHours > 24 && !lead.email_sent_2) {
      const result2 = await resend.emails.send({
        from: "Klarflow <hello@klarflow.de>",
        to: lead.email,
        subject: "Der Moment, in dem du normalerweise reagierst",
        html: buildEmailDay2(lead.insight || ""),
      });

      console.log("Day 2 Resend result:", result2);

      await supabase
        .from("leads")
        .update({ email_sent_2: true })
        .eq("id", lead.id);
    }

    if (diffHours > 72 && !lead.email_sent_3) {
      const result3 = await resend.emails.send({
        from: "Klarflow <hello@klarflow.de>",
        to: lead.email,
        subject: "Du brauchst keinen perfekten Plan",
        html: buildEmailDay3(),
      });

      console.log("Day 3 Resend result:", result3);

      await supabase
        .from("leads")
        .update({ email_sent_3: true })
        .eq("id", lead.id);
    }
  }

  return Response.json({
    success: true,
    leadsFound: leads?.length || 0,
  });
}
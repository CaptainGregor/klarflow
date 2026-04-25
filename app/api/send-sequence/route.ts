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
    <p>gestern hast du etwas bei dir klar gesehen:</p>
    <p style="background:#f5f5f5; padding:12px; border-radius:8px;">
      ${insight}
    </p>
    <p>Genau dort beginnt Veränderung.</p>
    <p>Heute geht es nicht darum, etwas zu ändern.</p>
    <p>Nur darum, den Moment <strong>bevor</strong> du automatisch reagierst, zu bemerken.</p>
    <p>Wenn dieser Moment heute kommt:<br/>halte für eine Sekunde inne.</p>
    <p>Mehr ist nicht nötig.</p>
    <p>— Klarflow</p>
  </div>
  `;
}

function buildEmailDay3(insight: string) {
  return `
  <div style="font-family: Arial; line-height:1.6; max-width:600px; margin:auto;">
    <h2>Du musst das nicht perfekt machen</h2>
    <p>Hallo,</p>
    <p>du hast bereits erkannt, dass dein Verhalten nicht zufällig ist:</p>
    <p style="background:#f5f5f5; padding:12px; border-radius:8px;">
      ${insight}
    </p>
    <p>Das ist mehr, als die meisten jemals sehen.</p>
    <p>Veränderung beginnt nicht mit Perfektion.</p>
    <p>Sondern mit einem einzigen bewussten Moment.</p>
    <p>Wenn du heute wieder zurückfällst:<br/>→ das ist kein Fehler<br/>→ das ist Teil des Weges</p>
    <p>Komm einfach wieder zurück.</p>
    <p>— Klarflow</p>
  </div>
  `;
}

function buildEmailDay7(insight: string) {
  return `
  <div style="font-family: Arial; line-height:1.6; max-width:600px; margin:auto;">
    <h2>Was sich verändert, wenn du hinschaust</h2>

    <p>Hallo,</p>

    <p>
      vor einigen Tagen hast du dir einen Moment genommen, um ehrlich auf dein Muster zu schauen.
    </p>

    <p style="background:#f5f5f5; padding:12px; border-radius:8px;">
      ${insight}
    </p>

    <p>
      Vielleicht hat sich seitdem schon etwas gezeigt.
      Vielleicht auch noch nicht.
    </p>

    <p>
      Beides ist in Ordnung.
    </p>

    <p>
      Veränderung beginnt oft nicht sichtbar.
      Sie beginnt in dem Moment, in dem du etwas nicht mehr völlig automatisch tust.
    </p>

    <p>
      Für heute reicht eine Frage:
    </p>

    <p style="font-weight:bold;">
      Was ist der eine Moment, in dem ich heute kurz wach bleiben kann?
    </p>

    <p>
      Nicht perfekt. Nicht streng. Nur bewusst.
    </p>

    <p>— Klarflow</p>
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
        html: buildEmailDay3(lead.insight || ""),
      });

      console.log("Day 3 Resend result:", result3);

      await supabase
        .from("leads")
        .update({ email_sent_3: true })
        .eq("id", lead.id);
    }

    if (diffHours > 168 && !lead.email_sent_7) {
      const result7 = await resend.emails.send({
        from: "Klarflow <hello@klarflow.de>",
        to: lead.email,
        subject: "Was sich verändert, wenn du hinschaust",
        html: buildEmailDay7(lead.insight || ""),
      });

      console.log("Day 7 Resend result:", result7);

      await supabase
        .from("leads")
        .update({ email_sent_7: true })
        .eq("id", lead.id);
    }
  }

  return Response.json({
    success: true,
    leadsFound: leads?.length || 0,
  });
}
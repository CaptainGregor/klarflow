import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function emailShell(title: string, label: string, body: string) {
  return `
  <div style="font-family: Arial, sans-serif; line-height:1.65; color:#171717; max-width:640px; margin:0 auto; padding:28px;">
    <p style="font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#08a99d; font-weight:700;">
      ${label}
    </p>

    <h1 style="font-size:30px; line-height:1.2; margin:12px 0 18px;">
      ${title}
    </h1>

    ${body}

    <p style="margin-top:34px;">— Klarflow</p>
  </div>
  `;
}

function insightBlock(insight: string) {
  return `
  <div style="background:#f2fbfa; border-radius:22px; padding:22px; margin:26px 0;">
    <p style="font-size:13px; letter-spacing:0.16em; text-transform:uppercase; color:#08a99d; font-weight:700; margin-top:0;">
      Dein Muster
    </p>
    <p style="margin-bottom:0;">
      ${insight.replace(/\n/g, "<br />")}
    </p>
  </div>
  `;
}

function darkBlock(title: string, text: string) {
  return `
  <div style="background:#171717; color:#ffffff; border-radius:22px; padding:22px; margin-top:30px;">
    <p style="margin-top:0; font-weight:700;">${title}</p>
    <p style="margin-bottom:16px; color:#d4d4d4;">${text}</p>

    <a href="https://klarflow.vercel.app?returning=true"
       style="display:inline-block; padding:12px 20px; background:#ffffff; color:#171717; text-decoration:none; border-radius:12px; font-weight:600;">
       Zurück zu Klarflow
    </a>
  </div>
  `;
}

function buildEmailDay2(insight: string) {
  return emailShell(
    "Der Moment davor",
    "Klarflow · Tag 2",
    `
    <p>Hallo,</p>

    <p>
      gestern hast du etwas bei dir klar gesehen.
    </p>

    ${insightBlock(insight)}

    <p>
      Heute geht es nicht darum, etwas zu ändern.
    </p>

    <p>
      Nur darum, den Moment <strong>bevor</strong> du automatisch reagierst, etwas früher zu bemerken.
    </p>

    ${darkBlock(
      "Für heute reicht eine Sekunde.",
      "Wenn dieser Moment heute kommt, halte kurz inne. Mehr ist nicht nötig."
    )}
    `
  );
}

function buildEmailDay3(insight: string) {
  return emailShell(
    "Du musst das nicht perfekt machen",
    "Klarflow · Tag 3",
    `
    <p>Hallo,</p>

    <p>
      du hast bereits erkannt, dass dein Verhalten nicht zufällig ist.
    </p>

    ${insightBlock(insight)}

    <p>
      Veränderung beginnt nicht mit Perfektion.
    </p>

    <p>
      Sie beginnt mit einem einzigen bewussten Moment.
    </p>

    ${darkBlock(
      "Wenn du zurückfällst, ist das kein Scheitern.",
      "Es ist Teil des Weges. Komm einfach wieder zurück — ruhig, ohne Druck."
    )}
    `
  );
}

function buildEmailDay7(insight: string) {
  return emailShell(
    "Was sich verändert, wenn du hinschaust",
    "Klarflow · Tag 7",
    `
    <p>Hallo,</p>

    <p>
      vor einigen Tagen hast du dir einen Moment genommen, um ehrlich auf dein Muster zu schauen.
    </p>

    ${insightBlock(insight)}

    <p>
      Vielleicht hat sich seitdem schon etwas gezeigt. Vielleicht auch noch nicht.
    </p>

    <p>
      Beides ist in Ordnung.
    </p>

    <p>
      Veränderung beginnt oft nicht sichtbar. Sie beginnt in dem Moment,
      in dem du etwas nicht mehr völlig automatisch tust.
    </p>

    ${darkBlock(
      "Eine Frage für heute:",
      "Was ist der eine Moment, in dem ich heute kurz wach bleiben kann?"
    )}
    `
  );
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
        subject: "Der Moment davor",
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
        subject: "Du musst das nicht perfekt machen",
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
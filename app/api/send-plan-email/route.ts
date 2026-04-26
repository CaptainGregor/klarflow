import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getNextStep(readiness: string) {
  if (readiness === "Ich denke darüber nach") {
    return `
      Du musst noch nichts verändern.<br/>
      Nimm heute nur einen Moment wahr, in dem dieses Muster auftaucht.
    `;
  }

  if (readiness === "Ich will kleine Schritte gehen") {
    return `
      Beobachte heute einen Moment bewusst — und pausiere kurz davor.<br/>
      Kein Druck, nur ein kleines Innehalten.
    `;
  }

  if (readiness === "Ich bin bereit, ernsthaft anzusetzen") {
    return `
      Setze dir heute einen klaren Moment, in dem du bewusst unterbrichst.<br/>
      Entscheide dich aktiv anders — auch wenn es sich ungewohnt anfühlt.
    `;
  }

  if (readiness === "Ich will jetzt einen echten Wandel") {
    return `
      Triff heute eine klare Entscheidung:<br/>
      In einem Moment handelst du bewusst anders — egal wie stark das Muster ist.
    `;
  }

  return `
    Beobachte heute nur einen einzigen Moment ganz bewusst.<br/>
    Noch nichts ändern. Nur erkennen.
  `;
}

function getMotivationBlock(readiness: string) {
  if (readiness === "Ich denke darüber nach") {
    return `
      Du bist gerade am Anfang — und das ist völlig in Ordnung.<br/>
      Veränderung beginnt nicht mit Aktion, sondern mit Ehrlichkeit.
    `;
  }

  if (readiness === "Ich will kleine Schritte gehen") {
    return `
      Du hast dich bereits innerlich bewegt.<br/>
      Kleine Schritte sind oft die stärksten — wenn sie bewusst sind.
    `;
  }

  if (readiness === "Ich bin bereit, ernsthaft anzusetzen") {
    return `
      Du hast eine klare Entscheidung getroffen.<br/>
      Genau daraus entsteht echte Veränderung.
    `;
  }

  if (readiness === "Ich will jetzt einen echten Wandel") {
    return `
      Das ist ein kraftvoller Moment.<br/>
      Wichtig ist jetzt nicht Perfektion — sondern bewusste Handlung.
    `;
  }

  return `
    Ein erster bewusster Moment reicht völlig aus.
  `;
}

function buildEmailHtml(insight: string, readiness: string, email: string) {
  const formattedInsight = insight.replace(/\n/g, "<br />");
  const nextStep = getNextStep(readiness);
  const motivation = getMotivationBlock(readiness);

  const returnUrl = `https://klarflow.vercel.app?returning=true&email=${encodeURIComponent(
    email
  )}`;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.65; color: #171717; max-width: 640px; margin: 0 auto; padding: 28px;">
      <p style="font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #08a99d; font-weight: 700;">
        Klarflow Report
      </p>

      <h1 style="font-size: 30px; line-height: 1.2; margin: 12px 0 18px;">
        Du hast ein Muster sichtbar gemacht.
      </h1>

      <p>Hallo,</p>

      <p>
        danke für deine Offenheit. Du hast dir gerade einen Moment genommen,
        um ehrlich hinzuschauen — und genau dort beginnt Veränderung.
      </p>

      <div style="background: #f2fbfa; border-radius: 22px; padding: 22px; margin: 26px 0;">
        <p style="font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: #08a99d; font-weight: 700; margin-top: 0;">
          Was wir erkennen
        </p>

        <p style="margin-bottom: 0;">
          ${formattedInsight}
        </p>
      </div>

      <h2 style="font-size: 20px; margin-top: 30px;">
        Was dir jetzt helfen kann
      </h2>

      <p>${motivation}</p>

      <h2 style="font-size: 20px; margin-top: 30px;">
        Dein nächster Schritt
      </h2>

      <p>${nextStep}</p>

      <div style="background: #171717; color: #ffffff; border-radius: 22px; padding: 22px; margin-top: 30px;">
        <p style="margin-top: 0; font-weight: 700;">
          Du musst das nicht perfekt machen.
        </p>

        <p style="margin-bottom: 16px; color: #d4d4d4;">
          Ein einziger bewusster Moment kann bereits etwas verändern.
        </p>

        <p style="margin-bottom: 16px; color: #d4d4d4;">
          Es gibt einen Moment, den du heute noch sehen kannst.
        </p>

        <a href="${returnUrl}"
           style="display:inline-block; padding:12px 20px; background:#ffffff; color:#171717; text-decoration:none; border-radius:12px; font-weight:600;">
           Nimm dir jetzt 1 Minute für dich
        </a>
      </div>

      <p style="margin-top: 34px;">
        — Klarflow
      </p>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, insight, readiness } = body;

    if (!email || !insight) {
      return Response.json(
        { error: "E-Mail oder Insight fehlt." },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "Klarflow <hello@klarflow.de>",
      to: email,
      subject: "Dein Klarflow Report",
      html: buildEmailHtml(insight, readiness || "", email),
    });

    return Response.json({ success: true, result });
  } catch (error) {
    console.error("Email send error:", error);

    return Response.json(
      { error: "Fehler beim Senden der E-Mail." },
      { status: 500 }
    );
  }
}
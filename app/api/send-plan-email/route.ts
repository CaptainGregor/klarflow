import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Build the email HTML
function buildEmailHtml(insight: string) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 640px; margin: 0 auto; padding: 24px;">
      
      <h2 style="margin-bottom: 16px;">Dein persönlicher erster Schritt</h2>

      <p>Hallo,</p>

      <p>danke für deine Offenheit.</p>

      <p>
        Du hast heute bereits etwas Wichtiges getan: Du hast ehrlich hingeschaut.
        Genau dort beginnt Veränderung.
      </p>

      <h3 style="margin-top: 24px;">Was wir bei dir erkennen</h3>
      <p>${insight.replace(/\n/g, "<br />")}</p>

      <h3 style="margin-top: 24px;">Was dir jetzt helfen kann</h3>
      <p>
        Nicht Druck. Nicht Perfektion.<br/>
        Sondern ein bewusster Moment, bevor du automatisch handelst.
      </p>

      <h3 style="margin-top: 24px;">Dein nächster kleiner Schritt</h3>
      <p>
        Beobachte heute nur einen einzigen Moment ganz bewusst, bevor du zum Handy greifst
        oder in ein automatisches Muster rutschst.
        <br/><br/>
        Noch nichts ändern. Nur erkennen.
      </p>

      <p>
        Du musst das nicht perfekt machen.<br/>
        Ein erster bewusster Moment ist bereits ein Fortschritt.
      </p>

      <p style="margin-top: 32px;">Alles Gute</p>

    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, insight } = body;

    if (!email || !insight) {
      return Response.json(
        { error: "E-Mail oder Insight fehlt." },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "Klarflow <hello@klarflow.de>",
      to: email,
      subject: "Dein persönlicher erster Schritt",
      html: buildEmailHtml(insight),
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
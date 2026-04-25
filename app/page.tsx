"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

function generateInsight(answers: string[]) {
  let trigger = "";
  let feeling = "";
  let control = "";

  if (answers.includes("Stress oder Überforderung")) {
    trigger = "Stress";
  } else if (answers.includes("Langeweile")) {
    trigger = "Langeweile";
  } else if (answers.includes("Einsamkeit")) {
    trigger = "Einsamkeit";
  } else {
    trigger = "Gewohnheit";
  }

  if (answers.includes("Leer oder erschöpft")) {
    feeling = "erschöpft und leer";
  } else if (answers.includes("Schuldig oder frustriert")) {
    feeling = "frustriert oder schuldig";
  } else {
    feeling = "unzufrieden";
  }

  if (answers.includes("Ich verliere komplett das Zeitgefühl")) {
    control = "starken Kontrollverlust";
  } else if (answers.includes("Oft länger als geplant")) {
    control = "teilweisen Kontrollverlust";
  } else {
    control = "ein erstes Muster";
  }

  return `Du hast beschrieben, dass ${trigger} ein häufiger Auslöser für dich ist und du dich danach oft ${feeling} fühlst. Gleichzeitig zeigt sich ${control}, was darauf hinweist, dass dieses Muster bereits tiefer verankert ist.

Die gute Nachricht: Genau diese Klarheit ist der erste Schritt, um bewusst etwas zu verändern.`;
}

function generateEmailPreview(answers: string[]) {
  return `Hallo,

danke für deine Offenheit.

Du hast heute bereits etwas Wichtiges getan: Du hast ehrlich hingeschaut. Genau dort beginnt Veränderung.

Was wir bei dir erkennen:
${generateInsight(answers)}

Was dir jetzt helfen kann:
Nicht Druck. Nicht Perfektion.
Sondern ein bewusster Moment, bevor du automatisch handelst.

Dein nächster kleiner Schritt für heute:
Beobachte heute nur einen einzigen Moment ganz bewusst, bevor du zum Handy greifst oder in ein automatisches Muster rutschst. Noch nichts bekämpfen. Nur erkennen.

Du musst das nicht perfekt machen.
Ein erster bewusster Moment ist bereits ein Fortschritt.

Alles Gute`;
}

const visuals = [
  "/focus.png",
  "/stress.png",
  "/impact.png",
  "/goal.png",
  "/focus.png",
  "/stress.png",
  "/impact.png",
  "/goal.png",
  "/focus.png",
  "/goal.png",
];

const steps = [
  {
    question: "Wann merkst du am häufigsten, dass du dich verlierst?",
    options: [
      "Abends im Bett",
      "Wenn ich alleine bin",
      "Bei Stress oder Druck",
      "Eigentlich über den ganzen Tag verteilt",
    ],
  },
  {
    question: "Wie bewusst ist dir dieser Moment, wenn es passiert?",
    options: [
      "Ich merke es kaum",
      "Ich merke es, aber mache weiter",
      "Ich bin mir bewusst, aber fühle mich machtlos",
      "Ich will stoppen, schaffe es aber nicht",
    ],
  },
  {
    question: "Was ist meistens der Auslöser?",
    options: [
      "Langeweile",
      "Stress oder Überforderung",
      "Einsamkeit",
      "Gewohnheit / Automatismus",
    ],
  },
  {
    question: "Wie lange bleibst du typischerweise darin?",
    options: [
      "Nur ein paar Minuten",
      "Oft länger als geplant",
      "Manchmal mehrere Stunden",
      "Ich verliere komplett das Zeitgefühl",
    ],
  },
  {
    question: "Wie fühlst du dich danach?",
    options: [
      "Neutral",
      "Leicht unzufrieden",
      "Schuldig oder frustriert",
      "Leer oder erschöpft",
    ],
  },
  {
    question: "Wie sehr beeinflusst das deinen Alltag?",
    options: [
      "Kaum",
      "Ein bisschen",
      "Spürbar",
      "Es belastet mich deutlich",
    ],
  },
  {
    question: "Hast du schon versucht, etwas daran zu ändern?",
    options: [
      "Noch nicht",
      "Ein paar Mal",
      "Mehrfach, aber ohne Erfolg",
      "Ich versuche es ständig",
    ],
  },
  {
    question: "Was hält dich am meisten davon ab, wirklich auszubrechen?",
    options: [
      "Ich weiß nicht wie",
      "Mir fehlt die Disziplin",
      "Es ist zu tief Gewohnheit",
      "Ich fühle mich allein damit",
    ],
  },
  {
    question: "Was würdest du dir stattdessen wünschen?",
    options: [
      "Mehr Kontrolle",
      "Mehr Fokus",
      "Mehr Energie",
      "Innere Ruhe",
    ],
  },
  {
    question: "Wie bereit bist du, wirklich etwas zu verändern?",
    options: [
      "Ich denke darüber nach",
      "Ich will kleine Schritte gehen",
      "Ich bin bereit, ernsthaft anzusetzen",
      "Ich will jetzt einen echten Wandel",
    ],
  },
];

const feedbackMap: Record<string, string> = {
  "Abends im Bett": "Viele erleben genau dann die größte Unruhe.",
  "Wenn ich alleine bin": "Alleinsein kann ein starker Auslöser sein.",
  "Bei Stress oder Druck": "Stress ist einer der häufigsten Auslöser.",
  "Eigentlich über den ganzen Tag verteilt":
    "Das zeigt, wie automatisiert es geworden ist.",

  "Ich merke es kaum": "Auch das ist wichtig zu bemerken.",
  "Ich merke es, aber mache weiter":
    "Dieses Muster kennen viele sehr gut.",
  "Ich bin mir bewusst, aber fühle mich machtlos":
    "Allein das so klar zu erkennen, ist ein wichtiger Schritt.",
  "Ich will stoppen, schaffe es aber nicht":
    "Das ist ein sehr ehrlicher und wichtiger Punkt.",

  Langeweile: "Langeweile kann stärker sein, als man denkt.",
  "Stress oder Überforderung": "Stress ist einer der häufigsten Auslöser.",
  Einsamkeit: "Einsamkeit kann Verhalten stark beeinflussen.",
  "Gewohnheit / Automatismus":
    "Gewohnheiten wirken oft tiefer, als man zuerst denkt.",

  "Nur ein paar Minuten": "Auch kurze Momente können Teil eines Musters sein.",
  "Oft länger als geplant":
    "Das deutet auf einen ersten Kontrollverlust hin.",
  "Manchmal mehrere Stunden":
    "Dann lohnt es sich, genauer hinzusehen.",
  "Ich verliere komplett das Zeitgefühl":
    "Dann ist es gut, dass du hier bist.",

  Neutral: "Auch Neutralität kann Teil eines Musters sein.",
  "Leicht unzufrieden":
    "Dieses Gefühl ist oft der erste wichtige Hinweis.",
  "Schuldig oder frustriert":
    "Das ist ein ehrlicher Punkt. Viele fühlen das ähnlich.",
  "Leer oder erschöpft":
    "Das zeigt, dass dich das innerlich bereits Kraft kostet.",

  Kaum: "Gut, dass du trotzdem bewusst hinschaust.",
  "Ein bisschen": "Solche Muster beginnen oft schleichend.",
  Spürbar: "Dann lohnt es sich, genauer hinzusehen.",
  "Es belastet mich deutlich": "Dann ist es gut, dass du hier bist.",

  "Noch nicht": "Bewusst hinzusehen ist ein guter Anfang.",
  "Ein paar Mal": "Das zeigt, dass du Veränderung bereits willst.",
  "Mehrfach, aber ohne Erfolg":
    "Viele scheitern nicht am Willen, sondern am fehlenden System.",
  "Ich versuche es ständig":
    "Das zeigt, wie wichtig dir Veränderung wirklich ist.",

  "Ich weiß nicht wie":
    "Klarheit über den Weg ist oft der erste Durchbruch.",
  "Mir fehlt die Disziplin":
    "Es geht oft weniger um Disziplin als um Muster.",
  "Es ist zu tief Gewohnheit":
    "Tiefe Gewohnheiten brauchen sanfte, klare Unterbrechungen.",
  "Ich fühle mich allein damit":
    "Sich damit allein zu fühlen, ist belastend – und sehr menschlich.",

  "Mehr Kontrolle": "Das ist ein starkes und gesundes Ziel.",
  "Mehr Fokus": "Ein klarer Kopf verändert oft sehr viel.",
  "Mehr Energie": "Energie kehrt oft mit kleinen Veränderungen zurück.",
  "Innere Ruhe": "Innere Ruhe ist ein wertvoller Ausgangspunkt.",

  "Ich denke darüber nach":
    "Schon das ist ein wichtiger erster innerer Schritt.",
  "Ich will kleine Schritte gehen":
    "Kleine Schritte sind oft die nachhaltigsten.",
  "Ich bin bereit, ernsthaft anzusetzen":
    "Diese Klarheit kann sehr viel verändern.",
  "Ich will jetzt einen echten Wandel":
    "Das ist ein kraftvoller Moment der Entscheidung.",
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleAnswer = (answer: string) => {
    const updated = [...answers, answer];
    setAnswers(updated);
    setFeedback(feedbackMap[answer] || "Danke für deine Ehrlichkeit.");

    setTimeout(() => {
      setFeedback(null);

      if (step + 1 < steps.length) {
        setStep(step + 1);
      } else {
        setDone(true);
      }
    }, 1200);
  };

const handleEmailSave = async () => {
  const trimmed = email.trim();
  const insight = generateInsight(answers);

  if (!trimmed) {
    setEmailError("Bitte gib deine E-Mail-Adresse ein.");
    setEmailSaved(false);
    return;
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

  if (!isValidEmail) {
    setEmailError("Bitte gib eine gültige E-Mail-Adresse ein.");
    setEmailSaved(false);
    return;
  }

  const { error: dbError } = await supabase.from("leads").insert([
    {
      email: trimmed,
      answers: JSON.stringify(answers),
      insight,
    },
  ]);

  if (dbError) {
    console.error("Supabase insert error:", dbError);
    setEmailError(`Fehler beim Speichern: ${dbError.message}`);
    setEmailSaved(false);
    return;
  }

  const emailResponse = await fetch("/api/send-plan-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: trimmed,
      insight,
    }),
  });

  if (!emailResponse.ok) {
    const emailData = await emailResponse.json().catch(() => null);
    setEmailError(
      emailData?.error ||
        "Der Plan wurde gespeichert, aber die E-Mail konnte nicht gesendet werden."
    );
    setEmailSaved(false);
    return;
  }

  setEmailError("");
  setEmailSaved(true);
  setEmail("");
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-neutral-200">
          {!done ? (
            <>
              <div className="mb-6">
                <img
                  src={visuals[step]}
                  className="w-full h-40 object-cover rounded-2xl mb-6"
                  alt="Illustration zur aktuellen Frage"
                />

                <h1 className="text-2xl font-semibold text-neutral-800 leading-snug text-center">
                  {steps[step].question}
                </h1>
              </div>

              <div className="space-y-4">
                {steps[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="w-full py-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 transition text-neutral-700 text-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {feedback && (
                <p className="text-sm text-neutral-500 text-center mt-4">
                  {feedback}
                </p>
              )}

              <p className="text-xs text-neutral-400 mt-8 text-center">
                Schritt {step + 1} von {steps.length}
              </p>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
                  Dein persönlicher Überblick
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">
                  {generateInsight(answers)}
                </p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <h3 className="text-neutral-800 font-medium mb-2">
                  Was wir erkennen
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Dein Verhalten scheint nicht zufällig zu sein, sondern mit
                  klaren Auslösern und wiederkehrenden Mustern verbunden.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <h3 className="text-neutral-800 font-medium mb-2">
                  Was dir jetzt helfen kann
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Der wichtigste nächste Schritt ist nicht Härte gegen dich
                  selbst, sondern mehr Bewusstheit im richtigen Moment.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <h3 className="text-neutral-800 font-medium mb-2">
                  Dein nächster kleiner Schritt
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Beobachte heute nur einen einzigen Moment ganz bewusst, bevor
                  du automatisch zum Handy greifst. Noch nichts ändern. Nur
                  erkennen.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
                <h3 className="text-neutral-800 font-medium mb-2 text-center">
                  Möchtest du deinen persönlichen Plan speichern?
                </h3>

                <p className="text-neutral-600 text-sm leading-relaxed text-center mb-4">
                  Wenn du möchtest, senden wir dir deinen Überblick und die
                  nächsten Schritte per E-Mail. Ohne Druck. Du kannst dich
                  jederzeit wieder abmelden.
                </p>

                <input
                  type="email"
                  placeholder="Deine E-Mail-Adresse"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                    if (emailSaved) setEmailSaved(false);
                  }}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-800 outline-none focus:border-neutral-500"
                />

                <button
                  onClick={handleEmailSave}
                  className="w-full mt-3 py-3 bg-neutral-900 text-white rounded-xl"
                >
                  Plan per E-Mail speichern
                </button>

                <button className="w-full mt-3 py-3 bg-transparent text-neutral-500 rounded-xl border border-transparent hover:text-neutral-700">
                  Erst einmal ohne weiter
                </button>

                {emailError && (
                  <p className="text-sm text-red-600 text-center mt-3">
                    {emailError}
                  </p>
                )}

                {emailSaved && (
                  <p className="text-sm text-green-700 text-center mt-3">
                    Danke. Dein Plan wurde gespeichert.
                  </p>
                )}

                <p className="text-xs text-neutral-400 text-center mt-4">
                  Wir behandeln deine Angaben vertraulich.
                </p>
              </div>

              {emailSaved && (
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                  <h3 className="text-neutral-800 font-medium mb-3">
                    Vorschau deiner E-Mail
                  </h3>

                  <div className="bg-white rounded-xl border border-neutral-200 p-4">
                    <p className="text-sm text-neutral-500 mb-2">
                      Betreff: Dein persönlicher erster Schritt
                    </p>

                    <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                      {generateEmailPreview(answers)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
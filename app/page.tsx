"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { AnimatePresence, motion } from "framer-motion";

function generateInsight(answers: string[]) {
  let trigger = "";
  let feeling = "";
  let control = "";

  if (answers.includes("Stress oder Überforderung")) trigger = "Stress";
  else if (answers.includes("Langeweile")) trigger = "Langeweile";
  else if (answers.includes("Einsamkeit")) trigger = "Einsamkeit";
  else trigger = "Gewohnheit";

  if (answers.includes("Leer oder erschöpft")) feeling = "erschöpft und leer";
  else if (answers.includes("Schuldig oder frustriert"))
    feeling = "frustriert oder schuldig";
  else feeling = "unzufrieden";

  if (answers.includes("Ich verliere komplett das Zeitgefühl"))
    control = "starken Kontrollverlust";
  else if (answers.includes("Oft länger als geplant"))
    control = "teilweisen Kontrollverlust";
  else control = "ein erstes Muster";

  return `Du hast beschrieben, dass ${trigger} ein häufiger Auslöser für dich ist und du dich danach oft ${feeling} fühlst. Gleichzeitig zeigt sich ${control}, was darauf hinweist, dass dieses Muster bereits tiefer verankert ist.

Die gute Nachricht: Genau diese Klarheit ist der erste Schritt, um bewusst etwas zu verändern.`;
}

function generateCheckpointFeedback(recentAnswers: string[]) {
  if (recentAnswers.includes("Stress oder Überforderung")) {
    return "Du erkennst bereits sehr klar, dass Stress eine wichtige Rolle spielt. Das ist kein kleiner Punkt — genau diese Klarheit kann der Anfang von echter Veränderung sein.";
  }

  if (recentAnswers.includes("Einsamkeit")) {
    return "Du hast ehrlich benannt, dass Alleinsein oder innere Leere eine Rolle spielen kann. Das braucht Mut — und genau dadurch wird Veränderung greifbarer.";
  }

  if (recentAnswers.includes("Ich verliere komplett das Zeitgefühl")) {
    return "Du hast ein starkes Muster erkannt: Es geht nicht nur um eine einzelne Handlung, sondern um Momente, in denen du dich selbst verlierst. Das zu sehen ist ein wichtiger Schritt.";
  }

  if (
    recentAnswers.includes("Ich bin mir bewusst, aber fühle mich machtlos") ||
    recentAnswers.includes("Ich will stoppen, schaffe es aber nicht")
  ) {
    return "Du hast sehr ehrlich beschrieben, dass ein Teil von dir es bemerkt — und trotzdem nicht leicht herauskommt. Genau diese Ehrlichkeit ist wichtig, weil Veränderung nicht mit Druck beginnt, sondern mit Bewusstheit.";
  }

  return "Du hast bereits mehrere wichtige Hinweise über dich gesammelt. Aus einzelnen Antworten entsteht langsam ein klares Bild — und genau das macht Veränderung möglich.";
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
    question: "In welchen Momenten merkst du, dass du dich ein wenig verlierst?",
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
    options: ["Kaum", "Ein bisschen", "Spürbar", "Es belastet mich deutlich"],
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
    options: ["Mehr Kontrolle", "Mehr Fokus", "Mehr Energie", "Innere Ruhe"],
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

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [checkpointFeedback, setCheckpointFeedback] = useState<string | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleAnswer = (answer: string) => {
    const updated = [...answers, answer];
    setAnswers(updated);

    const answeredCount = updated.length;

    if (answeredCount === 5) {
      const recentAnswers = updated.slice(-5);
      setCheckpointFeedback(generateCheckpointFeedback(recentAnswers));
      return;
    }

    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const handleCheckpointContinue = () => {
    setCheckpointFeedback(null);

    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
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
      setEmailError(`Fehler beim Speichern: ${dbError.message}`);
      setEmailSaved(false);
      return;
    }

const emailResponse = await fetch("/api/send-plan-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: trimmed,
    insight,
    readiness: answers[answers.length - 1],
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
    <main className="min-h-screen bg-white px-5 text-neutral-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col">
        <header className="flex h-20 items-center justify-center border-b border-neutral-100">
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">klarflow</p>
            <p className="mt-1 text-xs text-neutral-400">
              Ein ruhiger Moment, um dich selbst besser zu verstehen.
            </p>
          </div>
        </header>

        {!done ? (
          <section className="flex flex-1 flex-col pt-8 md:pt-12">
            <div className="mb-12">
              <div className="h-1 w-full rounded-full bg-neutral-100">
                <div
                  className="h-1 rounded-full bg-[#08a99d] transition-all duration-500"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>

              <div className="mt-3 flex justify-end text-sm font-medium text-neutral-400">
                {Math.min(step + 1, steps.length)} / {steps.length}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {checkpointFeedback ? (
                <motion.div
                  key="checkpoint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center text-center"
                >
                  <div className="rounded-[2rem] bg-[#f2fbfa] px-8 py-10 shadow-sm">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#08a99d]">
                      Kurzer Zwischenstand
                    </p>

                    <p className="text-xl font-semibold leading-relaxed text-neutral-900 md:text-2xl">
                      {checkpointFeedback}
                    </p>

                    <button
                      onClick={handleCheckpointContinue}
                      className="mt-8 rounded-2xl bg-neutral-950 px-8 py-4 font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                    >
                      Weiter
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="mx-auto w-full max-w-3xl text-center"
                >
                  <img
                    src={visuals[step]}
                    className="mx-auto mb-8 h-36 w-36 rounded-3xl object-cover md:h-44 md:w-44"
                    alt="Illustration zur aktuellen Frage"
                  />

                  <h1 className="mx-auto max-w-2xl text-[28px] font-bold leading-tight tracking-tight md:text-4xl">
                    {steps[step].question}
                  </h1>

                  <p className="mt-3 text-sm text-neutral-400">
                    Wähle die Antwort, die sich für dich am ehrlichsten anfühlt.
                  </p>

                  <div className="mx-auto mt-10 grid w-full max-w-2xl gap-4">
                    {steps[step].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="w-full rounded-2xl bg-neutral-100 px-7 py-5 text-left text-lg font-semibold text-neutral-900 transition-all duration-200 hover:scale-[1.01] hover:bg-neutral-200 active:scale-[0.98]"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        ) : (
          <section className="mx-auto w-full max-w-3xl flex-1 py-12">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold tracking-tight">
                Dein persönlicher Überblick
              </h2>
              <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-neutral-600">
                {generateInsight(answers)}
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              <div className="rounded-3xl bg-neutral-100 p-6">
                <h3 className="text-lg font-bold">Was wir erkennen</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  Dein Verhalten scheint nicht zufällig zu sein, sondern mit
                  klaren Auslösern und wiederkehrenden Mustern verbunden.
                </p>
              </div>

              <div className="rounded-3xl bg-neutral-100 p-6">
                <h3 className="text-lg font-bold">Was dir jetzt helfen kann</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  Der wichtigste nächste Schritt ist nicht Härte gegen dich
                  selbst, sondern mehr Bewusstheit im richtigen Moment.
                </p>
              </div>

              <div className="rounded-3xl bg-neutral-100 p-6">
                <h3 className="text-lg font-bold">
                  Dein nächster kleiner Schritt
                </h3>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  Beobachte heute nur einen einzigen Moment ganz bewusst, bevor
                  du automatisch zum Handy greifst. Noch nichts ändern. Nur
                  erkennen.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-neutral-950 p-7 text-white">
              <h3 className="text-center text-2xl font-extrabold">
                Möchtest du diesen Moment nicht verlieren?
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-center leading-relaxed text-neutral-300">
                Du hast gerade etwas bei dir erkannt, das im Alltag oft
                untergeht. Wenn du möchtest, senden wir dir deinen persönlichen
                Überblick und die nächsten Schritte per E-Mail.
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
                className="mt-6 w-full rounded-2xl border border-white/20 bg-white px-5 py-4 text-neutral-900 outline-none"
              />

              <button
                onClick={handleEmailSave}
                className="mt-4 w-full rounded-2xl bg-[#4b28e8] py-4 font-bold text-white transition hover:bg-[#3d20c7]"
              >
                Moment speichern
              </button>

              <button className="mt-3 w-full rounded-2xl py-3 text-sm text-neutral-400 hover:text-white">
                Erst einmal ohne weiter
              </button>

              {emailError && (
                <p className="mt-3 text-center text-sm text-red-300">
                  {emailError}
                </p>
              )}

              {emailSaved && (
                <p className="mt-3 text-center text-sm text-emerald-300">
                  Dein Moment wurde gespeichert.
                </p>
              )}

              <p className="mt-5 text-center text-xs text-neutral-500">
                Wir behandeln deine Angaben vertraulich.
              </p>
            </div>

            {emailSaved && (
              <div className="mt-6 rounded-3xl bg-neutral-100 p-6">
                <h3 className="mb-3 text-lg font-bold">
                  Vorschau deiner E-Mail
                </h3>

                <div className="rounded-2xl bg-white p-5">
                  <p className="mb-3 text-sm text-neutral-500">
                    Betreff: Dein persönlicher erster Schritt
                  </p>

                  <div className="whitespace-pre-line leading-relaxed text-neutral-700">
                    {generateEmailPreview(answers)}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
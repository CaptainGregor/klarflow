"use client";

import { useEffect, useState } from "react";
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

function generatePatternTitle(answers: string[]) {
  if (answers.includes("Stress oder Überforderung")) {
    return "Stress als zentraler Auslöser";
  }

  if (answers.includes("Einsamkeit")) {
    return "Alleinsein als emotionaler Auslöser";
  }

  if (answers.includes("Langeweile")) {
    return "Langeweile als wiederkehrender Auslöser";
  }

  if (answers.includes("Gewohnheit / Automatismus")) {
    return "Ein automatisiertes Gewohnheitsmuster";
  }

  return "Ein wiederkehrendes Muster";
}

function generateNextStep(answers: string[]) {
  const readiness = answers[answers.length - 1];

  if (readiness === "Ich denke darüber nach") {
    return "Du musst heute noch nichts verändern. Nimm nur einen Moment wahr, in dem dieses Muster auftaucht.";
  }

  if (readiness === "Ich will kleine Schritte gehen") {
    return "Beobachte heute einen Moment bewusst — und pausiere kurz davor. Kein Druck, nur ein kleines Innehalten.";
  }

  if (readiness === "Ich bin bereit, ernsthaft anzusetzen") {
    return "Setze dir heute einen klaren Moment, in dem du bewusst unterbrichst. Entscheide dich aktiv anders — auch wenn es sich ungewohnt anfühlt.";
  }

  if (readiness === "Ich will jetzt einen echten Wandel") {
    return "Triff heute eine klare Entscheidung: In einem Moment handelst du bewusst anders — egal wie stark das Muster ist.";
  }

  return "Beobachte heute nur einen einzigen Moment ganz bewusst. Noch nichts ändern. Nur erkennen.";
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
${generateNextStep(answers)}

Du musst das nicht perfekt machen.
Ein erster bewusster Moment ist bereits ein Fortschritt.

Alles Gute`;
}

function generateReturningReflection(answers: string[]) {
  if (answers.includes("Ich war bewusster als sonst")) {
    return "Das ist ein sehr wichtiger Fortschritt. Bewusstheit ist oft der erste echte Abstand zwischen dir und dem alten Muster.";
  }

  if (answers.includes("Ich bin wieder automatisch reingerutscht")) {
    return "Das ist kein Rückschritt. Es zeigt nur, dass das Muster noch stark ist. Wichtig ist: Du bist zurückgekommen und schaust wieder hin.";
  }

  if (answers.includes("Stress")) {
    return "Heute scheint Stress wieder eine Rolle zu spielen. Dein Ziel ist nicht, ihn wegzudrücken — sondern ihn etwas früher zu bemerken.";
  }

  if (answers.includes("Ruhe")) {
    return "Du sehnst dich gerade nach mehr Ruhe. Für heute reicht ein kleiner Moment, in dem du nichts optimierst und nur kurz bei dir bleibst.";
  }

  return "Du hast heute wieder kurz innegehalten. Genau solche kleinen Check-ins machen Veränderung greifbarer.";
}
function getInterventionContent(answers: string[]) {
  const trigger = answers[1];

  if (trigger === "Stress") {
    return {
      label: "Stress erkannt",
      title: "Erst den Druck senken.",
      body: "Bevor du weitermachst — nimm dir 10 Sekunden.",
      instruction: "Löse kurz deine Schultern. Atme einmal langsam aus.",
      button: "Ich bin wieder da",
    };
  }

  if (trigger === "Langeweile") {
    return {
      label: "Langeweile erkannt",
      title: "Nicht sofort füllen.",
      body: "Bevor du automatisch weitermachst — bleib kurz bei diesem leeren Moment.",
      instruction: "Schau dich im Raum um und benenne still drei Dinge, die du siehst.",
      button: "Weiter",
    };
  }

  if (trigger === "Alleinsein") {
    return {
      label: "Alleinsein erkannt",
      title: "Kurz Verbindung spüren.",
      body: "Bevor du dich weiter zurückziehst — komm für einen Moment zurück in deinen Körper.",
      instruction: "Lege eine Hand auf deinen Brustkorb und atme einmal ruhig ein und aus.",
      button: "Ich bin hier",
    };
  }

  if (trigger === "Gewohnheit") {
    return {
      label: "Gewohnheit erkannt",
      title: "Unterbrich den Autopilot.",
      body: "Bevor das Muster übernimmt — mach eine kleine bewusste Unterbrechung.",
      instruction: "Stell beide Füße auf den Boden und sag innerlich: Nicht automatisch.",
      button: "Bewusst weiter",
    };
  }

  return {
    label: "Kurzer Moment",
    title: "Stop.",
    body: "Bevor du weitermachst — nimm dir 10 Sekunden.",
    instruction: "Schau kurz weg vom Bildschirm. Atme einmal ruhig ein und aus.",
    button: "Weiter",
  };
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
  helper: "Es gibt keine falsche Antwort. Wähle einfach, was sich am vertrautesten anfühlt.",
  options: [
    "Abends im Bett",
    "Wenn ich alleine bin",
    "Bei Stress oder Druck",
    "Eigentlich über den ganzen Tag verteilt",
  ],
},
{
  question: "Wie bewusst ist dir dieser Moment, wenn es passiert?",
  helper: "Wichtig ist nicht, perfekt zu beschreiben — sondern ehrlich zu bemerken.",
  options: [
      "Ich merke es kaum",
      "Ich merke es, aber mache weiter",
      "Ich bin mir bewusst, aber fühle mich machtlos",
      "Ich will stoppen, schaffe es aber nicht",
    ],
  },
{
  question: "Was ist meistens der Auslöser?",
  helper: "Oft steckt hinter dem Verhalten ein Auslöser. Schau nur, was am ehesten passt.",
  options: [
      "Langeweile",
      "Stress oder Überforderung",
      "Einsamkeit",
      "Gewohnheit / Automatismus",
    ],
  },
 {
  question: "Wie lange bleibst du typischerweise darin?",
  helper: "Es geht nicht um Schuld. Nur darum, wie stark der Moment dich mitnimmt.",
  options: [
      "Nur ein paar Minuten",
      "Oft länger als geplant",
      "Manchmal mehrere Stunden",
      "Ich verliere komplett das Zeitgefühl",
    ],
  },
{
  question: "Wie fühlst du dich danach?",
  helper: "Wähle nicht die Antwort, die besser klingt — sondern die, die näher dran ist.",
  options: [
      "Neutral",
      "Leicht unzufrieden",
      "Schuldig oder frustriert",
      "Leer oder erschöpft",
    ],
  },
{
  question: "Wie sehr beeinflusst das deinen Alltag?",
  helper: "Manchmal wirkt ein Muster leise. Manchmal deutlich. Beides darf sein.",
  options: ["Kaum", "Ein bisschen", "Spürbar", "Es belastet mich deutlich"],
  },
{
  question: "Hast du schon versucht, etwas daran zu ändern?",
  helper: "Auch frühere Versuche zählen. Sie zeigen, dass ein Teil von dir bereits hinschaut.",
  options: [
      "Noch nicht",
      "Ein paar Mal",
      "Mehrfach, aber ohne Erfolg",
      "Ich versuche es ständig",
    ],
  },
{
  question: "Was hält dich am meisten davon ab, wirklich auszubrechen?",
  helper: "Das Hindernis ist kein Charakterfehler. Es zeigt nur, wo Unterstützung fehlt.",
  options: [
      "Ich weiß nicht wie",
      "Mir fehlt die Disziplin",
      "Es ist zu tief Gewohnheit",
      "Ich fühle mich allein damit",
    ],
  },
{
  question: "Was würdest du dir stattdessen wünschen?",
  helper: "Dein Wunsch zeigt, in welche Richtung dein System eigentlich will.",
  options: ["Mehr Kontrolle", "Mehr Fokus", "Mehr Energie", "Innere Ruhe"],
  },
 {
  question: "Wie bereit bist du, wirklich etwas zu verändern?",
  helper: "Es geht nicht um Druck. Nur darum, wie viel Veränderung sich gerade möglich anfühlt.",
  options: [
      "Ich denke darüber nach",
      "Ich will kleine Schritte gehen",
      "Ich bin bereit, ernsthaft anzusetzen",
      "Ich will jetzt einen echten Wandel",
    ],
  },
];

const returningSteps = [
  {
    question: "Wie war dein letzter Tag mit deinem Muster?",
    options: [
      "Ich war bewusster als sonst",
      "Ich bin wieder automatisch reingerutscht",
      "Es war ungefähr wie immer",
      "Ich habe kurz innegehalten",
    ],
  },
  {
    question: "Was war heute oder gestern der stärkste Auslöser?",
    options: ["Stress", "Langeweile", "Alleinsein", "Gewohnheit"],
  },
  {
    question: "Was brauchst du gerade am meisten?",
    options: ["Ruhe", "Klarheit", "Energie", "Einen kleinen nächsten Schritt"],
  },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [checkpointFeedback, setCheckpointFeedback] = useState<string | null>(
    null
  );

  const [showReturnScreen, setShowReturnScreen] = useState(false);
  const [previousInsight, setPreviousInsight] = useState<string | null>(null);
  const [returningMode, setReturningMode] = useState(false);
  const [returningStep, setReturningStep] = useState(0);
  const [returningAnswers, setReturningAnswers] = useState<string[]>([]);
  const [returningDone, setReturningDone] = useState(false);
const [showIntervention, setShowIntervention] = useState(false);
const [showChoicePoint, setShowChoicePoint] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [skippedEmail, setSkippedEmail] = useState(false);
const [started, setStarted] = useState(false);
const intervention = getInterventionContent(returningAnswers);
  useEffect(() => {
    const loadUserData = async (userEmail: string) => {
      const response = await fetch("/api/get-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const result = await response.json();

      if (result?.insight) {
        setPreviousInsight(result.insight);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const isReturning = params.get("returning") === "true";
    const emailParam = params.get("email");

if (isReturning) {
  setShowReturnScreen(true);
  setStarted(true);
}

    if (emailParam) {
      loadUserData(emailParam);
    }
  }, []);

  const startNewCheckIn = () => {
    setShowReturnScreen(false);
    setReturningMode(true);
    setReturningStep(0);
    setReturningAnswers([]);
    setReturningDone(false);
  };

const saveReturningCheckin = async (finalAnswers: string[]) => {
  try {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");

    if (!emailParam) return;

    await fetch("/api/save-checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailParam,
        returningAnswers: finalAnswers,
      }),
    });
  } catch (error) {
    console.error("Error saving returning check-in:", error);
  }
};

const handleReturningAnswer = async (answer: string) => {
  const updated = [...returningAnswers, answer];
  setReturningAnswers(updated);

  if (returningStep === 1) {
    setShowIntervention(true);
    return;
  }

  if (returningStep + 1 < returningSteps.length) {
    setReturningStep(returningStep + 1);
  } else {
    await saveReturningCheckin(updated);
    setReturningDone(true);
  }
};

const handleAnswer = (answer: string) => {
  setSelectedAnswer(answer);

  setTimeout(() => {
    const updated = [...answers, answer];
    setAnswers(updated);

    const answeredCount = updated.length;

    setSelectedAnswer(null);

    if (answeredCount === 5) {
      const recentAnswers = updated.slice(-5);
      setCheckpointFeedback(generateCheckpointFeedback(recentAnswers));
      return;
    }

    if (step + 1 < steps.length) {
      setStep(step + 1);
 } else {
  localStorage.setItem("klarflow_completed_at", new Date().toISOString());
  setDone(true);
}
  }, 220);
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
    const readiness = answers[answers.length - 1] || "";
    const patternTitle = generatePatternTitle(answers);
    const nextStep = generateNextStep(answers);

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
        readiness,
        pattern_title: patternTitle,
        next_step: nextStep,
        report_version: "v1",
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
        readiness,
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

{!started ? (
  <section className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center py-12 text-center">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full"
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#08a99d]">
        1-Minuten Check-in
      </p>

      <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
        Du merkst es erst, wenn es schon passiert ist.
      </h1>

<p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-neutral-600">
  Klarflow hilft dir, den Moment davor zu erkennen — ruhig, ehrlich und
  ohne Druck.
</p>

<div className="mx-auto mt-7 max-w-xl rounded-3xl bg-[#f2fbfa] px-6 py-5 text-left">
  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#08a99d]">
    Am Ende bekommst du
  </p>

  <div className="mt-4 grid gap-3 text-base text-neutral-700">
    <p>→ ein Muster, das dich gerade unbewusst steuert</p>
    <p>→ eine ruhige Einordnung ohne Bewertung</p>
    <p>→ einen kleinen nächsten Schritt für heute</p>
  </div>
</div>

      <button
  onClick={() => {
    localStorage.setItem("klarflow_started_at", new Date().toISOString());
    setStarted(true);
  }}
        className="mt-9 rounded-2xl bg-neutral-950 px-8 py-4 text-lg font-bold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
      >
        Kurz reinschauen
      </button>

      <p className="mt-4 text-sm text-neutral-400">
        Kostenlos · Keine Anmeldung nötig · Dauert ungefähr 1 Minute
      </p>

      <div className="mx-auto mt-14 grid max-w-3xl gap-4 text-left md:grid-cols-3">
        <div className="rounded-3xl bg-neutral-100 p-6">
          <h3 className="font-bold">Nicht noch mehr Druck</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Kein schlechtes Gewissen. Kein Perfektionismus. Nur ehrliches
            Hinschauen.
          </p>
        </div>

        <div className="rounded-3xl bg-neutral-100 p-6">
          <h3 className="font-bold">Erkenne dein Muster</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Du siehst, wann es passiert, was es auslöst und was danach bleibt.
          </p>
        </div>

        <div className="rounded-3xl bg-neutral-100 p-6">
          <h3 className="font-bold">Ein kleiner Schritt</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Am Ende bekommst du einen nächsten Schritt, der zu deinem Moment
            passt.
          </p>
        </div>
      </div>
    </motion.div>
  </section>
) : showReturnScreen ? (
    <section className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center py-12 text-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-[2rem] bg-[#f2fbfa] px-8 py-12 shadow-sm"
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#08a99d]">
        Du bist wieder da
      </p>

      <h1 className="text-4xl font-extrabold tracking-tight">
        Du hast etwas bei dir erkannt.
        <br />
        Lass uns genau dort wieder ansetzen.
      </h1>

<p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-600">
  Lass uns kurz schauen, wie es dir heute geht. Nur drei Fragen — ruhig,
  ehrlich, ohne Druck.
</p>

<p className="mx-auto mt-4 max-w-xl text-sm text-neutral-500">
  Dein letztes Muster ist noch da — wir schauen nur, wie es sich heute zeigt.
</p>

      {previousInsight && (
        <div className="mt-6 rounded-2xl bg-white p-5 text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Das hast du über dich erkannt
          </p>

          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">
            {previousInsight}
          </p>
        </div>
      )}

      <button
        onClick={startNewCheckIn}
        className="mt-8 rounded-2xl bg-neutral-950 px-8 py-4 font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
      >
        Kurz wieder reinschauen
      </button>
    </motion.div>
  </section>
        ) : returningMode ? (
          <section className="flex flex-1 flex-col pt-8 md:pt-12">
            <div className="mb-12">
              <div className="h-1 w-full rounded-full bg-neutral-100">
                <div
                  className="h-1 rounded-full bg-[#08a99d] transition-all duration-500"
                  style={{
                    width: `${
                      ((returningStep + 1) / returningSteps.length) * 100
                    }%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-end text-sm font-medium text-neutral-400">
                {Math.min(returningStep + 1, returningSteps.length)} /{" "}
                {returningSteps.length}
              </div>
            </div>

            {showIntervention ? (
  <section className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center text-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-[2rem] bg-[#f2fbfa] px-8 py-12 shadow-sm"
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#08a99d]">
        {intervention.label}
      </p>

      <h1 className="text-3xl font-extrabold tracking-tight">
       {intervention.title}
      </h1>

    <p className="mt-5 text-lg text-neutral-600 leading-relaxed">
  {intervention.body}
</p>

     <p className="mt-4 text-neutral-500">
  {intervention.instruction}
</p>

      <button
      onClick={() => {
  setShowIntervention(false);
  setShowChoicePoint(true);
}}
        className="mt-8 rounded-2xl bg-neutral-950 px-8 py-4 text-white font-semibold hover:bg-neutral-800"
      >
        {intervention.button}
      </button>
    </motion.div>
  </section>
) : showChoicePoint ? (
  <section className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center text-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-[2rem] bg-white px-8 py-12 shadow-sm"
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#08a99d]">
        Deine Entscheidung
      </p>

      <h1 className="text-3xl font-extrabold tracking-tight">
        Was wäre jetzt der kleinste bewusste Schritt?
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-600">
        Nicht perfekt. Nicht groß. Nur eine kleine Unterbrechung des Autopiloten.
      </p>

      <div className="mx-auto mt-8 grid max-w-xl gap-3">
        {[
          "Ich lege das Handy kurz weg",
          "Ich warte 30 Sekunden",
          "Ich mache etwas Kleines im Raum",
          "Ich beobachte nur, was gerade in mir passiert",
        ].map((choice) => (
          <button
            key={choice}
            onClick={() => {
              setReturningAnswers([...returningAnswers, `Choice: ${choice}`]);
              setShowChoicePoint(false);
              setReturningStep(returningStep + 1);
            }}
            className="w-full rounded-2xl bg-neutral-100 px-6 py-4 text-left font-semibold text-neutral-900 transition hover:bg-neutral-200 active:scale-[0.98]"
          >
            {choice}
          </button>
        ))}
      </div>
    </motion.div>
  </section>
) : !returningDone ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={returningStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="mx-auto w-full max-w-3xl text-center"
                >
                  <h1 className="mx-auto max-w-2xl text-[28px] font-bold leading-tight tracking-tight md:text-4xl">
                    {returningSteps[returningStep].question}
                  </h1>

                  <p className="mt-3 text-sm text-neutral-400">
                    Wähle, was heute am ehrlichsten passt.
                  </p>

                  <div className="mx-auto mt-10 grid w-full max-w-2xl gap-4">
                    {returningSteps[returningStep].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleReturningAnswer(opt)}
                        className={`w-full rounded-2xl px-7 py-5 text-left text-lg font-semibold transition-all duration-200 active:scale-[0.98] ${
  selectedAnswer === opt
    ? "bg-[#08a99d] text-white scale-[1.01]"
    : "bg-neutral-100 text-neutral-900 hover:scale-[1.01] hover:bg-neutral-200"
}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <section className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center py-12 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-[2rem] bg-[#f2fbfa] px-8 py-12 shadow-sm"
                >
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#08a99d]">
                    Dein heutiger Check-in
                  </p>

                  <h1 className="text-4xl font-extrabold tracking-tight">
                    Ein kleiner Moment zählt.
                  </h1>

                  <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-600">
                    {generateReturningReflection(returningAnswers)}
                  </p>
<p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-500">
  Achte morgen auf genau einen Moment —
  den, in dem dein Muster normalerweise automatisch startet.
</p>

<p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
  Wenn du ihn erkennst, reicht das völlig.
</p>
<p className="mt-6 text-xs text-neutral-400">
  Du kannst jederzeit kurz zurückkommen.
</p>
                  <button
                    onClick={() => setReturningMode(false)}
                    className="mt-8 rounded-2xl bg-neutral-950 px-8 py-4 font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    Für heute abschließen
                  </button>
                </motion.div>
              </section>
            )}
          </section>
        ) : !done ? (
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
<p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-neutral-500">
  Du bist bereits halb durch. Ab hier wird dein Muster noch klarer.
</p>
                    <button
                      onClick={handleCheckpointContinue}
                      className="mt-8 rounded-2xl bg-neutral-950 px-8 py-4 font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                    >
                      Weiter zu den letzten 5 Fragen
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
  {steps[step].helper || "Wähle die Antwort, die sich für dich am ehrlichsten anfühlt."}
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
            {skippedEmail ? (
  <div className="mx-auto flex min-h-[70vh] items-center justify-center text-center">
    <div className="rounded-[2rem] bg-[#f2fbfa] px-8 py-12 shadow-sm">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#08a99d]">
        Für heute reicht das
      </p>

      <h1 className="text-4xl font-extrabold tracking-tight">
        Nimm nur diesen einen Moment mit.
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-600">
        Du musst jetzt nichts festhalten. Vielleicht reicht es für heute,
        dass du dein Muster ein kleines Stück klarer gesehen hast.
      </p>

      <button
        onClick={() => setSkippedEmail(false)}
        className="mt-8 rounded-2xl bg-neutral-950 px-8 py-4 font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
      >
        Überblick nochmal ansehen
      </button>
    </div>
  </div>
) : (
  <>
            <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight">
  Das ist gerade bei dir sichtbar geworden
</h2>
              <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-neutral-600">
                {generateInsight(answers)}
              </p>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-500">
  Die meisten verlieren diesen Moment wieder im Alltag.
  Du kannst ihn behalten.
</p>
            </div>

            <div className="mt-10 grid gap-4 opacity-90">
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
                  {generateNextStep(answers)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-neutral-950 p-7 text-white">
              <h3 className="text-center text-2xl font-extrabold">
                Soll ich dir deinen Klarflow zusenden?
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-center leading-relaxed text-neutral-300">
               Damit du diesen Moment später wiederfindest, schicken wir dir deinen persönlichen Überblick und deinen kleinen nächsten Schritt per E-Mail.
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
  className="mt-4 w-full rounded-2xl bg-[#08a99d] py-4 font-bold text-white transition hover:bg-[#078f86] active:scale-[0.98]"
>
  Meinen Klarflow senden
</button>

              <button
  onClick={() => setSkippedEmail(true)}
  className="mt-3 w-full rounded-2xl py-3 text-sm text-neutral-400 hover:text-white"
>
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
                Kein Spam. Kein Druck. Nur dein persönlicher Überblick.
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
          </>
        )}
          </section>
        )}
      </div>
    </main>
  );
}
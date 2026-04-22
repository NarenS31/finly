"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Finn } from "@/components/mascot/finn";
import type { FinnMood } from "@/components/mascot/finn";

interface EventCard {
  day: number;
  emoji: string;
  title: string;
  description: string;
  choices: {
    label: string;
    cost: number;
    happiness: number; // -2 to +2
    savingsEffect: number; // e.g., +5 means adds to savings
    finn: FinnMood;
    feedback: string;
  }[];
}

const STARTING_BALANCE = 100;
const WEEKLY_ALLOWANCE = 10;

const EVENTS: EventCard[] = [
  {
    day: 1,
    emoji: "",
    title: "Pizza Friday!",
    description: "Your friends want to go out for pizza after school. It'll cost $12.",
    choices: [
      { label: "Go! I deserve it", cost: 12, happiness: 2, savingsEffect: 0, finn: "excited", feedback: "Fun! But that's $12 gone. Treat yourself sometimes, but not every time." },
      { label: "I'll pass and save the $12", cost: 0, happiness: -1, savingsEffect: 12, finn: "cool", feedback: "Smart save! That $12 stays in your pocket. FOMO is real but so is your bank balance." },
      { label: "Split a pizza — spend $6", cost: 6, happiness: 1, savingsEffect: 0, finn: "happy", feedback: "Balance! Half the fun, half the cost. This is the move." },
    ],
  },
  {
    day: 3,
    emoji: "",
    title: "New Game Drop",
    description: "A game you've wanted just launched — $35. Your friend says you can share their copy for $5.",
    choices: [
      { label: "Buy my own copy — $35", cost: 35, happiness: 2, savingsEffect: 0, finn: "love", feedback: "Nice! But $35 is a big chunk. If you're sure you'll play it for months, it can be worth it." },
      { label: "Share with friend — $5", cost: 5, happiness: 1, savingsEffect: 0, finn: "cool", feedback: "Clever! Same fun, way less cost. Sharing is smart." },
      { label: "Not for me right now", cost: 0, happiness: 0, savingsEffect: 0, finn: "thinking", feedback: "Respect! There'll always be another game. Your savings thank you." },
    ],
  },
  {
    day: 5,
    emoji: "",
    title: "Allowance Day!",
    description: `You just got your $${WEEKLY_ALLOWANCE} weekly allowance. What do you do first?`,
    choices: [
      { label: "Move $5 to savings right away", cost: 0, happiness: 0, savingsEffect: 5, finn: "happy", feedback: "Pay yourself first! Saving before spending is the #1 money habit." },
      { label: "Keep it all in my wallet", cost: 0, happiness: 1, savingsEffect: 0, finn: "thinking", feedback: "It's in your pocket — but will it still be there next week? Wallets have holes…" },
      { label: "Spend it all now on snacks", cost: 10, happiness: 2, savingsEffect: 0, finn: "sad", feedback: "Tasty but gone. Snacks are fine but an entire allowance on snacks leaves zero breathing room." },
    ],
  },
  {
    day: 7,
    emoji: "",
    title: "Limited Sneakers",
    description: "Limited-edition shoes, $65. A classmate offers to sell their pair for $40.",
    choices: [
      { label: "Buy retail — own them new! ($65)", cost: 65, happiness: 2, savingsEffect: 0, finn: "love", feedback: "Brand new feels great! But $65 is over half your starting balance. Is the 'new' worth $25 extra?" },
      { label: "Grab the deal — $40", cost: 40, happiness: 2, savingsEffect: 0, finn: "cool", feedback: "Same hype, saved $25. Buying secondhand is underrated." },
      { label: "My current shoes are fine", cost: 0, happiness: -1, savingsEffect: 0, finn: "thinking", feedback: "Discipline! FOMO is the enemy of savings. Your shoes still work fine." },
    ],
  },
  {
    day: 10,
    emoji: "",
    title: "Weekend Festival",
    description: "Theme park trip! Entry $25, you'll want $20 for food and rides, so $45 total.",
    choices: [
      { label: "All in — memories matter ($45)", cost: 45, happiness: 2, savingsEffect: 0, finn: "excited", feedback: "Experiences are worth it! Just make sure you planned for this one." },
      { label: "Entry only, bring my own food ($25)", cost: 25, happiness: 1, savingsEffect: 0, finn: "happy", feedback: "Budget pro move! You still get the experience for almost half price." },
      { label: "Skip — save the $45", cost: 0, happiness: -2, savingsEffect: 45, finn: "sad", feedback: "Big save! But don't always skip the fun stuff. Balance matters for long-term habits." },
    ],
  },
];

type Phase = "intro" | "playing" | "result";

export function SpendingSimulator() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [savings, setSavings] = useState(0);
  const [happiness, setHappiness] = useState(5); // 0-10
  const [eventIdx, setEventIdx] = useState(0);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finnMood, setFinnMood] = useState<FinnMood>("happy");

  const event = EVENTS[eventIdx];

  const handleChoice = (idx: number) => {
    if (chosenIdx !== null) return;
    const choice = event.choices[idx];
    setChosenIdx(idx);
    setBalance((b) => Math.max(0, b - choice.cost));
    setSavings((s) => s + choice.savingsEffect);
    setHappiness((h) => Math.min(10, Math.max(0, h + choice.happiness)));
    setFinnMood(choice.finn);
    setFeedback(choice.feedback);
  };

  const next = () => {
    if (eventIdx + 1 >= EVENTS.length) {
      setPhase("result");
      const savedPct = savings / STARTING_BALANCE;
      if (savedPct >= 0.3) {
        confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 }, colors: ["#22c55e", "#fbbf24"] });
      }
    } else {
      // Add allowance on day 5 event completion
      if (event.day === 5) setBalance((b) => b + WEEKLY_ALLOWANCE);
      setEventIdx((i) => i + 1);
      setChosenIdx(null);
      setFeedback(null);
      setFinnMood("happy");
    }
  };

  const restart = () => {
    setPhase("intro");
    setBalance(STARTING_BALANCE);
    setSavings(0);
    setHappiness(5);
    setEventIdx(0);
    setChosenIdx(null);
    setFeedback(null);
    setFinnMood("happy");
  };

  const happinessBar = Math.round((happiness / 10) * 100);
  const savingsRate = Math.round((savings / STARTING_BALANCE) * 100);

  if (phase === "intro") {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-8 text-center shadow-[var(--shadow-md)]">
        <Finn size={72} mood="excited" className="mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-[var(--black)]">Spending Simulator</h2>
        <p className="mt-2 text-[var(--gray-500)]">
          You have <strong className="text-[var(--black)]">${STARTING_BALANCE}</strong> and 10 days of real-life money decisions.
          Spend wisely, save smart, stay happy. Let's see how you do!
        </p>
        <button
          onClick={() => setPhase("playing")}
          className="btn-press mt-6 rounded-xl bg-[var(--green)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--green-dark)]"
        >
          Start Simulation →
        </button>
      </div>
    );
  }

  if (phase === "result") {
    const grade = savingsRate >= 30 ? "A" : savingsRate >= 15 ? "B" : savingsRate >= 5 ? "C" : "D";
    const gradeMsg: Record<string, string> = {
      A: "Outstanding saver! You kept your spending in check and built real savings.",
      B: "Solid work. You balanced fun and savings well.",
      C: "Some good moves, but room to save more. Try cutting one big spend next time.",
      D: "Spent it all! That can happen — the trick is starting fresh with a plan.",
    };
    const resultFinn: FinnMood = grade === "A" ? "love" : grade === "B" ? "excited" : grade === "C" ? "happy" : "sad";

    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] p-8 shadow-[var(--shadow-md)]">
        <div className="text-center">
          <Finn size={80} mood={resultFinn} className="mx-auto mb-4" />
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--green)]">Simulation Complete</p>
          <h2 className="mt-1 text-3xl font-extrabold text-[var(--black)]">Grade: {grade}</h2>
          <p className="mt-2 text-[var(--gray-500)]">{gradeMsg[grade]}</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-[var(--gray-50)] p-4">
            <p className="text-2xl font-extrabold text-[var(--black)]">${balance}</p>
            <p className="mt-1 text-xs text-[var(--gray-500)]">Cash left</p>
          </div>
          <div className="rounded-xl bg-[var(--green-bg)] p-4">
            <p className="text-2xl font-extrabold text-[var(--green-deeper)]">${savings}</p>
            <p className="mt-1 text-xs text-[var(--gray-500)]">Saved</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-2xl font-extrabold text-amber-700"></p>
            <p className="mt-1 text-xs text-[var(--gray-500)]">Happiness</p>
          </div>
        </div>
        <button
          onClick={restart}
          className="btn-press mt-6 w-full rounded-xl border border-[var(--border)] bg-[var(--gray-50)] py-3 text-sm font-bold text-[var(--black)] hover:bg-[var(--gray-100)]"
        >
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--white)] shadow-[var(--shadow-md)]">
      {/* Status bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-bold text-[var(--black)]">${balance}</span>
          <span className="font-bold text-[var(--green-deeper)]">${savings} saved</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--gray-500)]">Happiness</span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--gray-200)]">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${happinessBar}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Event card */}
        <div className="mb-4 flex items-start gap-3">
          <Finn size={52} mood={finnMood} className="mt-1 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gray-500)]">Day {event.day} of 10</p>
            <p className="text-lg font-extrabold text-[var(--black)]">
              {event.emoji} {event.title}
            </p>
            <p className="mt-1 text-sm text-[var(--gray-700)]">{event.description}</p>
          </div>
        </div>

        {/* Choices */}
        <div className="grid gap-2">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              disabled={chosenIdx !== null}
              onClick={() => handleChoice(i)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                chosenIdx === null
                  ? "border-[var(--border)] bg-[var(--gray-50)] hover:border-[var(--green)] hover:bg-[var(--green-bg)]"
                  : chosenIdx === i
                    ? "border-[var(--green)] bg-[var(--green-bg)] text-[var(--green-deeper)]"
                    : "border-[var(--border)] bg-[var(--gray-50)] opacity-40"
              }`}
            >
              {choice.label}
            </button>
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 rounded-xl border border-[var(--green-border)] bg-[var(--green-bg)] p-4"
            >
              <p className="text-sm font-semibold text-[var(--green-deeper)]">Finn says:</p>
              <p className="mt-1 text-sm text-[var(--gray-700)]">{feedback}</p>
              <button
                onClick={next}
                className="btn-press mt-3 rounded-lg bg-[var(--green)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--green-dark)]"
              >
                {eventIdx + 1 >= EVENTS.length ? "See results →" : "Next →"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div className="border-t border-[var(--border)] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--gray-200)]">
            <div
              className="h-full rounded-full bg-[var(--green)] transition-all"
              style={{ width: `${((eventIdx + (chosenIdx !== null ? 1 : 0)) / EVENTS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[var(--gray-500)]">{eventIdx + 1}/{EVENTS.length}</span>
        </div>
      </div>
    </div>
  );
}

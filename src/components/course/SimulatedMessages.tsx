"use client";

import { useState } from "react";
import { SIMULATED_MESSAGES, SimulatedMessage } from "@/lib/courseData";
import { recordActivityCompleted } from "@/lib/supabase";
import {
  Smartphone,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Eye,
  Check,
  Send,
} from "lucide-react";

interface SimulatedMessagesProps {
  userId: string;
}

export function SimulatedMessages({ userId }: SimulatedMessagesProps) {
  const [learnerAnswers, setLearnerAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [allFinished, setAllFinished] = useState(false);

  const handleTextChange = (caseId: string, val: string) => {
    setLearnerAnswers((prev) => ({ ...prev, [caseId]: val }));
  };

  const toggleReveal = (caseId: string) => {
    setRevealed((prev) => {
      const updated = { ...prev, [caseId]: !prev[caseId] };
      // Check if at least 3 cases have been analyzed & revealed
      const count = Object.values(updated).filter(Boolean).length;
      if (count >= 3 && !allFinished) {
        setAllFinished(true);
        recordActivityCompleted(userId, "MWSHS-W3-PRACTICE");
      }
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
              Activity 04 • SMS Simulation
            </span>
            <span className="text-xs text-slate-500 font-medium">5 Real-world Cases</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Practise: Spot the Warning Signs in 5 Simulated Messages
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            For each fictional message, identify the warning signs and safe next step before revealing the model explanation.
          </p>
        </div>

        {allFinished && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Practice Completed</span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {SIMULATED_MESSAGES.map((item) => {
            const isRevealed = Boolean(revealed[item.id]);
            const userResponse = learnerAnswers[item.id] || "";

            return (
              <div
                key={item.id}
                className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-white to-slate-50/50 shadow-sm"
              >
                {/* Simulated Phone SMS Card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs">
                      #{item.caseNumber}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Sender: {item.sender} • {item.time}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200">
                    <AlertOctagon className="w-3 h-3 text-amber-600" />
                    Simulated SMS
                  </span>
                </div>

                {/* SMS Bubble */}
                <div className="bg-slate-900 text-white p-3.5 rounded-2xl rounded-tl-sm text-xs sm:text-sm font-mono leading-relaxed mb-4 shadow-inner">
                  <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between font-sans">
                    <span>Incoming Message</span>
                    <span>Encrypted SMS</span>
                  </div>
                  &ldquo;{item.messageText}&rdquo;
                </div>

                {/* Learner Reflection Input */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your analysis: What is the concern, and what would you do?
                  </label>
                  <textarea
                    rows={2}
                    value={userResponse}
                    onChange={(e) => handleTextChange(item.id, e.target.value)}
                    placeholder="e.g. Warning sign: Asking for secret PIN. Safe step: Never send PIN, call customer care 100 independently."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Reveal Model Explanation Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleReveal(item.id)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>
                      {isRevealed
                        ? "Hide Model Explanation"
                        : "Reveal Official Model Explanation"}
                    </span>
                    {isRevealed ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isRevealed && (
                    <div className="mt-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-2 text-blue-950 animate-fadeIn">
                      <div>
                        <span className="font-bold text-blue-900">Official Analysis: </span>
                        <span>{item.explanation}</span>
                      </div>
                      <div className="pt-1 border-t border-blue-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <strong className="text-blue-900">Warning Signs: </strong>
                          <span className="text-blue-800">{item.warningSigns}</span>
                        </div>
                        <div>
                          <strong className="text-blue-900">Safe Action: </strong>
                          <span className="text-blue-800">{item.safeNextStep}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


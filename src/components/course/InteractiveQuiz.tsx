"use client";

import { useState } from "react";
import { QUIZ_QUESTIONS, QuizQuestion } from "@/lib/courseData";
import { recordQuizAttempt } from "@/lib/supabase";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";

interface InteractiveQuizProps {
  quizType: "practice_10" | "mastery_5";
  userId: string;
  userName: string;
  onCompleted?: (score: number, maxScore: number, passed: boolean) => void;
}

export function InteractiveQuiz({
  quizType,
  userId,
  userName,
  onCompleted,
}: InteractiveQuizProps) {
  // Determine questions for this quiz mode
  const questions: QuizQuestion[] =
    quizType === "mastery_5"
      ? QUIZ_QUESTIONS.filter((q) => q.category === "scam")
      : QUIZ_QUESTIONS;

  const maxScore = questions.length;
  const isMastery = quizType === "mastery_5";

  // State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | null>(null);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    questions.forEach((q) => {
      const selectedIndex = selectedAnswers[q.id];
      if (selectedIndex !== undefined && q.options[selectedIndex]?.isCorrect) {
        score++;
      }
    });

    const passed = isMastery ? score === 5 : score >= 7;
    setCurrentScore(score);
    setSubmitted(true);

    // Save record to backend/storage
    recordQuizAttempt({
      userId,
      userName,
      quizType,
      score,
      maxScore,
      passed,
      answers: selectedAnswers,
    });

    if (onCompleted) {
      onCompleted(score, maxScore, passed);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentScore(null);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === questions.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Quiz Header */}
      <div className={`p-5 border-b ${isMastery ? "bg-amber-500/10 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isMastery
                    ? "bg-amber-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {isMastery ? "Objective O3 Mastery Check" : "Practice Assessment"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {questions.length} Questions • Immediate Explanations
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isMastery
                ? "Scam Recognition Mastery (Pass requirement: 5/5)"
                : "10-Question Saving & Scam Recognition Check"}
            </h3>
          </div>

          {submitted && currentScore !== null && (
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-bold ${
                isMastery
                  ? currentScore === 5
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-amber-100 text-amber-800 border-amber-300"
                  : currentScore >= 7
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-slate-100 text-slate-700 border-slate-300"
              }`}
            >
              {isMastery && currentScore === 5 ? (
                <>
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Mastery Achieved: 5/5 (100%)</span>
                </>
              ) : isMastery ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Result: {currentScore}/5 — 5/5 Required to Pass</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Score: {currentScore}/10 ({Math.round((currentScore / 10) * 100)}%)</span>
                </>
              )}
            </div>
          )}
        </div>

        {isMastery && !submitted && (
          <p className="text-xs text-amber-900 mt-2 leading-relaxed bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <strong>Pass Criteria:</strong> All 5 scam identification questions must be answered correctly (5/5). 
            If you miss any question, review the feedback explanations and click &ldquo;Retry Quiz&rdquo; until 100% mastery is achieved.
          </p>
        )}
      </div>

      {/* Questions List */}
      <div className="p-5 sm:p-6 space-y-8 divide-y divide-slate-100">
        {questions.map((q, qIndex) => {
          const selectedOptionIndex = selectedAnswers[q.id];
          const isAnswered = selectedOptionIndex !== undefined;

          return (
            <div key={q.id} className={qIndex > 0 ? "pt-6" : ""}>
              <div className="flex items-start gap-3 mb-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs shrink-0 mt-0.5">
                  {qIndex + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Item {q.id} • {q.category === "scam" ? "Scam Detection" : "Safe Saving"}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {q.question}
                  </h4>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 ml-10">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedOptionIndex === optIdx;
                  let optionStyles = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";

                  if (submitted) {
                    if (option.isCorrect) {
                      optionStyles = "bg-emerald-50 border-emerald-400 text-emerald-900 font-medium";
                    } else if (isSelected && !option.isCorrect) {
                      optionStyles = "bg-red-50 border-red-300 text-red-900 line-through opacity-80";
                    } else {
                      optionStyles = "bg-slate-50/60 border-slate-200 text-slate-400";
                    }
                  } else if (isSelected) {
                    optionStyles = "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 ${optionStyles}`}
                    >
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}>
                        {submitted && option.isCorrect ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : isSelected ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <span className="leading-relaxed">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Explanatory Feedback when submitted */}
              {submitted && isAnswered && (
                <div
                  className={`mt-3 ml-10 p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2 ${
                    q.options[selectedOptionIndex]?.isCorrect
                      ? "bg-emerald-50/80 border border-emerald-200 text-emerald-900"
                      : "bg-red-50/80 border border-red-200 text-red-900"
                  }`}
                >
                  {q.options[selectedOptionIndex]?.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold">
                      {q.options[selectedOptionIndex]?.isCorrect ? "Correct: " : "Model Feedback: "}
                    </span>
                    {q.options[selectedOptionIndex]?.feedback}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Footer & Action Bar */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium">
          {!submitted ? (
            <span>
              Answered {answeredCount} of {questions.length} questions
            </span>
          ) : (
            <span>
              Best grade policy: You can retake this assessment at any time.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {submitted ? (
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Assessment</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!isComplete}
              onClick={handleSubmitQuiz}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-2 ${
                isComplete
                  ? isMastery
                    ? "bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>{isMastery ? "Submit Mastery Check" : "Check Quiz Answers"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import { COURSE_METADATA } from "@/lib/courseData";
import {
  ShieldCheck,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Target,
  Sparkles,
} from "lucide-react";

interface CourseHeroProps {
  completedCount: number;
  totalActivitiesCount: number;
}

export function CourseHero({
  completedCount,
  totalActivitiesCount,
}: CourseHeroProps) {
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / totalActivitiesCount) * 100),
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden mb-8">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            {COURSE_METADATA.institution}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Course ID: {COURSE_METADATA.id} • Sample Week: Week 3
          </span>
        </div>

        {/* Course Title & Overview */}
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {COURSE_METADATA.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            A practical digital literacy platform for rural senior high school students to build resilient safe-saving habits, collaborate on weekly savings plans, and master the detection of mobile money fraud.
          </p>
        </div>

        {/* Learning Objectives Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {COURSE_METADATA.objectives.map((obj) => (
            <div
              key={obj.code}
              className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 flex items-start gap-3.5"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                {obj.code}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                  {obj.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {obj.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Tracker Bar */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between text-xs font-semibold mb-2 gap-2">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Target className="w-4 h-4 text-emerald-400" />
              Your Week 3 Course Progress
            </span>
            <span className="text-emerald-400 font-mono">
              {completedCount} of {totalActivitiesCount} activities completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700/80 rounded-full overflow-hidden p-0.5 border border-slate-600">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Offline Pack Downloads Quick Ribbon */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Offline Access:</span>
            <span>Download during school computer lab or Wi-Fi hours to read offline without data charges.</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/course/Saving_Safely_Two_Page_Note.pdf"
              download
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl font-medium text-slate-200 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Two-Page PDF (85 KB)</span>
            </a>
            <a
              href="/course/Week_3_Offline_Reading_Pack.zip"
              download
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl font-medium text-slate-200 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Full Offline Pack (670 KB)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


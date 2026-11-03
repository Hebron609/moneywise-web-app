"use client";

import { useState } from "react";
import { COURSE_SECTIONS, WEEK_3_ACTIVITIES } from "@/lib/courseData";
import { CourseMediaViewer } from "./CourseMediaViewer";
import { SimulatedMessages } from "./SimulatedMessages";
import { CourseForum } from "./CourseForum";
import { CourseCollaboration } from "./CourseCollaboration";
import { InteractiveQuiz } from "./InteractiveQuiz";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Lock,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

interface CourseSectionsViewProps {
  userId: string;
  userName: string;
  userRole: string;
  onActivityComplete: (code: string) => void;
}

export function CourseSectionsView({
  userId,
  userName,
  userRole,
  onActivityComplete,
}: CourseSectionsViewProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-3");

  return (
    <div className="space-y-10">
      {/* 4-Week Moodle Course Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {COURSE_SECTIONS.map((sec) => {
          const isActive = activeSectionId === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSectionId(sec.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              {sec.status === "active" ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{sec.title}</span>
              {sec.status === "planned" && (
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                  Planned
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 0: Start Here */}
      {activeSectionId === "sec-0" && (
        <section id="sec-0" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Orientation
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Start Here: Welcome to MoneyWise SHS
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Course information, learning route, facilitator office hours, and offline resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Course Purpose &amp; Rural SHS Design
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                MoneyWise SHS is tailored specifically for rural Senior High School learners in Ghana. All case studies, simulated SMS messages, and budget exercises use realistic local scenarios without requiring any real bank account opening or fee payments.
              </p>
              <div className="pt-2 text-xs text-slate-500 border-t border-slate-200">
                <strong>Curriculum alignment:</strong> Group 4 IT404 Instructional Design project.
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Facilitator Contact &amp; Help Channels
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have questions or need assistance during practice? Post in the <strong>Course Help Forum</strong> or consult your teacher during supervised classroom periods.
              </p>
              <div className="pt-2 text-xs text-slate-500 border-t border-slate-200">
                <strong>Lecturer / Facilitator:</strong> Charity Adjei / Israel A. (Response target: within 24 hours).
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="text-xs text-emerald-900">
              <strong>Ready to begin?</strong> Head into Week 3 to explore safe savings habits and practice spotting mobile money scams.
            </div>
            <button
              type="button"
              onClick={() => setActiveSectionId("sec-3")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              Enter Week 3
            </button>
          </div>
        </section>
      )}

      {/* SECTION 1: Week 1 (Planned Outline) */}
      {activeSectionId === "sec-1" && (
        <section id="sec-1" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Planned Outline
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Week 1: Needs and Wants
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Distinguishing basic survival and schooling essentials from discretionary spending.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-3">
            <p>
              <strong>Curriculum Scope:</strong> In Week 1, learners examine personal and household expenditures, distinguishing fundamental needs (food, textbooks, transport fare) from discretionary wants (entertainment, trendy accessories).
            </p>
            <p className="text-slate-500">
              <em>Note: As specified in the IT404 prototype schedule, Week 3 is fully operational below; Week 1 will unlock during the full term rollout.</em>
            </p>
          </div>
        </section>
      )}

      {/* SECTION 2: Week 2 (Planned Outline) */}
      {activeSectionId === "sec-2" && (
        <section id="sec-2" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Planned Outline
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Week 2: Creating a Simple Weekly Budget
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Tracking small income allowances, calculating surpluses, and drafting manageable cash flow.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-3">
            <p>
              <strong>Curriculum Scope:</strong> Learners build simple cash-in and cash-out ledgers, identify opportunities to reduce impulse purchases, and ensure surplus funds are allocated to safety reserves.
            </p>
            <p className="text-slate-500">
              <em>Note: Week 3 is fully operational below; Week 2 will unlock during the full term rollout.</em>
            </p>
          </div>
        </section>
      )}

      {/* SECTION 3: Week 3 (FULLY ACTIVE Moodle Mirror) */}
      {activeSectionId === "sec-3" && (
        <section id="sec-3" className="space-y-10">
          {/* Week 3 Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                    Fully Active Module
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Estimated Duration: ~2 Hours</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Week 3: Saving Safely and Spotting Scams
                </h2>
              </div>
            </div>

            <div className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                Welcome to Week 3! Follow the route below to master safe savings strategies and protect yourself and your family against mobile money and digital financial fraud.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <strong className="text-emerald-950 block mb-0.5">Objective O3 (Mastery 5/5):</strong>
                  <span className="text-emerald-800">Identify 3 common financial scam patterns with 100% accuracy in the mastery quiz.</span>
                </div>
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl">
                  <strong className="text-teal-950 block mb-0.5">Objective O4 (Group Plan):</strong>
                  <span className="text-teal-800">Demonstrate safe saving habits by participating in the collaborative group savings plan.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity 02 & 03: Reading & Video Media */}
          <CourseMediaViewer userId={userId} />

          {/* Activity 04: Five Simulated Messages */}
          <div id="act-04">
            <SimulatedMessages userId={userId} />
          </div>

          {/* Activity 05: Discussion Forum */}
          <div id="act-05">
            <CourseForum
              userId={userId}
              userName={userName}
              userRole={userRole}
            />
          </div>

          {/* Activity 06a, 06b & 09: Collaboration, Wiki & Submissions */}
          <CourseCollaboration userId={userId} userName={userName} />

          {/* Activity 07: 10-Question Practice Quiz */}
          <div id="act-07">
            <InteractiveQuiz
              quizType="practice_10"
              userId={userId}
              userName={userName}
              onCompleted={() => onActivityComplete("MWSHS-W3-QUIZ")}
            />
          </div>

          {/* Activity 08: 5-Question High-Stakes Scam Mastery Check */}
          <div id="act-08">
            <InteractiveQuiz
              quizType="mastery_5"
              userId={userId}
              userName={userName}
              onCompleted={() => onActivityComplete("MWSHS-W3-MASTERY")}
            />
          </div>
        </section>
      )}

      {/* SECTION 4: Week 4 (Planned Outline) */}
      {activeSectionId === "sec-4" && (
        <section id="sec-4" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Planned Outline
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Week 4: Digital Finance Choices and Reflection
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Comparing mobile money platforms, formal accounts vs informal susu groups, and final course reflections.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-3">
            <p>
              <strong>Curriculum Scope:</strong> In the capstone week, learners synthesize lessons from Weeks 1–3, compare transactional fees across electronic money issuers, and formulate personal commitments for responsible financial decision-making.
            </p>
            <p className="text-slate-500">
              <em>Note: As specified in the IT404 prototype schedule, Week 3 is fully operational; Week 4 will unlock during the full term rollout.</em>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}


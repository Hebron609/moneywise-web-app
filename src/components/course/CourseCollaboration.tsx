"use client";

import { useState } from "react";
import { DEMO_WIKI_CONTENT } from "@/lib/courseData";
import { getSubmissions, saveSubmission, recordActivityCompleted, StoredSubmission } from "@/lib/supabase";
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  History,
  Send,
  Edit3,
  Award,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

interface CourseCollaborationProps {
  userId: string;
  userName: string;
}

export function CourseCollaboration({ userId, userName }: CourseCollaborationProps) {
  // Wiki State
  const [wiki, setWiki] = useState(DEMO_WIKI_CONTENT);
  const [isEditingWiki, setIsEditingWiki] = useState(false);
  const [wikiForm, setWikiForm] = useState({
    goal: wiki.goal,
    targetAmount: wiki.targetAmount,
    timeline: wiki.timeline,
    arithmetic: wiki.arithmetic,
    essentialNeedsProtected: wiki.essentialNeedsProtected,
    safeStorageChoice: wiki.safeStorageChoice,
    riskAndResponse: wiki.riskAndResponse,
  });

  // Submissions State
  const [submissions, setSubmissions] = useState<StoredSubmission[]>(getSubmissions());
  const [groupPlanText, setGroupPlanText] = useState(
    `Group: Demo Group A\nGoal: Purchase Term 2 Science Textbooks & Geometry Set\nTarget: GHS 120.00 total over 6 weeks (GHS 20.00/week)\nArithmetic: 6 weeks × GHS 20.00 = GHS 120.00\nNeeds: Daily lunch protected\nStorage: Regulated MoMo wallet\nRisk: High excursion fee - extend timeline 1 week without debt.`,
  );
  const [checklistForm, setChecklistForm] = useState({
    goal: "Save for end-of-term study guide and mathematical set",
    totalAmount: "GHS 60.00",
    weeklyCalculation: "GHS 10.00 / week × 6 weeks = GHS 60.00",
    essentialNeed: "Daily transportation bus fare to school",
    safeRule: "Never disclose secret wallet PIN or hand phone to strangers",
    groupContribution: "Calculated arithmetic table for Demo Group A plan",
  });

  const [groupSubmitSuccess, setGroupSubmitSuccess] = useState(false);
  const [individualSubmitSuccess, setIndividualSubmitSuccess] = useState(false);

  // User's existing submissions
  const existingGroupSub = submissions.find(
    (s) => s.assignmentCode === "MWSHS-W3-GROUP-SUBMIT",
  );
  const existingIndSub = submissions.find(
    (s) => s.assignmentCode === "MWSHS-W3-INDIVIDUAL" && s.userId === userId,
  ) || submissions.find((s) => s.assignmentCode === "MWSHS-W3-INDIVIDUAL");

  const handleSaveWiki = (e: React.FormEvent) => {
    e.preventDefault();
    const newRevision = {
      author: userName,
      date: new Date().toLocaleString(),
      change: "Updated savings plan details and protection rules.",
    };

    setWiki((prev) => ({
      ...prev,
      ...wikiForm,
      lastEditedBy: userName,
      lastEditedAt: new Date().toLocaleString(),
      revisions: [newRevision, ...prev.revisions],
    }));

    setIsEditingWiki(false);
    recordActivityCompleted(userId, "MWSHS-W3-WIKI");
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = saveSubmission({
      userId,
      userName: `${userName} (Demo Group A)`,
      assignmentCode: "MWSHS-W3-GROUP-SUBMIT",
      groupName: "Demo Group A",
      content: groupPlanText,
      maxGrade: 4,
    });
    setSubmissions([created, ...submissions]);
    setGroupSubmitSuccess(true);
  };

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = `1. Goal & Target: ${checklistForm.goal}\n2. Total Amount: ${checklistForm.totalAmount}\n3. Weekly Arithmetic: ${checklistForm.weeklyCalculation}\n4. Essential Need Protected: ${checklistForm.essentialNeed}\n5. Safe-saving Rule: ${checklistForm.safeRule}\n6. Group Contribution: ${checklistForm.groupContribution}`;

    const created = saveSubmission({
      userId,
      userName,
      assignmentCode: "MWSHS-W3-INDIVIDUAL",
      content,
      maxGrade: 1,
    });
    setSubmissions([created, ...submissions]);
    setIndividualSubmitSuccess(true);
  };

  return (
    <div className="space-y-8">
      {/* 06a: Collaborative Group Savings Plan Wiki */}
      <div id="act-06a" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-600 text-white">
                Activity 06a • Group Wiki
              </span>
              <span className="text-xs text-slate-500 font-medium">Collaborative Drafting</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Collaborate: Group Savings-Plan Wiki
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Work together in groups of 3–4. Outline your target goal, weekly contribution arithmetic, essential needs protection, and risk response.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingWiki(!isEditingWiki)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditingWiki ? "Cancel Editing" : "Edit Group Plan"}</span>
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {isEditingWiki ? (
            <form onSubmit={handleSaveWiki} className="space-y-4 bg-teal-50/40 p-4 rounded-2xl border border-teal-100">
              <h4 className="text-sm font-bold text-teal-950 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-600" /> Edit Group Savings Plan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">1. Small Practice Goal</label>
                  <input
                    type="text"
                    value={wikiForm.goal}
                    onChange={(e) => setWikiForm({ ...wikiForm, goal: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">2. Target Total Amount</label>
                  <input
                    type="text"
                    value={wikiForm.targetAmount}
                    onChange={(e) => setWikiForm({ ...wikiForm, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">3. Timeline & Weekly Amount</label>
                  <input
                    type="text"
                    value={wikiForm.timeline}
                    onChange={(e) => setWikiForm({ ...wikiForm, timeline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">4. Arithmetic Proof</label>
                  <input
                    type="text"
                    value={wikiForm.arithmetic}
                    onChange={(e) => setWikiForm({ ...wikiForm, arithmetic: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">5. How Essential Needs Remain Covered</label>
                <textarea
                  rows={2}
                  value={wikiForm.essentialNeedsProtected}
                  onChange={(e) => setWikiForm({ ...wikiForm, essentialNeedsProtected: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">6. Safe Storage Comparison (Checked with Facilitator)</label>
                <textarea
                  rows={2}
                  value={wikiForm.safeStorageChoice}
                  onChange={(e) => setWikiForm({ ...wikiForm, safeStorageChoice: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">7. Identified Risk and Response</label>
                <textarea
                  rows={2}
                  value={wikiForm.riskAndResponse}
                  onChange={(e) => setWikiForm({ ...wikiForm, riskAndResponse: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingWiki(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
                >
                  Save Group Wiki Contribution
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-slate-900">{wiki.groupName}</span>
                </div>
                <div>
                  Last revision by <strong className="text-slate-800">{wiki.lastEditedBy}</strong> on {wiki.lastEditedAt}
                </div>
              </div>

              {/* Wiki Content Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <td className="p-3 font-semibold text-slate-700 w-1/3">1. Agreed Small Goal</td>
                      <td className="p-3 text-slate-900 font-medium">{wiki.goal}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-3 font-semibold text-slate-700">2. Target Amount & Timeline</td>
                      <td className="p-3 text-slate-900">{wiki.targetAmount} over {wiki.timeline}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <td className="p-3 font-semibold text-slate-700">3. Arithmetic Calculation</td>
                      <td className="p-3 font-mono text-emerald-800">{wiki.arithmetic}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-3 font-semibold text-slate-700">4. Essential Needs Protected</td>
                      <td className="p-3 text-slate-900">{wiki.essentialNeedsProtected}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <td className="p-3 font-semibold text-slate-700">5. Safe Storage Provider</td>
                      <td className="p-3 text-slate-900">{wiki.safeStorageChoice}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-700">6. Risk Mitigation Response</td>
                      <td className="p-3 text-slate-900">{wiki.riskAndResponse}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Revision History */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Recent Revision History
                </h5>
                <div className="space-y-1.5">
                  {wiki.revisions.map((rev, idx) => (
                    <div key={idx} className="text-[11px] text-slate-500 flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <span><strong>{rev.author}</strong>: {rev.change}</span>
                      <span className="text-slate-400 shrink-0 ml-2">{rev.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 06b: Submit Final Group Savings Plan */}
      <div id="act-06b" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Activity 06b • Group Assignment
              </span>
              <span className="text-xs text-slate-500 font-medium">Objective O4 • 4 Points</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Submit: Final Group Savings Plan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit one consensus copy on behalf of your group. Evaluated on the 4-criterion rubric.
            </p>
          </div>

          {existingGroupSub?.status === "graded" && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Graded: {existingGroupSub.grade} / {existingGroupSub.maxGrade} pts</span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Rubric Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-800 block mb-1">Grading Rubric (4 Points Total):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <strong>1. Goal (1 pt):</strong> Realistic educational target
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <strong>2. Arithmetic (1 pt):</strong> Exact weekly calculation
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <strong>3. Provider (1 pt):</strong> Regulated safe storage
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <strong>4. Risk (1 pt):</strong> Sensible debt-free response
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGroupSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Final Group Savings Plan Text
              </label>
              <textarea
                rows={5}
                value={groupPlanText}
                onChange={(e) => setGroupPlanText(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {existingGroupSub?.feedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <span className="font-bold">Facilitator Feedback ({existingGroupSub.gradedBy}): </span>
                {existingGroupSub.feedback}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">
                {groupSubmitSuccess ? "Submission updated successfully!" : "Fictional figures only. Do not post real account details."}
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Group Savings Plan</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 09: Individual Savings Checklist */}
      <div id="act-09" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
                Activity 09 • Individual Assignment
              </span>
              <span className="text-xs text-slate-500 font-medium">Personal Reflection • 1 Point</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Submit: Your Individual Savings Checklist
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit individually using fictional figures to verify your personal grasp of safe saving habits.
            </p>
          </div>

          {existingIndSub?.status === "graded" && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Completed ({existingIndSub.grade}/{existingIndSub.maxGrade} pt)</span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleIndividualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. My goal and target date:
                </label>
                <input
                  type="text"
                  value={checklistForm.goal}
                  onChange={(e) => setChecklistForm({ ...checklistForm, goal: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Total goal amount:
                </label>
                <input
                  type="text"
                  value={checklistForm.totalAmount}
                  onChange={(e) => setChecklistForm({ ...checklistForm, totalAmount: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Weekly amount and calculation:
                </label>
                <input
                  type="text"
                  value={checklistForm.weeklyCalculation}
                  onChange={(e) => setChecklistForm({ ...checklistForm, weeklyCalculation: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4. One essential need my plan protects:
                </label>
                <input
                  type="text"
                  value={checklistForm.essentialNeed}
                  onChange={(e) => setChecklistForm({ ...checklistForm, essentialNeed: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                5. One safe-saving rule and how I would apply it:
              </label>
              <input
                type="text"
                value={checklistForm.safeRule}
                onChange={(e) => setChecklistForm({ ...checklistForm, safeRule: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                6. One contribution I made to our shared plan:
              </label>
              <input
                type="text"
                value={checklistForm.groupContribution}
                onChange={(e) => setChecklistForm({ ...checklistForm, groupContribution: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                required
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Data Privacy Reminder:</strong> Never enter a real PIN, live wallet balance, or personal account identifier.</span>
            </div>

            {existingIndSub?.feedback && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <span className="font-bold">Facilitator Feedback: </span>
                {existingIndSub.feedback}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Individual Checklist</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


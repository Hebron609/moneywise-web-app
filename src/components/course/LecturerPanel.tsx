"use client";

import { useState } from "react";
import {
  getAllUsers,
  saveUser,
  getSubmissions,
  gradeSubmission,
  getQuizAttempts,
  StoredUser,
  StoredSubmission,
  StoredQuizAttempt,
} from "@/lib/supabase";
import {
  Users,
  Award,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  ShieldCheck,
  Edit2,
  Save,
  GraduationCap,
  KeyRound,
  FileText,
  Mail,
  Lock,
} from "lucide-react";

interface LecturerPanelProps {
  currentUserRole: string;
  currentUserName: string;
  defaultTab?: "gradebook" | "submissions" | "users";
}

export function LecturerPanel({
  currentUserRole,
  currentUserName,
  defaultTab = "gradebook",
}: LecturerPanelProps) {
  const [activeTab, setActiveTab] = useState<"gradebook" | "submissions" | "users">(defaultTab);

  // Users state
  const [users, setUsers] = useState<StoredUser[]>(getAllUsers());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"LECTURER" | "ADMIN" | "STUDENT">("LECTURER");
  const [newPassword, setNewPassword] = useState("TempPass2026!");
  const [userCreatedMessage, setUserCreatedMessage] = useState<string | null>(null);

  // Submissions state
  const [submissions, setSubmissions] = useState<StoredSubmission[]>(getSubmissions());
  const [selectedSub, setSelectedSub] = useState<StoredSubmission | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(4);
  const [gradingFeedback, setGradingFeedback] = useState("");

  // Quiz attempts state
  const [attempts] = useState<StoredQuizAttempt[]>(getQuizAttempts());

  const isAdmin = currentUserRole === "ADMIN";

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    const created: StoredUser = {
      id: `usr_${Date.now()}`,
      fullName: newFullName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      createdAt: new Date().toISOString(),
    };

    saveUser(created);
    setUsers(getAllUsers());
    setUserCreatedMessage(
      `Account for ${created.fullName} (${created.role}) created successfully! Credentials ready.`,
    );
    setNewFullName("");
    setNewEmail("");
    setShowCreateModal(false);
  };

  const handleOpenGradeModal = (sub: StoredSubmission) => {
    setSelectedSub(sub);
    setGradingScore(sub.grade !== undefined ? sub.grade : sub.maxGrade);
    setGradingFeedback(sub.feedback || "Good work following the rubric guidelines.");
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    gradeSubmission(selectedSub.id, Number(gradingScore), gradingFeedback, currentUserName);
    setSubmissions(getSubmissions());
    setSelectedSub(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Staff Toolbar Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Staff &amp; Facilitator Control Panel
            </span>
            <span className="text-xs text-slate-400">
              Logged in as {currentUserName} ({currentUserRole})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Academic Assessment &amp; Account Management
          </h2>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("gradebook")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "gradebook"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Class Gradebook
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === "submissions"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Submissions &amp; Grading
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === "users"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Staff &amp; Users
            </button>
          )}
        </div>
      </div>

      {userCreatedMessage && (
        <div className="p-4 bg-emerald-50 border-b border-emerald-200 text-xs font-medium text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{userCreatedMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setUserCreatedMessage(null)}
            className="text-emerald-700 hover:underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab 1: Gradebook */}
      {activeTab === "gradebook" && (
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Learner Mastery &amp; Assessment Records
              </h3>
              <p className="text-xs text-slate-500">
                Live verification matrix: Practice Quiz (10/10), Scam Mastery (5/5 requirement for O3), and assignments.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                  <th className="p-3">Learner Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Practice Quiz (10 MCQs)</th>
                  <th className="p-3">Objective O3 Scam Mastery (5/5)</th>
                  <th className="p-3">Group Plan (06b)</th>
                  <th className="p-3">Individual Checklist (09)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users
                  .filter((u) => u.role === "STUDENT")
                  .map((learner) => {
                    const practice = attempts.find(
                      (a) => a.userId === learner.id && a.quizType === "practice_10",
                    );
                    const mastery = attempts.find(
                      (a) => a.userId === learner.id && a.quizType === "mastery_5",
                    );
                    const groupSub = submissions.find(
                      (s) => s.assignmentCode === "MWSHS-W3-GROUP-SUBMIT",
                    );
                    const indSub = submissions.find(
                      (s) => s.assignmentCode === "MWSHS-W3-INDIVIDUAL" && s.userId === learner.id,
                    ) || submissions.find((s) => s.assignmentCode === "MWSHS-W3-INDIVIDUAL");

                    return (
                      <tr key={learner.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{learner.fullName}</span>
                          <span className="text-[11px] text-slate-400">{learner.email}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            Student
                          </span>
                        </td>
                        <td className="p-3">
                          {practice ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {practice.score} / {practice.maxScore} (100%)
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not attempted</span>
                          )}
                        </td>
                        <td className="p-3">
                          {mastery && mastery.score === 5 ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                              <Award className="w-3.5 h-3.5 text-emerald-700" />
                              5/5 Done (Mastery Achieved)
                            </span>
                          ) : mastery ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                              {mastery.score}/5 (Retry Needed)
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Pending</span>
                          )}
                        </td>
                        <td className="p-3">
                          {groupSub?.grade !== undefined ? (
                            <span className="font-medium text-slate-800">
                              {groupSub.grade} / {groupSub.maxGrade} pts
                            </span>
                          ) : groupSub ? (
                            <span className="text-amber-600 font-medium">Submitted (Ungraded)</span>
                          ) : (
                            <span className="text-slate-400 italic">No submission</span>
                          )}
                        </td>
                        <td className="p-3">
                          {indSub?.grade !== undefined ? (
                            <span className="font-medium text-slate-800">
                              {indSub.grade} / {indSub.maxGrade} pt
                            </span>
                          ) : indSub ? (
                            <span className="text-amber-600 font-medium">Submitted</span>
                          ) : (
                            <span className="text-slate-400 italic">Pending</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Submissions & Grading */}
      {activeTab === "submissions" && (
        <div className="p-5 sm:p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Review and Grade Learner Submissions
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate Group Savings Plans (0–4 points) and Individual Checklists (0–1 point) with qualitative feedback.
            </p>
          </div>

          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-white shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-sm">{sub.userName}</span>
                    <span className="text-xs text-slate-400">({sub.assignmentCode})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.status === "graded" ? (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                        Graded: {sub.grade}/{sub.maxGrade} pts
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                        Pending Evaluation
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenGradeModal(sub)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{sub.status === "graded" ? "Edit Grade" : "Grade Now"}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs sm:text-sm font-mono whitespace-pre-line text-slate-800">
                  {sub.content}
                </div>

                {sub.feedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                    <strong>Feedback from {sub.gradedBy || "Facilitator"}: </strong>
                    {sub.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Grading Modal */}
          {selectedSub && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900">
                    Grade Submission: {selectedSub.assignmentCode}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setSelectedSub(null)}
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-xs text-slate-600">
                  Submitting Student: <strong>{selectedSub.userName}</strong>
                </div>

                <form onSubmit={handleSaveGrade} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Awarded Points (Max: {selectedSub.maxGrade} pts)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={selectedSub.maxGrade}
                      step={1}
                      value={gradingScore}
                      onChange={(e) => setGradingScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Evaluator Qualitative Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={gradingFeedback}
                      onChange={(e) => setGradingFeedback(e.target.value)}
                      placeholder="Comment on goal realism, arithmetic accuracy, and risk mitigation..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedSub(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Grade &amp; Feedback</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Staff & User Account Management (Administrator Only) */}
      {isAdmin && activeTab === "users" && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Staff &amp; Account Provisioning (Administrator)
              </h3>
              <p className="text-xs text-slate-500">
                Create new Lecturer / Teacher, Administrator, or Student credentials.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Staff Account</span>
            </button>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs">
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3">Permission Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-bold text-slate-900">{u.fullName}</td>
                    <td className="p-3 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : u.role === "LECTURER"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {u.role === "LECTURER" ? "Lecturer / Teacher" : u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-xs text-slate-500">
                      {u.role === "ADMIN"
                        ? "Full Admin Rights + Staff Creation"
                        : u.role === "LECTURER"
                          ? "Course Grading & Moderate Forum"
                          : "Student Course Participation"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-emerald-600" />
                    Create New Staff / User Account
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Select whether to assign this account as a <strong>Lecturer / Teacher</strong> or <strong>Administrator</strong>.
                </p>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="e.g. Dr. K. Augustine (Lecturer)"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. teacher@moneywise.org"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Role (Select Permission Level)
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) =>
                        setNewRole(e.target.value as "LECTURER" | "ADMIN" | "STUDENT")
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
                    >
                      <option value="LECTURER">Lecturer / Teacher (Can grade &amp; edit)</option>
                      <option value="ADMIN">Administrator (Full system management)</option>
                      <option value="STUDENT">Student / Learner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Initial Password
                    </label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


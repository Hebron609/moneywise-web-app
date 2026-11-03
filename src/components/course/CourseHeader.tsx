"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { DEFAULT_USERS } from "@/lib/supabase";
import {
  ShieldCheck,
  GraduationCap,
  KeyRound,
  LogOut,
  User,
  BookOpen,
  Award,
  Layers,
  Settings,
  Menu,
  X,
  MessageSquare,
  CheckSquare,
  FileText,
  ChevronRight,
  Smartphone,
  Users,
  Video,
  FileSpreadsheet,
} from "lucide-react";

interface CourseHeaderProps {
  currentUser: {
    fullName: string;
    email: string;
    role: string;
  } | null;
  onStaffToggle?: () => void;
  isStaffMode?: boolean;
}

export function CourseHeader({
  currentUser,
  onStaffToggle,
  isStaffMode,
}: CourseHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
    localStorage.removeItem("mw_current_user");
    router.push("/login");
  };

  const handleRoleSwitch = (role: "STUDENT" | "LECTURER" | "ADMIN") => {
    const target = DEFAULT_USERS.find((u) => u.role === role);
    if (target) {
      localStorage.setItem("mw_current_user", JSON.stringify(target));
      useAuthStore.getState().login(
        {
          id: target.id,
          email: target.email,
          firstName: target.fullName.split(" ")[0] || target.fullName,
          lastName: target.fullName.split(" ").slice(1).join(" ") || "User",
          role: target.role,
          enrolledPrograms: ["it404-moneywise-shs"],
        },
        `mock-token-${target.id}`,
      );
      const secure =
        typeof window !== "undefined" && window.location.protocol === "https:"
          ? "; Secure"
          : "";
      document.cookie = `auth_token=present; path=/; SameSite=Lax${secure}`;
      document.cookie = `user_role=${target.role}; path=/; SameSite=Lax${secure}`;
      setMobileMenuOpen(false);
      window.location.reload();
    }
  };

  const isStaff = currentUser?.role === "LECTURER" || currentUser?.role === "ADMIN";

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/course"
            onClick={closeMenu}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  MoneyWise SHS
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  IT404
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Financial Literacy for Rural SHS Learners
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Shortcuts */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <a
              href="#sec-0"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Start Here
            </a>
            <a
              href="#sec-3"
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition"
            >
              Week 3 (Active)
            </a>
            <a
              href="#act-07"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Practice Quiz
            </a>
            <a
              href="#act-08"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Scam Mastery
            </a>
            <a
              href="#act-05"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Forum
            </a>
          </nav>

          {/* Desktop Right User Bar */}
          <div className="hidden md:flex items-center gap-3">
            {isStaff && onStaffToggle && (
              <button
                type="button"
                onClick={onStaffToggle}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isStaffMode
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isStaffMode ? "Close Staff Tools" : "Staff Tools"}</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {currentUser.fullName}
                  </span>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 rounded ${
                      currentUser.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : currentUser.role === "LECTURER"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {currentUser.role === "LECTURER" ? "Lecturer" : currentUser.role}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Action Buttons (Hamburger + Staff Quick Button) */}
          <div className="flex items-center gap-2 md:hidden">
            {isStaff && onStaffToggle && (
              <button
                type="button"
                onClick={onStaffToggle}
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  isStaffMode
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
                title="Toggle Staff Tools"
                aria-label="Toggle Staff Tools"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-5">
            {/* User Profile Card */}
            {currentUser && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        currentUser.role === "ADMIN"
                          ? "bg-purple-600 text-white"
                          : currentUser.role === "LECTURER"
                            ? "bg-blue-600 text-white"
                            : "bg-emerald-600 text-white"
                      }`}
                    >
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {currentUser.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      currentUser.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : currentUser.role === "LECTURER"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>

                {/* Mobile Quick Role Switcher */}
                <div className="pt-2 border-t border-slate-200/70">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Quick Role Switch
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch("STUDENT")}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 border ${
                        currentUser.role === "STUDENT"
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch("LECTURER")}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 border ${
                        currentUser.role === "LECTURER"
                          ? "bg-blue-600 text-white border-blue-600 font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Lecturer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch("ADMIN")}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 border ${
                        currentUser.role === "ADMIN"
                          ? "bg-purple-600 text-white border-purple-600 font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

                {/* Staff Toggle Button in Mobile Drawer */}
                {isStaff && onStaffToggle && (
                  <button
                    type="button"
                    onClick={() => {
                      onStaffToggle();
                      closeMenu();
                    }}
                    className={`mt-2.5 w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      isStaffMode
                        ? "bg-slate-900 text-white"
                        : "bg-blue-600 text-white shadow-sm"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>{isStaffMode ? "Close Staff Panel" : "Open Staff / Lecturer Tools"}</span>
                  </button>
                )}
              </div>
            )}

            {/* Week 3 Active Activities Navigation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Week 3: Active Module
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Saving & Scams
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1 text-xs">
                <a
                  href="#sec-3"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 text-emerald-900 font-bold hover:bg-emerald-100 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>Week 3 Overview & Path</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>

                <a
                  href="#act-07"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>Activity 07: 10-Q Practice Quiz</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="#act-08"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold">Activity 08: Scam Mastery (5/5)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="#act-05"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Activity 05: Discussion Forum</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="#act-04"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-slate-600" />
                    <span>Activity 04: Simulated SMS Cases</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="#act-06a"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Activity 06: Wiki & Group Plan</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="#act-09"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Activity 09: Individual Checklist</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="#act-02"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-rose-600" />
                    <span>Activity 02: 2-Page Note PDF</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="#act-03"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-cyan-600" />
                    <span>Activity 03: Video & Captions</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Course Sections Navigation */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                All 4-Week Sections
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <a
                  href="#sec-0"
                  onClick={closeMenu}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  <div className="font-bold text-slate-900">Start Here</div>
                  <div className="text-[10px] text-slate-500">Orientation & Syllabus</div>
                </a>
                <a
                  href="#sec-1"
                  onClick={closeMenu}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  <div className="font-bold text-slate-900">Week 1</div>
                  <div className="text-[10px] text-slate-500">Needs vs. Wants</div>
                </a>
                <a
                  href="#sec-2"
                  onClick={closeMenu}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  <div className="font-bold text-slate-900">Week 2</div>
                  <div className="text-[10px] text-slate-500">Weekly Budgeting</div>
                </a>
                <a
                  href="#sec-4"
                  onClick={closeMenu}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                  <div className="font-bold text-slate-900">Week 4</div>
                  <div className="text-[10px] text-slate-500">Digital Finance</div>
                </a>
              </div>
            </div>

            {/* Footer / Sign Out */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}



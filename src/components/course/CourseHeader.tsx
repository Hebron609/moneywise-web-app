"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
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

  const handleLogout = () => {
    useAuthStore.getState().logout();
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
    localStorage.removeItem("mw_current_user");
    router.push("/login");
  };

  const isStaff = currentUser?.role === "LECTURER" || currentUser?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/course" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  MoneyWise SHS
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  IT404 Group 4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Financial Literacy for Rural SHS Learners
              </p>
            </div>
          </Link>

          {/* Center Navigation Shortcuts */}
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

          {/* Right User Bar */}
          <div className="flex items-center gap-3">
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
                <span>{isStaffMode ? "Close Staff Tools" : "Staff / Lecturer Tools"}</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
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
        </div>
      </div>
    </header>
  );
}


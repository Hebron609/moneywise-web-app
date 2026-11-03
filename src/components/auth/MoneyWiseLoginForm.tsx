"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { getAllUsers, StoredUser } from "@/lib/supabase";
import {
  ShieldCheck,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";

export function MoneyWiseLoginForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"student" | "staff">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const performLogin = (user: StoredUser) => {
    // Save to Zustand & Cookies
    const verifiedUser = {
      id: user.id,
      email: user.email,
      firstName: user.fullName.split(" ")[0] || user.fullName,
      lastName: user.fullName.split(" ").slice(1).join(" ") || "User",
      role: user.role,
      enrolledPrograms: ["it404-moneywise-shs"],
    };

    useAuthStore.getState().login(verifiedUser, `mock-token-${user.id}`);

    // Set routing cookies
    const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `auth_token=present; path=/; SameSite=Lax${secure}`;
    document.cookie = `user_role=${user.role}; path=/; SameSite=Lax${secure}`;
    localStorage.setItem("mw_current_user", JSON.stringify(user));

    router.push("/course");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const allUsers = getAllUsers();
      const trimmedEmail = email.trim().toLowerCase();

      // Find user
      const matchedUser = allUsers.find(
        (u) => u.email.toLowerCase() === trimmedEmail,
      );

      if (!matchedUser) {
        // If it's a student and user entered a new email, allow instant convenience or prompt signup
        if (activeTab === "student") {
          // Auto create demonstration student if non-existent
          const newStudent: StoredUser = {
            id: `usr_${Date.now()}`,
            email: trimmedEmail,
            fullName: trimmedEmail.split("@")[0].toUpperCase() || "New Student",
            role: "STUDENT",
            createdAt: new Date().toISOString(),
          };
          const users = [...allUsers, newStudent];
          localStorage.setItem("mw_users", JSON.stringify(users));
          performLogin(newStudent);
          return;
        } else {
          setError(
            "Staff / Administrator account not found. Only administrators can create lecturer and admin accounts.",
          );
          setLoading(false);
          return;
        }
      }

      // Check role permissions based on active tab
      if (activeTab === "student" && matchedUser.role !== "STUDENT") {
        // Allow staff to sign in on staff tab or switch them
        setActiveTab("staff");
        setError("This account is registered as staff. Please log in using the Staff / Administrator tab.");
        setLoading(false);
        return;
      }

      if (activeTab === "staff" && matchedUser.role === "STUDENT") {
        setError("This account is a Student account. Please switch to the Student Login tab.");
        setLoading(false);
        return;
      }

      performLogin(matchedUser);
    } catch {
      setError("An unexpected error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: "STUDENT" | "LECTURER" | "ADMIN") => {
    const allUsers = getAllUsers();
    const demo = allUsers.find((u) => u.role === role);
    if (demo) {
      performLogin(demo);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Course Header Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>IT404 Group 4 • MoneyWise SHS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Literacy Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Senior High School safe saving habits & scam detection
          </p>
        </div>

        {/* 1-Click Demo Testing Ribbon */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-3 mb-6 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-2 px-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Quick Demo Access:
            </span>
            <span className="text-slate-400">1-click login</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("STUDENT")}
              className="py-1.5 px-2 bg-slate-700/70 hover:bg-emerald-600/30 hover:border-emerald-500/50 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition flex items-center justify-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("LECTURER")}
              className="py-1.5 px-2 bg-slate-700/70 hover:bg-blue-600/30 hover:border-blue-500/50 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition flex items-center justify-center gap-1"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Lecturer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("ADMIN")}
              className="py-1.5 px-2 bg-slate-700/70 hover:bg-purple-600/30 hover:border-purple-500/50 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition flex items-center justify-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("student");
                setError(null);
                if (email === "lecturer@moneywise.org" || email === "admin@moneywise.org") setEmail("");
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === "student"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Student Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("staff");
                setError(null);
                if (email === "student@moneywise.org") setEmail("");
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === "staff"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <KeyRound className="w-4 h-4 text-blue-600" />
              Staff / Admin
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              {activeTab === "student" ? "Welcome back, Learner!" : "Staff & Lecturer Portal"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === "student"
                ? "Sign in to access Week 3 activities, submit plans, and take quizzes."
                : "Enter your administrator or assigned lecturer credentials."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === "student"
                      ? "student@moneywise.org or your school email"
                      : "lecturer@moneywise.org or admin@moneywise.org"
                  }
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-lg transition flex items-center justify-center gap-2 ${
                activeTab === "student"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
              }`}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>
                    {activeTab === "student" ? "Sign In as Student" : "Sign In to Staff Portal"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Student Signup Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New student joining MoneyWise SHS?{" "}
              <Link
                href="/signup"
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Create Student Account
              </Link>
            </p>
          </div>
        </div>

        {/* Notice for Public vs Admin Links */}
        <div className="mt-6 p-3.5 bg-slate-800/60 border border-slate-700 rounded-2xl text-xs text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-300 font-semibold mb-0.5">Role Management Policy</p>
            <p className="leading-relaxed">
              Anyone visiting the platform can register as a <strong className="text-white">Student</strong>. 
              Lecturer and Administrator logins are securely provisioned by the Project Administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


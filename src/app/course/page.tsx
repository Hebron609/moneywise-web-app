"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserProgress, DEFAULT_USERS, StoredUser } from "@/lib/supabase";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseHero } from "@/components/course/CourseHero";
import { CourseSectionsView } from "@/components/course/CourseSectionsView";
import { LecturerPanel } from "@/components/course/LecturerPanel";

function CoursePageContent() {
  const searchParams = useSearchParams();
  const authStore = useAuthStore();

  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Read stored user from localStorage or Zustand store
    let user: StoredUser | null = null;
    try {
      const stored = localStorage.getItem("mw_current_user");
      if (stored) {
        user = JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    if (!user && authStore.user) {
      user = {
        id: authStore.user.id,
        email: authStore.user.email,
        fullName: `${authStore.user.firstName || ""} ${authStore.user.lastName || ""}`.trim() || "Student Learner",
        role: (authStore.user.role as "STUDENT" | "LECTURER" | "ADMIN") || "STUDENT",
        createdAt: new Date().toISOString(),
      };
    }

    // Default to student demo if visiting without login
    if (!user) {
      user = DEFAULT_USERS[0]; // Addo Mensah
    }

    setCurrentUser(user);

    // Check if staff mode requested via URL or user role
    const tabParam = searchParams.get("tab");
    if (tabParam === "gradebook" || tabParam === "submissions" || tabParam === "admin") {
      setIsStaffMode(true);
    }

    // Load progress
    const progressMap = getUserProgress(user.id);
    const completed = new Set(Object.keys(progressMap));
    setCompletedActivities(completed);
  }, [authStore.user, searchParams]);

  const handleActivityComplete = (code: string) => {
    setCompletedActivities((prev) => new Set([...prev, code]));
  };

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 font-semibold text-sm">
          Loading MoneyWise SHS Course...
        </div>
      </div>
    );
  }

  const isStaff = currentUser.role === "LECTURER" || currentUser.role === "ADMIN";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Top Header */}
      <CourseHeader
        currentUser={currentUser}
        isStaffMode={isStaffMode}
        onStaffToggle={isStaff ? () => setIsStaffMode(!isStaffMode) : undefined}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* If Staff / Admin Mode is active, render LecturerPanel */}
        {isStaff && isStaffMode && (
          <LecturerPanel
            currentUserRole={currentUser.role}
            currentUserName={currentUser.fullName}
            defaultTab={
              searchParams.get("tab") === "submissions"
                ? "submissions"
                : searchParams.get("tab") === "admin"
                  ? "users"
                  : "gradebook"
            }
          />
        )}

        {/* Course Hero Banner with Learning Objectives & Progress */}
        <CourseHero
          completedCount={completedActivities.size}
          totalActivitiesCount={13}
        />

        {/* 4-Week Moodle Modules Container */}
        <CourseSectionsView
          userId={currentUser.id}
          userName={currentUser.fullName}
          userRole={currentUser.role}
          onActivityComplete={handleActivityComplete}
        />
      </main>
    </div>
  );
}

export default function CoursePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-slate-500 font-semibold text-sm">Loading MoneyWise Course...</div>
        </div>
      }
    >
      <CoursePageContent />
    </Suspense>
  );
}

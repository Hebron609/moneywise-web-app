/**
 * Supabase Client & Local Fallback State Manager for MoneyWise LMS
 * Provides zero-dependency REST integration with Supabase when configured,
 * and reliable localStorage demonstration persistence when offline/unconfigured.
 */

export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  role: "STUDENT" | "LECTURER" | "ADMIN";
  createdAt: string;
}

export interface StoredProgress {
  userId: string;
  activityCode: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  maxScore?: number;
  completedAt?: string;
}

export interface StoredQuizAttempt {
  id: string;
  userId: string;
  userName: string;
  quizType: "practice_10" | "mastery_5";
  score: number;
  maxScore: number;
  passed: boolean;
  date: string;
  answers: Record<string, number>;
}

export interface StoredForumPost {
  id: string;
  authorName: string;
  authorRole: string;
  date: string;
  topic: string;
  content: string;
  isPinned?: boolean;
  replies: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    date: string;
    content: string;
  }>;
}

export interface StoredSubmission {
  id: string;
  userId: string;
  userName: string;
  assignmentCode: "MWSHS-W3-GROUP-SUBMIT" | "MWSHS-W3-INDIVIDUAL";
  groupName?: string;
  content: string;
  status: "submitted" | "graded";
  grade?: number;
  maxGrade: number;
  feedback?: string;
  gradedBy?: string;
  submittedAt: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.startsWith("https://"));
};

// Initial demonstration accounts
export const DEFAULT_USERS: StoredUser[] = [
  {
    id: "usr-student-1",
    email: "student@moneywise.org",
    fullName: "Addo Mensah",
    role: "STUDENT",
    createdAt: "2026-10-18T08:00:00Z",
  },
  {
    id: "usr-student-2",
    email: "millicent@moneywise.org",
    fullName: "Millicent Kumado",
    role: "STUDENT",
    createdAt: "2026-10-18T08:30:00Z",
  },
  {
    id: "usr-lecturer-1",
    email: "lecturer@moneywise.org",
    fullName: "Charity Adjei (Course Lecturer)",
    role: "LECTURER",
    createdAt: "2026-10-17T12:00:00Z",
  },
  {
    id: "usr-admin-1",
    email: "admin@moneywise.org",
    fullName: "Israel Ayiku (Project Lead)",
    role: "ADMIN",
    createdAt: "2026-10-16T10:00:00Z",
  },
];

// Helper to safely access browser localStorage
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`mw_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`mw_${key}`, JSON.stringify(value));
  } catch {
    // storage limit or private mode safe
  }
}

// User Management
export function getAllUsers(): StoredUser[] {
  const users = getLocal<StoredUser[]>("users", DEFAULT_USERS);
  let updated = false;
  users.forEach((u) => {
    if (u.id === "usr-student-2" && u.fullName !== "Millicent Kumado") {
      u.fullName = "Millicent Kumado";
      updated = true;
    }
    if (u.id === "usr-lecturer-1" && u.fullName !== "Charity Adjei (Course Lecturer)") {
      u.fullName = "Charity Adjei (Course Lecturer)";
      updated = true;
    }
  });
  if (updated) {
    setLocal("users", users);
  }
  return users;
}

export function saveUser(user: StoredUser): void {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  setLocal("users", users);
}

// Activity Progress Management
export function getUserProgress(userId: string): Record<string, StoredProgress> {
  const all = getLocal<Record<string, StoredProgress>>(`progress_${userId}`, {});
  return all;
}

export function recordActivityCompleted(
  userId: string,
  activityCode: string,
  score?: number,
  maxScore?: number,
): void {
  const current = getUserProgress(userId);
  current[activityCode] = {
    userId,
    activityCode,
    status: "completed",
    score,
    maxScore,
    completedAt: new Date().toISOString(),
  };
  setLocal(`progress_${userId}`, current);
}

// Quiz Attempts & Mastery Tracking
export function getQuizAttempts(userId?: string): StoredQuizAttempt[] {
  const all = getLocal<StoredQuizAttempt[]>("quiz_attempts", [
    {
      id: "demo-attempt-1",
      userId: "usr-student-1",
      userName: "Addo Mensah",
      quizType: "practice_10",
      score: 10,
      maxScore: 10,
      passed: true,
      date: "2026-10-20 06:40",
      answers: {},
    },
    {
      id: "demo-attempt-2",
      userId: "usr-student-1",
      userName: "Addo Mensah",
      quizType: "mastery_5",
      score: 5,
      maxScore: 5,
      passed: true,
      date: "2026-10-20 06:43",
      answers: {},
    },
  ]);

  if (userId) {
    return all.filter((a) => a.userId === userId);
  }
  return all;
}

export function recordQuizAttempt(attempt: Omit<StoredQuizAttempt, "id" | "date">): StoredQuizAttempt {
  const all = getQuizAttempts();
  const newAttempt: StoredQuizAttempt = {
    ...attempt,
    id: `att_${Date.now()}`,
    date: new Date().toLocaleString(),
  };
  all.unshift(newAttempt);
  setLocal("quiz_attempts", all);

  // Update activity completion
  const code = attempt.quizType === "practice_10" ? "MWSHS-W3-QUIZ" : "MWSHS-W3-MASTERY";
  recordActivityCompleted(attempt.userId, code, attempt.score, attempt.maxScore);

  return newAttempt;
}

// Forum Posts Management
export function getForumPosts(): StoredForumPost[] {
  const posts = getLocal<StoredForumPost[]>("forum_posts", [
    {
      id: "post-1",
      authorName: "Charity Adjei (Course Lecturer)",
      authorRole: "LECTURER",
      date: "2026-10-18 09:00",
      topic: "Discuss: pause before you pay",
      content:
        "Choose a fictional scam example from the lesson. In 2–3 sentences, explain one warning sign and the safe next step. Reply to a classmate with an independent verification check.",
      isPinned: true,
      replies: [
        {
          id: "rep-1",
          authorName: "Addo Mensah",
          authorRole: "STUDENT",
          date: "2026-10-19 14:22",
          content:
            "In Case 1, the warning sign is asking for my secret PIN to unblock an account. My safe step is to never disclose my PIN, but call official customer service 100 instead.",
        },
        {
          id: "rep-2",
          authorName: "Millicent Kumado",
          authorRole: "STUDENT",
          date: "2026-10-19 15:45",
          content:
            "Adding to Addo's point: you can also check your wallet balance yourself using the provider's official USSD code. If your wallet works normally, the SMS was clearly fake!",
        },
      ],
    },
  ]);

  // Auto-migrate legacy cached author names in browser storage
  let updated = false;
  posts.forEach((p) => {
    if (p.authorName.includes("Augustine")) {
      p.authorName = "Charity Adjei (Course Lecturer)";
      updated = true;
    }
    p.replies?.forEach((r) => {
      if (r.authorName.includes("Augustine")) {
        r.authorName = "Charity Adjei (Course Lecturer)";
        updated = true;
      }
      if (r.authorName.includes("Osei")) {
        r.authorName = "Millicent Kumado";
        updated = true;
      }
    });
  });
  if (updated) {
    setLocal("forum_posts", posts);
  }
  return posts;
}

export function addForumPost(post: {
  authorName: string;
  authorRole: string;
  topic: string;
  content: string;
}): StoredForumPost {
  const posts = getForumPosts();
  const newPost: StoredForumPost = {
    id: `post_${Date.now()}`,
    authorName: post.authorName,
    authorRole: post.authorRole,
    date: new Date().toLocaleString(),
    topic: post.topic,
    content: post.content,
    replies: [],
  };
  posts.unshift(newPost);
  setLocal("forum_posts", posts);
  return newPost;
}

export function addForumReply(
  postId: string,
  reply: { authorName: string; authorRole: string; content: string },
): void {
  const posts = getForumPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.replies.push({
      id: `rep_${Date.now()}`,
      authorName: reply.authorName,
      authorRole: reply.authorRole,
      date: new Date().toLocaleString(),
      content: reply.content,
    });
    setLocal("forum_posts", posts);
  }
}

// Assignment Submissions Management
export function getSubmissions(): StoredSubmission[] {
  const subs = getLocal<StoredSubmission[]>("submissions", [
    {
      id: "sub-group-1",
      userId: "usr-student-1",
      userName: "Addo Mensah (Demo Group A)",
      assignmentCode: "MWSHS-W3-GROUP-SUBMIT",
      groupName: "Demo Group A",
      content:
        "Goal: Purchase Term 2 Science Textbooks & Geometry Set (GHS 120.00 total) over 6 weeks at GHS 20.00/week.\nArithmetic: GHS 20 × 6 weeks = GHS 120.00.\nNeeds Protection: Lunch stipend (GHS 15/day) remains untouched.\nStorage: Regulated mobile money wallet with biometric authorization.\nRisk & Response: If unexpected costs occur, deadline is extended by 1 week without borrowing.",
      status: "graded",
      grade: 4,
      maxGrade: 4,
      feedback: "Excellent plan! Fictional amounts are realistic, arithmetic is exact, and risk management avoids debt.",
      gradedBy: "Charity Adjei (Course Lecturer)",
      submittedAt: "2026-10-20 06:44",
    },
    {
      id: "sub-ind-1",
      userId: "usr-student-1",
      userName: "Addo Mensah",
      assignmentCode: "MWSHS-W3-INDIVIDUAL",
      content:
        "1. My goal: Save for educational stationery by end of November.\n2. Total amount: GHS 60.00.\n3. Weekly amount: GHS 10.00 per week for 6 weeks.\n4. Essential need protected: Daily transport bus fare.\n5. Safe-saving rule: Never share my wallet PIN or let others operate my phone.\n6. Group contribution: Drafted the initial arithmetic calculation table.",
      status: "graded",
      grade: 1,
      maxGrade: 1,
      feedback: "Complete and thoughtful application of safe saving principles.",
      gradedBy: "Charity Adjei (Course Lecturer)",
      submittedAt: "2026-10-20 06:45",
    },
  ]);

  // Auto-migrate legacy cached grader names in browser storage
  let updated = false;
  subs.forEach((s) => {
    if (s.gradedBy && s.gradedBy.includes("Augustine")) {
      s.gradedBy = "Charity Adjei (Course Lecturer)";
      updated = true;
    }
  });
  if (updated) {
    setLocal("submissions", subs);
  }
  return subs;
}

export function saveSubmission(
  sub: Omit<StoredSubmission, "id" | "status" | "submittedAt">,
): StoredSubmission {
  const all = getSubmissions();
  const newSub: StoredSubmission = {
    ...sub,
    id: `sub_${Date.now()}`,
    status: "submitted",
    submittedAt: new Date().toLocaleString(),
  };
  all.unshift(newSub);
  setLocal("submissions", all);

  recordActivityCompleted(sub.userId, sub.assignmentCode);
  return newSub;
}

export function gradeSubmission(
  submissionId: string,
  grade: number,
  feedback: string,
  gradedBy: string,
): void {
  const all = getSubmissions();
  const sub = all.find((s) => s.id === submissionId);
  if (sub) {
    sub.grade = grade;
    sub.feedback = feedback;
    sub.gradedBy = gradedBy;
    sub.status = "graded";
    setLocal("submissions", all);
  }
}


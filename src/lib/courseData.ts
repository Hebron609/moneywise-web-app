/**
 * MoneyWise SHS: Financial Literacy for Rural SHS Learners
 * Direct faithful port of Moodle course: https://group4moneywise.moodlecloud.com/course/view.php?id=9
 * Group 4 Course ID: 9
 */

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  category: "scam" | "saving";
  question: string;
  options: QuizOption[];
}

export interface SimulatedMessage {
  id: string;
  caseNumber: number;
  messageText: string;
  sender: string;
  time: string;
  category: string;
  warningSigns: string;
  safeNextStep: string;
  explanation: string;
}

export interface CourseSection {
  id: string;
  title: string;
  subtitle?: string;
  status: "active" | "planned";
  summary: string;
  activitiesCount: number;
}

export interface Activity {
  id: string;
  code: string;
  title: string;
  type: "page" | "resource" | "video" | "interactive_messages" | "forum" | "wiki" | "assign" | "quiz" | "mastery_quiz";
  sectionId: string;
  description: string;
  badge?: string;
  maxGrade?: number;
  passGrade?: number;
  estimatedMinutes?: number;
}

export const COURSE_METADATA = {
  id: 9,
  code: "IT404-G4-MWSHS",
  title: "MoneyWise SHS: Financial Literacy for Rural SHS Learners",
  institution: "IT404 Group 4 / Rural Senior High School Initiative",
  duration: "4 Weeks (Sample Week 3 active)",
  sampleWeek: 3,
  objectives: [
    {
      code: "O3",
      title: "Scam Recognition & Fraud Defence",
      description: "By the end of Week 3, learners will be able to identify three common financial scams (e.g., mobile money fraud) with 100% accuracy in a simulated digital quiz (5/5 Scam Mastery).",
    },
    {
      code: "O4",
      title: "Safe Saving Habits & Collaboration",
      description: "By the end of Week 3, learners will be able to demonstrate safe saving habits by participating in a collaborative group task where they outline a savings plan for a small goal.",
    },
  ],
  contextNote: "Use fictional figures only. No real payment or account opening is part of this course. Download the offline reading pack during school access time.",
  facilitatorContact: {
    name: "Charity Adjei (Course Lecturer) / Israel (LMS Lead)",
    email: "lecturer@moneywise.org",
    responseTarget: "Within 24 hours during supervised sessions",
  },
};

export const COURSE_SECTIONS: CourseSection[] = [
  {
    id: "sec-0",
    title: "Start here — Course Welcome & Orientation",
    subtitle: "Course introduction, offline pack, facilitator help",
    status: "active",
    summary: "Welcome to MoneyWise SHS. Review the 4-week learning path, access downloadable offline study guides, and meet your course facilitator.",
    activitiesCount: 2,
  },
  {
    id: "sec-1",
    title: "Week 1: Needs and wants",
    subtitle: "Planned outline",
    status: "planned",
    summary: "Distinguishing basic survival needs from discretionary wants; prioritizing school supplies and essential food before personal leisure.",
    activitiesCount: 3,
  },
  {
    id: "sec-2",
    title: "Week 2: Creating a simple weekly budget",
    subtitle: "Planned outline",
    status: "planned",
    summary: "Tracking small income sources (allowances, gifts, errands); listing recurring weekly expenses; calculating surplus or deficit.",
    activitiesCount: 3,
  },
  {
    id: "sec-3",
    title: "Week 3: Saving safely and spotting scams",
    subtitle: "Full Interactive Prototype — Active",
    status: "active",
    summary: "Mastering safe saving habits, collaborative savings planning, identifying mobile money fraud, and passing the 100% scam mastery requirement.",
    activitiesCount: 10,
  },
  {
    id: "sec-4",
    title: "Week 4: Digital finance choices and reflection",
    subtitle: "Planned outline",
    status: "planned",
    summary: "Comparing mobile money providers, safe wallet management, susu groups vs credit unions, and compiling personal learning reflections.",
    activitiesCount: 3,
  },
];

export const WEEK_3_ACTIVITIES: Activity[] = [
  {
    id: "act-00",
    code: "MWSHS-W3-OFFLINE",
    title: "00 Download: offline reading and practice pack",
    type: "resource",
    sectionId: "sec-3",
    description: "Download the two-page PDF and practice pack (ZIP) during school Wi-Fi or computer lab hours to study offline without using mobile data.",
    estimatedMinutes: 5,
  },
  {
    id: "act-01",
    code: "MWSHS-W3-OVERVIEW",
    title: "01 Start here: Week 3 overview",
    type: "page",
    sectionId: "sec-3",
    description: "Learning roadmap, objectives O3 & O4, guidelines on using fictional amounts, and step-by-step route through the week.",
    estimatedMinutes: 10,
  },
  {
    id: "act-02",
    code: "MWSHS-W3-PDF",
    title: "02 Read: saving safely (two-page PDF)",
    type: "resource",
    sectionId: "sec-3",
    description: "Core reading note explaining safe custodians, paying yourself first, avoiding unverified high-yield schemes, and keeping credentials secret.",
    estimatedMinutes: 20,
  },
  {
    id: "act-03",
    code: "MWSHS-W3-VIDEO",
    title: "03 Watch: spot the fake message",
    type: "video",
    sectionId: "sec-3",
    description: "Short educational video (2 min) demonstrating warning signs for PIN theft, wrong-transfer scams, and upfront fee demands. Subtitles and transcript provided.",
    estimatedMinutes: 10,
  },
  {
    id: "act-03b",
    code: "MWSHS-W3-TRANSCRIPT",
    title: "03b Read the video transcript",
    type: "page",
    sectionId: "sec-3",
    description: "Complete text transcript with pattern breakdown: account impersonation, claimed wrong transfers, and advance-fee lottery scams.",
    estimatedMinutes: 8,
  },
  {
    id: "act-04",
    code: "MWSHS-W3-PRACTICE",
    title: "04 Practise: five simulated messages",
    type: "interactive_messages",
    sectionId: "sec-3",
    description: "Interactive SMS simulation: analyse 5 fictional phone messages, identify the warning signs, formulate safe actions, and reveal official guidance.",
    estimatedMinutes: 20,
  },
  {
    id: "act-05",
    code: "MWSHS-W3-FORUM",
    title: "05 Discuss: pause before you pay",
    type: "forum",
    sectionId: "sec-3",
    description: "Discussion forum: share one scam pattern and your safe next step. Reply constructively to a classmate with an independent verification check.",
    estimatedMinutes: 20,
  },
  {
    id: "act-06a",
    code: "MWSHS-W3-WIKI",
    title: "06a Collaborate: group savings-plan wiki",
    type: "wiki",
    sectionId: "sec-3",
    description: "Collaborate in groups of 3–4 learners. Draft target goals, weekly contributions, arithmetic, protected needs, and risk mitigation.",
    estimatedMinutes: 25,
  },
  {
    id: "act-06b",
    code: "MWSHS-W3-GROUP-SUBMIT",
    title: "06b Submit: final group savings plan",
    type: "assign",
    sectionId: "sec-3",
    description: "One submission per group. Assessed on 4-point rubric: realistic goal (1 pt), correct arithmetic (1 pt), safe provider choice (1 pt), risk response (1 pt).",
    maxGrade: 4,
    estimatedMinutes: 15,
  },
  {
    id: "act-07",
    code: "MWSHS-W3-QUIZ",
    title: "07 Check: 10-question saving and scams quiz",
    type: "quiz",
    sectionId: "sec-3",
    description: "Formative 10-question assessment covering Part A (5 scams) and Part B (5 safe saving concepts). Immediate feedback and retries enabled.",
    maxGrade: 10,
    estimatedMinutes: 15,
  },
  {
    id: "act-08",
    code: "MWSHS-W3-MASTERY",
    title: "08 Mastery: scam recognition — all five correct",
    type: "mastery_quiz",
    sectionId: "sec-3",
    description: "High-stakes mastery check (Objective O3): 5 scam questions. Requires 100% (5/5) to pass. Unlimited retries until full mastery is achieved.",
    maxGrade: 5,
    passGrade: 5,
    badge: "100% Required",
    estimatedMinutes: 10,
  },
  {
    id: "act-09",
    code: "MWSHS-W3-INDIVIDUAL",
    title: "09 Submit: your individual savings checklist",
    type: "assign",
    sectionId: "sec-3",
    description: "Individual learner reflection: personal fictional goal, weekly breakdown, essential need protected, and safe rule applied (Max 1 pt).",
    maxGrade: 1,
    estimatedMinutes: 10,
  },
  {
    id: "act-10",
    code: "MWSHS-W3-HELP",
    title: "10 Need help? / Course help forum",
    type: "forum",
    sectionId: "sec-3",
    description: "Ask questions regarding technical issues, quiz questions, or group work to your facilitator and LMS lead.",
    estimatedMinutes: 5,
  },
];

export const SIMULATED_MESSAGES: SimulatedMessage[] = [
  {
    id: "case-1",
    caseNumber: 1,
    sender: "MoMo Alert (Unverified)",
    time: "10:14 AM",
    messageText: "Your wallet is blocked due to suspicious activity. Send your PIN now to 0244-XXX-XXX to unblock immediately.",
    category: "PIN Theft / Impersonation",
    warningSigns: "Direct demand for secret PIN, urgency threat ('unblock immediately'), unverified sender.",
    safeNextStep: "Never disclose your PIN to anyone. Stop and call the mobile network provider directly on their official toll-free shortcode (e.g. 100).",
    explanation: "PIN theft / impersonation. No official service provider or bank will ever ask for your secret PIN or OTP. Contact the provider independently using a known trusted channel.",
  },
  {
    id: "case-2",
    caseNumber: 2,
    sender: "Caller +233 55 982 XXXX",
    time: "02:30 PM",
    messageText: "I mistakenly sent GHS200 to your mobile money number! Reverse it back right now or I will report you to the police!",
    category: "Wrong-Transfer Scam / Pressure Tactics",
    warningSigns: "Threats of police action, urgency, pressure to send money without independent transaction verification.",
    safeNextStep: "Do not send any money. Check your actual wallet balance and SMS statement from the official provider. Contact customer care to reverse genuine transactions.",
    explanation: "Possible wrong-transfer scam. Scammers send fake SMS notifications pretending money arrived and intimidate the victim into sending real funds. Verify transaction history through an official channel and ask the provider to handle any genuine reversal.",
  },
  {
    id: "case-3",
    caseNumber: 3,
    sender: "Promo Winner Desk",
    time: "07:45 PM",
    messageText: "CONGRATULATIONS! You have been selected to win a brand new iPhone 15 Pro. Pay GHS50 delivery and processing fee now to release your prize.",
    category: "Advance-Fee Prize Scam",
    warningSigns: "Unsolicited lottery/prize, requirement to pay money in advance to receive a 'free' reward.",
    safeNextStep: "Delete the message and do not pay any fee. Genuine competitions never require winners to transfer processing fees.",
    explanation: "Advance-fee prize scam. Do not pay an unknown sender; verify the promotion on the company's verified social media or official store.",
  },
  {
    id: "case-4",
    caseNumber: 4,
    sender: "Quick Wealth Club",
    time: "11:05 AM",
    messageText: "Double your savings in 24 hours! Special youth promotion: Invest GHS100 now and receive GHS200 guaranteed tomorrow. Only 10 slots remaining, send now!",
    category: "Ponzi / Fake Investment Scheme",
    warningSigns: "Unrealistic guaranteed return ('double in 24 hours'), false urgency ('only 10 slots left').",
    safeNextStep: "Decline and ignore the offer. Discuss with a trusted parent or facilitator. Real investments involve risk and regulated timelines.",
    explanation: "Suspicious high-yield investment scam. Decline pressure to transfer money; check provider licensing with the Bank of Ghana or SEC.",
  },
  {
    id: "case-5",
    caseNumber: 5,
    sender: "Bank Verification Unit",
    time: "04:12 PM",
    messageText: "Critical security alert: unauthorized login detected. Tap http://bank-secure-verify.momo-login.net/auth to confirm your 6-digit verification code.",
    category: "Phishing / Link Harvesting",
    warningSigns: "Suspicious non-official URL, alarming threat, prompt to enter one-time authorization code on an external link.",
    safeNextStep: "Do not click the link or disclose your one-time code. Close the message and open your official banking app or visit the physical branch.",
    explanation: "Phishing / credential harvesting. Fraudsters clone official login portals to steal one-time codes and passwords. Never follow links in SMS alerts.",
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "A01",
    category: "scam",
    question: "A message says: “Your account is blocked. Send your PIN to unblock it.” What should you do?",
    options: [
      {
        text: "Send the PIN quickly",
        isCorrect: false,
        feedback: "A PIN request is a major warning sign; do not disclose it under any circumstances.",
      },
      {
        text: "Reply asking who they are",
        isCorrect: false,
        feedback: "Do not engage with the message. Verify independently using a known official channel.",
      },
      {
        text: "Keep the PIN private and contact the provider independently",
        isCorrect: true,
        feedback: "Correct! Use an official channel you already trust (e.g. shortcode 100), not the contact supplied in the suspicious message.",
      },
      {
        text: "Forward the message to friends",
        isCorrect: false,
        feedback: "Forwarding can spread the scam to classmates. Ask a trusted adult or facilitator for help instead.",
      },
    ],
  },
  {
    id: "A02",
    category: "scam",
    question: "Someone claims to have sent GHS200 to you by mistake and demands an immediate refund before they call the police. What is the safest first step?",
    options: [
      {
        text: "Send the money immediately",
        isCorrect: false,
        feedback: "A threatening message alone does not prove a transfer occurred.",
      },
      {
        text: "Check transaction history independently and contact the provider through an official channel",
        isCorrect: true,
        feedback: "Correct! Verify your real balance and let the service provider guide any genuine reversal; do not send money under pressure.",
      },
      {
        text: "Send half the requested amount",
        isCorrect: false,
        feedback: "Sending partial funds still risks losing your own hard-earned savings.",
      },
      {
        text: "Give the caller your PIN to reverse it",
        isCorrect: false,
        feedback: "Keep your PIN strictly confidential. No caller should ever obtain it.",
      },
    ],
  },
  {
    id: "A03",
    category: "scam",
    question: "An unsolicited message says you won a phone but must send GHS50 first to release it. What is the main warning sign?",
    options: [
      {
        text: "It mentions a phone",
        isCorrect: false,
        feedback: "The item alone does not identify a scam.",
      },
      {
        text: "An unexpected prize is conditional on sending money first",
        isCorrect: true,
        feedback: "Correct! Genuine contests never ask winners to send money upfront to release prizes. Stop and verify independently.",
      },
      {
        text: "It is a school notice",
        isCorrect: false,
        feedback: "Nothing in this example establishes a verified school sender.",
      },
      {
        text: "It includes a money amount",
        isCorrect: false,
        feedback: "Amounts can appear in genuine messages. The unsolicited advance-fee demand is the critical warning sign.",
      },
    ],
  },
  {
    id: "A04",
    category: "scam",
    question: "Which combination is a strong warning sign of a financial scam?",
    options: [
      {
        text: "Pressure to act immediately and a request for a PIN, code or payment",
        isCorrect: true,
        feedback: "Correct! Pressure to rush combined with requests for confidential credentials or quick transfers is the classic signature of fraud.",
      },
      {
        text: "A long message",
        isCorrect: false,
        feedback: "Length alone does not distinguish a scam from a genuine notification.",
      },
      {
        text: "A message sent at night",
        isCorrect: false,
        feedback: "Time of delivery alone is not a definitive test.",
      },
      {
        text: "A message written in English",
        isCorrect: false,
        feedback: "Language alone does not determine authenticity.",
      },
    ],
  },
  {
    id: "A05",
    category: "scam",
    question: "A caller promises to double GHS100 in 24 hours if you send it now. What should you do?",
    options: [
      {
        text: "Send GHS100 to try it",
        isCorrect: false,
        feedback: "Do not transfer money to test an unverified offer; you will lose it.",
      },
      {
        text: "Send GHS20 as a small test",
        isCorrect: false,
        feedback: "A smaller transfer is still lost, or scammers send fake returns to lure bigger sums.",
      },
      {
        text: "Decline and report the suspicious offer through an official channel",
        isCorrect: true,
        feedback: "Correct! Unrealistic guaranteed returns with artificial urgency are fraudulent. Verify regulatory status before taking action.",
      },
      {
        text: "Tell classmates to join",
        isCorrect: false,
        feedback: "Sharing unverified schemes exposes your friends and family to financial loss.",
      },
    ],
  },
  {
    id: "B01",
    category: "saving",
    question: "Which is the strongest starting point when choosing where to keep savings?",
    options: [
      {
        text: "An unverified investor promising very high returns",
        isCorrect: false,
        feedback: "High-return promises without licensing indicate high risk or outright scams.",
      },
      {
        text: "A licensed provider with suitable terms, eligibility and access checked with a trusted adult",
        isCorrect: true,
        feedback: "Correct! Always check licensing, fees, withdrawal terms, and age rules with a parent or teacher. No provider is risk-free.",
      },
      {
        text: "A friend’s personal wallet",
        isCorrect: false,
        feedback: "You lose direct control over your funds and records.",
      },
      {
        text: "A wallet whose PIN is shared with classmates",
        isCorrect: false,
        feedback: "A shared PIN exposes your savings to unauthorized withdrawal or loss.",
      },
    ],
  },
  {
    id: "B02",
    category: "saving",
    question: "What does “pay yourself first” mean in a savings plan?",
    options: [
      {
        text: "Spend first and hope something is left",
        isCorrect: false,
        feedback: "This leaves savings dependent on random leftovers and usually results in zero savings.",
      },
      {
        text: "Plan to set aside an affordable amount when money arrives",
        isCorrect: true,
        feedback: "Correct! Treat your savings as a priority commitment the moment money arrives, while budgeting for essential needs.",
      },
      {
        text: "Borrow money simply to meet the savings target",
        isCorrect: false,
        feedback: "Borrowing to save creates unnecessary debt interest. Keep your plan affordable.",
      },
      {
        text: "Never spend any money",
        isCorrect: false,
        feedback: "A realistic budget must provide for essential living expenses like food and school supplies.",
      },
    ],
  },
  {
    id: "B03",
    category: "saving",
    question: "A practice goal is to save GHS120 in six weeks. What weekly amount reaches the goal?",
    options: [
      {
        text: "GHS10",
        isCorrect: false,
        feedback: "10 × 6 = GHS60, which only achieves half of the 120 target.",
      },
      {
        text: "GHS15",
        isCorrect: false,
        feedback: "15 × 6 = GHS90, which is below the 120 target.",
      },
      {
        text: "GHS20",
        isCorrect: true,
        feedback: "Correct! GHS120 ÷ 6 weeks = GHS20 per week.",
      },
      {
        text: "GHS30",
        isCorrect: false,
        feedback: "30 × 6 = GHS180, which exceeds the needed target.",
      },
    ],
  },
  {
    id: "B04",
    category: "saving",
    question: "Which goal is specific and measurable with a deadline?",
    options: [
      {
        text: "Save more money",
        isCorrect: false,
        feedback: "Lacks a specific target amount, timeline, and measurable indicator.",
      },
      {
        text: "Save GHS10 each week for eight weeks for a GHS80 textbook set",
        isCorrect: true,
        feedback: "Correct! It specifies the exact weekly amount (GHS10), timeline (8 weeks), target cost (GHS80), and specific educational purpose.",
      },
      {
        text: "Be rich",
        isCorrect: false,
        feedback: "This is a vague wish without numbers or deadlines.",
      },
      {
        text: "Save whenever possible",
        isCorrect: false,
        feedback: "Does not define how much or by when.",
      },
    ],
  },
  {
    id: "B05",
    category: "saving",
    question: "Which detail must never appear in the group’s shared savings plan?",
    options: [
      {
        text: "The practice goal",
        isCorrect: false,
        feedback: "A hypothetical target goal is an essential part of the plan.",
      },
      {
        text: "The weekly practice amount",
        isCorrect: false,
        feedback: "A hypothetical amount is needed to show the arithmetic calculation.",
      },
      {
        text: "A real wallet PIN",
        isCorrect: true,
        feedback: "Correct! Keep PINs, passwords, and real phone numbers private. Always use fictional amounts and placeholder names.",
      },
      {
        text: "The target date",
        isCorrect: false,
        feedback: "The target completion date is required to track milestones.",
      },
    ],
  },
];

export const VIDEO_TRANSCRIPT = `MoneyWise SHS — Spot the fake message
Synthetic narration for the educational prototype. All examples are fictional.

Pause before you pay
Welcome to MoneyWise SHS, Week Three. In this lesson, practise spotting three scam patterns: an account warning that asks for secrets, a claimed wrong transfer, and an unexpected prize or rapid-return offer. The messages are fictional. You will not make a payment or open an account. A safe response starts with pausing before you act.

Pattern 1: account impersonation
Imagine a message says: Your account is blocked. Send your PIN now. The request for your PIN is the warning sign. Keep your PIN and verification codes private. Do not reply to prove who you are. Contact the provider using an official channel you already trust, rather than the number or link in the message.

Pattern 2: a claimed wrong transfer
Now imagine a caller says money was sent to you by mistake and demands an immediate refund. A message alone does not prove a transfer occurred. Check your transaction history independently. Contact the provider through its official channel, and let it guide any genuine reversal. Do not send money because someone threatens or rushes you.

Pattern 3: pay first, win later
A third message offers a prize if you pay a release fee, or promises to double your money today. These are warning signs that need independent checking. Do not send a small test payment, and do not forward the offer as a recommendation. Ask a trusted adult or the facilitator for help. Attractive wording does not establish that an offer is genuine.

Stop • check • ask for help
Remember three steps: stop, check, and ask for help. Stop before sharing money or secrets. Check independently through a known official channel. Report concerns using that channel, with help from a trusted adult when needed. Next, try the five practice messages. Explain the warning sign and the action you would take. Then complete the forum, group savings plan and quiz.

Sources: Cyber Security Authority, https://www.csa.gov.gh/mobile_money_fraud.php; MTN Ghana, https://mtn.com.gh/newsabout/scam-alert-protect-your-personal-information/`;

export const DEMO_FORUM_POSTS = [
  {
    id: "post-1",
    authorName: "Charity Adjei (Course Lecturer)",
    authorRole: "LECTURER",
    date: "2026-10-18 09:00",
    topic: "Welcome to Week 3: Pause Before You Pay Discussion",
    content: "Welcome learners! Choose a fictional scam example from the lesson. In 2–3 sentences, explain one critical warning sign and the safe next step. Remember: never share real phone numbers or PINs in this forum.",
    replies: [
      {
        id: "rep-1",
        authorName: "Addo Mensah",
        authorRole: "STUDENT",
        date: "2026-10-19 14:22",
        content: "In Case 1, the warning sign is asking for my secret PIN to unblock an account. My safe step is to never reply with my PIN, but rather visit an official service centre or call toll-free 100.",
      },
      {
        id: "rep-2",
        authorName: "Millicent Kumado",
        authorRole: "STUDENT",
        date: "2026-10-19 15:45",
        content: "Adding to Addo's point: you can also verify your account balance yourself via USSD without clicking links. If your wallet actually works, then the SMS was 100% fake!",
      },
    ],
  },
];

export const DEMO_WIKI_CONTENT = {
  groupName: "Demo Group A (SHS Learners)",
  lastEditedBy: "Millicent Kumado & Addo Mensah",
  lastEditedAt: "2026-10-20 06:34",
  goal: "Purchase of Term 2 Science Textbooks & Geometry Set",
  targetAmount: "GHS 120.00",
  timeline: "6 weeks (GHS 20.00 per week)",
  arithmetic: "GHS 20.00 / week × 6 weeks = GHS 120.00 total.",
  essentialNeedsProtected: "Daily school lunch allowance (GHS 15/day) is protected. Only discretionary snack money is saved.",
  safeStorageChoice: "Bank of Ghana licensed student savings account or registered custodian mobile wallet with biometric / secret PIN.",
  riskAndResponse: "Risk: Unexpected school excursion fee. Response: Group members agree to extend the deadline by 1 week rather than borrowing at high interest.",
  revisions: [
    {
      author: "Addo Mensah",
      date: "2026-10-19 16:10",
      change: "Created initial draft: agreed on 6-week textbook goal and arithmetic.",
    },
    {
      author: "Millicent Kumado",
      date: "2026-10-20 06:34",
      change: "Added safe storage comparison and risk mitigation plan for unexpected costs.",
    },
  ],
};


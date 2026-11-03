# MoneyWise SHS — Financial Literacy Platform (IT404 Group 4)

A dedicated Next.js web application replacing the Moodle course for **MoneyWise SHS: Financial Literacy for Rural SHS Learners** (Course ID: 9, https://group4moneywise.moodlecloud.com/course/view.php?id=9).

---

## Features

1. **Faithful 4-Week Moodle Replication**:
   - **Start Here**: Orientation, syllabus, rural SHS context, facilitator office hours, and offline downloads.
   - **Week 1 & Week 2**: Planned outlines for needs/wants and simple weekly budgeting.
   - **Week 3: Saving Safely and Spotting Scams (Fully Active Module)**:
     - **Activity 00**: Offline pack download (`Saving_Safely_Two_Page_Note.pdf`, `Week_3_Offline_Reading_Pack.zip`).
     - **Activity 01**: Week 3 overview & learning path (Objectives O3 & O4).
     - **Activity 02**: Embedded PDF reader with download for the 2-page safe saving note.
     - **Activity 03 & 03b**: HTML5 captioned video player (`Spot_The_Fake_Message.mp4` with `Spot_The_Fake_Message.en.vtt`) & expandable transcript.
     - **Activity 04**: Interactive 5 simulated SMS messages with diagnosis inputs & official model analysis reveal.
     - **Activity 05**: Interactive discussion forum with thread creation, replies, and pinned facilitator messages.
     - **Activity 06a**: Collaborative Group Savings Plan Wiki with multi-member revision history (Addo Mensah & Millicent Osei).
     - **Activity 06b**: Final Group Savings Plan assignment submission evaluated on the 4-point rubric.
     - **Activity 07**: 10-Question Saving & Scams Practice Quiz with immediate feedback and explanations.
     - **Activity 08**: 5-Question Scam Mastery Check (Pass requirement: 5/5 to achieve Objective O3, with retry loop).
     - **Activity 09**: Individual Savings Checklist submission form (1-point rubric).
     - **Activity 10**: Facilitator Q&A and course help.
   - **Week 4**: Planned outline for digital finance choices and course reflection.

2. **Role-Based Authentication & Policies**:
   - **Public Registration (`/signup`)**: Anyone visiting the platform can register **strictly as a Student**.
   - **Staff & Admin Logins (`/login`)**:
     - Pre-configured demo logins:
       - **Student**: `student@moneywise.org` (Addo Mensah)
       - **Lecturer**: `lecturer@moneywise.org` (Augustine K. - Facilitator)
       - **Administrator**: `admin@moneywise.org` (Israel Ayiku - Project Lead)
   - **Staff Management Console**: When logged in as Administrator, you can create new accounts and select their role (**Lecturer / Teacher**, **Administrator**, or **Student**).
   - **Lecturer Academic Toolbar**: Toggle into Staff Mode to view the **Class Gradebook** (10/10 practice scores, 5/5 scam mastery) and evaluate submissions with rubrics and feedback.

3. **Supabase PostgreSQL Backend**:
   - Schema file: `supabase/schema.sql` (tables for profiles, activity progress, quiz attempts, forum threads, wiki, assignments).
   - Dual-mode client in `src/lib/supabase.ts`: Connects to Supabase when environment variables are set, and falls back to persistent demonstration storage when offline.

---

## Getting Started Locally

```bash
# Install dependencies (already pre-installed)
npm install

# Run the development server
npm run dev

# Open in your browser
http://localhost:3000
```

---

## Connecting Supabase

1. Open your project at [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New query**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. Copy your **Project URL** and **anon public key** from **Project Settings** -> **API**.
5. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## Deploying to Vercel

1. Initialize git and push to GitHub:
   ```bash
   cd "/Users/CEO/Desktop/moneywise-web-app"
   git init
   git add .
   git commit -m "Initial commit for MoneyWise SHS Next.js platform"
   git branch -M master
   # Link to your GitHub repository
   # git remote add origin https://github.com/<your-username>/moneywise-shs.git
   # git push -u origin master
   ```
2. Import the project in [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

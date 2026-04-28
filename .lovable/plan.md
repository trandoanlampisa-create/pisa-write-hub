## PISA IELTS Writing Hub — MVP Build Plan

A polished, frontend-first MVP using the full PISA IELTS design language, with mock data and a Supabase-ready code structure (so we can wire up Lovable Cloud + real AI in a follow-up step).

### What we'll build in this pass

**Design system (foundation)**
- Load Manrope + Plus Jakarta Sans from Google Fonts
- Map all PISA tokens (navy, pink, yellow, purple, gray, mint, etc.) into `index.css` as HSL semantic tokens and into `tailwind.config.ts`
- Custom Button variants: `primary` (navy), `accent` (pink), `yellow`, `outline`, `ghost` — all pill-shaped
- Card, badge, progress, and chip styles aligned to spec

**Reusable components**
Navbar, HeroBanner, MetricCard, BandChip, StatusBadge, EssayCard, FeedbackPanel, ScoreInput, ProgressBar, TaskCard, StudentProgressTimeline, EmptyState, LoadingState

**Pages / routes**
1. `/` — Landing page (navy hero + pink bubble, feature cards, dashboard preview)
2. `/login` and `/signup` — Auth screens with role selector (Student / Teacher) — mock auth via localStorage for now
3. `/student` — Student dashboard (greeting, 4 metric cards, latest feedback, assigned tasks)
4. `/student/write/:taskId` — Writing workspace (prompt left, editor right, word count, timer, save draft / submit)
5. `/student/feedback/:submissionId` — Feedback view (essay, criterion scores, sample essay, next steps)
6. `/teacher` — Teacher dashboard (metrics, submissions table with filters)
7. `/teacher/tasks/new` — Create writing task
8. `/teacher/review/:submissionId` — Two-column review workspace with score inputs, feedback fields, and "Generate sample essay" modal
9. `/teacher/student/:studentId` — Student progress page (timeline, notes, repeated issues)
10. `/settings` — Profile settings

**AI sample essay generator**
- Modal with target band selector (5.5–8.0), style selector, instruction textbox, editable output
- `generateSampleEssay()` placeholder function with the exact prompt template provided — returns mock text now, structured to swap in a Lovable AI edge function later
- Teacher must approve before sending (no auto-send)

**Mock data layer**
- `src/data/mockData.ts` with realistic students, tasks, submissions, feedback
- TypeScript interfaces matching the Supabase schema (profiles, writing_tasks, essay_submissions, teacher_feedback, student_progress_notes, classes) so wiring real backend later is a drop-in

### Technical details

- React Router for all routes; role-based dashboards gated by mock auth context
- Tailwind semantic tokens only — no raw hex in components
- Pill buttons everywhere, 12–16px card radius, navy headings, pink CTAs
- Writing-skill progress bars use yellow per spec
- AI/sample-essay UI uses purple badges
- Mint badges for "reviewed" / "completed" status
- Mobile-responsive: stacked layouts on small screens, two-column on desktop for review workspace

### Explicitly NOT in this pass (per your "MVP rules")

- Real Supabase backend, real auth, real AI calls — all stubbed but structured for easy wiring
- Payments, attendance, live classes, chat, parent portal

### Follow-up (after you approve this MVP)

Once you're happy with the look and flows, I'll enable Lovable Cloud, create the actual tables + RLS, swap mock auth for real auth, and connect `generateSampleEssay()` to Lovable AI Gateway.

Approve and I'll start building.

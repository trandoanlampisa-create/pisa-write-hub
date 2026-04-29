import { Link, Navigate, useParams } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { BandChip } from "@/components/pisa/BandChip";
import { MetricCard } from "@/components/pisa/MetricCard";
import { ProgressBar } from "@/components/pisa/ProgressBar";
import { StudentProgressTimeline } from "@/components/pisa/StudentProgressTimeline";
import { StatusBadge, submissionStatusBadge } from "@/components/pisa/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  getProfile,
  getProgressNotesByStudent,
  getSubmissionsByStudent,
  getTask,
} from "@/data/mockData";
import { ArrowLeft } from "lucide-react";

const StudentProgress = () => {
  const { profile } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const student = getProfile(studentId ?? "");

  if (!profile) return <Navigate to="/login?role=teacher" replace />;
  if (!student) {
    return <PageShell><div className="pisa-card text-center">Student not found.</div></PageShell>;
  }

  const notes = getProgressNotesByStudent(student.id);
  const subs = getSubmissionsByStudent(student.id);
  const current = notes.length ? notes[notes.length - 1].estimated_band : 0;
  const target = student.target_band ?? 7;

  // Aggregate "repeated issues" from progress notes' focus areas
  const focusCounts = notes.reduce<Record<string, number>>((acc, n) => {
    acc[n.focus_area] = (acc[n.focus_area] ?? 0) + 1;
    return acc;
  }, {});
  const repeatedIssues = Object.entries(focusCounts)
    .filter(([, count]) => count >= 2)
    .map(([area]) => area);

  return (
    <PageShell className="space-y-5">
      <Button asChild variant="ghost" size="sm">
        <Link to="/teacher"><ArrowLeft className="h-3.5 w-3.5" /> Dashboard</Link>
      </Button>

      <header className="pisa-card-navy relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-pisa-pink opacity-25" />
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-pisa-yellow opacity-15" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="pisa-tag text-pisa-yellow">Student profile</p>
            <h1 className="font-display text-2xl md:text-3xl text-white mt-2">{student.full_name}</h1>
            <p className="text-white/70 text-sm">{student.class_name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BandChip label="Current" band={current ? current.toFixed(1) : "—"} variant="current" />
            <BandChip label="Target" band={target.toFixed(1)} variant="target" />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Essays submitted" value={subs.length} accent="navy" />
        <MetricCard label="Reviewed" value={subs.filter((s) => s.status === "reviewed").length} accent="mint" />
        <MetricCard label="Progress notes" value={notes.length} accent="purple" />
        <MetricCard label="Repeated focus" value={repeatedIssues.length} accent="pink" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="pisa-card lg:col-span-2">
          <h2 className="font-display text-lg text-pisa-navy">Writing progress timeline</h2>
          <p className="text-[12px] text-muted-foreground">
            Estimated band over time, with each progress note saved by you.
          </p>
          <div className="mt-5">
            <StudentProgressTimeline notes={notes} />
          </div>

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5">
              Writing skill — {current.toFixed(1)} → {target.toFixed(1)}
            </p>
            <ProgressBar value={(current / target) * 100} color="yellow" />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="pisa-card">
            <h3 className="font-display text-base text-pisa-navy">Repeated issues</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {repeatedIssues.length ? (
                repeatedIssues.map((r) => (
                  <StatusBadge key={r} variant="pink">{r}</StatusBadge>
                ))
              ) : (
                <p className="text-[13px] text-muted-foreground">No recurring issues yet.</p>
              )}
            </div>
          </div>

          <div className="pisa-card">
            <h3 className="font-display text-base text-pisa-navy">Long-term action plan</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-foreground/85 leading-relaxed">
              <li>· Drill subject-verb agreement and articles weekly.</li>
              <li>· Build collocation bank for common Task 2 themes.</li>
              <li>· Practise paraphrasing question prompts each session.</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="pisa-card">
        <h2 className="font-display text-lg text-pisa-navy mb-3">All essays</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Task</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Words</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => {
                const t = getTask(s.task_id);
                return (
                  <tr key={s.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-3 max-w-[300px] truncate">{t?.title}</td>
                    <td className="py-3 pr-3">
                      <StatusBadge variant={t?.task_type === "task1" ? "navy" : "purple"}>
                        {t?.task_type === "task1" ? "Task 1" : "Task 2"}
                      </StatusBadge>
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">{s.word_count}</td>
                    <td className="py-3 pr-3">{submissionStatusBadge(s.status)}</td>
                    <td className="py-3 pr-0 text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/teacher/review/${s.id}`}>Open</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {subs.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No essays yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
};

export default StudentProgress;
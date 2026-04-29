import { Link, Navigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
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
  getFeedbackBySubmission,
} from "@/data/mockData";
import { ArrowLeft, Download, FileDown } from "lucide-react";
import { toast } from "sonner";

const StudentProgress = () => {
  const { profile } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const student = getProfile(studentId ?? "");
  const now = new Date();
  const [reportMonth, setReportMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );

  if (!profile) return <Navigate to="/login?role=teacher" replace />;
  if (!student) {
    return <PageShell><div className="pisa-card text-center">Student not found.</div></PageShell>;
  }

  const notes = getProgressNotesByStudent(student.id);
  const subs = getSubmissionsByStudent(student.id);
  const current = notes.length ? notes[notes.length - 1].estimated_band : 0;
  const target = student.target_band ?? 7;

  // ----- Monthly report data -----
  const monthlyData = useMemo(() => {
    const [yStr, mStr] = reportMonth.split("-");
    const y = parseInt(yStr);
    const m = parseInt(mStr);
    const inMonth = subs.filter((s) => {
      const d = new Date(s.submitted_at ?? s.updated_at);
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    });
    const items = inMonth
      .map((s) => {
        const fb = getFeedbackBySubmission(s.id);
        const t = getTask(s.task_id);
        return fb && t ? { sub: s, fb, task: t } : null;
      })
      .filter(Boolean) as { sub: typeof subs[number]; fb: NonNullable<ReturnType<typeof getFeedbackBySubmission>>; task: NonNullable<ReturnType<typeof getTask>> }[];
    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    return {
      label: new Date(y, m - 1).toLocaleString(undefined, { month: "long", year: "numeric" }),
      items,
      avgTr: avg(items.map((x) => x.fb.task_response_score)),
      avgCc: avg(items.map((x) => x.fb.coherence_score)),
      avgLr: avg(items.map((x) => x.fb.lexical_score)),
      avgGr: avg(items.map((x) => x.fb.grammar_score)),
      avgOverall: avg(items.map((x) => x.fb.overall_band)),
    };
  }, [reportMonth, subs]);

  const exportReport = () => {
    if (monthlyData.items.length === 0) {
      toast.error("No reviewed essays in this month to export.");
      return;
    }
    const lines: string[] = [];
    lines.push(`PISA IELTS Writing Hub — Monthly Progress Report`);
    lines.push(`================================================`);
    lines.push(``);
    lines.push(`Student: ${student.full_name}`);
    lines.push(`Class:   ${student.class_name ?? "—"}`);
    lines.push(`Period:  ${monthlyData.label}`);
    lines.push(`Target:  Band ${target.toFixed(1)}`);
    lines.push(``);
    lines.push(`AVERAGE SCORES (this month)`);
    lines.push(`---------------------------`);
    lines.push(`Task Response / Achievement : ${monthlyData.avgTr.toFixed(1)}`);
    lines.push(`Coherence & Cohesion        : ${monthlyData.avgCc.toFixed(1)}`);
    lines.push(`Lexical Resource            : ${monthlyData.avgLr.toFixed(1)}`);
    lines.push(`Grammatical Range & Accuracy: ${monthlyData.avgGr.toFixed(1)}`);
    lines.push(`OVERALL BAND                : ${monthlyData.avgOverall.toFixed(1)}`);
    lines.push(``);
    lines.push(`CONSOLIDATED FEEDBACK BY CRITERION`);
    lines.push(`----------------------------------`);

    const collect = (key: "task_response_comment" | "coherence_comment" | "lexical_comment" | "grammar_comment") =>
      monthlyData.items
        .map((x) => x.fb[key])
        .filter((c): c is string => Boolean(c && c.trim()))
        .map((c, i) => `  ${i + 1}. ${c}`)
        .join("\n") || "  (no comments recorded)";

    lines.push(``);
    lines.push(`▸ Task Response`);
    lines.push(collect("task_response_comment"));
    lines.push(``);
    lines.push(`▸ Coherence & Cohesion`);
    lines.push(collect("coherence_comment"));
    lines.push(``);
    lines.push(`▸ Lexical Resource`);
    lines.push(collect("lexical_comment"));
    lines.push(``);
    lines.push(`▸ Grammatical Range & Accuracy`);
    lines.push(collect("grammar_comment"));
    lines.push(``);

    lines.push(`ESSAYS REVIEWED THIS MONTH`);
    lines.push(`--------------------------`);
    monthlyData.items.forEach((x, i) => {
      const date = x.sub.submitted_at
        ? new Date(x.sub.submitted_at).toLocaleDateString()
        : "—";
      lines.push(`${i + 1}. ${x.task.title}  [${x.task.task_type === "task1" ? "Task 1" : "Task 2"}]`);
      lines.push(`   Date: ${date}  ·  Band: ${x.fb.overall_band.toFixed(1)}  ·  Words: ${x.sub.word_count}`);
      if (x.fb.overall_feedback) lines.push(`   Summary: ${x.fb.overall_feedback}`);
      lines.push(``);
    });

    lines.push(`STRENGTHS (combined)`);
    lines.push(`--------------------`);
    monthlyData.items.forEach((x) => x.fb.strengths && lines.push(`· ${x.fb.strengths}`));
    lines.push(``);
    lines.push(`AREAS TO IMPROVE (combined)`);
    lines.push(`---------------------------`);
    monthlyData.items.forEach((x) => x.fb.weaknesses && lines.push(`· ${x.fb.weaknesses}`));
    lines.push(``);
    lines.push(`TEACHER'S NEXT STEPS`);
    lines.push(`--------------------`);
    monthlyData.items.forEach((x) => x.fb.next_action && lines.push(`· ${x.fb.next_action}`));
    lines.push(``);
    lines.push(`Generated on ${new Date().toLocaleString()}`);

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.full_name.replace(/\s+/g, "_")}_${reportMonth}_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Monthly report downloaded.");
  };

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

      <section className="pisa-card">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="pisa-tag text-pisa-pink-deep">Monthly report</p>
            <h2 className="font-display text-lg text-pisa-navy mt-1">Export consolidated feedback</h2>
            <p className="text-[12.5px] text-muted-foreground mt-1 max-w-md">
              Combines per-criterion comments from every reviewed essay this month, plus average scores — ready to share with the student or parent.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="rounded-pill border border-border bg-white px-3 py-1.5 text-[13px] text-pisa-navy focus:outline-none focus:border-pisa-navy"
            />
            <Button variant="accent" onClick={exportReport}>
              <Download className="h-4 w-4" /> Export report
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { l: "Task Response", v: monthlyData.avgTr },
            { l: "Coherence", v: monthlyData.avgCc },
            { l: "Lexical", v: monthlyData.avgLr },
            { l: "Grammar", v: monthlyData.avgGr },
            { l: "Overall", v: monthlyData.avgOverall },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-secondary p-3 text-center">
              <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
              <p className="font-display text-xl text-pisa-navy mt-0.5">
                {s.v ? s.v.toFixed(1) : "—"}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-muted-foreground flex items-center gap-1.5">
          <FileDown className="h-3.5 w-3.5" />
          {monthlyData.items.length} essay{monthlyData.items.length === 1 ? "" : "s"} included from {monthlyData.label}.
        </p>
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
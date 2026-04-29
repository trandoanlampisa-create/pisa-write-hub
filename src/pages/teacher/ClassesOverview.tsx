import { Link, Navigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/pisa/PageShell";
import { HeroBanner } from "@/components/pisa/HeroBanner";
import { MetricCard } from "@/components/pisa/MetricCard";
import { StatusBadge, submissionStatusBadge } from "@/components/pisa/StatusBadge";
import { BandChip } from "@/components/pisa/BandChip";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  mockClasses,
  mockProfiles,
  mockSubmissions,
  mockFeedback,
  getStudentsByClass,
  getSubmissionsByStudent,
  getFeedbackBySubmission,
  getTask,
} from "@/data/mockData";
import type { ClassRoom } from "@/types";
import { ArrowLeft, ArrowRight, Users, FileText, Download, FileDown } from "lucide-react";
import { toast } from "sonner";

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const ClassesOverview = () => {
  const { profile } = useAuth();
  const { className } = useParams<{ className?: string }>();

  if (!profile) return <Navigate to="/login?role=teacher" replace />;

  if (className) {
    const cls = mockClasses.find(
      (c) => c.class_name === decodeURIComponent(className),
    );
    if (!cls) {
      return (
        <PageShell>
          <div className="pisa-card text-center">Class not found.</div>
        </PageShell>
      );
    }
    return <ClassDrilldown cls={cls} />;
  }

  return <AllClasses />;
};

const AllClasses = () => {
  const classRows = useMemo(
    () =>
      mockClasses.map((c) => {
        const students = getStudentsByClass(c.class_name);
        const subs = mockSubmissions.filter((s) =>
          students.some((st) => st.id === s.student_id),
        );
        const fbs = mockFeedback.filter((f) =>
          subs.some((s) => s.id === f.submission_id),
        );
        return {
          ...c,
          studentCount: students.length,
          subCount: subs.length,
          reviewedCount: fbs.length,
          pending: subs.filter((s) => s.status === "submitted").length,
          avgBand: avg(fbs.map((f) => f.overall_band)),
        };
      }),
    [],
  );

  return (
    <PageShell className="space-y-5">
      <Button asChild variant="ghost" size="sm">
        <Link to="/teacher">
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
      </Button>

      <HeroBanner
        tag="Classes"
        title="Class performance overview"
        subtitle="See how each class is performing across all writing tasks."
      />

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classRows.map((c) => (
          <Link
            key={c.id}
            to={`/teacher/classes/${encodeURIComponent(c.class_name)}`}
            className="pisa-card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="pisa-tag text-pisa-pink-deep">Class</p>
                <h3 className="mt-1 font-display text-lg text-pisa-navy">
                  {c.class_name}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-tint-yellow px-2.5 py-1">
                  <span className="text-[10px] uppercase tracking-wider text-pisa-yellow-deep font-medium">
                    Join code
                  </span>
                  <span className="font-mono text-[12px] font-bold text-pisa-yellow-deep tracking-wider">
                    {c.join_code}
                  </span>
                </div>
              </div>
              {c.avgBand ? (
                <BandChip label="Avg" band={c.avgBand.toFixed(1)} />
              ) : (
                <StatusBadge variant="yellow">No data</StatusBadge>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-tint-navy py-2">
                <p className="font-display text-lg text-pisa-navy">
                  {c.studentCount}
                </p>
                <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  Students
                </p>
              </div>
              <div className="rounded-xl bg-tint-purple py-2">
                <p className="font-display text-lg text-pisa-purple-deep">
                  {c.subCount}
                </p>
                <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  Essays
                </p>
              </div>
              <div className="rounded-xl bg-tint-pink py-2">
                <p className="font-display text-lg text-pisa-pink-deep">
                  {c.pending}
                </p>
                <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  Pending
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[12.5px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> View class
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-pisa-navy group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </section>
    </PageShell>
  );
};

const ClassDrilldown = ({ cls }: { cls: ClassRoom }) => {
  const students = getStudentsByClass(cls.class_name);
  const subs = mockSubmissions.filter((s) =>
    students.some((st) => st.id === s.student_id),
  );
  const fbs = mockFeedback.filter((f) =>
    subs.some((s) => s.id === f.submission_id),
  );
  const classAvg = avg(fbs.map((f) => f.overall_band));

  const now = new Date();
  const [reportMonth, setReportMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );

  const monthlyData = useMemo(() => {
    const [yStr, mStr] = reportMonth.split("-");
    const y = parseInt(yStr);
    const m = parseInt(mStr);
    const items = subs
      .filter((s) => {
        const d = new Date(s.submitted_at ?? s.updated_at);
        return d.getFullYear() === y && d.getMonth() + 1 === m;
      })
      .map((s) => {
        const fb = getFeedbackBySubmission(s.id);
        const t = getTask(s.task_id);
        const st = mockProfiles.find((p) => p.id === s.student_id);
        return fb && t && st ? { sub: s, fb, task: t, student: st } : null;
      })
      .filter(Boolean) as Array<{
      sub: (typeof subs)[number];
      fb: (typeof mockFeedback)[number];
      task: NonNullable<ReturnType<typeof getTask>>;
      student: (typeof mockProfiles)[number];
    }>;
    return {
      label: new Date(y, m - 1).toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      }),
      items,
      avgTr: avg(items.map((x) => x.fb.task_response_score)),
      avgCc: avg(items.map((x) => x.fb.coherence_score)),
      avgLr: avg(items.map((x) => x.fb.lexical_score)),
      avgGr: avg(items.map((x) => x.fb.grammar_score)),
      avgOverall: avg(items.map((x) => x.fb.overall_band)),
    };
  }, [reportMonth, subs]);

  const exportClassReport = () => {
    if (monthlyData.items.length === 0) {
      toast.error("No reviewed essays in this month to export.");
      return;
    }
    const lines: string[] = [];
    lines.push(`PISA IELTS Writing Hub — Monthly Class Report`);
    lines.push(`==============================================`);
    lines.push(``);
    lines.push(`Class:    ${cls.class_name}`);
    lines.push(`Period:   ${monthlyData.label}`);
    lines.push(`Students: ${students.length}`);
    lines.push(``);
    lines.push(`CLASS AVERAGE SCORES (this month)`);
    lines.push(`---------------------------------`);
    lines.push(`Task Response / Achievement : ${monthlyData.avgTr.toFixed(1)}`);
    lines.push(`Coherence & Cohesion        : ${monthlyData.avgCc.toFixed(1)}`);
    lines.push(`Lexical Resource            : ${monthlyData.avgLr.toFixed(1)}`);
    lines.push(`Grammatical Range & Accuracy: ${monthlyData.avgGr.toFixed(1)}`);
    lines.push(`OVERALL BAND                : ${monthlyData.avgOverall.toFixed(1)}`);
    lines.push(``);

    const byStudent = new Map<string, typeof monthlyData.items>();
    monthlyData.items.forEach((x) => {
      const arr = byStudent.get(x.student.id) ?? [];
      arr.push(x);
      byStudent.set(x.student.id, arr);
    });

    lines.push(`PER-STUDENT CONSOLIDATED FEEDBACK`);
    lines.push(`=================================`);
    lines.push(``);

    Array.from(byStudent.entries()).forEach(([, items]) => {
      const st = items[0].student;
      const sAvg = (k: keyof (typeof items)[number]["fb"]) =>
        avg(items.map((x) => Number(x.fb[k]) || 0));
      lines.push(
        `▸ ${st.full_name}  (target: Band ${(st.target_band ?? 7).toFixed(1)})`,
      );
      lines.push(`  -------------------------------------------------`);
      lines.push(
        `  Avg Overall: ${sAvg("overall_band").toFixed(1)}  ·  Essays: ${items.length}`,
      );
      lines.push(
        `  TR: ${sAvg("task_response_score").toFixed(1)}  CC: ${sAvg("coherence_score").toFixed(1)}  LR: ${sAvg("lexical_score").toFixed(1)}  GR: ${sAvg("grammar_score").toFixed(1)}`,
      );
      lines.push(``);
      const collect = (
        k:
          | "task_response_comment"
          | "coherence_comment"
          | "lexical_comment"
          | "grammar_comment",
        label: string,
      ) => {
        const comments = items
          .map((x) => x.fb[k])
          .filter((c): c is string => Boolean(c && c.trim()));
        if (!comments.length) return;
        lines.push(`  ${label}:`);
        comments.forEach((c, i) => lines.push(`    ${i + 1}. ${c}`));
      };
      collect("task_response_comment", "Task Response");
      collect("coherence_comment", "Coherence & Cohesion");
      collect("lexical_comment", "Lexical Resource");
      collect("grammar_comment", "Grammatical Range & Accuracy");

      const strengths = items.map((x) => x.fb.strengths).filter(Boolean);
      const weaknesses = items.map((x) => x.fb.weaknesses).filter(Boolean);
      const next = items.map((x) => x.fb.next_action).filter(Boolean);
      if (strengths.length) {
        lines.push(`  Strengths:`);
        strengths.forEach((s) => lines.push(`    · ${s}`));
      }
      if (weaknesses.length) {
        lines.push(`  Areas to improve:`);
        weaknesses.forEach((s) => lines.push(`    · ${s}`));
      }
      if (next.length) {
        lines.push(`  Next steps:`);
        next.forEach((s) => lines.push(`    · ${s}`));
      }
      lines.push(``);
    });

    lines.push(`Generated on ${new Date().toLocaleString()}`);
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cls.class_name.replace(/\s+/g, "_")}_${reportMonth}_class_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Class monthly report downloaded.");
  };

  return (
    <PageShell className="space-y-5">
      <Button asChild variant="ghost" size="sm">
        <Link to="/teacher/classes">
          <ArrowLeft className="h-3.5 w-3.5" /> All classes
        </Link>
      </Button>

      <HeroBanner
        tag="Class overview"
        title={cls.class_name}
        subtitle="Track every student's writing progress in this class."
      >
        <div className="inline-flex items-center gap-2 rounded-pill bg-pisa-yellow px-3 py-1.5">
          <span className="text-[11px] uppercase tracking-wider text-pisa-navy font-bold">
            Join code
          </span>
          <span className="font-mono text-sm font-bold text-pisa-navy tracking-wider">
            {cls.join_code}
          </span>
        </div>
      </HeroBanner>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Students" value={students.length} accent="navy" />
        <MetricCard label="Submissions" value={subs.length} accent="purple" />
        <MetricCard label="Reviewed" value={fbs.length} accent="mint" />
        <MetricCard
          label="Class avg band"
          value={classAvg ? classAvg.toFixed(1) : "—"}
          accent="yellow"
        />
      </section>

      <section className="pisa-card">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="pisa-tag text-pisa-pink-deep">Monthly class report</p>
            <h2 className="font-display text-lg text-pisa-navy mt-1">
              Export consolidated feedback for the whole class
            </h2>
            <p className="text-[12.5px] text-muted-foreground mt-1 max-w-xl">
              Combines per-criterion comments, average scores and key feedback
              for every student in this class — ready to share with parents or
              the academic team.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="rounded-pill border border-border bg-white px-3 py-1.5 text-[13px] text-pisa-navy focus:outline-none focus:border-pisa-navy"
            />
            <Button variant="accent" onClick={exportClassReport}>
              <Download className="h-4 w-4" /> Export class report
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
              <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                {s.l}
              </p>
              <p className="font-display text-xl text-pisa-navy mt-0.5">
                {s.v ? s.v.toFixed(1) : "—"}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-muted-foreground flex items-center gap-1.5">
          <FileDown className="h-3.5 w-3.5" />
          {monthlyData.items.length} essay
          {monthlyData.items.length === 1 ? "" : "s"} included from{" "}
          {monthlyData.label}.
        </p>
      </section>

      <section className="pisa-card">
        <h2 className="font-display text-lg text-pisa-navy mb-3">Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Student</th>
                <th className="py-2 pr-3">Target</th>
                <th className="py-2 pr-3">Essays</th>
                <th className="py-2 pr-3">Reviewed</th>
                <th className="py-2 pr-3">Avg band</th>
                <th className="py-2 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => {
                const ss = getSubmissionsByStudent(st.id);
                const sf = ss
                  .map((s) => getFeedbackBySubmission(s.id))
                  .filter(Boolean) as typeof mockFeedback;
                const a = avg(sf.map((f) => f.overall_band));
                return (
                  <tr
                    key={st.id}
                    className="border-b border-border/60 last:border-0 hover:bg-secondary/40"
                  >
                    <td className="py-3 pr-3 font-medium text-pisa-navy">
                      {st.full_name}
                    </td>
                    <td className="py-3 pr-3">
                      {st.target_band
                        ? `Band ${st.target_band.toFixed(1)}`
                        : "—"}
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {ss.length}
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {sf.length}
                    </td>
                    <td className="py-3 pr-3">
                      {a ? (
                        <BandChip label="Avg" band={a.toFixed(1)} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-0 text-right">
                      <Button asChild variant="primary" size="sm">
                        <Link to={`/teacher/student/${st.id}`}>
                          Open <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No students in this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pisa-card">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-pisa-navy" />
          <h2 className="font-display text-lg text-pisa-navy">
            Recent essays in this class
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Student</th>
                <th className="py-2 pr-3">Task</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {subs
                .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
                .map((s) => {
                  const st = mockProfiles.find((p) => p.id === s.student_id);
                  const t = getTask(s.task_id);
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="py-3 pr-3 font-medium text-pisa-navy">
                        {st?.full_name}
                      </td>
                      <td className="py-3 pr-3 max-w-[280px] truncate">
                        {t?.title}
                      </td>
                      <td className="py-3 pr-3">
                        {submissionStatusBadge(s.status)}
                      </td>
                      <td className="py-3 pr-0 text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/teacher/review/${s.id}`}>Review</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              {subs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No essays yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
};

export default ClassesOverview;
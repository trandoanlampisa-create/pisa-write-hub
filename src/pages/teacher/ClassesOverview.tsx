import { Link, Navigate, useParams } from "react-router-dom";
import { useMemo } from "react";
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
import { ArrowLeft, ArrowRight, Users, FileText } from "lucide-react";

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const ClassesOverview = () => {
  const { profile } = useAuth();
  const { className } = useParams<{ className?: string }>();

  if (!profile) return <Navigate to="/login?role=teacher" replace />;

  // ----- Single class drill-down -----
  if (className) {
    const cls = mockClasses.find((c) => c.class_name === decodeURIComponent(className));
    if (!cls) {
      return (
        <PageShell>
          <div className="pisa-card text-center">Class not found.</div>
        </PageShell>
      );
    }
    const students = getStudentsByClass(cls.class_name);
    const subs = mockSubmissions.filter((s) =>
      students.some((st) => st.id === s.student_id),
    );
    const fbs = mockFeedback.filter((f) =>
      subs.some((s) => s.id === f.submission_id),
    );
    const classAvg = avg(fbs.map((f) => f.overall_band));

    return (
      <PageShell className="space-y-5">
        <Button asChild variant="ghost" size="sm">
          <Link to="/teacher/classes"><ArrowLeft className="h-3.5 w-3.5" /> All classes</Link>
        </Button>

        <HeroBanner
          tag="Class overview"
          title={cls.class_name}
          subtitle="Track every student's writing progress in this class."
        />

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
                    <tr key={st.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                      <td className="py-3 pr-3 font-medium text-pisa-navy">{st.full_name}</td>
                      <td className="py-3 pr-3">{st.target_band ? `Band ${st.target_band.toFixed(1)}` : "—"}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{ss.length}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{sf.length}</td>
                      <td className="py-3 pr-3">
                        {a ? <BandChip band={a.toFixed(1)} /> : <span className="text-muted-foreground">—</span>}
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
                  <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No students in this class.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pisa-card">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-pisa-navy" />
            <h2 className="font-display text-lg text-pisa-navy">Recent essays in this class</h2>
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
                      <tr key={s.id} className="border-b border-border/60 last:border-0">
                        <td className="py-3 pr-3 font-medium text-pisa-navy">{st?.full_name}</td>
                        <td className="py-3 pr-3 max-w-[280px] truncate">{t?.title}</td>
                        <td className="py-3 pr-3">{submissionStatusBadge(s.status)}</td>
                        <td className="py-3 pr-0 text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/teacher/review/${s.id}`}>Review</Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                {subs.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No essays yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </PageShell>
    );
  }

  // ----- All classes overview -----
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
        <Link to="/teacher"><ArrowLeft className="h-3.5 w-3.5" /> Dashboard</Link>
      </Button>

      <HeroBanner
        tag="Classes"
        title="Class performance overview"
        subtitle="See how each class is performing across all writing tasks."
      />

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classRows.map((c) => (
          <Link
            key={c.id}
            to={`/teacher/classes/${encodeURIComponent(c.class_name)}`}
            className="pisa-card hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="pisa-tag text-pisa-pink-deep">Class</p>
                <h3 className="mt-1 font-display text-lg text-pisa-navy">{c.class_name}</h3>
              </div>
              {c.avgBand ? (
                <BandChip band={c.avgBand.toFixed(1)} />
              ) : (
                <StatusBadge variant="yellow">No data</StatusBadge>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-tint-navy py-2">
                <p className="font-display text-lg text-pisa-navy">{c.studentCount}</p>
                <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Students</p>
              </div>
              <div className="rounded-xl bg-tint-purple py-2">
                <p className="font-display text-lg text-pisa-purple-deep">{c.subCount}</p>
                <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Essays</p>
              </div>
              <div className="rounded-xl bg-tint-pink py-2">
                <p className="font-display text-lg text-pisa-pink-deep">{c.pending}</p>
                <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Pending</p>
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

export default ClassesOverview;
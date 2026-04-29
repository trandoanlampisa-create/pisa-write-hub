import { Link, Navigate } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { HeroBanner } from "@/components/pisa/HeroBanner";
import { MetricCard } from "@/components/pisa/MetricCard";
import { StatusBadge, submissionStatusBadge } from "@/components/pisa/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  mockSubmissions,
  mockTasks,
  mockProfiles,
  mockClasses,
  mockFeedback,
} from "@/data/mockData";
import { Filter, Plus, Users, ArrowRight, LayoutGrid } from "lucide-react";
import { useMemo, useState } from "react";

const TeacherDashboard = () => {
  const { profile } = useAuth();
  const [classFilter, setClassFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const allSubs = useMemo(
    () =>
      [...mockSubmissions].sort((a, b) =>
        b.updated_at.localeCompare(a.updated_at),
      ),
    [],
  );

  const filtered = allSubs.filter((s) => {
    const student = mockProfiles.find((p) => p.id === s.student_id);
    const task = mockTasks.find((t) => t.id === s.task_id);
    if (classFilter !== "all" && student?.class_name !== classFilter) return false;
    if (typeFilter !== "all" && task?.task_type !== typeFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const pending = allSubs.filter((s) => s.status === "submitted").length;
  const reviewedThisWeek = mockFeedback.length;
  const avgBand = mockFeedback.length
    ? (
        mockFeedback.reduce((sum, f) => sum + f.overall_band, 0) /
        mockFeedback.length
      ).toFixed(1)
    : "—";

  if (!profile) return <Navigate to="/login?role=teacher" replace />;

  return (
    <PageShell className="space-y-6">
      <HeroBanner
        tag={`Hello, ${profile.full_name.split(" ")[0]}`}
        title="Teacher dashboard"
        subtitle="Review essays, give feedback, and track each student's writing journey."
      >
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="yellow">
            <Link to="/teacher/tasks/new"><Plus className="h-4 w-4" /> Create writing task</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/teacher/classes"><LayoutGrid className="h-4 w-4" /> Classes</Link>
          </Button>
          <Button asChild variant="accent">
            <Link to={`/teacher/student/${mockProfiles.find((p) => p.role === "student")!.id}`}>
              <Users className="h-4 w-4" /> View progress
            </Link>
          </Button>
        </div>
      </HeroBanner>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total submissions" value={allSubs.length} accent="navy" />
        <MetricCard label="Pending reviews" value={pending} accent="pink" />
        <MetricCard label="Reviewed this week" value={reviewedThisWeek} accent="mint" />
        <MetricCard label="Average class band" value={avgBand} accent="yellow" />
      </section>

      <section className="pisa-card">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-pisa-navy" />
            <h2 className="font-display text-lg text-pisa-navy">Recent submissions</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-pill border border-border bg-white px-3 py-1.5 text-[12px] text-pisa-navy focus:outline-none focus:border-pisa-navy"
            >
              <option value="all">All classes</option>
              {mockClasses.map((c) => (
                <option key={c.id} value={c.class_name}>{c.class_name}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-pill border border-border bg-white px-3 py-1.5 text-[12px] text-pisa-navy focus:outline-none focus:border-pisa-navy"
            >
              <option value="all">All tasks</option>
              <option value="task1">Task 1</option>
              <option value="task2">Task 2</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-pill border border-border bg-white px-3 py-1.5 text-[12px] text-pisa-navy focus:outline-none focus:border-pisa-navy"
            >
              <option value="all">All statuses</option>
              <option value="submitted">Awaiting review</option>
              <option value="reviewed">Reviewed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Student</th>
                <th className="py-2 pr-3">Task</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Submitted</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const student = mockProfiles.find((p) => p.id === s.student_id);
                const task = mockTasks.find((t) => t.id === s.task_id);
                return (
                  <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/50">
                    <td className="py-3 pr-3 font-medium text-pisa-navy">
                      <Link to={`/teacher/student/${student?.id}`} className="hover:underline">
                        {student?.full_name}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">{student?.class_name}</p>
                    </td>
                    <td className="py-3 pr-3 max-w-[260px] truncate" title={task?.title}>
                      {task?.title}
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge variant={task?.task_type === "task1" ? "navy" : "purple"}>
                        {task?.task_type === "task1" ? "Task 1" : "Task 2"}
                      </StatusBadge>
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground text-[13px]">
                      {s.submitted_at
                        ? new Date(s.submitted_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-3 pr-3">{submissionStatusBadge(s.status)}</td>
                    <td className="py-3 pr-0 text-right">
                      <Button asChild variant="primary" size="sm">
                        <Link to={`/teacher/review/${s.id}`}>
                          {s.status === "reviewed" ? "View" : "Review"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    No submissions match these filters.
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

export default TeacherDashboard;
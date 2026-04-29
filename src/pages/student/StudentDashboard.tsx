import { Link, Navigate } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { HeroBanner } from "@/components/pisa/HeroBanner";
import { MetricCard } from "@/components/pisa/MetricCard";
import { TaskCard } from "@/components/pisa/TaskCard";
import { BandChip } from "@/components/pisa/BandChip";
import { StatusBadge } from "@/components/pisa/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  mockTasks,
  mockSubmissions,
  mockFeedback,
  getProgressNotesByStudent,
  getTask,
} from "@/data/mockData";
import { ArrowRight } from "lucide-react";

const StudentDashboard = () => {
  const { profile } = useAuth();
  if (!profile) return <Navigate to="/login?role=student" replace />;

  const studentSubs = mockSubmissions.filter((s) => s.student_id === profile.id);
  const myTasks = mockTasks.filter(
    (t) => !t.assigned_class || t.assigned_class === profile.class_name,
  );
  const submittedIds = new Set(studentSubs.map((s) => s.task_id));
  const assigned = myTasks.filter((t) => !submittedIds.has(t.id));

  const reviewedSubs = studentSubs
    .filter((s) => s.status === "reviewed")
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  const notes = getProgressNotesByStudent(profile.id);
  const currentBand = notes.length
    ? notes[notes.length - 1].estimated_band
    : 0;
  const targetBand = profile.target_band ?? 7;

  return (
    <PageShell className="space-y-6">
      <HeroBanner
        tag={`Hi, ${profile.full_name.split(" ")[0]}`}
        title="Ready for your next essay?"
        subtitle={`Your target is band ${targetBand.toFixed(1)}. Keep writing — every essay moves you closer.`}
      >
        <div className="flex flex-wrap gap-3">
          <BandChip label="Current" band={currentBand ? currentBand.toFixed(1) : "—"} variant="current" />
          <BandChip label="Target" band={targetBand.toFixed(1)} variant="target" />
          {assigned[0] && (
            <Button asChild variant="yellow">
              <Link to={`/student/write/${assigned[0].id}`}>
                Start writing <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </HeroBanner>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Current band" value={currentBand ? currentBand.toFixed(1) : "—"} accent="purple" />
        <MetricCard label="Target band" value={targetBand.toFixed(1)} accent="pink" />
        <MetricCard label="Essays submitted" value={studentSubs.length} accent="navy" />
        <MetricCard label="Awaiting submission" value={assigned.length} accent="yellow" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-xl text-pisa-navy">Assigned tasks</h2>
            <span className="text-[12px] text-muted-foreground">{assigned.length} open</span>
          </div>
          <div className="flex flex-col gap-3">
            {assigned.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
            {assigned.length === 0 && (
              <div className="pisa-card text-sm text-muted-foreground">
                You're all caught up. New tasks will appear here.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-xl text-pisa-navy">Latest feedback</h2>
            <span className="text-[12px] text-muted-foreground">{reviewedSubs.length} reviewed</span>
          </div>
          <div className="flex flex-col gap-3">
            {reviewedSubs.map((s) => {
              const fb = mockFeedback.find((f) => f.submission_id === s.id);
              const t = getTask(s.task_id);
              if (!fb || !t) return null;
              const date = s.submitted_at
                ? new Date(s.submitted_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—";
              return (
                <Link
                  key={s.id}
                  to={`/student/feedback/${s.id}`}
                  className="pisa-card hover:shadow-lg transition-shadow flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge variant={t.task_type === "task1" ? "navy" : "purple"}>
                        {t.task_type === "task1" ? "Task 1" : "Task 2"}
                      </StatusBadge>
                      <StatusBadge variant="success">Reviewed</StatusBadge>
                    </div>
                    <h3 className="mt-2 font-display text-base text-pisa-navy truncate">{t.title}</h3>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Submitted {date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Overall</p>
                    <p className="font-display text-3xl text-pisa-navy leading-none mt-1">
                      {fb.overall_band.toFixed(1)}
                    </p>
                    <ArrowRight className="h-4 w-4 text-pisa-navy/70 ml-auto mt-2" />
                  </div>
                </Link>
              );
            })}
            {reviewedSubs.length === 0 && (
              <div className="pisa-card text-sm text-muted-foreground">
                No feedback yet. Submit your first essay to get started.
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default StudentDashboard;
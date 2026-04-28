import { Link } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { HeroBanner } from "@/components/pisa/HeroBanner";
import { MetricCard } from "@/components/pisa/MetricCard";
import { TaskCard } from "@/components/pisa/TaskCard";
import { BandChip } from "@/components/pisa/BandChip";
import { StatusBadge } from "@/components/pisa/StatusBadge";
import { ProgressBar } from "@/components/pisa/ProgressBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  mockTasks,
  mockSubmissions,
  mockFeedback,
  getProgressNotesByStudent,
} from "@/data/mockData";
import { ArrowRight, Sparkles } from "lucide-react";
import { Navigate } from "react-router-dom";

const StudentDashboard = () => {
  const { profile } = useAuth();
  if (!profile) return <Navigate to="/login?role=student" replace />;

  const studentSubs = mockSubmissions.filter((s) => s.student_id === profile.id);
  const myTasks = mockTasks.filter(
    (t) => !t.assigned_class || t.assigned_class === profile.class_name,
  );
  const submittedIds = new Set(studentSubs.map((s) => s.task_id));
  const assigned = myTasks.filter((t) => !submittedIds.has(t.id));

  const latestReviewed = studentSubs
    .filter((s) => s.status === "reviewed")
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  const latestFeedback = latestReviewed
    ? mockFeedback.find((f) => f.submission_id === latestReviewed.id)
    : undefined;

  const notes = getProgressNotesByStudent(profile.id);
  const currentBand = notes.length
    ? notes[notes.length - 1].estimated_band
    : 0;
  const targetBand = profile.target_band ?? 7;
  const focus = notes.length ? notes[notes.length - 1].focus_area : "Get started";

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
        <MetricCard label="This week's focus" value={focus} accent="yellow" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-xl text-pisa-navy">Assigned tasks</h2>
            <span className="text-[12px] text-muted-foreground">{assigned.length} open</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {assigned.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
            {assigned.length === 0 && (
              <div className="pisa-card text-sm text-muted-foreground sm:col-span-2">
                You're all caught up. New tasks will appear here.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="pisa-card">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-pisa-navy">Latest feedback</h3>
              {latestFeedback && <StatusBadge variant="success">Reviewed</StatusBadge>}
            </div>
            {latestFeedback && latestReviewed ? (
              <div className="mt-3 space-y-3">
                <p className="text-[12px] text-muted-foreground">
                  Overall band
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl text-pisa-navy">
                    {latestFeedback.overall_band.toFixed(1)}
                  </span>
                  <StatusBadge variant="purple">Band {latestFeedback.overall_band.toFixed(1)}</StatusBadge>
                </div>
                <p className="text-[13px] text-foreground/80 line-clamp-3 leading-relaxed">
                  {latestFeedback.overall_feedback}
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={`/student/feedback/${latestReviewed.id}`}>
                    View full feedback <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-muted-foreground">
                No feedback yet. Submit your first essay to get started.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-pisa-purple text-pisa-purple-deep p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/30" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <p className="pisa-tag">Your next focus</p>
              </div>
              <h3 className="mt-2 font-display text-lg text-pisa-purple-deep">{focus}</h3>
              <ProgressBar
                value={(currentBand / 9) * 100}
                color="purple"
                className="mt-3 bg-white/40"
              />
              <p className="mt-2 text-[12px] text-pisa-purple-deep/80">
                Band {currentBand ? currentBand.toFixed(1) : "—"} of {targetBand.toFixed(1)} target
              </p>
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
};

export default StudentDashboard;
import { Link, Navigate, useParams } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { EssayCard } from "@/components/pisa/EssayCard";
import { BandChip } from "@/components/pisa/BandChip";
import { StatusBadge } from "@/components/pisa/StatusBadge";
import { ProgressBar } from "@/components/pisa/ProgressBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  getSubmission,
  getTask,
  getFeedbackBySubmission,
} from "@/data/mockData";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

const Criterion = ({ label, score }: { label: string; score: number }) => (
  <div className="rounded-xl bg-secondary p-3">
    <div className="flex items-baseline justify-between">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-bold text-pisa-navy">{score.toFixed(1)}</p>
    </div>
    <ProgressBar value={(score / 9) * 100} color="yellow" className="mt-2" />
  </div>
);

const StudentFeedback = () => {
  const { profile } = useAuth();
  const { submissionId } = useParams<{ submissionId: string }>();
  const submission = getSubmission(submissionId ?? "");
  const task = submission ? getTask(submission.task_id) : undefined;
  const feedback = submission ? getFeedbackBySubmission(submission.id) : undefined;

  if (!profile) return <Navigate to="/login?role=student" replace />;
  if (!submission || !task) {
    return (
      <PageShell>
        <div className="pisa-card text-center">Submission not found.</div>
      </PageShell>
    );
  }

  const improvements = feedback?.next_action
    ?.split(/\.|\n/)
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

  return (
    <PageShell className="space-y-5">
      <Button asChild variant="ghost" size="sm">
        <Link to="/student"><ArrowLeft className="h-3.5 w-3.5" /> Dashboard</Link>
      </Button>

      <header className="pisa-card-navy relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-pisa-pink opacity-25" />
        <div className="relative">
          <p className="pisa-tag text-pisa-yellow">Your feedback</p>
          <h1 className="mt-2 font-display text-2xl md:text-3xl text-white">{task.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            {feedback ? (
              <>
                <BandChip label="Overall" band={feedback.overall_band.toFixed(1)} />
                <StatusBadge variant="ghost">Reviewed</StatusBadge>
              </>
            ) : (
              <StatusBadge variant="ghost">Awaiting feedback</StatusBadge>
            )}
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <EssayCard title="Question" meta={<span>Task {task.task_type === "task1" ? "1" : "2"}</span>}>
          {task.question_prompt}
        </EssayCard>
        <EssayCard title="Your essay" meta={<span>{submission.word_count} words</span>}>
          {submission.essay_text}
        </EssayCard>
      </section>

      {feedback ? (
        <>
          <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Criterion label="Task response" score={feedback.task_response_score} />
            <Criterion label="Coherence & cohesion" score={feedback.coherence_score} />
            <Criterion label="Lexical resource" score={feedback.lexical_score} />
            <Criterion label="Grammar" score={feedback.grammar_score} />
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="pisa-card lg:col-span-2">
              <h3 className="font-display text-base text-pisa-navy">Overall feedback</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/85">
                {feedback.overall_feedback}
              </p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-tint-mint p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-pisa-mint-deep">Strengths</p>
                  <p className="mt-1 text-[13.5px] text-pisa-mint-deep/90">{feedback.strengths}</p>
                </div>
                <div className="rounded-xl bg-tint-pink p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-pisa-pink-deep">To improve</p>
                  <p className="mt-1 text-[13.5px] text-pisa-pink-deep/90">{feedback.weaknesses}</p>
                </div>
              </div>
            </div>
            <div className="pisa-card">
              <h3 className="font-display text-base text-pisa-navy">What to improve next</h3>
              <ul className="mt-3 space-y-2">
                {improvements.length === 0 && (
                  <li className="text-sm text-muted-foreground">No action items yet.</li>
                )}
                {improvements.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13.5px]">
                    <CheckCircle2 className="h-4 w-4 text-pisa-mint-deep mt-0.5 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              {feedback.progress_note && (
                <div className="mt-4 rounded-xl bg-tint-yellow p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-pisa-yellow-deep">Teacher's note</p>
                  <p className="mt-1 text-[13px] text-pisa-yellow-deep/90">{feedback.progress_note}</p>
                </div>
              )}
            </div>
          </section>

          {feedback.sample_essay && (
            <section className="pisa-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pisa-purple-deep" />
                  <h3 className="font-display text-base text-pisa-navy">Sample essay</h3>
                  <StatusBadge variant="purple">AI-assisted, teacher-approved</StatusBadge>
                </div>
              </div>
              <div className="mt-3 text-[14.5px] leading-[1.8] whitespace-pre-wrap text-foreground/90">
                {feedback.sample_essay}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="pisa-card text-center text-sm text-muted-foreground">
          Your teacher hasn't reviewed this essay yet. We'll notify you when feedback is ready.
        </div>
      )}
    </PageShell>
  );
};

export default StudentFeedback;
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
import { ArrowLeft, Sparkles } from "lucide-react";

const Criterion = ({
  label,
  score,
  comment,
  detail,
}: {
  label: string;
  score: number;
  comment?: string;
  detail?: string;
}) => (
  <div className="rounded-xl bg-secondary p-3">
    <div className="flex items-baseline justify-between">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-bold text-pisa-navy">{score.toFixed(1)}</p>
    </div>
    <ProgressBar value={(score / 9) * 100} color="yellow" className="mt-2" />
    {comment && (
      <p className="mt-2 text-[12.5px] font-medium text-pisa-navy">{comment}</p>
    )}
    {detail && (
      <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
        {detail}
      </p>
    )}
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
          <section className="grid gap-3 md:grid-cols-2">
            <Criterion
              label="Task response"
              score={feedback.task_response_score}
              comment={feedback.task_response_comment}
              detail={feedback.task_response_detail}
            />
            <Criterion
              label="Coherence & cohesion"
              score={feedback.coherence_score}
              comment={feedback.coherence_comment}
              detail={feedback.coherence_detail}
            />
            <Criterion
              label="Lexical resource"
              score={feedback.lexical_score}
              comment={feedback.lexical_comment}
              detail={feedback.lexical_detail}
            />
            <Criterion
              label="Grammar"
              score={feedback.grammar_score}
              comment={feedback.grammar_comment}
              detail={feedback.grammar_detail}
            />
          </section>

          <section className="pisa-card">
            <h3 className="font-display text-base text-pisa-navy">Overall feedback</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/85 whitespace-pre-wrap">
              {feedback.overall_feedback}
            </p>
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
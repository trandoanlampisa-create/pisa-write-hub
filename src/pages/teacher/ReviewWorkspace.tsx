import { useMemo, useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { Button } from "@/components/ui/button";
import { ScoreInput } from "@/components/pisa/ScoreInput";
import { StatusBadge } from "@/components/pisa/StatusBadge";
import { BandChip } from "@/components/pisa/BandChip";
import { SampleEssayModal } from "@/components/pisa/SampleEssayModal";
import { useAuth } from "@/context/AuthContext";
import {
  getSubmission,
  getTask,
  getProfile,
  getFeedbackBySubmission,
  upsertFeedback,
} from "@/data/mockData";
import { ArrowLeft, Save, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

const roundInt = (n: number) => Math.round(n);

const ReviewWorkspace = () => {
  const { profile } = useAuth();
  const { submissionId } = useParams<{ submissionId: string }>();
  const submission = getSubmission(submissionId ?? "");
  const task = submission ? getTask(submission.task_id) : undefined;
  const student = submission ? getProfile(submission.student_id) : undefined;
  const existing = submission ? getFeedbackBySubmission(submission.id) : undefined;

  const [tr, setTr] = useState(Math.round(existing?.task_response_score ?? 6));
  const [cc, setCc] = useState(Math.round(existing?.coherence_score ?? 6));
  const [lr, setLr] = useState(Math.round(existing?.lexical_score ?? 6));
  const [gr, setGr] = useState(Math.round(existing?.grammar_score ?? 6));
  const [trC, setTrC] = useState(existing?.task_response_comment ?? "");
  const [ccC, setCcC] = useState(existing?.coherence_comment ?? "");
  const [lrC, setLrC] = useState(existing?.lexical_comment ?? "");
  const [grC, setGrC] = useState(existing?.grammar_comment ?? "");
  const [trD, setTrD] = useState(existing?.task_response_detail ?? "");
  const [ccD, setCcD] = useState(existing?.coherence_detail ?? "");
  const [lrD, setLrD] = useState(existing?.lexical_detail ?? "");
  const [grD, setGrD] = useState(existing?.grammar_detail ?? "");
  const [overall, setOverall] = useState(existing?.overall_feedback ?? "");
  const [sample, setSample] = useState(existing?.sample_essay ?? "");
  const [aiOpen, setAiOpen] = useState(false);

  const overallBand = useMemo(() => roundInt((tr + cc + lr + gr) / 4), [tr, cc, lr, gr]);

  useEffect(() => {
    document.title = student
      ? `Review · ${student.full_name} — PISA IELTS`
      : "Review — PISA IELTS";
  }, [student]);

  if (!profile) return <Navigate to="/login?role=teacher" replace />;
  if (!submission || !task || !student) {
    return (
      <PageShell>
        <div className="pisa-card text-center">Submission not found.</div>
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-5">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/teacher"><ArrowLeft className="h-3.5 w-3.5" /> Dashboard</Link>
        </Button>
        <div className="flex items-center gap-2">
          <StatusBadge variant={task.task_type === "task1" ? "navy" : "purple"}>
            {task.task_type === "task1" ? "Task 1" : "Task 2"}
          </StatusBadge>
          <StatusBadge variant="yellow">{submission.word_count} words</StatusBadge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: submission */}
        <div className="lg:col-span-7 space-y-4">
          <div className="pisa-card">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="pisa-tag text-pisa-pink-deep">Student submission</p>
                <h1 className="font-display text-xl text-pisa-navy mt-1">{student.full_name}</h1>
                <p className="text-[12px] text-muted-foreground">
                  {student.class_name} · Submitted{" "}
                  {submission.submitted_at &&
                    new Date(submission.submitted_at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-secondary p-4">
              <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Question</p>
              <p className="mt-1 font-display text-base text-pisa-navy">{task.title}</p>
              <p className="mt-2 text-[14px] text-foreground/85 leading-relaxed whitespace-pre-wrap">
                {task.question_prompt}
              </p>
            </div>

            {submission.student_note && (
              <div className="mt-3 rounded-xl bg-tint-yellow p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-pisa-yellow-deep">
                  Note from student
                </p>
                <p className="mt-1 text-[13.5px] text-pisa-yellow-deep/90">{submission.student_note}</p>
              </div>
            )}

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-2">Essay</p>
              <div className="rounded-xl border border-border bg-white p-4 text-[14.5px] leading-[1.85] whitespace-pre-wrap">
                {submission.essay_text}
              </div>
            </div>
          </div>
        </div>

        {/* Right: feedback panel */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="pisa-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="pisa-tag text-pisa-pink-deep">Scoring</p>
                <h2 className="font-display text-lg text-pisa-navy mt-1">IELTS criteria</h2>
              </div>
              <BandChip label="Overall" band={String(overallBand)} />
            </div>
            <div className="mt-4 space-y-4">
              <ScoreInput
                label="Task response / achievement"
                value={tr}
                onChange={setTr}
                comment={trC}
                onCommentChange={setTrC}
                commentPlaceholder="e.g. Position is clear; ideas need more development."
              />
              <ScoreInput
                label="Coherence & cohesion"
                value={cc}
                onChange={setCc}
                comment={ccC}
                onCommentChange={setCcC}
                commentPlaceholder="e.g. Good linkers; paragraphing inconsistent."
              />
              <ScoreInput
                label="Lexical resource"
                value={lr}
                onChange={setLr}
                comment={lrC}
                onCommentChange={setLrC}
                commentPlaceholder="e.g. Limited range; repeats key words."
              />
              <ScoreInput
                label="Grammatical range & accuracy"
                value={gr}
                onChange={setGr}
                comment={grC}
                onCommentChange={setGrC}
                commentPlaceholder="e.g. Subject-verb agreement errors throughout."
              />
            </div>
          </div>

          <div className="pisa-card space-y-3">
            <div>
              <p className="pisa-tag text-pisa-pink-deep">Detailed feedback</p>
              <h2 className="font-display text-lg text-pisa-navy mt-1">Per criterion</h2>
              <p className="text-[12px] text-muted-foreground mt-1">
                Expand on each IELTS criterion. Students see this in their feedback view.
              </p>
            </div>
            <div>
              <label className="text-[12px] font-medium text-pisa-navy">Task response / achievement — detail</label>
              <textarea
                value={trD}
                onChange={(e) => setTrD(e.target.value)}
                className="mt-1 w-full min-h-[70px] rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
                placeholder="What did the student do well / poorly on task response? Be specific."
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-pisa-navy">Coherence & cohesion — detail</label>
              <textarea
                value={ccD}
                onChange={(e) => setCcD(e.target.value)}
                className="mt-1 w-full min-h-[70px] rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
                placeholder="Comment on paragraphing, linkers, referencing and overall flow."
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-pisa-navy">Lexical resource — detail</label>
              <textarea
                value={lrD}
                onChange={(e) => setLrD(e.target.value)}
                className="mt-1 w-full min-h-[70px] rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
                placeholder="Range, accuracy, collocations, register — give examples from the essay."
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-pisa-navy">Grammatical range & accuracy — detail</label>
              <textarea
                value={grD}
                onChange={(e) => setGrD(e.target.value)}
                className="mt-1 w-full min-h-[70px] rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
                placeholder="Sentence variety, tense control, punctuation — quote a few errors."
              />
            </div>

            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Overall feedback</label>
              <textarea
                value={overall}
                onChange={(e) => setOverall(e.target.value)}
                className="mt-1 w-full min-h-[100px] rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
                placeholder="Summarise the student's performance on this essay."
              />
            </div>
          </div>

          <div className="pisa-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pisa-purple-deep" />
                <h3 className="font-display text-base text-pisa-navy">Sample essay</h3>
                {sample ? (
                  <StatusBadge variant="success">Attached</StatusBadge>
                ) : (
                  <StatusBadge variant="purple">Not attached</StatusBadge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setAiOpen(true)}>
                <Sparkles className="h-3.5 w-3.5" /> {sample ? "Re-generate" : "Generate"}
              </Button>
            </div>
            {sample && (
              <div className="mt-3 rounded-xl bg-secondary p-3 text-[13.5px] leading-[1.7] whitespace-pre-wrap max-h-48 overflow-y-auto">
                {sample}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sticky bottom-3">
            <Button
              variant="ghost"
              onClick={() => {
                upsertFeedback({
                  submission_id: submission.id,
                  teacher_id: profile.id,
                  task_response_score: tr,
                  coherence_score: cc,
                  lexical_score: lr,
                  grammar_score: gr,
                  task_response_comment: trC,
                  coherence_comment: ccC,
                  lexical_comment: lrC,
                  grammar_comment: grC,
              task_response_detail: trD,
              coherence_detail: ccD,
              lexical_detail: lrD,
              grammar_detail: grD,
                  overall_band: overallBand,
                  overall_feedback: overall,
                  strengths: "",
                  weaknesses: "",
                  next_action: "",
                  progress_note: "",
                  sample_essay: sample,
                  is_sent_to_student: false,
                });
                toast.success("Draft feedback saved.");
              }}
            >
              <Save className="h-4 w-4" /> Save draft
            </Button>
            <Button
              variant="accent"
              onClick={() => {
                upsertFeedback({
                  submission_id: submission.id,
                  teacher_id: profile.id,
                  task_response_score: tr,
                  coherence_score: cc,
                  lexical_score: lr,
                  grammar_score: gr,
                  task_response_comment: trC,
                  coherence_comment: ccC,
                  lexical_comment: lrC,
                  grammar_comment: grC,
                  task_response_detail: trD,
                  coherence_detail: ccD,
                  lexical_detail: lrD,
                  grammar_detail: grD,
                  overall_band: overallBand,
                  overall_feedback: overall,
                  strengths: "",
                  weaknesses: "",
                  next_action: "",
                  progress_note: "",
                  sample_essay: sample,
                  is_sent_to_student: true,
                });
                toast.success("Feedback sent to student.", {
                  description: "Saved to progress history.",
                });
              }}
            >
              <Send className="h-4 w-4" /> Send to student
            </Button>
          </div>
        </aside>
      </div>

      <SampleEssayModal
        open={aiOpen}
        onOpenChange={setAiOpen}
        questionPrompt={task.question_prompt}
        studentEssay={submission.essay_text}
        defaultTargetBand={student.target_band ?? task.target_band ?? 6.5}
        onAttach={setSample}
      />
    </PageShell>
  );
};

export default ReviewWorkspace;
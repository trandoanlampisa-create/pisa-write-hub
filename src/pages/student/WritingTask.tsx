import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/pisa/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { getTask } from "@/data/mockData";
import { ArrowLeft, CheckCircle2, Clock, Save, Send } from "lucide-react";
import { toast } from "sonner";

const WritingTask = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const task = getTask(taskId ?? "");

  const [taskType, setTaskType] = useState<"task1" | "task2">(task?.task_type ?? "task2");
  const [essay, setEssay] = useState("");
  const [note, setNote] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const wordCount = useMemo(
    () => (essay.trim() ? essay.trim().split(/\s+/).length : 0),
    [essay],
  );
  const minWords = taskType === "task1" ? 150 : 250;

  if (!profile) return <Navigate to="/login?role=student" replace />;
  if (!task) {
    return (
      <PageShell>
        <div className="pisa-card text-center">
          <h2 className="font-display text-xl text-pisa-navy">Task not found</h2>
          <Button asChild variant="primary" className="mt-3">
            <Link to="/student">Back to dashboard</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const r = (s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved", { description: `${wordCount} words saved locally.` });
  };

  const handleSubmit = () => {
    if (wordCount < 30) {
      toast.error("Your essay is too short to submit yet.");
      return;
    }
    setSubmitted(true);
    setRunning(false);
    toast.success("Essay submitted!", { description: "Your teacher will review it shortly." });
  };

  if (submitted) {
    return (
      <PageShell>
        <div className="max-w-xl mx-auto pisa-card text-center py-10">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-tint-mint text-pisa-mint-deep">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-2xl text-pisa-navy">Essay submitted!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Status: <StatusBadge variant="pink">Waiting for teacher feedback</StatusBadge>
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            We saved {wordCount} words. You'll see feedback in your dashboard once your teacher reviews it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="primary" onClick={() => navigate("/student")}>Back to dashboard</Button>
            <Button variant="outline" onClick={() => { setSubmitted(false); setEssay(""); setSeconds(0); }}>
              Write another
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-5">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/student"><ArrowLeft className="h-3.5 w-3.5" /> Dashboard</Link>
        </Button>
        <div className="flex items-center gap-2">
          <StatusBadge variant={taskType === "task1" ? "navy" : "purple"}>
            {taskType === "task1" ? "Task 1" : "Task 2"}
          </StatusBadge>
          {task.target_band && (
            <StatusBadge variant="yellow">Target {task.target_band}</StatusBadge>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Prompt */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="pisa-card">
            <p className="pisa-tag text-pisa-pink-deep">Question prompt</p>
            <h2 className="mt-1 font-display text-lg text-pisa-navy leading-snug">
              {task.title}
            </h2>
            <p className="mt-3 text-[14px] text-foreground/85 leading-relaxed whitespace-pre-wrap">
              {task.question_prompt}
            </p>
            {task.instructions && (
              <div className="mt-3 rounded-xl bg-tint-yellow p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-pisa-yellow-deep">
                  Teacher tip
                </p>
                <p className="mt-1 text-[13px] text-pisa-yellow-deep/90">{task.instructions}</p>
              </div>
            )}
          </div>

          <div className="pisa-card space-y-3">
            <p className="pisa-tag text-muted-foreground">Writing type</p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-pill">
              {(["task1", "task2"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTaskType(t)}
                  className={`py-1.5 rounded-pill text-xs font-medium ${
                    taskType === t ? "bg-pisa-navy text-white" : "text-pisa-navy/70"
                  }`}
                >
                  {t === "task1" ? "Task 1 · 150w" : "Task 2 · 250w"}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="pisa-card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <span>
                  <span className={`font-display font-bold ${wordCount >= minWords ? "text-pisa-mint-deep" : "text-pisa-navy"}`}>{wordCount}</span> / {minWords} words
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRunning((r) => !r)}
                  className="inline-flex items-center gap-1.5 rounded-pill bg-secondary text-pisa-navy px-3 py-1 text-[12px] font-medium"
                >
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(seconds)} · {running ? "Pause" : "Start timer"}
                </button>
              </div>
            </div>

            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Start writing your essay here…"
              className="w-full min-h-[420px] rounded-xl border border-border bg-secondary p-4 text-[15px] leading-[1.75] focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
            />

            <div className="mt-4">
              <label className="text-[12px] font-medium text-muted-foreground">
                Optional note for your teacher
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. I struggled with the conclusion"
                className="mt-1 w-full rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleSaveDraft}>
              <Save className="h-4 w-4" /> Save draft
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              <Send className="h-4 w-4" /> Submit essay
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default WritingTask;
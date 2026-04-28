import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PageShell } from "@/components/pisa/PageShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { mockClasses, mockProfiles } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CreateTask = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState<"task1" | "task2">("task2");
  const [prompt, setPrompt] = useState("");
  const [instructions, setInstructions] = useState("");
  const [target, setTarget] = useState(6.5);
  const [assignedClass, setAssignedClass] = useState(mockClasses[0]?.class_name ?? "");
  const [dueDate, setDueDate] = useState("");

  if (!profile) return <Navigate to="/login?role=teacher" replace />;

  const onPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !prompt) {
      toast.error("Please add a title and question prompt.");
      return;
    }
    toast.success("Writing task published!", {
      description: `${title} → ${assignedClass}`,
    });
    navigate("/teacher");
  };

  const students = mockProfiles.filter(
    (p) => p.role === "student" && p.class_name === assignedClass,
  );

  return (
    <PageShell className="space-y-5">
      <Button asChild variant="ghost" size="sm">
        <Link to="/teacher"><ArrowLeft className="h-3.5 w-3.5" /> Dashboard</Link>
      </Button>

      <div className="grid gap-5 lg:grid-cols-3">
        <form onSubmit={onPublish} className="pisa-card lg:col-span-2 space-y-5">
          <div>
            <p className="pisa-tag text-pisa-pink-deep">New writing task</p>
            <h1 className="mt-1 font-display text-2xl text-pisa-navy">Create a writing task</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Students see this on their dashboard once you publish.
            </p>
          </div>

          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Task title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Opinion essay: Modern lifestyles"
              className="mt-1 w-full rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Task type</label>
              <div className="mt-1 grid grid-cols-2 gap-2 p-1 bg-secondary rounded-pill">
                {(["task1", "task2"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTaskType(t)}
                    className={`py-1.5 rounded-pill text-xs font-medium ${
                      taskType === t ? "bg-pisa-navy text-white" : "text-pisa-navy/70"
                    }`}
                  >
                    {t === "task1" ? "Task 1" : "Task 2"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Target band</label>
              <select
                value={target}
                onChange={(e) => setTarget(parseFloat(e.target.value))}
                className="mt-1 w-full rounded-xl border border-border bg-white p-2.5 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
              >
                {[5.5, 6, 6.5, 7, 7.5, 8].map((b) => (
                  <option key={b} value={b}>Band {b.toFixed(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Question prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste the IELTS question here…"
              className="mt-1 w-full min-h-[140px] rounded-xl border border-border bg-secondary p-3 text-sm leading-relaxed focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-muted-foreground">Instructions for students (optional)</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Focus on overview and use comparative language."
              className="mt-1 w-full min-h-[80px] rounded-xl border border-border bg-white p-3 text-sm leading-relaxed focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15 resize-y"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Assign to class</label>
              <select
                value={assignedClass}
                onChange={(e) => setAssignedClass(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white p-2.5 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
              >
                {mockClasses.map((c) => (
                  <option key={c.id} value={c.class_name}>{c.class_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-muted-foreground">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white p-2.5 text-sm focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate("/teacher")}>Cancel</Button>
            <Button type="submit" variant="accent">Publish task</Button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="pisa-card">
            <h3 className="font-display text-base text-pisa-navy">Will be visible to</h3>
            <p className="mt-1 text-[12px] text-muted-foreground">{assignedClass}</p>
            <ul className="mt-3 space-y-2">
              {students.map((s) => (
                <li key={s.id} className="flex items-center gap-2 text-sm">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-tint-purple text-pisa-purple-deep text-[11px] font-bold">
                    {s.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <span>{s.full_name}</span>
                </li>
              ))}
              {students.length === 0 && (
                <li className="text-[13px] text-muted-foreground">No students in this class yet.</li>
              )}
            </ul>
          </div>
          <div className="rounded-2xl bg-pisa-yellow text-pisa-navy p-4">
            <p className="pisa-tag">Tip</p>
            <p className="mt-1 text-[13.5px] leading-relaxed">
              Add specific instructions so students know exactly what to focus on. The clearer the brief, the more useful the feedback.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
};

export default CreateTask;
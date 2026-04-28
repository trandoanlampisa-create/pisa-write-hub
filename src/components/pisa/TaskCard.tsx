import { Link } from "react-router-dom";
import type { WritingTask, EssaySubmission } from "@/types";
import { StatusBadge, submissionStatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";

interface TaskCardProps {
  task: WritingTask;
  submission?: EssaySubmission;
}

export const TaskCard = ({ task, submission }: TaskCardProps) => {
  const due = task.due_date
    ? new Date(task.due_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="pisa-card flex flex-col gap-3 hover:border-pisa-navy/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge variant={task.task_type === "task1" ? "navy" : "purple"}>
            {task.task_type === "task1" ? "Task 1" : "Task 2"}
          </StatusBadge>
          {task.target_band && (
            <StatusBadge variant="yellow">Target {task.target_band}</StatusBadge>
          )}
          {submission && submissionStatusBadge(submission.status)}
        </div>
        {due && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" /> Due {due}
          </span>
        )}
      </div>

      <h3 className="font-display text-lg leading-snug text-pisa-navy">
        {task.title}
      </h3>
      <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
        {task.question_prompt}
      </p>

      <div className="mt-1">
        <Button asChild variant="primary" size="sm">
          <Link to={`/student/write/${task.id}`}>
            {submission ? "Continue writing" : "Start writing"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
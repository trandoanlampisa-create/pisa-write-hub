import type { ProgressNote } from "@/types";
import { ProgressBar } from "./ProgressBar";

export const StudentProgressTimeline = ({ notes }: { notes: ProgressNote[] }) => {
  if (notes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No progress notes yet.
      </div>
    );
  }
  const max = 9;
  return (
    <ol className="relative border-l-2 border-pisa-yellow/60 pl-5 space-y-5">
      {notes.map((n) => (
        <li key={n.id} className="relative">
          <span className="absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full bg-pisa-yellow ring-4 ring-background" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {new Date(n.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="rounded-pill bg-tint-yellow text-pisa-yellow-deep px-2 py-0.5 text-[11px] font-medium">
              Band {n.estimated_band.toFixed(1)}
            </span>
            <span className="rounded-pill bg-tint-purple text-pisa-purple-deep px-2 py-0.5 text-[11px] font-medium">
              {n.focus_area}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-foreground/85 leading-relaxed">{n.note}</p>
          <ProgressBar value={(n.estimated_band / max) * 100} color="yellow" className="mt-2" />
        </li>
      ))}
    </ol>
  );
};
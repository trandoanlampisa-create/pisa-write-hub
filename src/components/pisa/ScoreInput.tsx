import { cn } from "@/lib/utils";

interface ScoreInputProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  comment?: string;
  onCommentChange?: (v: string) => void;
  commentPlaceholder?: string;
}

// Integer band scores only (per teacher requirement)
const BANDS = [4, 5, 6, 7, 8, 9];

export const ScoreInput = ({
  label,
  hint,
  value,
  onChange,
  comment,
  onCommentChange,
  commentPlaceholder,
}: ScoreInputProps) => {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[12px] font-medium text-pisa-navy">{label}</label>
        <span className="font-display text-lg font-bold text-pisa-navy">
          {Math.round(value)}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {BANDS.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => onChange(b)}
            className={cn(
              "h-7 min-w-[34px] px-2.5 rounded-pill text-[12px] font-semibold transition-all border",
              Math.round(value) === b
                ? "bg-pisa-navy text-white border-pisa-navy"
                : "bg-white text-pisa-navy border-border hover:border-pisa-navy/40",
            )}
          >
            {b}
          </button>
        ))}
      </div>
      {onCommentChange && (
        <input
          value={comment ?? ""}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder={commentPlaceholder ?? "Brief comment for this criterion…"}
          className="mt-2 w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:border-pisa-navy focus:ring-[3px] focus:ring-pisa-navy/15"
        />
      )}
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
};
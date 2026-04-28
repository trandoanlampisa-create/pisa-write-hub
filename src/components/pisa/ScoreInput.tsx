import { cn } from "@/lib/utils";

interface ScoreInputProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
}

const BANDS = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export const ScoreInput = ({ label, hint, value, onChange }: ScoreInputProps) => {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[12px] font-medium text-pisa-navy">{label}</label>
        <span className="font-display text-lg font-bold text-pisa-navy">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {BANDS.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => onChange(b)}
            className={cn(
              "h-7 min-w-[32px] px-2 rounded-pill text-[11px] font-medium transition-all border",
              value === b
                ? "bg-pisa-navy text-white border-pisa-navy"
                : "bg-white text-pisa-navy border-border hover:border-pisa-navy/40",
            )}
          >
            {b}
          </button>
        ))}
      </div>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
};
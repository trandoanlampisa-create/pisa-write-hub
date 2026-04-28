import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "navy" | "pink" | "yellow" | "purple" | "mint";
  className?: string;
}

export const MetricCard = ({ label, value, hint, accent, className }: MetricCardProps) => {
  const accentClass = accent
    ? {
        navy: "border-l-pisa-navy",
        pink: "border-l-pisa-pink",
        yellow: "border-l-pisa-yellow",
        purple: "border-l-pisa-purple",
        mint: "border-l-pisa-mint",
      }[accent]
    : "border-l-transparent";

  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border/60 border-l-[3px] p-4 md:p-5",
        accentClass,
        className,
      )}
    >
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl md:text-[26px] font-bold text-pisa-navy leading-tight">
        {value}
      </p>
      {hint && <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
};
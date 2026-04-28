import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  color?: "navy" | "pink" | "yellow" | "purple" | "mint";
  className?: string;
}

export const ProgressBar = ({ value, color = "yellow", className }: ProgressBarProps) => {
  const fillClass = {
    navy: "bg-pisa-navy",
    pink: "bg-pisa-pink",
    yellow: "bg-pisa-yellow",
    purple: "bg-pisa-purple",
    mint: "bg-pisa-mint",
  }[color];

  return (
    <div className={cn("h-1.5 w-full rounded-pill bg-black/[0.08] overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-pill transition-[width] duration-500", fillClass)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
};
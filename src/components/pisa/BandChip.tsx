import { cn } from "@/lib/utils";

interface BandChipProps {
  label: string;
  band: number | string;
  variant?: "default" | "target" | "current";
  className?: string;
}

export const BandChip = ({ label, band, variant = "default", className }: BandChipProps) => {
  const styles = {
    default: "bg-pisa-navy text-white",
    target: "bg-pisa-pink text-white",
    current: "bg-pisa-purple text-pisa-purple-deep",
  }[variant];

  const scoreColor =
    variant === "current" ? "text-pisa-navy" : "text-pisa-yellow";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2",
        styles,
        className,
      )}
    >
      <span className="text-[12px] font-medium opacity-90">{label}</span>
      <span className={cn("font-display text-xl font-bold leading-none", scoreColor)}>
        {band}
      </span>
    </div>
  );
};
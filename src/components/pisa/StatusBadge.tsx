import { cn } from "@/lib/utils";
import type { SubmissionStatus } from "@/types";

type Variant = "navy" | "pink" | "yellow" | "purple" | "success" | "ghost";

const variantClasses: Record<Variant, string> = {
  navy: "bg-tint-navy text-pisa-navy",
  pink: "bg-tint-pink text-pisa-pink-deep",
  yellow: "bg-tint-yellow text-pisa-yellow-deep",
  purple: "bg-tint-purple text-pisa-purple-deep",
  success: "bg-tint-mint text-pisa-mint-deep",
  ghost: "bg-white/15 text-white",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export const StatusBadge = ({ children, variant = "navy", className }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11px] font-medium",
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
);

export const submissionStatusBadge = (status: SubmissionStatus) => {
  if (status === "draft") return <StatusBadge variant="yellow">Draft</StatusBadge>;
  if (status === "submitted") return <StatusBadge variant="pink">Awaiting review</StatusBadge>;
  return <StatusBadge variant="success">Reviewed</StatusBadge>;
};
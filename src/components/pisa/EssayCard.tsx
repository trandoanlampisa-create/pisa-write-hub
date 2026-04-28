import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EssayCardProps {
  title?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const EssayCard = ({ title, meta, children, className }: EssayCardProps) => (
  <div className={cn("pisa-card", className)}>
    {(title || meta) && (
      <div className="flex items-center justify-between gap-3 mb-3">
        {title && <h3 className="font-display text-base text-pisa-navy">{title}</h3>}
        {meta && <div className="text-[12px] text-muted-foreground">{meta}</div>}
      </div>
    )}
    <div className="text-[14.5px] leading-[1.75] text-foreground whitespace-pre-wrap">
      {children}
    </div>
  </div>
);
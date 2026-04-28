import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const EmptyState = ({ title, description, action, icon, className }: EmptyStateProps) => (
  <div
    className={cn(
      "rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center",
      className,
    )}
  >
    {icon && <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-tint-yellow text-pisa-navy">{icon}</div>}
    <h3 className="font-display text-lg text-pisa-navy">{title}</h3>
    {description && (
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const LoadingState = ({ label = "Loading…" }: { label?: string }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
    <span className="h-2 w-2 rounded-full bg-pisa-pink animate-pulse" />
    <span className="h-2 w-2 rounded-full bg-pisa-yellow animate-pulse [animation-delay:120ms]" />
    <span className="h-2 w-2 rounded-full bg-pisa-navy animate-pulse [animation-delay:240ms]" />
    <span className="ml-2">{label}</span>
  </div>
);
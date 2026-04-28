import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  tag?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  size?: "default" | "lg";
}

export const HeroBanner = ({
  tag,
  title,
  subtitle,
  children,
  className,
  size = "default",
}: HeroBannerProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl bg-pisa-navy text-white",
        size === "lg" ? "p-8 md:p-14" : "p-6 md:p-10",
        className,
      )}
    >
      {/* decorative pink bubble */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-pisa-pink opacity-25 blur-[2px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 -bottom-16 h-48 w-48 rounded-full bg-pisa-yellow opacity-15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 -bottom-12 h-32 w-32 rounded-full bg-pisa-purple opacity-20"
      />

      <div className="relative">
        {tag && (
          <p className="pisa-tag text-pisa-yellow mb-3">{tag}</p>
        )}
        <h1
          className={cn(
            "font-display font-bold leading-[1.05] text-white max-w-3xl",
            size === "lg"
              ? "text-4xl md:text-6xl"
              : "text-3xl md:text-4xl",
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-white/70 leading-relaxed text-[15px] md:text-base">
            {subtitle}
          </p>
        )}
        {children && <div className="relative mt-6">{children}</div>}
      </div>
    </section>
  );
};
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

export const PageShell = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className={cn("w-full px-4 md:px-6 lg:px-8 py-6 md:py-8", className)}>{children}</main>
  </div>
);
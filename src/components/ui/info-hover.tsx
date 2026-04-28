import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function InfoHover({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <span
      className={cn(
        "group relative inline-flex items-center align-middle",
        className,
      )}
    >
      <Info className="w-3.5 h-3.5 text-ink-300 hover:text-ink-600 transition-colors cursor-help" />
      <span
        className={cn(
          "pointer-events-none absolute top-full mt-2 z-50 hidden group-hover:block w-[320px] rounded-md bg-ink-900 text-ink-50 text-[12px] leading-relaxed font-normal px-3 py-2 shadow-lg ring-1 ring-black/5",
          align === "left" ? "left-0" : "right-0",
        )}
      >
        {children}
      </span>
    </span>
  );
}

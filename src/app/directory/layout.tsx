"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENTS, REGISTERED_ACTIONS } from "@/lib/fixtures";

const tabs = [
  {
    href: "/directory/agents",
    label: "Agents",
    icon: Bot,
    blurb: "Every AI agent that calls Preflight before acting.",
    count: AGENTS.length,
  },
  {
    href: "/directory/actions",
    label: "Actions",
    icon: Activity,
    blurb:
      "Data-change watches across your sources of record. Every change lands in the Action Ledger.",
    count: REGISTERED_ACTIONS.length,
  },
] as const;

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = tabs.find((t) => pathname.startsWith(t.href)) ?? tabs[0];
  const isList =
    pathname === "/directory" ||
    pathname === "/directory/agents" ||
    pathname === "/directory/actions";

  if (!isList) {
    return <>{children}</>;
  }

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-brand mb-1">
          Directory
        </div>
        <h1 className="text-[26px] leading-tight font-semibold tracking-tight text-ink-900 hero-serif">
          Everything the Coordinator watches.
        </h1>
        <p className="mt-1.5 text-[13.5px] text-muted max-w-2xl">
          Two kinds of registration sit side-by-side.{" "}
          <strong className="text-ink-800 font-semibold">Agents</strong> declare
          what they intend to do before they do it.{" "}
          <strong className="text-ink-800 font-semibold">Actions</strong>{" "}
          declare what data changes you care about — every match lands in the
          Action Ledger, ready for downstream policies and agents to react.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-1 flex-wrap border-b border-border -mx-1 px-1 pb-0.5">
          {tabs.map((t) => {
            const isActive = pathname.startsWith(t.href);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "relative inline-flex items-center gap-1.5 h-9 px-3 -mb-px text-[12.5px] font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-brand text-ink-900"
                    : "border-transparent text-ink-600 hover:text-ink-900",
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isActive ? "text-brand" : "text-ink-400",
                  )}
                />
                <span>{t.label}</span>
                <span
                  className={cn(
                    "tabular text-[10.5px] px-1.5 h-[18px] rounded-full inline-flex items-center justify-center font-semibold",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "bg-ink-100 text-ink-600",
                  )}
                >
                  {t.count}
                </span>
              </Link>
            );
          })}
        </div>
        <p className="text-[12px] text-muted">{active.blurb}</p>
      </div>

      {children}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Bot,
  Users,
  Scroll,
  ShieldCheck,
  Coins,
  CalendarCheck,
  Zap,
  TrendingUp,
  Plug,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: "Control" | "Agents" | "Insight" | "Platform";
};

const nav: NavItem[] = [
  { href: "/", label: "Command Center", icon: LayoutGrid, group: "Control" },
  {
    href: "/preflight",
    label: "Preflight Stream",
    icon: Zap,
    group: "Control",
  },
  {
    href: "/collisions",
    label: "Collisions",
    icon: ShieldCheck,
    group: "Control",
  },
  { href: "/agents", label: "Agents", icon: Bot, group: "Agents" },
  { href: "/records", label: "Records", icon: Users, group: "Agents" },
  { href: "/ledger", label: "Action Ledger", icon: Scroll, group: "Agents" },
  { href: "/policies", label: "Policies", icon: ShieldCheck, group: "Insight" },
  { href: "/budgets", label: "Budgets", icon: Coins, group: "Insight" },
  {
    href: "/scheduling",
    label: "Scheduling",
    icon: CalendarCheck,
    group: "Insight",
  },
  {
    href: "/attribution",
    label: "Attribution",
    icon: TrendingUp,
    group: "Insight",
  },
  { href: "/partners", label: "Partners", icon: Plug, group: "Platform" },
  { href: "/mcp", label: "MCP & API", icon: Code2, group: "Platform" },
];

const groups: Array<{ key: string; label: string }> = [
  { key: "Control", label: "Control plane" },
  { key: "Agents", label: "Agents & records" },
  { key: "Insight", label: "Guardrails & insight" },
  { key: "Platform", label: "Platform" },
];

export function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="h-14 px-4 flex items-center gap-2 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-brand text-white flex items-center justify-center text-[11px] font-bold tracking-tight">
          LD
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-ink-900">
            GTM Coordinator
          </span>
          <span className="text-[10.5px] text-muted">by LeanData</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {groups.map((g) => {
          const items = nav.filter((i) => i.group === g.key);
          return (
            <div key={g.key} className="mb-4">
              <div className="px-2 mb-1 text-[10px] uppercase tracking-wider font-semibold text-ink-400">
                {g.label}
              </div>
              <ul className="space-y-[1px]">
                {items.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors",
                          active
                            ? "bg-brand-50 text-brand-700 font-semibold"
                            : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-[15px] h-[15px] shrink-0",
                            active
                              ? "text-brand"
                              : "text-ink-400 group-hover:text-ink-600",
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-ink-50">
          <span className="live-dot" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-ink-700 font-medium">
              Coordinator live
            </div>
            <div className="text-[10px] text-muted tabular">
              p95 287 ms · 99.97% · fail-open
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

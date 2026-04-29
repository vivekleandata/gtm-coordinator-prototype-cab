"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  Bot,
  Users,
  Scroll,
  ShieldCheck,
  Zap,
  TrendingUp,
  Plug,
  Code2,
  ChevronRight,
  Building2,
  Briefcase,
  UserSquare2,
  UserPlus,
  LifeBuoy,
  CalendarDays,
  ListOrdered,
  Megaphone,
  Repeat,
  Server,
  Activity,
  Lock,
  Radar,
  FileText,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceChipStack } from "@/components/ui/source-chip";
import type { DataSourceKind } from "@/lib/fixtures";

type NavLeaf = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  sources?: DataSourceKind[];
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: "Control" | "Agents" | "Insight" | "Platform";
  children?: Array<NavLeaf | { label: string; children: NavLeaf[] }>;
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
  { href: "/directory", label: "Directory", icon: Bot, group: "Agents" },
  {
    href: "/records",
    label: "Records",
    icon: Users,
    group: "Agents",
    children: [
      {
        href: "/records/contacts",
        label: "Contacts",
        icon: UserSquare2,
        sources: ["salesforce", "hubspot", "marketo"],
      },
      {
        href: "/records/accounts",
        label: "Accounts",
        icon: Building2,
        sources: ["salesforce", "hubspot", "snowflake"],
      },
      {
        href: "/records/opportunities",
        label: "Opportunities",
        icon: Briefcase,
        sources: ["salesforce"],
      },
      {
        href: "/records/leads",
        label: "Leads",
        icon: UserPlus,
        sources: ["salesforce", "hubspot", "marketo"],
      },
      {
        href: "/records/cases",
        label: "Cases",
        icon: LifeBuoy,
        sources: ["salesforce", "zendesk"],
      },
      {
        href: "/records/meetings",
        label: "Meetings",
        icon: CalendarDays,
        sources: ["scheduling", "salesforce", "gong"],
      },
      {
        href: "/records/sequence-enrollments",
        label: "Sequences",
        icon: ListOrdered,
        sources: ["outreach", "marketo", "hubspot"],
      },
      {
        href: "/records/campaigns",
        label: "Campaigns",
        icon: Megaphone,
        sources: ["marketo", "salesforce", "hubspot"],
      },
      {
        href: "/records/subscriptions",
        label: "Subscriptions",
        icon: Repeat,
        sources: ["salesforce", "snowflake"],
      },
      {
        label: "Custom",
        children: [
          {
            href: "/records/custom/quotes",
            label: "Quotes",
            icon: FileText,
            sources: ["salesforce"],
          },
          {
            href: "/records/custom/orders",
            label: "Orders",
            icon: Boxes,
            sources: ["salesforce", "stripe"],
          },
          {
            href: "/records/custom/workspaces",
            label: "Workspaces",
            icon: Server,
            sources: ["snowflake", "segment"],
          },
          {
            href: "/records/custom/product-usage",
            label: "Product Usage",
            icon: Activity,
            sources: ["snowflake", "segment"],
          },
          {
            href: "/records/custom/consents",
            label: "Consents",
            icon: Lock,
            sources: ["onetrust", "hubspot", "marketo", "salesforce"],
          },
          {
            href: "/records/custom/intent-signals",
            label: "Intent Signals",
            icon: Radar,
            sources: ["zoominfo", "snowflake", "segment", "hubspot"],
          },
        ],
      },
    ],
  },
  { href: "/ledger", label: "Action Ledger", icon: Scroll, group: "Agents" },
  { href: "/policies", label: "Policies", icon: ShieldCheck, group: "Insight" },
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

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SideNav() {
  const pathname = usePathname();
  const recordsActive = pathname.startsWith("/records");
  const [recordsOpen, setRecordsOpen] = useState<boolean>(recordsActive);
  const customActive = pathname.startsWith("/records/custom");
  const [customOpen, setCustomOpen] = useState<boolean>(customActive);

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="h-14 px-4 flex items-center gap-2 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-tool-salesforce text-white flex items-center justify-center text-[10px] font-bold tracking-tight">
          SF
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[14px] font-semibold text-ink-900 truncate">
            Convex Software
          </span>
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
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);

                  if (item.children) {
                    return (
                      <li key={item.href}>
                        <div className="flex items-stretch">
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors",
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
                          <button
                            type="button"
                            aria-label={`Toggle ${item.label}`}
                            aria-expanded={recordsOpen}
                            onClick={(e) => {
                              e.preventDefault();
                              setRecordsOpen((v) => !v);
                            }}
                            className="px-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-ink-50"
                          >
                            <ChevronRight
                              className={cn(
                                "w-3.5 h-3.5 transition-transform",
                                recordsOpen && "rotate-90",
                              )}
                            />
                          </button>
                        </div>
                        {recordsOpen && (
                          <ul className="mt-0.5 ml-[14px] pl-3 border-l border-border space-y-[1px]">
                            {item.children.map((child) => {
                              if ("children" in child) {
                                const subActive =
                                  pathname.startsWith("/records/custom");
                                return (
                                  <li key={child.label}>
                                    <button
                                      type="button"
                                      onClick={() => setCustomOpen((v) => !v)}
                                      aria-expanded={customOpen}
                                      className={cn(
                                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] transition-colors",
                                        subActive
                                          ? "text-brand-700 font-semibold"
                                          : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
                                      )}
                                    >
                                      <ChevronRight
                                        className={cn(
                                          "w-3 h-3 transition-transform shrink-0",
                                          customOpen && "rotate-90",
                                          subActive
                                            ? "text-brand"
                                            : "text-ink-400",
                                        )}
                                      />
                                      <span>{child.label}</span>
                                    </button>
                                    {customOpen && (
                                      <ul className="mt-0.5 ml-[10px] pl-3 border-l border-border space-y-[1px]">
                                        {child.children.map((sub) => (
                                          <NavChildLink
                                            key={sub.href}
                                            child={sub}
                                            active={isActive(
                                              pathname,
                                              sub.href,
                                            )}
                                          />
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                );
                              }
                              return (
                                <NavChildLink
                                  key={child.href}
                                  child={child}
                                  active={isActive(pathname, child.href)}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  }

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

      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span>powered by</span>
          <span className="inline-flex items-center gap-1 font-semibold text-ink-700">
            <span className="w-3 h-3 rounded-[3px] bg-brand text-white flex items-center justify-center text-[7px] font-bold tracking-tight">
              LD
            </span>
            LeanData
          </span>
        </div>
      </div>
    </aside>
  );
}

function NavChildLink({ child, active }: { child: NavLeaf; active: boolean }) {
  const Icon = child.icon;
  return (
    <li>
      <Link
        href={child.href}
        className={cn(
          "group flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] transition-colors",
          active
            ? "text-brand-700 font-semibold bg-brand-50/60"
            : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "w-[13px] h-[13px] shrink-0",
              active ? "text-brand" : "text-ink-400 group-hover:text-ink-600",
            )}
          />
        )}
        <span className="truncate">{child.label}</span>
        {child.sources && child.sources.length > 0 && (
          <span className="ml-auto pl-1 shrink-0">
            <SourceChipStack sources={child.sources} size="xs" max={3} />
          </span>
        )}
      </Link>
    </li>
  );
}

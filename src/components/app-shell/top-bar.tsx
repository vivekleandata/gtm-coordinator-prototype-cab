"use client";

import { Search, Sparkles, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-border">
      <div className="h-14 px-5 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-ink-50 text-[13px] text-ink-700">
            <span className="w-4 h-4 rounded-sm bg-tool-salesforce text-white flex items-center justify-center text-[9px] font-bold">
              SF
            </span>
            <span className="font-medium">Convex Software</span>
            <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
          </button>
          <span className="text-ink-300">/</span>
          <span className="text-[12px] text-muted">Production · US‑East‑1</span>
        </div>

        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 px-2.5 h-8 rounded-md border border-border bg-ink-50/60 text-[12.5px] text-muted">
            <Search className="w-3.5 h-3.5" />
            <span>Search agents, records, policies…</span>
            <span className="ml-auto text-[10.5px] text-ink-400 font-mono">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-2 h-8 rounded-md border border-border bg-surface hover:bg-ink-50 text-[12.5px] text-ink-700">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            Ask Coordinator
          </button>
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[11.5px] font-semibold">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}

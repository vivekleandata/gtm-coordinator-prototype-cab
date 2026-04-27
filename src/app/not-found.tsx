import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-8 py-16 max-w-xl mx-auto text-center space-y-3">
      <div className="text-[11px] uppercase tracking-wider font-semibold text-brand">
        404
      </div>
      <h1 className="text-[26px] hero-serif text-ink-900">
        No such resource in this ledger.
      </h1>
      <p className="text-[13.5px] text-muted">
        The Coordinator couldn’t resolve that URL to a known agent, record, or
        policy.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-ink-900 hover:bg-ink-800 text-[12.5px] font-medium text-white"
      >
        Back to Command Center
      </Link>
    </div>
  );
}

import { DECISION_DISTRIBUTION_7D } from "@/lib/fixtures";

export function DecisionStackedBars() {
  const max = Math.max(
    ...DECISION_DISTRIBUTION_7D.map(
      (d) => d.go + d.no_go + d.wait + d.redirect,
    ),
  );
  return (
    <div className="flex items-stretch gap-3 h-40 px-1">
      {DECISION_DISTRIBUTION_7D.map((d) => {
        const total = d.go + d.no_go + d.wait + d.redirect;
        const h = (total / max) * 100;
        return (
          <div
            key={d.day}
            className="flex-1 h-full flex flex-col items-center justify-end gap-1.5"
          >
            <div
              className="w-full rounded-sm overflow-hidden flex flex-col-reverse min-h-[4px]"
              style={{ height: `${h}%` }}
              title={`${d.day}: ${total.toLocaleString()} decisions`}
            >
              <div
                className="bg-emerald-500/85"
                style={{ height: `${(d.go / total) * 100}%` }}
              />
              <div
                className="bg-amber-500/85"
                style={{ height: `${(d.wait / total) * 100}%` }}
              />
              <div
                className="bg-blue-500/85"
                style={{ height: `${(d.redirect / total) * 100}%` }}
              />
              <div
                className="bg-red-500/85"
                style={{ height: `${(d.no_go / total) * 100}%` }}
              />
            </div>
            <div className="text-[10.5px] text-muted tabular shrink-0">
              {d.day}
            </div>
          </div>
        );
      })}
    </div>
  );
}

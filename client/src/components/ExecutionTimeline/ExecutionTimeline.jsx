const agentColors = {
  planner: 'bg-blue-50 text-blue-700',
  execution: 'bg-emerald-50 text-emerald-700',
  validation: 'bg-amber-50 text-amber-700',
  recovery: 'bg-red-50 text-red-700',
  monitoring: 'bg-slate-100 text-slate-700'
};

export default function ExecutionTimeline({ events }) {
  if (!events.length) {
    return <p className="text-sm text-slate-500">No execution events yet.</p>;
  }

  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li className="rounded border border-slate-200 bg-white p-3" key={event.id || `${event.eventType}-${event.createdAt}`}>
          <div className="flex items-center justify-between gap-3">
            <span className={`rounded px-2 py-1 text-xs font-medium ${agentColors[event.agent] || agentColors.monitoring}`}>
              {event.agent}
            </span>
            <span className="text-xs text-slate-500">{event.createdAt ? new Date(event.createdAt).toLocaleTimeString() : ''}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-ink">{event.message}</p>
          <p className="mt-1 text-xs text-slate-500">{event.eventType}</p>
        </li>
      ))}
    </ol>
  );
}

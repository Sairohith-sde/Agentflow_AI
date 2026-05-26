const metrics = [
  { label: 'Total Workflows', value: '0' },
  { label: 'Active Runs', value: '0' },
  { label: 'Success Rate', value: '0%' },
  { label: 'Agent Events', value: '0' }
];

export default function MetricGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{metric.value}</p>
        </article>
      ))}
    </section>
  );
}

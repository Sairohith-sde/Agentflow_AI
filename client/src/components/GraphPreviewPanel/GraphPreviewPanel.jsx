export default function GraphPreviewPanel({ workflow, provider }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Graph Preview</h2>
        {provider ? <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{provider}</span> : null}
      </div>

      {workflow ? (
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-sm font-medium text-ink">{workflow.name}</p>
            <p className="mt-1 text-xs text-slate-500">{workflow.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border border-slate-200 p-2">
              <p className="text-xs text-slate-500">Nodes</p>
              <p className="font-semibold text-ink">{workflow.nodes.length}</p>
            </div>
            <div className="rounded border border-slate-200 p-2">
              <p className="text-xs text-slate-500">Edges</p>
              <p className="font-semibold text-ink">{workflow.edges.length}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Generated workflow details will appear here.</p>
      )}
    </section>
  );
}

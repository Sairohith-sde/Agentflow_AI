export default function NodeConfigPanel({ node, onChange }) {
  if (!node) {
    return (
      <aside className="rounded border border-slate-200 bg-white p-3">
        <h2 className="text-sm font-semibold text-ink">Node Config</h2>
        <p className="mt-3 text-sm text-slate-500">Select a node to configure it.</p>
      </aside>
    );
  }

  const config = node.data.config || {};

  function updateConfig(key, value) {
    onChange({
      ...node,
      data: {
        ...node.data,
        config: {
          ...config,
          [key]: value
        }
      }
    });
  }

  return (
    <aside className="rounded border border-slate-200 bg-white p-3">
      <h2 className="text-sm font-semibold text-ink">Node Config</h2>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-slate-600">Label</span>
        <input
          className="mt-1 w-full rounded border border-slate-300 px-2 py-2 text-sm outline-none focus:border-brand"
          value={node.data.label}
          onChange={(event) =>
            onChange({
              ...node,
              data: { ...node.data, label: event.target.value }
            })
          }
        />
      </label>

      <div className="mt-4 space-y-3">
        {Object.keys(config).length ? (
          Object.entries(config).map(([key, value]) => (
            <label className="block" key={key}>
              <span className="text-xs font-medium capitalize text-slate-600">{key}</span>
              <input
                className="mt-1 w-full rounded border border-slate-300 px-2 py-2 text-sm outline-none focus:border-brand"
                value={Array.isArray(value) ? value.join(', ') : value}
                onChange={(event) => updateConfig(key, event.target.value)}
              />
            </label>
          ))
        ) : (
          <p className="text-sm text-slate-500">This node has no required configuration.</p>
        )}
      </div>
    </aside>
  );
}

import { nodeCatalog } from '../../lib/nodeCatalog';

export default function NodePalette({ onAddNode }) {
  const groups = nodeCatalog.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <aside className="rounded border border-slate-200 bg-white p-3">
      <h2 className="text-sm font-semibold text-ink">Node Palette</h2>
      <div className="mt-3 space-y-4">
        {Object.entries(groups).map(([group, items]) => (
          <section key={group}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{group}</p>
            <div className="mt-2 space-y-2">
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.type}
                    className="flex w-full items-center gap-2 rounded border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 hover:border-brand hover:bg-blue-50"
                    onClick={() => onAddNode(item)}
                    type="button"
                  >
                    <Icon className="h-4 w-4 text-slate-500" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}

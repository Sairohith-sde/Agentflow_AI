import { Play, Save } from 'lucide-react';

export default function WorkflowToolbar({
  name,
  status,
  saving,
  executing,
  onNameChange,
  onStatusChange,
  onSave,
  onExecute
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">
      <input
        className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm font-medium outline-none focus:border-brand"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
      />
      <select
        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="archived">Archived</option>
      </select>
      <button
        className="inline-flex items-center justify-center gap-2 rounded bg-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={saving}
        onClick={onSave}
        type="button"
      >
        <Save className="h-4 w-4" />
        {saving ? 'Saving' : 'Save'}
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
        disabled={executing}
        onClick={onExecute}
        type="button"
      >
        <Play className="h-4 w-4" />
        {executing ? 'Starting' : 'Execute'}
      </button>
    </div>
  );
}

import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data, selected }) {
  return (
    <div
      className={`min-w-44 rounded border bg-white px-3 py-2 shadow-sm ${
        selected ? 'border-brand ring-2 ring-blue-100' : 'border-slate-200'
      }`}
    >
      <Handle className="h-2 w-2 border-0 bg-slate-400" position={Position.Top} type="target" />
      <p className="text-sm font-semibold text-ink">{data.label}</p>
      <p className="mt-1 text-xs text-slate-500">{data.nodeType}</p>
      <Handle className="h-2 w-2 border-0 bg-slate-400" position={Position.Bottom} type="source" />
    </div>
  );
}

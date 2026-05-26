import { Sparkles } from 'lucide-react';

export default function PromptInputPanel({ prompt, loading, onPromptChange, onGenerate }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-ink">Automation Prompt</h2>
      <textarea
        className="mt-3 h-40 w-full resize-none rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
        placeholder="Describe the automation you want to run..."
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
      />
      <button
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={loading || prompt.trim().length < 8}
        onClick={onGenerate}
        type="button"
      >
        <Sparkles className="h-4 w-4" />
        {loading ? 'Generating' : 'Generate workflow'}
      </button>
    </section>
  );
}

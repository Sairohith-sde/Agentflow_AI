import AppShell from '../../components/AppShell/AppShell';
import GraphPreviewPanel from '../../components/GraphPreviewPanel/GraphPreviewPanel';
import PromptInputPanel from '../../components/PromptInputPanel/PromptInputPanel';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import WorkflowCanvas from '../../components/WorkflowCanvas/WorkflowCanvas';
import WorkflowToolbar from '../../components/WorkflowToolbar/WorkflowToolbar';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createWorkflow, generateWorkflow } from '../../services/workflowApi';

export default function WorkflowBuilderPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [workflow, setWorkflow] = useState(null);
  const [provider, setProvider] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');

    try {
      const result = await generateWorkflow(prompt);
      setWorkflow(result.workflow);
      setProvider(result.provider);
    } catch (apiError) {
      setError(apiError.response?.data?.error?.message || 'Unable to generate workflow.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!workflow) return;
    setSaving(true);
    setError('');

    try {
      const saved = await createWorkflow(workflow);
      router.push(`/workflows/${saved.id}`);
    } catch (apiError) {
      setError(apiError.response?.data?.error?.message || 'Unable to save workflow.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppShell title="Workflow Builder">
        {workflow ? (
          <WorkflowToolbar
            name={workflow.name}
            saving={saving}
            status={workflow.status}
            onNameChange={(name) => setWorkflow({ ...workflow, name })}
            onExecute={() => {}}
            onSave={handleSave}
            onStatusChange={(status) => setWorkflow({ ...workflow, status })}
          />
        ) : null}

        {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4">
            <PromptInputPanel
              loading={loading}
              prompt={prompt}
              onGenerate={handleGenerate}
              onPromptChange={setPrompt}
            />
            <GraphPreviewPanel provider={provider} workflow={workflow} />
          </div>

          {workflow ? (
            <WorkflowCanvas
              edges={workflow.edges}
              nodes={workflow.nodes}
              onConnect={() => {}}
              onEdgesChange={() => {}}
              onNodeClick={() => {}}
              onNodesChange={() => {}}
            />
          ) : (
            <section className="flex min-h-[520px] items-center justify-center rounded border border-slate-200 bg-white text-sm text-slate-500">
              Your generated workflow canvas will appear here.
            </section>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}

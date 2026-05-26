import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/AppShell/AppShell';
import NodeConfigPanel from '../../components/NodeConfigPanel/NodeConfigPanel';
import NodePalette from '../../components/NodePalette/NodePalette';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import WorkflowCanvas from '../../components/WorkflowCanvas/WorkflowCanvas';
import WorkflowToolbar from '../../components/WorkflowToolbar/WorkflowToolbar';
import { createNodeFromCatalogItem } from '../../lib/nodeCatalog';
import { createWorkflow, getWorkflow, updateWorkflow } from '../../services/workflowApi';
import { executeWorkflow } from '../../services/executionApi';

const starterWorkflow = {
  name: 'Untitled workflow',
  description: '',
  status: 'draft',
  nodes: [],
  edges: [],
  trigger: {},
  tags: []
};

export default function WorkflowEditorPage() {
  const router = useRouter();
  const workflowId = router.query.id;
  const isNew = workflowId === 'new';
  const [workflow, setWorkflow] = useState(starterWorkflow);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workflowId) return;

    if (isNew) {
      setWorkflow(starterWorkflow);
      setLoading(false);
      return;
    }

    getWorkflow(workflowId)
      .then(setWorkflow)
      .catch((apiError) => setError(apiError.response?.data?.error?.message || 'Unable to load workflow.'))
      .finally(() => setLoading(false));
  }, [workflowId, isNew]);

  const selectedNode = useMemo(
    () => workflow.nodes.find((node) => node.id === selectedNodeId) || null,
    [workflow.nodes, selectedNodeId]
  );

  const onNodesChange = useCallback((changes) => {
    setWorkflow((current) => ({ ...current, nodes: applyNodeChanges(changes, current.nodes) }));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setWorkflow((current) => ({ ...current, edges: applyEdgeChanges(changes, current.edges) }));
  }, []);

  const onConnect = useCallback((connection) => {
    setWorkflow((current) => ({ ...current, edges: addEdge({ ...connection, animated: true }, current.edges) }));
  }, []);

  function addNode(item) {
    const node = createNodeFromCatalogItem(item, {
      x: 120 + workflow.nodes.length * 30,
      y: 120 + workflow.nodes.length * 30
    });

    setWorkflow((current) => ({ ...current, nodes: [...current.nodes, node] }));
    setSelectedNodeId(node.id);
  }

  function updateSelectedNode(nextNode) {
    setWorkflow((current) => ({
      ...current,
      nodes: current.nodes.map((node) => (node.id === nextNode.id ? nextNode : node))
    }));
  }

  async function saveWorkflow() {
    setSaving(true);
    setError('');

    try {
      const saved = isNew ? await createWorkflow(workflow) : await updateWorkflow(workflow.id, workflow);
      setWorkflow(saved);

      if (isNew) {
        router.replace(`/workflows/${saved.id}`);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.error?.message || 'Unable to save workflow.');
    } finally {
      setSaving(false);
    }
  }

  async function runWorkflow() {
    if (isNew || !workflow.id) {
      await saveWorkflow();
      return;
    }

    setExecuting(true);
    setError('');

    try {
      const execution = await executeWorkflow(workflow.id);
      router.push(`/executions?executionId=${execution.id}`);
    } catch (apiError) {
      setError(apiError.response?.data?.error?.message || 'Unable to execute workflow.');
    } finally {
      setExecuting(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppShell title="Workflow Editor">
        {loading ? (
          <div className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading workflow...</div>
        ) : (
          <>
            <WorkflowToolbar
              name={workflow.name}
              saving={saving}
              status={workflow.status}
              onNameChange={(name) => setWorkflow({ ...workflow, name })}
              onSave={saveWorkflow}
              onExecute={runWorkflow}
              onStatusChange={(status) => setWorkflow({ ...workflow, status })}
              executing={executing}
            />

            {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
              <NodePalette onAddNode={addNode} />
              <WorkflowCanvas
                edges={workflow.edges}
                nodes={workflow.nodes}
                onConnect={onConnect}
                onEdgesChange={onEdgesChange}
                onNodeClick={(_, node) => setSelectedNodeId(node.id)}
                onNodesChange={onNodesChange}
              />
              <NodeConfigPanel node={selectedNode} onChange={updateSelectedNode} />
            </div>
          </>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}

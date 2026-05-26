import mongoose from 'mongoose';

const executionSchema = new mongoose.Schema(
  {
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    workflowSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'PAUSED', 'CANCELLED'],
      default: 'PENDING'
    },
    currentNodeId: String,
    input: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    error: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    retryCount: {
      type: Number,
      default: 0
    },
    startedAt: Date,
    completedAt: Date,
    durationMs: Number
  },
  { timestamps: true }
);

executionSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    workflow: this.workflow.toString(),
    owner: this.owner.toString(),
    workflowSnapshot: this.workflowSnapshot,
    status: this.status,
    currentNodeId: this.currentNodeId,
    input: this.input,
    output: this.output,
    error: this.error,
    retryCount: this.retryCount,
    startedAt: this.startedAt,
    completedAt: this.completedAt,
    durationMs: this.durationMs,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Execution = mongoose.models.Execution || mongoose.model('Execution', executionSchema);

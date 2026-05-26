import mongoose from 'mongoose';

const agentMemorySchema = new mongoose.Schema(
  {
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true
    },
    execution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Execution',
      required: true,
      index: true
    },
    agent: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    confidence: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export const AgentMemory = mongoose.models.AgentMemory || mongoose.model('AgentMemory', agentMemorySchema);

import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'archived'],
      default: 'draft'
    },
    trigger: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    nodes: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    edges: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    version: {
      type: Number,
      default: 1
    },
    lastExecutedAt: Date
  },
  { timestamps: true }
);

workflowSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    owner: this.owner.toString(),
    status: this.status,
    trigger: this.trigger,
    nodes: this.nodes,
    edges: this.edges,
    tags: this.tags,
    version: this.version,
    lastExecutedAt: this.lastExecutedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Workflow = mongoose.models.Workflow || mongoose.model('Workflow', workflowSchema);

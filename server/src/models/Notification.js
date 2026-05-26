import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow'
    },
    execution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Execution'
    },
    type: {
      type: String,
      enum: ['success', 'failure', 'escalation', 'info'],
      default: 'info'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

notificationSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    owner: this.owner.toString(),
    workflow: this.workflow?.toString(),
    execution: this.execution?.toString(),
    type: this.type,
    title: this.title,
    message: this.message,
    read: this.read,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    provider: {
      type: String,
      enum: ['gmail', 'slack', 'google-sheets', 'discord', 'openrouter', 'gemini'],
      required: true
    },
    status: {
      type: String,
      enum: ['connected', 'disconnected', 'expired', 'error'],
      default: 'disconnected'
    },
    scopes: {
      type: [String],
      default: []
    },
    encryptedAccessToken: String,
    encryptedRefreshToken: String,
    expiresAt: Date,
    accountLabel: String,
    lastError: String,
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

integrationSchema.index({ owner: 1, provider: 1 }, { unique: true });

integrationSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    owner: this.owner.toString(),
    provider: this.provider,
    status: this.status,
    scopes: this.scopes,
    expiresAt: this.expiresAt,
    accountLabel: this.accountLabel,
    lastError: this.lastError,
    config: this.config,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Integration = mongoose.models.Integration || mongoose.model('Integration', integrationSchema);

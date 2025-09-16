import mongoose from "mongoose";
import { type } from "os";

const alertSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["geofence", "anomaly", "panic", "sos", "missing"],
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "acknowledged", "resolved"],
      default: "active",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    responseTime: {
      type: Number, // in minutes
    },

    resolvedAt: {
      type: Date,
    },

    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);

alertSchema.index({ location: "2dsphere" });

export const Alert = mongoose.model("Alert", alertSchema);

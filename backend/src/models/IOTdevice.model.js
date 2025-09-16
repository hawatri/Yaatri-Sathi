import mongoose from "mongoose";
import { type } from "os";

const iotDeviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },

    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["smart_band", "tag", "beacon"],
      required: true,
    },

    lastHeartbeat: {
      type: Date,
      default: Date.now,
    },

    batteryLevel: {
      type: Number,
    },

    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },

    healthMetrics: {
      type: Object,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "sos"],
      default: "active",
    },

    firmwareVersion: {
      type: String,
    },
  },
  { timestamps: true }
);

iotDeviceSchema.index({ location: "2dsphere" });

export const IoTDevice = mongoose.model("IoTDevice", iotDeviceSchema);

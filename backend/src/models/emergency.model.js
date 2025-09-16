import mongoose from "mongoose";
import { type } from "os";

const emergencySchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["panic", "sos", "medical", "accident"],
      required: true,
    },

    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },

    nearestPoliceStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    responseTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["active", "dispatched", "resolved"],
      default: "active",
    },
    
    efirGenerated: {
      type: Boolean,
      default: false,
    },

    efirNumber: {
      type: String,
    },

    audioRecording: {
      type: String,
    },

    photos: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

emergencySchema.index({ location: "2dsphere" });

export const Emergency = mongoose.model("Emergency", emergencySchema);

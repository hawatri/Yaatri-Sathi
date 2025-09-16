import mongoose from "mongoose";
import { type } from "os";

const locationSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      }, // [lng, lat]
    },

    altitude: {
      type: Naumber,
    },

    accuracy: {
      type: Number,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    source: {
      type: String,
      enum: ["gps", "iot", "manual"],
      default: "gps",
    },

    batteryLevel: {
      type: Number,
    },
  },
  { timestamps: true }
);

locationSchema.index({ coordinates: "2dsphere" });

export const Location = mongoose.model("Location", locationSchema);

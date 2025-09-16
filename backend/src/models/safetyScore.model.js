import mongoose from "mongoose";

const safetyScoreSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    currentScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },

    factors: {
      locationRisk: { type: Number, default: 0 },
      timeRisk: { type: Number, default: 0 },
      behaviorRisk: { type: Number, default: 0 },
      weatherRisk: { type: Number, default: 0 },
    },
    history: [
      {
        score: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const SafetyScore = mongoose.model("SafetyScore", safetyScoreSchema);

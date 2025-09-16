import mongoose from "mongoose";

const geofenceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["safe", "restricted", "high_risk", "tourist_zone"],
      required: true,
    },

    geometry: {
      type: Object,
      required: true,
    }, // GeoJSON

    riskLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
    },

    alertMessage: {
      type: String,
    },

    restrictions: [{ type: Object }],

    activeHours: {
      type: Object,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Geofence = mongoose.model("Geofence", geofenceSchema);

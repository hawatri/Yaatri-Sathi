import mongoose from "mongoose";
import { type } from "os";

const digitalIDSchema = new mongoose.Schema(
  {
    blockchainHash: {
      type: String,
      required: true,
    },

    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    kycDetails: {
      aadhaarNumber: {
        type: String,
      },

      passportNumber: {
        type: String,
      },

      name: {
        type: String,
        required: true,
      },
      nationality: {
        type: String,
        required: true,
      },
    },

    itinerary: [{ type: Object }], // e.g. { place, startDate, endDate }

    emergencyContacts: [{ type: Object }], // e.g. { name, relation, phone }

    validFrom: {
      type: Date,
    },

    validUntil: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
    },

    qrCode: {
      type: String, // URL or base64 string
    },
    
  },
  { timestamps: true }
);

export const DigitalID = mongoose.model("DigitalID", digitalIDSchema);

import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    // Main itinerary with planned locations
    itinerary: [
      {
        place: {
          type: String,
          required: true,
          trim: true
        },

        coordinates: {
          type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
          },
          coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
          }
        },

        startDate: {
          type: Date,
          required: true
        },

        endDate: {
          type: Date,
          required: true
        },

        description: {
          type: String,
          trim: true
        },

        status: {
          type: String,
          enum: ['planned', 'in-progress', 'completed', 'cancelled'],
          default: 'planned'
        }
      }
    ],

    // Actual visited locations with timestamps
    visitedLocations: [
      {
        coordinates: {
          type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
          },
          coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
          }
        },

        timestamp: {
          type: Date,
          default: Date.now
        },

        placeName: {
          type: String,
          trim: true
        }
      }
    ],

    // Journey status
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'cancelled'],
      default: 'planning'
    },

    // Emergency contacts specific to this journey
    emergencyContacts: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },

        relationship: {
          type: String,
          trim: true
        },

        phone: {
          type: String,
          required: true,
          trim: true
        },

        primary: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Create indexes for efficient querying
journeySchema.index({ touristId: 1, status: 1 });
journeySchema.index({ 'itinerary.coordinates': '2dsphere' });
journeySchema.index({ 'visitedLocations.coordinates': '2dsphere' });
journeySchema.index({ startDate: 1, endDate: 1 });

// Virtual for journey duration in days
journeySchema.virtual('duration').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Method to check if journey is currently active
journeySchema.methods.isActive = function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now && this.status === 'active';
};

// Method to get current location if journey is active
journeySchema.methods.getCurrentLocation = function() {
  if (this.visitedLocations.length > 0) {
    return this.visitedLocations[this.visitedLocations.length - 1];
  }
  return null;
};

export const Journey = mongoose.model('Journey', journeySchema);
import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    departureDate: {
      type: Date,
      required: true
    },

    arrivalDate: {
      type: Date,
      required: true
    },

    travelMedium: {
      type: String,
      trim: true
    },

    travelItinerary: {
      type: String,
      trim: true
    },

    hotelName: {
      type: String,
      trim: true
    },

    hotelContactNo: {
      type: String,
      trim: true
    },

    familyMembers: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        relation: {
          type: String,
          required: true,
          trim: true
        },
        age: {
          type: Number,
          required: true
        }
      }
    ],

    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed', 'cancelled'],
      default: 'planned'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

// Create indexes for efficient querying
journeySchema.index({ touristId: 1, status: 1 });
journeySchema.index({ departureDate: 1, arrivalDate: 1 });

// Virtual for formatted dates (dd-mm-yyyy)
journeySchema.virtual('departureDateFormatted').get(function() {
  if (!this.departureDate) return null;
  const day = String(this.departureDate.getDate()).padStart(2, '0');
  const month = String(this.departureDate.getMonth() + 1).padStart(2, '0');
  const year = this.departureDate.getFullYear();
  return `${day}-${month}-${year}`;
});

journeySchema.virtual('arrivalDateFormatted').get(function() {
  if (!this.arrivalDate) return null;
  const day = String(this.arrivalDate.getDate()).padStart(2, '0');
  const month = String(this.arrivalDate.getMonth() + 1).padStart(2, '0');
  const year = this.arrivalDate.getFullYear();
  return `${day}-${month}-${year}`;
});

// Virtual for journey duration in days
journeySchema.virtual('durationDays').get(function() {
  if (!this.arrivalDate || !this.departureDate) return 0;
  return Math.ceil((this.arrivalDate - this.departureDate) / (1000 * 60 * 60 * 24));
});

export const Journey = mongoose.model('Journey', journeySchema);
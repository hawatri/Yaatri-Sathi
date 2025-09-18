import { Journey } from '../models/journey.model.js';
import { User } from '../models/user.model.js';

// Create a new journey
export const createJourney = async (req, res) => {
  try {
    const { 
      departureDate, 
      arrivalDate, 
      travelMedium, 
      travelItinerary, 
      hotelName, 
      hotelContactNo, 
      familyMembers 
    } = req.body;

    const touristId = req.user.userId;
    
    // Check if tourist exists
    const tourist = await User.findById(touristId);
    if (!tourist || tourist.role !== 'tourist') {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    
    const journey = new Journey({
      touristId,
      departureDate,
      arrivalDate,
      travelMedium,
      travelItinerary,
      hotelName,
      hotelContactNo,
      familyMembers,
      status: 'planned'
    });
    
    await journey.save();
    
    res.status(201).json({
      message: 'Journey created successfully',
      journey
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all journeys for a tourist
export const getJourneys = async (req, res) => {
  try {
    const touristId = req.user.userId;
    const { status } = req.query;
    
    let query = { touristId };
    if (status) query.status = status;
    
    const journeys = await Journey.find(query)
      .populate('touristId', 'email')
      .sort({ departureDate: -1 });
    
    res.json({ journeys, count: journeys.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific journey
export const getJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;
    
    const journey = await Journey.findById(journeyId)
      .populate('touristId', 'email');
    
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    
    res.json({ journey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a journey
export const updateJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const updates = req.body;
    
    // Prevent changing the touristId
    if (updates.touristId) {
      delete updates.touristId;
    }
    
    const journey = await Journey.findByIdAndUpdate(
      journeyId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    
    res.json({
      message: 'Journey updated successfully',
      journey
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a journey
export const deleteJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;
    
    const journey = await Journey.findByIdAndDelete(journeyId);
    
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    
    res.json({ message: 'Journey deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current journey for a tourist
export const getCurrentJourney = async (req, res) => {
  try {
    const touristId = req.user.userId;
    
    const currentDate = new Date();
    
    const journey = await Journey.findOne({
      touristId,
      departureDate: { $lte: currentDate },
      arrivalDate: { $gte: currentDate },
      status: 'in-progress'
    })
    .populate('touristId', 'email');
    
    if (!journey) {
      return res.status(404).json({ error: 'No active journey found' });
    }
    
    res.json({ journey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
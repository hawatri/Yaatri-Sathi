import { Location } from '../models/location.model.js';
import { User } from '../models/user.model.js';

// Update location
export const updateLocation = async (req, res) => {
  try {
    const { touristId, coordinates, altitude, accuracy, source, batteryLevel } = req.body;
    
    const location = new Location({
      touristId,
      coordinates: {
        type: 'Point',
        coordinates
      },
      altitude,
      accuracy,
      source: source || 'gps',
      batteryLevel
    });
    
    await location.save();
    
    res.status(201).json({
      message: 'Location updated successfully',
      location
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current location
export const getCurrentLocation = async (req, res) => {
  try {
    const { touristId } = req.params;
    
    const location = await Location.findOne({ touristId })
      .sort({ timestamp: -1 })
      .populate('touristId', 'email role');
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found for this tourist' });
    }
    
    res.json({ location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get location history
export const getLocationHistory = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;
    
    let query = { touristId };
    
    // Add date filter if provided
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const locations = await Location.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('touristId', 'email role');
    
    res.json({ locations, count: locations.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Opt-in to tracking
export const optInTracking = async (req, res) => {
  try {
    const { touristId } = req.body;
    
    // In a real application, you might update user preferences
    res.json({ message: 'Tracking opted in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Opt-out of tracking
export const optOutTracking = async (req, res) => {
  try {
    const { touristId } = req.body;
    
    // In a real application, you might update user preferences
    res.json({ message: 'Tracking opted out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
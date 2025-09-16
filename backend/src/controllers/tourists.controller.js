import { User } from '../models/user.model.js';
import { DigitalID } from '../models/digitalID.model.js';
import { SafetyScore } from '../models/safetyScore.model.js';

// Get tourist profile
export const getProfile = async (req, res) => {
  try {
    const { touristId } = req.params;
    
    const tourist = await User.findById(touristId)
      .select('-password')
      .populate('digitalId');
    
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    
    res.json({ tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update tourist profile
export const updateProfile = async (req, res) => {
  try {
    const { touristId } = req.params;
    const updates = req.body;
    
    // Remove password from updates if present
    delete updates.password;
    
    const tourist = await User.findByIdAndUpdate(
      touristId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    
    res.json({ message: 'Profile updated successfully', tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add emergency contacts
export const addEmergencyContacts = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { contacts } = req.body;
    
    const digitalId = await DigitalID.findOneAndUpdate(
      { touristId },
      { $push: { emergencyContacts: { $each: contacts } } },
      { new: true, upsert: true }
    );
    
    res.json({ 
      message: 'Emergency contacts added successfully',
      digitalId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get travel history
export const getTravelHistory = async (req, res) => {
  try {
    const { touristId } = req.params;
    
    const digitalId = await DigitalID.findOne({ touristId });
    
    if (!digitalId) {
      return res.status(404).json({ error: 'Digital ID not found for this tourist' });
    }
    
    res.json({ itinerary: digitalId.itinerary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add itinerary
export const addItinerary = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { itinerary } = req.body;
    
    const digitalId = await DigitalID.findOneAndUpdate(
      { touristId },
      { $push: { itinerary: { $each: itinerary } } },
      { new: true, upsert: true }
    );
    
    res.json({ 
      message: 'Itinerary added successfully',
      digitalId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get safety score
export const getSafetyScore = async (req, res) => {
  try {
    const { touristId } = req.params;
    
    const safetyScore = await SafetyScore.findOne({ touristId });
    
    if (!safetyScore) {
      return res.status(404).json({ error: 'Safety score not found for this tourist' });
    }
    
    res.json({ safetyScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
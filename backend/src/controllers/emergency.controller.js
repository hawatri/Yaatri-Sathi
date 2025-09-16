import { Emergency } from '../models/emergency.model.js';
import { Alert } from '../models/alert.model.js';
import { User } from '../models/user.model.js';
import { DigitalID } from '../models/digitalID.model.js';
import { IoTDevice } from '../models/IOTdevice.model.js';

// Handle panic button press
export const handlePanicButton = async (req, res) => {
  try {
    const { touristId, location, type = 'panic' } = req.body;
    
    // Create emergency record
    const emergency = new Emergency({
      touristId,
      type,
      location: {
        type: 'Point',
        coordinates: location
      },
      status: 'active'
    });
    
    await emergency.save();
    
    // Create alert
    const alert = new Alert({
      touristId,
      type: 'panic',
      severity: 'critical',
      location: emergency.location,
      status: 'active',
      description: 'Panic button activated by tourist'
    });
    
    await alert.save();
    
    // Find nearest police stations (simplified)
    const nearestPolice = await User.find({
      role: 'police',
      isActive: true
    }).limit(5);
    
    // Update emergency with nearest police station
    if (nearestPolice.length > 0) {
      emergency.nearestPoliceStation = nearestPolice[0]._id;
      await emergency.save();
    }
    
    // TODO: Send notifications to response teams
    
    res.status(201).json({
      message: 'Emergency reported successfully',
      emergency,
      alert
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle SOS signal from IoT device
export const handleSosSignal = async (req, res) => {
  try {
    const { deviceId, location, healthMetrics } = req.body;
    
    // Find device and associated tourist
    const device = await IoTDevice.findOne({ deviceId }).populate('touristId');
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    // Update device status
    device.status = 'sos';
    device.location = {
      type: 'Point',
      coordinates: location
    };
    if (healthMetrics) device.healthMetrics = healthMetrics;
    await device.save();
    
    // Create emergency record
    const emergency = new Emergency({
      touristId: device.touristId._id,
      type: 'sos',
      location: device.location,
      status: 'active'
    });
    
    await emergency.save();
    
    // Create alert
    const alert = new Alert({
      touristId: device.touristId._id,
      type: 'sos',
      severity: 'critical',
      location: emergency.location,
      status: 'active',
      description: 'SOS signal received from IoT device',
      metadata: { deviceId, healthMetrics }
    });
    
    await alert.save();
    
    res.status(201).json({
      message: 'SOS emergency recorded',
      emergency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find nearest police stations
export const findNearestPolice = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }
    
    const policeStations = await User.find({
      role: 'police',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select('-password');
    
    res.json({ policeStations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate automatic eFIR
export const generateAutoEFIR = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    
    const emergency = await Emergency.findById(emergencyId)
      .populate('touristId')
      .populate('nearestPoliceStation');
    
    if (!emergency) {
      return res.status(404).json({ error: 'Emergency not found' });
    }
    
    // Generate eFIR number (simplified)
    const efirNumber = `EFIR-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Update emergency with eFIR details
    emergency.efirGenerated = true;
    emergency.efirNumber = efirNumber;
    await emergency.save();
    
    // TODO: Generate proper eFIR document
    
    res.json({
      message: 'eFIR generated successfully',
      efirNumber,
      emergency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get emergency contacts
export const getEmergencyContacts = async (req, res) => {
  try {
    const { touristId } = req.params;
    
    const digitalId = await DigitalID.findOne({ touristId });
    
    if (!digitalId) {
      return res.status(404).json({ error: 'Digital ID not found for this tourist' });
    }
    
    res.json({ emergencyContacts: digitalId.emergencyContacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
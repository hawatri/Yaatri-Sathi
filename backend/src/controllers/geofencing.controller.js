import { Geofence } from '../models/geofencing.model.js';
import { Alert } from '../models/alert.model.js';
import turf from '@turf/turf';

// Get zones by type
export const getZonesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const zones = await Geofence.find({ type })
      .populate('createdBy', 'email role');
    
    res.json({ zones, count: zones.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check location against geofences
export const checkLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    
    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }
    
    // Get all geofences
    const geofences = await Geofence.find();
    
    const point = turf.point([longitude, latitude]);
    const alerts = [];
    
    // Check each geofence
    for (const geofence of geofences) {
      const polygon = turf.polygon(geofence.geometry.coordinates);
      
      if (turf.booleanPointInPolygon(point, polygon)) {
        // Create alert if tourist is in a restricted zone
        if (geofence.type === 'restricted' || geofence.type === 'high_risk') {
          const alert = new Alert({
            touristId: req.user.userId, // Assuming user is authenticated
            type: 'geofence',
            severity: geofence.type === 'high_risk' ? 'high' : 'medium',
            location: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            description: `Entered ${geofence.type} zone: ${geofence.name}`,
            status: 'active',
            metadata: { geofenceId: geofence._id }
          });
          
          await alert.save();
          alerts.push(alert);
        }
      }
    }
    
    res.json({
      message: 'Location checked against geofences',
      alertsGenerated: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get alerts for tourist
export const getAlertsForTourist = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { status } = req.query;
    
    let query = { touristId, type: 'geofence' };
    if (status) query.status = status;
    
    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .populate('touristId', 'email');
    
    res.json({ alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create zone (Admin only)
export const createZone = async (req, res) => {
  try {
    const { name, type, geometry, riskLevel, alertMessage, restrictions, activeHours } = req.body;
    
    const geofence = new Geofence({
      name,
      type,
      geometry,
      riskLevel,
      alertMessage,
      restrictions,
      activeHours,
      createdBy: req.user.userId // Assuming user is authenticated
    });
    
    await geofence.save();
    
    res.status(201).json({
      message: 'Geofence created successfully',
      geofence
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update zone (Admin only)
export const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const geofence = await Geofence.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'email role');
    
    if (!geofence) {
      return res.status(404).json({ error: 'Geofence not found' });
    }
    
    res.json({
      message: 'Geofence updated successfully',
      geofence
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
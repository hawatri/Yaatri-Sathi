import { User } from '../models/user.model.js';
import { Alert } from '../models/alert.model.js';
import { Emergency } from '../models/emergency.model.js';
import { IoTDevice } from '../models/IOTdevice.model.js';
import { Geofence } from '../models/geofencing.model.js';

// Get all tourists
export const getAllTourists = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = { role: 'tourist', isActive: true };
    
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }
    
    const tourists = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      tourists,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all alerts
export const getAllAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    
    const alerts = await Alert.find(query)
      .populate('touristId', 'email')
      .populate('assignedTo', 'email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Alert.countDocuments(query);
    
    res.json({
      alerts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Broadcast alert
export const broadcastAlert = async (req, res) => {
  try {
    const { message, severity, zone, touristIds } = req.body;
    
    let query = { role: 'tourist', isActive: true };
    
    if (touristIds && touristIds.length > 0) {
      query._id = { $in: touristIds };
    }
    
    const tourists = await User.find(query).select('_id');
    
    // Create alerts for all targeted tourists
    const alertPromises = tourists.map(tourist => {
      const alert = new Alert({
        touristId: tourist._id,
        type: 'broadcast',
        severity: severity || 'medium',
        description: message,
        status: 'active',
        metadata: { broadcast: true, zone }
      });
      
      return alert.save();
    });
    
    await Promise.all(alertPromises);
    
    // TODO: Send push notifications to affected tourists
    
    res.json({
      message: `Alert broadcasted to ${tourists.length} tourists`,
      count: tourists.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get system statistics
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalTourists = await User.countDocuments({ role: 'tourist', isActive: true });
    const totalPolice = await User.countDocuments({ role: 'police', isActive: true });
    const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });
    
    const totalAlerts = await Alert.countDocuments();
    const activeAlerts = await Alert.countDocuments({ status: 'active' });
    
    const totalEmergencies = await Emergency.countDocuments();
    const activeEmergencies = await Emergency.countDocuments({ status: 'active' });
    
    const totalDevices = await IoTDevice.countDocuments();
    const activeDevices = await IoTDevice.countDocuments({ status: 'active' });
    
    const totalZones = await Geofence.countDocuments();
    
    res.json({
      users: {
        total: totalUsers,
        tourists: totalTourists,
        police: totalPolice,
        admins: totalAdmins
      },
      alerts: {
        total: totalAlerts,
        active: activeAlerts
      },
      emergencies: {
        total: totalEmergencies,
        active: activeEmergencies
      },
      devices: {
        total: totalDevices,
        active: activeDevices
      },
      zones: {
        total: totalZones
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Manage zones
export const manageZones = async (req, res) => {
  try {
    const { action, zoneId, data } = req.body;
    
    let result;
    
    switch (action) {
      case 'create':
        const newZone = new Geofence({
          ...data,
          createdBy: req.user.userId
        });
        result = await newZone.save();
        break;
        
      case 'update':
        result = await Geofence.findByIdAndUpdate(
          zoneId,
          data,
          { new: true, runValidators: true }
        );
        break;
        
      case 'delete':
        result = await Geofence.findByIdAndDelete(zoneId);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json({
      message: `Zone ${action}d successfully`,
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
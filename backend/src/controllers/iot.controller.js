import { IoTDevice } from '../models/IOTdevice.model.js';
import { User } from '../models/user.model.js';
import { Alert } from '../models/alert.model.js';

// Register IoT device
export const registerDevice = async (req, res) => {
  try {
    const { deviceId, touristId, type, firmwareVersion } = req.body;
    
    // Check if device already exists
    const existingDevice = await IoTDevice.findOne({ deviceId });
    if (existingDevice) {
      return res.status(400).json({ error: 'Device already registered' });
    }
    
    // Check if tourist exists
    const tourist = await User.findById(touristId);
    if (!tourist || tourist.role !== 'tourist') {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    
    const device = new IoTDevice({
      deviceId,
      touristId,
      type,
      firmwareVersion,
      status: 'active',
      lastHeartbeat: new Date()
    });
    
    await device.save();
    
    res.status(201).json({
      message: 'Device registered successfully',
      device
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle device heartbeat
export const handleHeartbeat = async (req, res) => {
  try {
    const { deviceId, batteryLevel, location, healthMetrics } = req.body;
    
    const device = await IoTDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    // Update device status
    device.lastHeartbeat = new Date();
    if (batteryLevel) device.batteryLevel = batteryLevel;
    if (location) device.location = { type: 'Point', coordinates: location };
    if (healthMetrics) device.healthMetrics = healthMetrics;
    
    await device.save();
    
    res.json({
      message: 'Heartbeat received',
      device
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle SOS from device
export const handleDeviceSos = async (req, res) => {
  try {
    const { deviceId, location, healthMetrics } = req.body;
    
    const device = await IoTDevice.findOne({ deviceId }).populate('touristId');
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    // Update device status
    device.status = 'sos';
    device.lastHeartbeat = new Date();
    if (location) device.location = { type: 'Point', coordinates: location };
    if (healthMetrics) device.healthMetrics = healthMetrics;
    
    await device.save();
    
    // Create alert
    const alert = new Alert({
      touristId: device.touristId._id,
      type: 'sos',
      severity: 'critical',
      location: device.location,
      status: 'active',
      description: 'SOS signal received from IoT device',
      metadata: { deviceId, healthMetrics }
    });
    
    await alert.save();
    
    res.json({
      message: 'SOS signal processed',
      alert
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get device status
export const getDeviceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const device = await IoTDevice.findById(id)
      .populate('touristId', 'email');
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json({ device });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle health data from device
export const handleHealthData = async (req, res) => {
  try {
    const { deviceId, healthMetrics } = req.body;
    
    const device = await IoTDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    // Update device health metrics
    device.healthMetrics = healthMetrics;
    device.lastHeartbeat = new Date();
    
    await device.save();
    
    // Check for abnormal health metrics and create alert if needed
    if (healthMetrics.heartRate > 120 || healthMetrics.heartRate < 50) {
      const alert = new Alert({
        touristId: device.touristId,
        type: 'medical',
        severity: 'medium',
        location: device.location,
        status: 'active',
        description: 'Abnormal heart rate detected',
        metadata: { deviceId, healthMetrics }
      });
      
      await alert.save();
    }
    
    res.json({
      message: 'Health data received',
      device
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
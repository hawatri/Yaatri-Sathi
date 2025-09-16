import { Alert } from '../models/alert.model.js';
import { Location } from '../models/location.model.js';
import { User } from '../models/user.model.js';

// Analyze patterns for anomalies
export const analyzePattern = async (req, res) => {
  try {
    const { touristId, days = 7 } = req.body;
    
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - parseInt(days));
    
    // Get location history
    const locations = await Location.find({
      touristId,
      timestamp: { $gte: dateThreshold }
    }).sort({ timestamp: 1 });
    
    // Simple anomaly detection (in reality, this would be more complex)
    const anomalies = [];
    
    if (locations.length > 0) {
      // Check for unusual movement patterns
      const avgDistance = calculateAverageDistance(locations);
      
      // Check for visits to high-risk areas (simplified)
      const lateNightLocations = locations.filter(loc => {
        const hour = new Date(loc.timestamp).getHours();
        return hour >= 23 || hour <= 5;
      });
      
      if (lateNightLocations.length > 3) {
        anomalies.push({
          type: 'unusual_time_activity',
          description: 'Unusual activity during late night hours',
          severity: 'medium',
          locations: lateNightLocations
        });
      }
    }
    
    // Create alerts for anomalies
    for (const anomaly of anomalies) {
      const alert = new Alert({
        touristId,
        type: 'anomaly',
        severity: anomaly.severity,
        location: anomaly.locations[0].coordinates,
        description: anomaly.description,
        status: 'active',
        metadata: { anomalyType: anomaly.type }
      });
      
      await alert.save();
    }
    
    res.json({
      message: 'Pattern analysis completed',
      anomaliesDetected: anomalies.length,
      anomalies
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to calculate average distance
const calculateAverageDistance = (locations) => {
  let totalDistance = 0;
  let count = 0;
  
  for (let i = 1; i < locations.length; i++) {
    const prev = locations[i-1];
    const curr = locations[i];
    
    if (prev.coordinates && curr.coordinates) {
      const distance = calculateDistance(
        prev.coordinates.coordinates[1],
        prev.coordinates.coordinates[0],
        curr.coordinates.coordinates[1],
        curr.coordinates.coordinates[0]
      );
      
      totalDistance += distance;
      count++;
    }
  }
  
  return count > 0 ? totalDistance / count : 0;
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Get alerts for tourist
export const getAlertsForTourist = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { type } = req.query;
    
    let query = { touristId };
    if (type) query.type = type;
    
    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .populate('touristId', 'email');
    
    res.json({ alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Report missing person
export const reportMissingPerson = async (req, res) => {
  try {
    const { touristId, lastKnownLocation, lastSeen, description } = req.body;
    
    // Create missing person alert
    const alert = new Alert({
      touristId,
      type: 'missing',
      severity: 'critical',
      location: lastKnownLocation || null,
      description: description || 'Person reported missing',
      status: 'active',
      metadata: { lastSeen, reportedAt: new Date() }
    });
    
    await alert.save();
    
    // TODO: Notify authorities and emergency contacts
    
    res.status(201).json({
      message: 'Missing person reported successfully',
      alert
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get risk assessment
export const getRiskAssessment = async (req, res) => {
  try {
    const { touristId } = req.query;
    
    // Get recent alerts
    const recentAlerts = await Alert.find({
      touristId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });
    
    // Calculate risk score based on alerts
    let riskScore = 100; // Start with perfect score
    
    for (const alert of recentAlerts) {
      switch (alert.severity) {
        case 'critical':
          riskScore -= 20;
          break;
        case 'high':
          riskScore -= 10;
          break;
        case 'medium':
          riskScore -= 5;
          break;
        case 'low':
          riskScore -= 2;
          break;
      }
    }
    
    // Ensure score is within bounds
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    res.json({
      riskScore,
      alertsCount: recentAlerts.length,
      recentAlerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
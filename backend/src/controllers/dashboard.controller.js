import { User } from '../models/user.model.js';
import { Alert } from '../models/alert.model.js';
import { Emergency } from '../models/emergency.model.js';
import { Location } from '../models/location.model.js';

// Get tourist clusters
export const getTouristClusters = async (req, res) => {
  try {
    // Get all tourist locations and cluster them
    const locations = await Location.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'touristId',
          foreignField: '_id',
          as: 'tourist'
        }
      },
      {
        $unwind: '$tourist'
      },
      {
        $match: {
          'tourist.role': 'tourist',
          'tourist.isActive': true
        }
      },
      {
        $group: {
          _id: {
            latitude: { $arrayElemAt: ['$coordinates.coordinates', 1] },
            longitude: { $arrayElemAt: ['$coordinates.coordinates', 0] }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ clusters: locations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get heat maps
export const getHeatMaps = async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    let matchCriteria = {};
    if (type !== 'all') {
      matchCriteria = { type };
    }
    
    // Get emergency and alert data for heatmap
    const emergencies = await Emergency.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: {
            latitude: { $arrayElemAt: ['$location.coordinates', 1] },
            longitude: { $arrayElemAt: ['$location.coordinates', 0] }
          },
          count: { $sum: 1 },
          type: { $first: '$type' }
        }
      }
    ]);

    res.json({ heatmap: emergencies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalTourists = await User.countDocuments({ role: 'tourist', isActive: true });
    const totalEmergencies = await Emergency.countDocuments();
    const activeEmergencies = await Emergency.countDocuments({ status: 'active' });
    const resolvedEmergencies = await Emergency.countDocuments({ status: 'resolved' });
    
    // Get emergencies by type
    const emergenciesByType = await Emergency.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get alerts by severity
    const alertsBySeverity = await Alert.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalTourists,
      totalEmergencies,
      activeEmergencies,
      resolvedEmergencies,
      emergenciesByType,
      alertsBySeverity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get alerts summary
export const getAlertsSummary = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - parseInt(days));
    
    const alerts = await Alert.find({
      createdAt: { $gte: dateThreshold }
    }).populate('touristId', 'email');
    
    const alertSummary = await Alert.aggregate([
      {
        $match: {
          createdAt: { $gte: dateThreshold }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      total: alerts.length,
      alerts,
      summary: alertSummary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get statistics
export const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalTourists = await User.countDocuments({ role: 'tourist', isActive: true });
    const totalPolice = await User.countDocuments({ role: 'police', isActive: true });
    const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });
    
    const responseTimeAgg = await Emergency.aggregate([
      {
        $match: { status: 'resolved' }
      },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$resolvedAt', '$createdAt'] },
              60000 // Convert to minutes
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' }
        }
      }
    ]);

    res.json({
      users: {
        total: totalUsers,
        tourists: totalTourists,
        police: totalPolice,
        admins: totalAdmins
      },
      responseTime: responseTimeAgg[0] || {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
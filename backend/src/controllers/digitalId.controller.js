import { DigitalID } from '../models/digitalID.model.js';
import crypto from 'crypto';

// Generate Digital ID
export const generateDigitalID = async (req, res) => {
  try {
    const { touristId, kycDetails, itinerary, emergencyContacts, validFrom, validUntil } = req.body;
    
    // Check if digital ID already exists
    const existingDigitalID = await DigitalID.findOne({ touristId });
    if (existingDigitalID) {
      return res.status(400).json({ error: 'Digital ID already exists for this tourist' });
    }
    
    // Create blockchain hash (simplified)
    const blockchainHash = crypto
      .createHash('sha256')
      .update(`${touristId}-${Date.now()}`)
      .digest('hex');
    
    // Generate QR code (simplified - in production, use a QR code library)
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${blockchainHash}`;
    
    const digitalID = new DigitalID({
      blockchainHash,
      touristId,
      kycDetails,
      itinerary,
      emergencyContacts,
      validFrom: validFrom || new Date(),
      validUntil,
      qrCode
    });
    
    await digitalID.save();
    
    res.status(201).json({
      message: 'Digital ID generated successfully',
      digitalID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Digital ID
export const verifyDigitalID = async (req, res) => {
  try {
    const { id } = req.params;
    
    const digitalID = await DigitalID.findById(id)
      .populate('touristId', 'email role');
    
    if (!digitalID) {
      return res.status(404).json({ error: 'Digital ID not found' });
    }
    
    // Check if digital ID is still valid
    const currentDate = new Date();
    const isValid = currentDate >= digitalID.validFrom && 
                   currentDate <= digitalID.validUntil &&
                   digitalID.status === 'active';
    
    res.json({
      digitalID,
      isValid,
      verificationDate: currentDate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Digital ID
export const updateDigitalID = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const digitalID = await DigitalID.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('touristId', 'email role');
    
    if (!digitalID) {
      return res.status(404).json({ error: 'Digital ID not found' });
    }
    
    res.json({
      message: 'Digital ID updated successfully',
      digitalID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Digital ID details
export const getDigitalIDDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const digitalID = await DigitalID.findById(id)
      .populate('touristId', 'email role');
    
    if (!digitalID) {
      return res.status(404).json({ error: 'Digital ID not found' });
    }
    
    res.json({ digitalID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Revoke Digital ID
export const revokeDigitalID = async (req, res) => {
  try {
    const { id } = req.params;
    
    const digitalID = await DigitalID.findByIdAndUpdate(
      id,
      { status: 'revoked' },
      { new: true }
    ).populate('touristId', 'email role');
    
    if (!digitalID) {
      return res.status(404).json({ error: 'Digital ID not found' });
    }
    
    res.json({
      message: 'Digital ID revoked successfully',
      digitalID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
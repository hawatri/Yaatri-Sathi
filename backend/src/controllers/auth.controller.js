import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utilities/generateToken.util.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role: role || 'tourist'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    
    // Set token as HTTP-only cookie
    setTokenCookie(res, token);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email});
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    
    // Set token as HTTP-only cookie
    setTokenCookie(res, token);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Generate new token
    const newToken = generateToken(decoded.userId, decoded.email, decoded.role);
    
    // Set new token as HTTP-only cookie
    setTokenCookie(res, newToken);

    res.json({
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    clearTokenCookie(res);
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    // This would typically integrate with an SMS service
    const { email, otp } = req.body;
    
    // Placeholder implementation
    if (otp === '123456') { // In production, validate against stored OTP
      res.json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate reset token (simplified)
    const resetToken = Math.random().toString(36).substring(2, 15);
    
    // In a real application, you would:
    // 1. Save the reset token with expiration to the user document
    // 2. Send an email with a reset link containing the token
    
    res.json({ 
      message: 'Password reset instructions sent to your email',
      resetToken // In production, don't send this back
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
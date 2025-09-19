import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utilities/generateToken.util.js';

// Register new user
export const register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Name, email, and password are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Please enter a valid email address' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12; // Increased from 10 for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();
    console.log('User saved to database:', { id: user._id, email: user.email });

    // Generate token
    const token = generateToken(user._id, user.email);
    console.log('Token generated');
    
    // Set token as HTTP-only cookie
    setTokenCookie(res, token);
    console.log('Token cookie set');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    // Handle duplicate key error (in case unique index fails)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user (case insensitive email)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
   // In your login function, after generating the token:
const token = generateToken(user._id, user.email);

// Set token as HTTP-only cookie
setTokenCookie(res, token);

res.json({
  success: true,
  message: 'Login successful',
  token: token, // Add this line
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  }
});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
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
    const newToken = generateToken(decoded.userId, decoded.email);
    
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
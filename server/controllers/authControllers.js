const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const JWT_SECRET = config.API_KEY_JWT;

// Register a new user
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user instance
    user = new User({ email, password });

    // Save user to the database (will hash password automatically)
    await user.save();

    // Generate a token after registration
    const token = user.generateAuthToken();
    await user.save(); // Save token in the database

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user and generate token
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a new token for the session
    const token = user.generateAuthToken();
    await user.save(); // Save token in the database

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Middleware to protect routes with JWT
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach decoded token payload (user info) to req.user
    req.user.token = token; // Attach the actual token to req.user as well
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user details' });
  }
};
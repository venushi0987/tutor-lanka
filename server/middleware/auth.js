const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DISABLE_JWT = process.env.DISABLE_JWT === 'true';

const protect = async (req, res, next) => {
  // If JWT disabled, allow requests through and optionally accept a developer header
  if (DISABLE_JWT) {
    const devId = req.headers['x-dev-user-id'];
    if (devId) {
      try {
        req.user = await User.findById(devId).select('-password');
        if (!req.user) return res.status(401).json({ success: false, message: 'Dev user not found' });
      } catch (_) {
        return res.status(401).json({ success: false, message: 'Dev user lookup failed' });
      }
    }
    return next();
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Role '${req.user.role}' is not authorized` });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  if (DISABLE_JWT) {
    const devId = req.headers['x-dev-user-id'];
    if (devId) {
      try {
        req.user = await User.findById(devId).select('-password');
      } catch (_) {}
    }
    return next();
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (_) {}
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };

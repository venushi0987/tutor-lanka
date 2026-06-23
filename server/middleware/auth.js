const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
<<<<<<< Updated upstream
=======
  // Extract Bearer token from Authorization header
>>>>>>> Stashed changes
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
<<<<<<< Updated upstream
=======

  // Dev-mode shortcut: x-dev-user-id header bypasses token entirely
  const devId = req.headers['x-dev-user-id'];
  if (devId) {
    try {
      req.user = await User.findById(devId).select('-password');
      if (!req.user) return res.status(401).json({ success: false, message: 'Dev user not found' });
    } catch (_) {
      return res.status(401).json({ success: false, message: 'Dev user lookup failed' });
    }
    return next();
  }

  if (DISABLE_JWT) {
    // Dev mode: no strict auth required, but still decode token to identify user
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (_) {
        // Token invalid — no user set, but allow through in dev mode
      }
    }
    return next();
  }

  // Production: strict JWT verification
>>>>>>> Stashed changes
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
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Role '${req.user.role}' is not authorized` });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
<<<<<<< Updated upstream
=======
  if (DISABLE_JWT) {
    const devId = req.headers['x-dev-user-id'];
    if (devId) {
      try {
        req.user = await User.findById(devId).select('-password');
      } catch (_) {}
    } else {
      // Try decoding Bearer token in dev mode too
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
    }
    return next();
  }

>>>>>>> Stashed changes
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

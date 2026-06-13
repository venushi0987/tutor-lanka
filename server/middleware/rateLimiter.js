const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests, please try again after 15 minutes' },
});

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, slow down' },
});

module.exports = { authLimiter, apiLimiter };

const jwt = require('jsonwebtoken');

const DISABLE_JWT = process.env.DISABLE_JWT === 'true';

const generateAccessToken = (id, role) => {
  if (DISABLE_JWT) return null;
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });
};

const generateRefreshToken = (id) => {
  if (DISABLE_JWT) return null;
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken, DISABLE_JWT };

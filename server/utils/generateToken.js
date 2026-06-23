const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

<<<<<<< Updated upstream
module.exports = generateToken;
=======
const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'dev_secret_key', { expiresIn: process.env.JWT_EXPIRE || '15m' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'dev_refresh_key', { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken, DISABLE_JWT };
>>>>>>> Stashed changes

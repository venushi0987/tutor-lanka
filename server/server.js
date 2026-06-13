require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const { apiLimiter } = require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/auth');
const tutorRoutes = require('./routes/tutors');
const classRoutes = require('./routes/classes');
const reviewRoutes = require('./routes/reviews');
const studentRoutes = require('./routes/students');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Connect DB
connectDB();

// Init Socket.io
initSocket(server);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'EduConnect API is running 🚀' }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`EduConnect Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

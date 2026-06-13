const { Server } = require('socket.io');
const Notification = require('../models/Notification');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    socket.on('disconnect', () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
        }
      });
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

const sendNotification = async (userId, type, message, relatedId = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      relatedId,
    });

    const ioInstance = getIO();
    ioInstance.to(userId.toString()).emit('notification', notification);

    return notification;
  } catch (error) {
    console.error('Notification error:', error);
  }
};

module.exports = { initSocket, getIO, sendNotification };

import { io } from 'socket.io-client';
import store from '../store';
import { addNotification } from '../store/slices/notificationSlice';

let socket;

export const initSocket = () => {
  if (socket) return socket;
  const base = import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000';
  socket = io(base, { withCredentials: true });
  socket.on('connect', () => console.log('Socket connected', socket.id));
  socket.on('notification', (data) => {
    store.dispatch(addNotification(data));
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  socket = null;
};

export default { initSocket, disconnectSocket };
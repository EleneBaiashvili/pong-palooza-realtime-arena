
import { io } from 'socket.io-client';

// For development, connect to localhost. In production, this would be your server URL
const SERVER_URL = 'http://localhost:3001';

export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
});

// Add connection event logging
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

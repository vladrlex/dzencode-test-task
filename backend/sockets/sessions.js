const jwt = require('jsonwebtoken');

function registerSessionSocket(io) {
  let activeSessions = 0;

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    activeSessions++;
    io.emit('sessions_count', activeSessions);

    socket.on('disconnect', () => {
      activeSessions = Math.max(0, activeSessions - 1);
      io.emit('sessions_count', activeSessions);
    });
  });
}

module.exports = { registerSessionSocket };

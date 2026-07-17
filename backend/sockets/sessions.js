function registerSessionSocket(io) {
  let activeSessions = 0;

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
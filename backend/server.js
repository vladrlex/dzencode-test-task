const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { seedIfEmpty } = require('./seed');
const { registerSessionSocket } = require('./sockets/sessions');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

registerSessionSocket(io);

const PORT = process.env.PORT || 5000;

seedIfEmpty()
  .catch((error) => console.error('Seeding failed:', error))
  .finally(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
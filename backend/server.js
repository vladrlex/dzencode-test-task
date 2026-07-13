const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const products = [
  {
    id: 1,
    serialNumber: 1234,
    isNew: 1,
    photo: 'pathToFile.jpg',
    title: 'Product 1',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: { start: '2017-06-29 12:09:33', end: '2017-06-29 12:09:33' },
    price: [
      {value: 100, symbol: 'USD', isDefault: 0},
      {value: 2600, symbol: 'UAH', isDefault: 1}
    ],
    order: 1,
    date: '2017-06-29 12:09:33'
  },
  {
    id: 2,
    serialNumber: 1234,
    isNew: 1,
    photo: 'pathToFile.jpg',
    title: 'Product 2',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: { start: '2017-06-29 12:09:33', end: '2017-06-29 12:09:33' },
    price: [
      {value: 100, symbol: 'USD', isDefault: 0},
      {value: 2600, symbol: 'UAH', isDefault: 1}
    ],
    order: 2,
    date: '2017-06-29 12:09:33'
  }
];

const orders = [
  { id: 1, title: 'Order 1', date: '2017-06-29 12:09:33', description: 'desc' },
  { id: 2, title: 'Order 2', date: '2017-06-29 12:09:33', description: 'desc' },
  { id: 3, title: 'Order 3', date: '2017-06-29 12:09:33', description: 'desc' }
];

app.get('/api/orders', (req, res) => res.json(orders));
app.get('/api/products', (req, res) => res.json(products));

let activeSessions = 0;

io.on('connection', (socket) => {
  activeSessions++;
  io.emit('sessions_count', activeSessions);

  socket.on('disconnect', () => {
    activeSessions = Math.max(0, activeSessions - 1);
    io.emit('sessions_count', activeSessions);
  });
});

const PORT = 5000;
server.listen(PORT);
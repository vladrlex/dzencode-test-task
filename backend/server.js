const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading data.json:', error);
    return { products: [], orders: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to data.json:', error);
  }
}

app.get('/api/orders', (req, res) => {
  const data = readData();
  res.json(data.orders);
});

app.get('/api/products', (req, res) => {
  const data = readData();
  res.json(data.products);
});

app.delete('/api/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const data = readData();

  data.orders = data.orders.filter((o) => o.id !== orderId);
  data.products = data.products.filter((p) => p.order !== orderId);

  writeData(data);

  res.status(200).json({ success: true, id: orderId });
});

app.post('/api/orders', (req, res) => {
  const { title, description } = req.body;
  const data = readData();

  const newId = data.orders.length > 0 ? Math.max(...data.orders.map(o => o.id)) + 1 : 1;

  const newOrder = {
    id: newId,
    title: title || `Order ${newId}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 19), // Формат 'YYYY-MM-DD HH:mm:ss'
    description: description || 'No description'
  };

  data.orders.push(newOrder);
  writeData(data);

  res.status(201).json(newOrder);
});

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
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
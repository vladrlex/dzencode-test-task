const fs = require('fs');
const path = require('path');
const pool = require('./db');

const DATA_FILE = path.join(__dirname, 'data.json');

async function seedIfEmpty() {
  const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM orders');

  if (count > 0) {
    console.log('Database already has data, skipping seed.');
    return;
  }

  if (!fs.existsSync(DATA_FILE)) {
    console.log('No data.json found, skipping seed.');
    return;
  }

  console.log('Seeding database from data.json...');
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const data = JSON.parse(raw);

  for (const order of data.orders) {
    await pool.query(
      'INSERT INTO orders (id, title, date, description) VALUES (?, ?, ?, ?)',
      [order.id, order.title, order.date, order.description || null]
    );
  }

  for (const product of data.products) {
    await pool.query(
      `INSERT INTO products
        (id, serialNumber, isNew, photo, title, type, specification, guarantee_start, guarantee_end, order_id, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.serialNumber,
        product.isNew,
        product.photo || null,
        product.title,
        product.type,
        product.specification || null,
        product.guarantee?.start || null,
        product.guarantee?.end || null,
        product.order,
        product.date,
      ]
    );

    for (const price of product.price) {
      await pool.query(
        'INSERT INTO prices (product_id, value, symbol, isDefault) VALUES (?, ?, ?, ?)',
        [product.id, price.value, price.symbol, price.isDefault ?? 0]
      );
    }
  }

  console.log('Seeding complete.');
}

module.exports = { seedIfEmpty };
const express = require('express');
const pool = require('../db');
const { toMySQLDateTime } = require('../utils/dateUtils');

const router = express.Router();

function mapProductRow(row, pricesByProduct) {
  return {
    id: row.id,
    serialNumber: row.serialNumber,
    isNew: row.isNew,
    photo: row.photo,
    title: row.title,
    type: row.type,
    specification: row.specification,
    guarantee: {
      start: row.guarantee_start,
      end: row.guarantee_end,
    },
    price: pricesByProduct[row.id] || [],
    order: row.order_id,
    orderTitle: row.orderTitle,
    date: row.date,
  };
}

async function attachPrices(products) {
  if (!products.length) return [];

  const productIds = products.map((p) => p.id);
  const placeholders = productIds.map(() => '?').join(',');
  const [prices] = await pool.query(
    `SELECT * FROM prices WHERE product_id IN (${placeholders})`,
    productIds
  );

  const pricesByProduct = {};
  for (const p of prices) {
    if (!pricesByProduct[p.product_id]) pricesByProduct[p.product_id] = [];
    pricesByProduct[p.product_id].push({
      value: Number(p.value),
      symbol: p.symbol,
      isDefault: p.isDefault,
    });
  }

  return products.map((row) => mapProductRow(row, pricesByProduct));
}

async function getProductWithPrices(productId) {
  const [rows] = await pool.query(
    `SELECT p.*, o.title AS orderTitle
     FROM products p
     LEFT JOIN orders o ON o.id = p.order_id
     WHERE p.id = ?`,
    [productId]
  );
  if (!rows.length) return null;
  const [mapped] = await attachPrices(rows);
  return mapped;
}

router.get('/', async (req, res) => {
  try {
    const { search, order, type } = req.query;

    if (order) {
      const [products] = await pool.query(
        `SELECT p.*, o.title AS orderTitle
         FROM products p
         LEFT JOIN orders o ON o.id = p.order_id
         WHERE p.order_id = ?
         ORDER BY p.id DESC`,
        [parseInt(order, 10)]
      );
      const items = await attachPrices(products);
      return res.json({ items, total: items.length, page: 1, limit: items.length || 1, totalPages: 1 });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 30, 1);
    const offset = (page - 1) * limit;

    const conditions = [];
    const whereParams = [];

    if (search) {
      conditions.push('p.title LIKE ?');
      whereParams.push(`%${search}%`);
    }

    if (type && type !== 'All') {
      conditions.push('p.type = ?');
      whereParams.push(type);
    }

    const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM products p${whereClause}`,
      whereParams
    );
    const total = countRows[0].total;

    const [products] = await pool.query(
      `SELECT p.*, o.title AS orderTitle
       FROM products p
       LEFT JOIN orders o ON o.id = p.order_id
       ${whereClause}
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      [...whereParams, limit, offset]
    );

    const items = await attachPrices(products);

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/meta/types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT type FROM products ORDER BY type');
    res.json(rows.map((r) => r.type));
  } catch (error) {
    console.error('GET /api/products/meta/types error:', error);
    res.status(500).json({ error: 'Failed to fetch product types' });
  }
});

router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const {
      serialNumber,
      isNew,
      photo,
      title,
      type,
      specification,
      guarantee = {},
      price = [],
      order,
      date,
    } = req.body;

    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO products
        (serialNumber, isNew, photo, title, type, specification, guarantee_start, guarantee_end, order_id, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serialNumber,
        isNew ?? 1,
        photo || null,
        title,
        type,
        specification || null,
        toMySQLDateTime(guarantee.start),
        toMySQLDateTime(guarantee.end),
        order,
        toMySQLDateTime(date) || toMySQLDateTime(new Date()),
      ]
    );

    const productId = result.insertId;

    for (const p of price) {
      await conn.query(
        'INSERT INTO prices (product_id, value, symbol, isDefault) VALUES (?, ?, ?, ?)',
        [productId, p.value, p.symbol, p.isDefault ?? 0]
      );
    }

    await conn.commit();

    const created = await getProductWithPrices(productId);
    res.status(201).json(created);
  } catch (error) {
    await conn.rollback();
    console.error('POST /api/products error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  } finally {
    conn.release();
  }
});

router.put('/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const productId = parseInt(req.params.id, 10);
    const {
      serialNumber,
      isNew,
      photo,
      title,
      type,
      specification,
      guarantee = {},
      price,
      order,
      date,
    } = req.body;

    await conn.beginTransaction();

    await conn.query(
      `UPDATE products SET
        serialNumber = COALESCE(?, serialNumber),
        isNew = COALESCE(?, isNew),
        photo = COALESCE(?, photo),
        title = COALESCE(?, title),
        type = COALESCE(?, type),
        specification = COALESCE(?, specification),
        guarantee_start = COALESCE(?, guarantee_start),
        guarantee_end = COALESCE(?, guarantee_end),
        order_id = COALESCE(?, order_id),
        date = COALESCE(?, date)
       WHERE id = ?`,
      [
        serialNumber ?? null,
        isNew ?? null,
        photo ?? null,
        title ?? null,
        type ?? null,
        specification ?? null,
        toMySQLDateTime(guarantee.start),
        toMySQLDateTime(guarantee.end),
        order ?? null,
        toMySQLDateTime(date),
        productId,
      ]
    );

    if (Array.isArray(price)) {
      await conn.query('DELETE FROM prices WHERE product_id = ?', [productId]);
      for (const p of price) {
        await conn.query(
          'INSERT INTO prices (product_id, value, symbol, isDefault) VALUES (?, ?, ?, ?)',
          [productId, p.value, p.symbol, p.isDefault ?? 0]
        );
      }
    }

    await conn.commit();

    const updated = await getProductWithPrices(productId);
    if (!updated) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(updated);
  } catch (error) {
    await conn.rollback();
    console.error('PUT /api/products/:id error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  } finally {
    conn.release();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);
    res.status(200).json({ id: productId });
  } catch (error) {
    console.error('DELETE /api/products/:id error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
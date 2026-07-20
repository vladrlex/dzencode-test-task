const express = require('express');
const pool = require('../db');
const { toMySQLDateTime } = require('../utils/dateUtils');
const { validateOrderCreate } = require('../utils/validateOrder');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 30, 1);
    const offset = (page - 1) * limit;

    let whereClause = '';
    const whereParams = [];

    if (search) {
      whereClause = ' WHERE o.title LIKE ?';
      whereParams.push(`%${search}%`);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM orders o${whereClause}`,
      whereParams
    );
    const total = countRows[0].total;

    const [orders] = await pool.query(
      `SELECT
        o.*,
        COUNT(DISTINCT pr.id) AS productsCount,
        COALESCE(SUM(CASE WHEN pc.symbol = 'USD' THEN pc.value END), 0) AS totalUsd,
        COALESCE(SUM(CASE WHEN pc.symbol = 'UAH' THEN pc.value END), 0) AS totalUah
      FROM orders o
      LEFT JOIN products pr ON pr.order_id = o.id
      LEFT JOIN prices pc ON pc.product_id = pr.id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.id DESC
      LIMIT ? OFFSET ?`,
      [...whereParams, limit, offset]
    );

    res.json({
      items: orders.map((row) => ({
        ...row,
        productsCount: Number(row.productsCount),
        totalUsd: Number(row.totalUsd),
        totalUah: Number(row.totalUah),
      })),
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/meta/stats', async (req, res) => {
  try {
    const [[orderStats]] = await pool.query('SELECT COUNT(*) as totalOrders FROM orders');
    const [[productStats]] = await pool.query(
      `SELECT
        COUNT(DISTINCT p.id) as totalProducts,
        COALESCE(SUM(CASE WHEN pc.symbol = 'USD' THEN pc.value END), 0) as totalUsd,
        COALESCE(SUM(CASE WHEN pc.symbol = 'UAH' THEN pc.value END), 0) as totalUah
      FROM products p
      LEFT JOIN prices pc ON pc.product_id = p.id`
    );
    res.json({
      totalOrders: Number(orderStats.totalOrders),
      totalProducts: Number(productStats.totalProducts),
      totalUsd: Number(productStats.totalUsd),
      totalUah: Number(productStats.totalUah),
    });
  } catch (error) {
    console.error('GET /api/orders/meta/stats error:', error);
    res.status(500).json({ error: 'Failed to fetch order stats' });
  }
});

router.post('/', async (req, res) => {
  const validationErrors = validateOrderCreate(req.body);
  if (validationErrors.length) {
    return res.status(400).json({ error: 'Invalid order data', details: validationErrors });
  }

  try {
    const { title, description } = req.body;
    const date = toMySQLDateTime(new Date());

    const [result] = await pool.query(
      'INSERT INTO orders (title, date, description) VALUES (?, ?, ?)',
      [title || 'New order', date, description || null]
    );

    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...rows[0], productsCount: 0, totalUsd: 0, totalUah: 0 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ success: true, id: orderId });
  } catch (error) {
    console.error('DELETE /api/orders/:id error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];

    if (search) {
      sql += ' WHERE title LIKE ?';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY id';

    const [orders] = await pool.query(sql, params);
    res.json(orders);
  } catch (error) {
    console.error('GET /api/orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const date = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const [result] = await pool.query(
      'INSERT INTO orders (title, date, description) VALUES (?, ?, ?)',
      [title || 'New order', date, description || null]
    );

    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('POST /api/orders error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
    res.status(200).json({ success: true, id: orderId });
  } catch (error) {
    console.error('DELETE /api/orders/:id error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
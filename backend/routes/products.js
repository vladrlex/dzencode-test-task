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
    date: row.date,
  };
}

async function getProductWithPrices(productId) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
  if (!rows.length) return null;

  const [priceRows] = await pool.query('SELECT * FROM prices WHERE product_id = ?', [productId]);
  const prices = priceRows.map((p) => ({
    value: Number(p.value),
    symbol: p.symbol,
    isDefault: p.isDefault,
  }));

  return mapProductRow(rows[0], { [productId]: prices });
}

router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products');
    const [prices] = await pool.query('SELECT * FROM prices');

    const pricesByProduct = {};
    for (const p of prices) {
      if (!pricesByProduct[p.product_id]) pricesByProduct[p.product_id] = [];
      pricesByProduct[p.product_id].push({
        value: Number(p.value),
        symbol: p.symbol,
        isDefault: p.isDefault,
      });
    }

    res.json(products.map((row) => mapProductRow(row, pricesByProduct)));
  } catch (error) {
    console.error('GET /api/products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
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
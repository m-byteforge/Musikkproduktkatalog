// productRoutes.js

const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');

router.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

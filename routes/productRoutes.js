
//productRoutes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');

router.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.render('productlist', { products: rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/products/add', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    await pool.query(
      'INSERT INTO products (name, description, price) VALUES ($1, $2, $3)',
      [name, description, price]
    );

    res.redirect('/products');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/products/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4',
      [name, description, price, id]
    );

    res.redirect('/products');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/products/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    res.redirect('/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

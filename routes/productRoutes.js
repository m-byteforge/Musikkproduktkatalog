// productRoutes.js

const express = require('express');
const router = express.Router();
const { pool } = require('../dbConfig');

// Function to fetch all plant categories
router.get('/categories', async (req, res) => {
  try {
    // Assuming 'category' is a column in the products table
    const { rows } = await pool.query('SELECT DISTINCT category FROM products');
    res.render('categories', { categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to fetch plants based on a selected category
router.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    const { rows } = await pool.query('SELECT * FROM products WHERE category = $1', [category]);
    res.render('productlist', { plants: rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




app.get('/product/details/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Fetch the product details from the database using the productId
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

    // Check if a product with the given ID was found
    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    const product = result.rows[0];

    // Render the product details page with the product information
    res.render('product', { product });  // Update the template name to match your file name
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add other routes as needed

module.exports = router;

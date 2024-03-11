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



// Add this route to productRoutes.js
router.get('/cart/items', (req, res) => {
  const cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  res.json(cartItems);
});

// productRoutes.js

// ... (existing code)

router.get('/get-shipping-methods', async (req, res) => {
  try {
    // Fetch shipping methods from the server (replace this with your logic)
    const shippingMethods = [
      { id: 1, name: 'Standard Shipping', price: 5.99 },
      { id: 2, name: 'Express Shipping', price: 12.99 },
      // Add more shipping methods as needed
    ];

    res.json(shippingMethods);
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ... (existing code)


// Add this route to productRoutes.js


router.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (rows.length > 0) {
      res.render('productdetails', { product: rows[0] });
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});





module.exports = router;
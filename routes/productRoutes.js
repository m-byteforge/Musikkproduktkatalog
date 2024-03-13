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


// Example Express route for fetching users who purchased a product
app.get('/api/users/product/:productId', async (req, res) => {
  const productId = req.params.productId;
  const users = await getUsersForProduct(productId);
  res.json(users);
});

// Example Express route for fetching reviews for a product
app.get('/api/reviews/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await getReviewsForProduct(productId);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const { addComment } = require('../controllers/commentController');



router.post('/comments/add', addComment);



// productRoutes.js

// ... (existing code)

// Add a review for a product
router.post('/api/reviews/add', async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [productId, req.user.id, rating, comment]
    );

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Review added successfully' });
    } else {
      res.status(500).json({ error: 'Error adding review' });
    }
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const { addReview, getReviewsForProduct } = require('../controllers/reviewController');

// ... (existing code)

// Add a review for a product
router.post('/api/reviews/add', ensureAuthenticated, addReview);

// productRoutes.js

// ... (existing code)

const { addReviewToDatabase } = require('../controllers/reviewController');

// Add this route to productRoutes.js
router.post('/api/reviews/add-to-database', async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    // Implement the logic to add the review to the database
    // This might involve interacting with your database (e.g., using SQL queries)
    // For simplicity, let's assume you have a function `addToDatabase` for this purpose

    // Example:
    const result = await addToDatabase(productId, rating, comment);

    if (result) {
      res.status(200).json({ message: 'Review added to the database successfully' });
    } else {
      res.status(500).json({ error: 'Error adding review to the database' });
    }
  } catch (error) {
    console.error('Error adding review to the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;

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
>>>>>>> 74d9084bccd5d290600b374f295a6613af7dfb32

    res.redirect('/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

//commentController.js
const { pool } = require("../dbConfig");

async function addReview(req, res) {
  try {
    const { productId, rating, comment } = req.body;

    const result = await pool.query(
      "INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, NOW())",
      [productId, req.user.id, rating, comment]
    );

    if (result.rowCount === 1) {
      res.status(200).json({ message: "Review added successfully" });
    } else {
      res.status(500).json({ error: "Error adding review" });
    }
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getReviewsForProduct(productId) {
  try {
    const result = await pool.query(
      "SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC",
      [productId]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

const { addReview, getReviewsForProduct } = require("./commentController");

// Add this function to handle adding reviews to the database
async function addReviewToDatabase(req, res) {
  try {
    const { productId, rating, comment } = req.body;

    // Call the existing addReview function to insert the review into the database
    await addReview(req, res);

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Review added to the database successfully" });
  } catch (error) {
    console.error("Error adding review to the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { addReview, getReviewsForProduct, addReviewToDatabase };

module.exports = { addReview, getReviewsForProduct };

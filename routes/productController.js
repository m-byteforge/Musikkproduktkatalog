//productController.js

const express = require("express");
const router = express.Router();
const { pool } = require("../dbConfig");
router.get("/edit/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    const product = result.rows[0];

    res.render("editProduct", { product });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update/:productId", async (req, res) => {
  const productId = req.params.productId;
  const { name, description, price } = req.body;

  try {
    await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4",
      [name, description, price, productId]
    );

    // Redirect to the correct route
    res.redirect(`/products/edit/${productId}`);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

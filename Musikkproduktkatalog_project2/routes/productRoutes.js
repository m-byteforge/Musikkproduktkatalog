const express = require("express");
const router = express.Router();
const { pool } = require("../database");
const { isLoggedIn, isProductOwner } = require("../auth");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// GET all products
router.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    const products = result.rows;
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET a single product by ID
router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);
    const product = result.rows[0];
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST a new product
router.post("/products", isLoggedIn, async (req, res) => {
  const { name, description, images_name, price } = req.body;
  const userId = req.user.id; // Get user ID from the authenticated user

  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, images_name, price, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, images_name, price, userId]
    );
    const newProduct = result.rows[0];
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT (update) an existing product
router.put("/products/:id", isLoggedIn, async (req, res) => {
  const productId = req.params.id;
  const { name, description, images_name, price } = req.body;
  const userId = req.user.id; // Get user ID from the authenticated user

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, description = $2, images_name = $3, price = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [name, description, images_name, price, productId, userId]
    );
    const updatedProduct = result.rows[0];
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE a product
router.delete("/products/:id", isLoggedIn, async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await pool.query("DELETE FROM products WHERE id = $1", [
      productId,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET PDF for a product
router.get("/products/:productId/pdf", isLoggedIn, async (req, res) => {
  try {
    const productId = req.params.productId;
    const productResult = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create PDF document
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${product.name}.pdf"`
    );

    // Add content to PDF
    doc.pipe(res);
    doc.fontSize(20).text(product.name);
    doc.fontSize(14).text(`Description: ${product.description}`);
    doc.fontSize(14).text(`Price: $${product.price}`);

    // Fetch image data and embed it in the PDF
    const imagePath = `./public/images/${product.images_name}.png`; // Adjust the path as per your image storage location
    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, { fit: [250, 250] }); // Adjust image size as needed
    } else {
      doc.text("Image not found");
    }

    // End the PDF document
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

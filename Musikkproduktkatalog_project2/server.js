// server.js

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./passport-config"); // Updated import path
const { pool } = require("./database");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Import admin routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // Use Passport session middleware
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/", productRoutes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes); // Mount admin routes onto /admin path
app.use(express.static(__dirname + "/public"));

app.get("/admin", async (req, res) => {
  try {
    // Render the admin dashboard view
    res.render("dashboard_admin");
  } catch (error) {
    console.error("Error rendering admin dashboard:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to render index page
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    const products = result.rows;
    res.render("index", {
      products,
      userIcon: req.isAuthenticated() ? "/images/user-128.png" : "",
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

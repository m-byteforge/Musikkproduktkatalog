const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4000;

const initializePassport = require("./passportConfig");

initializePassport(passport);

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: 'password',
    resave: false,
    saveUninitialized: false
  })
);

app.use(express.static('public'));
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", (req, res) => {
  res.render("register", { errors: [] });
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2, city, country, zcode, telephone } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be at least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await pool.query(
        'INSERT INTO users (name, email, password, city, country, zcode, telephone, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [name, email, hashedPassword, city, country, zcode, telephone, new Date()]
      );

      req.flash("success_msg", "You are now registered. Please log in");
      res.redirect("/users/login");
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).send("Internal Server Error");
    }
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.get("/users/edit-profile", checkNotAuthenticated, (req, res) => {
  res.render("editProfile", { user: req.user });
});

app.get("/users/delete-account", checkNotAuthenticated, (req, res) => {
  res.render("deleteAccount", { user: req.user });
});

// Updated route for handling profile updates
app.post("/users/edit-profile", checkNotAuthenticated, async (req, res) => {
  try {
    const { city, country, zcode, telephone } = req.body;

    await pool.query(
      'UPDATE users SET city = $1, country = $2, zcode = $3, telephone = $4 WHERE id = $5',
      [city, country, zcode, telephone, req.user.id]
    );

    // Redirect to the dashboard after updating profile
    res.redirect('/users/dashboard');
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/shoppingcart", checkAuthenticated, (req, res) => {
  res.render("shoppingcart");
});

app.post("/update-cart", (req, res) => {
  const { productId, action } = req.body;

  // Retrieve the shopping cart from the session
  const shoppingCart = req.session.shoppingCart || [];

  // Find the product in the shopping cart
  const productIndex = shoppingCart.findIndex((product) => product.id === productId);

  // Update the quantity based on the action
  if (productIndex !== -1) {
    if (action === "increase") {
      shoppingCart[productIndex].quantity += 1;
    } else if (action === "decrease" && shoppingCart[productIndex].quantity > 1) {
      shoppingCart[productIndex].quantity -= 1;
    }
  }

  // Store the updated shopping cart back in the session
  req.session.shoppingCart = shoppingCart;

  res.json(shoppingCart); // Return the updated shopping cart as JSON
});

app.post("/add-to-cart", (req, res) => {
  const { productId } = req.body;

  // Retrieve the shopping cart from the session
  const shoppingCart = req.session.shoppingCart || [];

  // Check if the product is already in the cart
  const productIndex = shoppingCart.findIndex(product => product.id === productId);

  if (productIndex !== -1) {
    // Product is already in the cart, increase quantity
    shoppingCart[productIndex].quantity += 1;
  } else {
    // Product is not in the cart, add it with quantity 1
    shoppingCart.push({
      id: productId,
      quantity: 1,
      // Include other product details as needed
    });
  }

  // Store the updated shopping cart back in the session
  req.session.shoppingCart = shoppingCart;

  // Respond with the updated shopping cart items
  res.json(shoppingCart);
});





app.get('/product/detail/:productId', async (req, res) => {
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
    res.render('detail', { product });
 // Update the template name to match your file name
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

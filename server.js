//server.js
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
    secret: "Zeryaw",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static("public"));
app.get("/favicon.ico", (req, res) => res.status(204));

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

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
    }
    res.redirect("/");
  });
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2, city, country, zcode, telephone } =
    req.body;
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
        "INSERT INTO users (name, email, password, city, country, zcode, telephone, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
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
    failureFlash: true,
  })
);

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  console.log("GET /users/delete-account - Rendering deleteAccount page");
  res.render("deleteAccount", { user: req.user });
});

app.post("/users/edit-profile", checkNotAuthenticated, async (req, res) => {
  try {
    const { city, country, zcode, telephone } = req.body;

    await pool.query(
      "UPDATE users SET city = $1, country = $2, zcode = $3, telephone = $4 WHERE id = $5",
      [city, country, zcode, telephone, req.user.id]
    );

    res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/users/delete-account", checkNotAuthenticated, async (req, res) => {
  console.log("POST /users/delete-account - Handling account deletion");
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { reason } = req.body;

    // Ensure the reason is provided
    if (!reason) {
      return res.status(400).send('Reason is required');
    }

    // Delete the user from the users table
    const deleteResult = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [req.user.id]
    );

    // Check if the user was deleted successfully
    if (deleteResult.rowCount === 0) {
      return res.status(404).send('User not found');
    }

    // Insert the deletion record into the deletions table
    await client.query(
      'INSERT INTO deletions (user_id, reason, created_at) VALUES ((SELECT id FROM users WHERE id = $1), $2, $3)',
      [req.user.id, reason, new Date()]
    );

    await client.query('COMMIT');

    // Redirect to the confirmation page or home page after account deletion
    res.redirect('/confirmation'); // You can create a confirmation page
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting user account:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  } finally {
    client.release();
  }
});

app.get("/shoppingcart", checkAuthenticated, (req, res) => {
  const cartItems = req.session.shoppingCart || [];
  res.render("shoppingcart", { cartItems });
});

app.post("/add-to-cart", (req, res) => {
  const { productId } = req.body;
  const shoppingCart = req.session.shoppingCart || [];
  const productIndex = shoppingCart.findIndex(
    (product) => product.id === productId
  );

  if (productIndex !== -1) {
    shoppingCart[productIndex].quantity += 1;
  } else {
    shoppingCart.push({
      id: productId,
      quantity: 1,
      price: product.price,
    });
  }

  req.session.shoppingCart = shoppingCart;
  res.json(shoppingCart);
});

app.post("/update-cart", (req, res) => {
  const { productId, action } = req.body;
  const shoppingCart = req.session.shoppingCart || [];
  const productIndex = shoppingCart.findIndex(
    (product) => product.id === productId
  );

  if (productIndex !== -1) {
    if (action === "increase") {
      shoppingCart[productIndex].quantity += 1;
    } else if (
      action === "decrease" &&
      shoppingCart[productIndex].quantity > 1
    ) {
      shoppingCart[productIndex].quantity -= 1;
    }
  }

  req.session.shoppingCart = shoppingCart;
  res.json(shoppingCart);
  req.session.cartQuantity = shoppingCart.reduce(
    (total, item) => total + item.quantity,
    0
  );
});

app.post("/empty-cart", (req, res) => {
  req.session.shoppingCart = [];
  res.redirect("/shoppingcart");
});

app.get("/shoppingcart", checkAuthenticated, (req, res) => {
  const cartItems = req.session.shoppingCart || [];
  const user = req.user;

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  res.render("shoppingcart", { cartItems, totalPrice, user });
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.get("/checkout-step1", (req, res) => {
  res.render("checkout-step1");
});

app.get("/checkout-step2", (req, res) => {
  res.render("checkout-step2");
});

app.get("/checkout-step3", (req, res) => {
  res.render("checkout-step3");
});

app.get("/order-confirmation", (req, res) => {
  res.render("order-confirmation");
});

app.get("/get-shipping-methods", (req, res) => {
  try {
    const shippingMethods = [
      { name: "Standard Shipping", price: 5.99 },
      { name: "Express Shipping", price: 12.99 },
    ];

    res.json(shippingMethods);
  } catch (error) {
    console.error("Error retrieving shipping methods:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-user-info", (req, res) => {
  try {
    const userInfo = {
      name: req.user.name,
      email: req.user.email,
      city: req.user.city,
      country: req.user.country,
      zcode: req.user.zcode,
      telephone: req.user.telephone,
    };

    res.json(userInfo);
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/get-shipping-methods", (req, res) => {
  try {
    const shippingMethods = [
      { name: "Standard Shipping", price: 5.99 },
      { name: "Express Shipping", price: 12.99 },
    ];

    res.json(shippingMethods);
  } catch (error) {
    console.error("Error retrieving shipping methods:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Internal Server Error: ${err.message}`);
});




app.get('/product/details/:productId', async (req, res) => {
  const productId = req.params.productId;
  console.log('Server-side Product ID:', productId);  // Add this line for debugging

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
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


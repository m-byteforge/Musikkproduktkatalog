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
  console.log(req.session.flash && req.session.flash.error);
  res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.render("index", { message: "You have logged out successfully" });
  });
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2,city, country, zcode, telephone } = req.body;
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

      // Insert user into the database
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
  if (req.isAuthenticated() && req.session.flash && req.session.flash.error) {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

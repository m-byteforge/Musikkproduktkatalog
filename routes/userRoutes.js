const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { pool } = require('../dbConfig');
const { ensureAuthenticated } = require('../passportConfig');

router.get('/edit-profile', ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    res.render('edit-profile', { user });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit-profile', ensureAuthenticated, async (req, res) => {
  try {
    const { city, country, zcode, telephone } = req.body;

    await pool.query(
      'UPDATE users SET city = $1, country = $2, zcode = $3, telephone = $4 WHERE id = $5',
      [city, country, zcode, telephone, req.user.id]
    );

    res.redirect('/users/dashboard');
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/register', (req, res) => {
  res.render('register', { errors: [] });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password2, city, country, zcode, telephone } = req.body;
    const errors = [];

    // Validation checks
    if (!name || !email || !password || !password2) {
      errors.push({ message: 'Please enter all fields' });
    }

    if (password.length < 6) {
      errors.push({ message: 'Password must be at least 6 characters long' });
    }

    if (password !== password2) {
      errors.push({ message: 'Passwords do not match' });
    }

    if (errors.length > 0) {
      return res.render('register', { errors, name, email, password, password2 });
    }

    // Check for existing user
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.render('register', { message: 'Email already registered' });
    }

    // Continue with password hashing and user insertion
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, city, country, zcode, telephone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, password',
      [name, email, hashedPassword, city, country, zcode, telephone]
    );

    req.flash('success_msg', 'You are now registered. Please log in');
    res.redirect('/users/login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

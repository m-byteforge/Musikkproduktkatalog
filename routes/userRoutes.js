const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { pool } = require('../dbConfig');
const { ensureAuthenticated } = require('../passportConfig');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user.name });
});

router.get('/edit-profile', ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    res.render('editProfile', { user });
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

    // Redirect to the dashboard after updating profile
    res.redirect('/users/dashboard');
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/delete-account', ensureAuthenticated, (req, res,) => {
  
  res.render('deleteAccount', { user: req.user });
});

router.post('/delete-account', ensureAuthenticated, async (req, res ) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { reason } = req.body;

    // Ensure the reason is provided
    if (!reason) {
      return res.status(400).send('Reason is required');
    }



    // Delete the user from the users table
    await client.query('DELETE FROM users WHERE id = $1', [req.user.id]);

    // Insert the deletion record into the deletions table
    await client.query(
      'INSERT INTO deletions (user_id, reason, created_at) VALUES ($1, $2, $3,$4,$5,$6,$7)',
      [req.user.id, reason, new Date()]
    );

    await client.query('COMMIT');

    // Redirect or render as needed
    res.redirect('./index');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting user account:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    client.release();
  }
});

router.get('/register', (req, res) => {
  res.render('register', { errors: [] });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password2, city, country, zcode, telephone } = req.body;
    const errors = [];

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

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.render('register', { message: 'Email already registered' });
    }

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

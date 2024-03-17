//userRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { pool } = require('../database');
const LocalStrategy = require('passport-local').Strategy;

router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));
router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
      // Retrieve user information from the database
      const userId = req.user.id;
      pool.query('SELECT username FROM users WHERE id = $1', [userId], (error, results) => {
          if (error) {
              console.error('Error fetching user information:', error);
              res.status(500).json({ message: 'Internal Server Error' });
          } else {
              const username = results.rows[0].username;
              res.render('dashboard', { user: { id: userId, username: username } });
          }
      });
  } else {
      res.redirect('/login');
  }
});


router.get('/dashboard/edit', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    res.render('edit_profile', { user: req.user });
});

router.post('/dashboard/edit', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    const { username, email, city, country, zip_code, telephone } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2, city = $3, country = $4, zip_code = $5, telephone = $6 WHERE id = $7 RETURNING *',
            [username, email, city, country, zip_code, telephone, userId]
        );
        const updatedUser = result.rows[0];

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/delete_account', (req, res) => {
    res.render('delete_account', { user: req.user });
});

router.post('/dashboard/delete', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);

        req.logout(() => {
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, city, country, zip_code, telephone } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO users (username, email, password, city, country, zip_code, telephone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [username, email, hashedPassword, city, country, zip_code, telephone]);
        const newUser = result.rows[0];
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            if (user.rows.length === 0) {
                return done(null, false, { message: 'User not found' });
            }

            const match = await bcrypt.compare(password, user.rows[0].password);
            if (!match) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user.rows[0]);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            return done(error);
        }
        done(null, results.rows[0]);
    });
});

module.exports = router;

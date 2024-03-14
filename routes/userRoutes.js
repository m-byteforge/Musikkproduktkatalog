// userRoutes.js
const express = require("express");
const router = express.Router();
const { pool } = require("./dbConfig");
const passport = require("passport");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

router.get("/edit-profile", ensureAuthenticated, (req, res) => {
  res.render("editProfile", { user: req.user });
});

router.post("/edit-profile", ensureAuthenticated, async (req, res) => {
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

router.get("/delete-account", ensureAuthenticated, (req, res) => {
  res.render("deleteAccount", { user: req.user });
});
// Inside your delete-account POST route
router.post("/delete-account", ensureAuthenticated, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).send('Reason is required');
    }

    const deleteResult = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.user.id]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).send('User not found');
    }

    await client.query(
      'INSERT INTO deletions (user_id, reason, created_at) VALUES ($1, $2, $3)',
      [req.user.id, reason, new Date()]
    );

    await client.query('COMMIT');

    // Clear the session and redirect to the index page
    req.logout();  // Assuming you are using Passport.js
    res.redirect('/');  // Adjust the route as needed
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting user account:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  } finally {
    client.release();
  }
});


router.get('/get-user-info', ensureAuthenticated, (req, res) => {
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
    console.error('Error fetching user information:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/delete-account', async (req, res) => {
  try {
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
   
  }
})

module.exports = router;

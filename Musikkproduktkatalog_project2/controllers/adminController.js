// adminController.js


const { passport, isLoggedIn } = require('../auth');
const bcrypt = require('bcrypt');
const { pool } = require('../database');

// Function to render the login page for admin
function getLoginPage(req, res) {
    res.render('admin/login_admin');
}

// Function to handle admin login
function login(req, res, next) {
    passport.authenticate('local-admin', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
}

// Function to render the registration page for admin
function getRegisterPage(req, res) {
    res.render('admin/register_admin');
}

// Function to handle admin registration
async function register(req, res) {
    try {
        const { username, password, email } = req.body;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin details into the database
        await pool.query('INSERT INTO admins (username, password, email) VALUES ($1, $2, $3)', [username, hashedPassword, email]);

        res.redirect('/admin/login'); // Redirect to login page after successful registration
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to render the dashboard for admin
function getDashboard(req, res) {
    res.render('admin/dashboard_admin');
}

module.exports = {
    getLoginPage,
    login,
    getRegisterPage,
    register,
    getDashboard
};

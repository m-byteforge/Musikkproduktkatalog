// adminController.js

const bcrypt = require('bcrypt');
const passport = require('../passport-config'); // Correct the import path

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
    // Registration logic
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

//adminRoutes.js

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const passport = require("passport");

// Route to render the login page for admin
router.get("/login", adminController.getLoginPage);

// Route to handle admin login
router.post("/login", adminController.login);

// Route to render the registration page for admin
router.get("/register", adminController.getRegisterPage);

// Route to handle admin registration
router.post("/register", adminController.register);

// Route to render the dashboard for admin
router.get("/dashboard", ensureAuthenticated, adminController.getDashboard);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/admin/login");
}

module.exports = router;

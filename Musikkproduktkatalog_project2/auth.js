const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { pool } = require('./database');

// Middleware function to check if the user is authenticated
function isLoggedIn(req, res, next) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        // If authenticated, continue to the next middleware or route handler
        return next();
    }
    // If not authenticated, send an error response
    res.status(401).json({ message: 'Unauthorized' });
}

// Define local strategy for admin authentication
passport.use('local-admin', new LocalStrategy(
    async function(username, password, done) {
        try {
            const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
            if (result.rows.length === 0) {
                return done(null, false, { message: 'Incorrect username' });
            }
            const admin = result.rows[0];
            bcrypt.compare(password, admin.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, admin);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            });
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize and deserialize admin user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM admins WHERE id = $1', [id], (error, results) => {
        if (error) {
            return done(error);
        }
        const admin = results.rows[0];
        done(null, admin);
    });
});

// Export the middleware and passport configuration
module.exports = { isLoggedIn, passport };

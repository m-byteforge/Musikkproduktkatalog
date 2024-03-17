const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { pool } = require('./database');

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

module.exports = passport;

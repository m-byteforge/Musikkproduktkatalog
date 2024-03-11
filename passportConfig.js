const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');



function initializePassport(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

          if (user.rows.length > 0) {
            const isPasswordMatch = await bcrypt.compare(password, user.rows[0].password);

            if (isPasswordMatch) {
              return done(null, user.rows[0]);
            } else {
              return done(null, false, { message: 'Incorrect password' });
            }
          } else {
            return done(null, false, { message: 'Email not registered' });
          }
        } catch (error) {
          console.error('Error authenticating user:', error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return done(null, user.rows[0]);
    } catch (error) {
      console.error('Error deserializing user:', error);
      return done(error);
    }
    
  });
  
}


module.exports = initializePassport;

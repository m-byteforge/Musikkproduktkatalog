// userController.js
const passport = require("../auth"); // Import passport for authentication

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, city, country, zip_code, telephone } =
      req.body;
    const role = "user"; // Default role for users

    const userData = {
      username: username,
      email: email,
      password: password,
      city: city,
      country: country,
      zip_code: zip_code,
      telephone: telephone,
      role: role, // Assign the default role to the user
    };

    const user = await User.create(userData);

    // Log in the user immediately after registration
    req.login(user, (err) => {
      if (err) {
        console.error("Error logging in user after registration:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(201).json(user);
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

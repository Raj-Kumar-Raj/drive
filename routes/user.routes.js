// require express

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");

// used to validate form at user side
const { body, validationResult } = require("express-validator");
// this route is used to shwo the resitration page
router.get("/register", (req, res) => {
  res.render("register");
});

// this route is used to handle the registration form submission

router.post(
  "/register",

  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  async (req, res) => {
    // for demonstration purposes, we'll just log the data to the console
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Registration failed" });
    }
    // create a new user
    const { email, password, username } = req.body;
    // hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      username,
    });
    res.render("login");
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  body("username").trim(),
  body("password").trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Login failed" });
    }

    const { username, password } = req.body;
    const user = await userModel.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      // create and sign a token
      const token = jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET
      );

      // Set cookie with a valid expiration
      res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      }); // Expires in 1 day

      res.render("home");
    }
  }
);

module.exports = router;

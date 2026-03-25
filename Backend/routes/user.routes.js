const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

//register user
router.post("/register",[
    body("fullname").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
], userController.registerUser);

//login user
router.post("/login",[
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
],userController.loginUser);

router.get("/profile", authMiddleware.authToken, userController.getUserProfile);

router.get("/logout", authMiddleware.authToken, userController.logoutUser);

module.exports = router;
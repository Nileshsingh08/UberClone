const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller');

router.post('/register',[
    body('fullName.FirstName').isString().withMessage('First name must be a string')
    .isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isString().withMessage('Vehicle color must be a string')
    .isLength({min:3}).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.plate').isString().withMessage('Vehicle plate must be a string'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'bike', 'auto']).withMessage('Vehicle type must be either car, bike, or auto'),
],
captainController.registerCaptain);

module.exports = router;
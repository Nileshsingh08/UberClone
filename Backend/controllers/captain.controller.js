const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const validationResult = require('express-validator').validationResult;
const blackListTokenModel = require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { fullName, email, password, vehicle } = req.body;
        const existingCaptain = await captainModel.findOne({ email });
        if (existingCaptain) {
            return res.status(400).json({ error: 'Captain with this email already exists' });
        }

        const newCaptain = await captainService.createCaptain({ 
            firstName: fullName.FirstName, 
            lastName: fullName.LastName, 
            email, 
            password, 
            color: vehicle.color, 
            plate: vehicle.plate, 
            capacity: vehicle.capacity, 
            vehicleType: vehicle.vehicleType 
        });
        const token = newCaptain.generateAuthToken();
        return res.status(201).json({ message: 'Captain registered successfully', captain: newCaptain, token });
        
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }  
    const { email, password } = req.body;
    try {
        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(401).json({ message: 'Captain not found' });
        }   
        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = captain.generateAuthToken();
        res.cookie('token',token);
        return res.status(200).json({ message: 'Login successful', captain, token }); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports.getCaptainProfile = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id).select('-password');
        return res.status(200).json({ captain });
    }   catch (error) { 
        return res.status(500).json({ error: error.message });
    }  
};  

module.exports.logoutCaptain = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blackListTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }  
};
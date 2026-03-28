const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const validationResult = require('express-validator').validationResult;

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

        const hashedPassword = await captainModel.hashPassword(password);
        const newCaptain = await captainService.createCaptain({ 
            firstName: fullName.FirstName, 
            lastName: fullName.LastName, 
            email, 
            password: hashedPassword, 
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
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authToken = async (req,res,next)=>{
    console.log(req.headers.authorization);
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'No token provided' });
    }
    const isBlacklisted = await blackListTokenModel.findOne({ token });
    if(isBlacklisted){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded._id);
        if(!user){
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        // console.log("Authenticated user:", user);
        next(); 
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports.authCaptain = async (req,res,next)=>{
    console.log(req.headers.authorization);
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];  
    if(!token){
        return res.status(401).json({ message: 'No token provided' });
    }
    const isBlacklisted = await blackListTokenModel.findOne({ token });
    if(isBlacklisted){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const captain = await captainModel.findById(decoded._id);
        if(!captain){
            return res.status(401).json({ message: 'Captain not found' });
        }
        req.captain = captain;
        // console.log("Authenticated captain:", captain);
        next(); 
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }   
}

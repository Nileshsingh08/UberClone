const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator')


module.exports.registerUser = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const {fullname, email ,password} = req.body;
    const hashedPassword = await userModel.hashPassword(password);
    const userData = { firstname : fullname.firstname,
         lastname : fullname.lastname  
        , email, password: hashedPassword
     };
    try {
        const newUser = await userService.createUser(userData);
        const token = newUser.generateAuthToken();
        res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports.loginUser = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };
    const {email, password} = req.body;
    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = user.generateAuthToken();
        res.status(200).json({ message: 'Login successful', user, token }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getUserProfile = async (req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id).select('-password');   
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
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
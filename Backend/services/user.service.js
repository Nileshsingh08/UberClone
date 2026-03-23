const userModel = require('../models/user.model');

module.exports.createUser = async ({ firstname, lastname, email, password }) => {
    console.log("Creating user with data:", { firstname, lastname, email,password });
    if(!firstname || !email || !password){
        throw new Error('Missing required fields');
    }
    const newUser = new userModel({ fullname: { firstname, lastname }, email, password });
    console.log(newUser);
    await newUser.save();
    return newUser;
}

module.exports.findUserByEmail = async (email) => {
    return await userModel.findOne({ email }).select('+password');
};
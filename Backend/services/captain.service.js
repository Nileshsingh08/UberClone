const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({firstName, lastName, email, password, color,plate,capacity, vehicleType }) => {
    if(!firstName || !lastName || !email || !password || !color || !plate || !capacity || !vehicleType){
        throw new Error('All fields are required');
    }
    const existingCaptain = await captainModel.findOne({email});
    if(existingCaptain){
        throw new Error('Captain with this email already exists');
    }  
    const existingPlate = await captainModel.findOne({'vehicle.plate': plate});
    if(existingPlate){
        throw new Error('Captain with this plate already exists');
    }   
    const hashedPassword = await captainModel.hashPassword(password);
    const newCaptain = new captainModel({
        fullName: { FirstName: firstName, LastName: lastName },
        email,
        password: hashedPassword,   
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });
    return await newCaptain.save();
};
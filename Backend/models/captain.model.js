const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captionSchema = new mongoose.Schema({
    fullName: {
        FirstName:{
            type: String,
            required: true,
            minlength:[3,'Firstname must be at least 3 characters long']
        },
        LastName:{
            type: String,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.']
    },
    password: { 
        type: String,
        required: true,
        minlength:[6,'Password must be at least 6 characters long'] 
    },
    socketid: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle:{
        color: {
            type: String,
            required: true,
            minlength:[3,'Color must be at least 3 characters long']
        },
        plate:{
            type: String,
            required: true,
            unique: true,
        },
        capacity:{
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'bike', 'auto']
        }

    },
    location: {
        lat: {
            type: Number,
            // required: true,
        },
        long: {
            type: Number,
            // required: true,
        }
    }


});

captionSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id}, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
    return token;
}
captionSchema.methods.comparePassword = async function(Password){
    return await bcrypt.compare(Password, this.password);
};
captionSchema.statics.hashPassword = async function(password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const captionModel = mongoose.model('Caption', captionSchema);

module.exports = captionModel;
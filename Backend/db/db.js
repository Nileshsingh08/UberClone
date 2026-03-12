const mongoose = require('mongoose');

function connectToDb(){
    mongoose.connect(process.env.DB_connect,)
    .then(()=>{
        console.log("connected to db successfully");
    })
    .catch((err)=>{
        console.log("error connecting to db", err);
    })
}

module.exports = connectToDb;
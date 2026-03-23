const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db');
const userRouts = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(cookieParser());

connectToDb();


app.use('/users', userRouts);

app.get("/", (req,res)=>{
    return res.status(200).json({"message":"got it"});
     
})

module.exports = app;
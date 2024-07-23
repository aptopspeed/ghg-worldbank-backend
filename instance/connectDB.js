const mongoose = require("mongoose");
const Country = require('../models/Country');
const Sector = require('../models/Sector');
const Emission = require('../models/Emission');
const csv = require("csv-parser");
const fs = require('fs');

const connectDB = async () => {
    const mongoURI = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@world-bank-ghg.mtdws8h.mongodb.net/${process.env.DB}?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`;
    try {
        await mongoose.connect(mongoURI);
        console.log("Successfully connected to MongoDB");

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
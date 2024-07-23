const mongoose = require('mongoose');
const { Schema } = mongoose;

const countrySchema = new Schema({
    shortName: {
        type: String,
        required: true,
        unique: true
    },
    countryName: {
        type: String,
        required: true
    },
    countryShortName: {
        type: String,
        required: true
    }
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
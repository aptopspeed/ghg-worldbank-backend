const mongoose = require('mongoose');
const { Schema } = mongoose;

const sectorSchema = new Schema({
  shortSector: {
    type: String,
    required: true,
    unique: true
  },
  sectorName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Sector = mongoose.model('Sector', sectorSchema);

module.exports = Sector;
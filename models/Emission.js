const mongoose = require('mongoose');

const emissionSchema = new mongoose.Schema({
  countryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Country', 
    required: true 
    },
  sectorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sector', 
    required: true },
  year: { 
    type: Number, 
    required: true },
  emissions: {
    CO2: { type: Number, required: true },
    FGas: { type: Number, required: true },
    N2O: { type: Number, required: true },
    CH4: { type: Number, required: true },
  }
});

module.exports = mongoose.model('Emission', emissionSchema);
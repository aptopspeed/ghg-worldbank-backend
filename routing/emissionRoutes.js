const express = require('express');
const router = express.Router();
const Country = require("../models/Country");
const Emission = require("../models/Emission");

router.get('/trend', async (req, res) => {
    const countryShortName = req.query.country;

    if (!countryShortName) {
        return res.status(400).json({ error: 'Country short name is required' });
    }

    try {
        // Find the country by short name
        const country = await Country.findOne({ shortName: countryShortName });

        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }

        // Find emissions data for the country
        const emissions = await Emission.find({ countryId: country._id })
            .populate('sectorId', 'shortSector sectorName')
            .sort({ year: 1 });

        if (!emissions.length) {
            return res.status(404).json({ error: 'No emissions data found for the country' });
        }

        // Format the response
        const response = emissions.map(emission => ({
            year: emission.year,
            emissions: emission.emissions,
            sector: {
                shortSector: emission.sectorId.shortSector,
                sectorName: emission.sectorId.sectorName
            }
        }));

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/map', async (req, res) => {
    const year = parseInt(req.query.year);

    if (isNaN(year)) {
        return res.status(400).json({ error: 'Valid year is required' });
    }

    try {
        // Find emissions data for the specified year
        const emissions = await Emission.find({ year })
            .populate('countryId', 'shortName countryName')
            .populate('sectorId', 'shortSector sectorName');

        if (!emissions.length) {
            return res.status(404).json({ error: 'No emissions data found for the specified year' });
        }

        // Format the response
        const response = emissions.map(emission => ({
            country: {
                shortName: emission.countryId.shortName,
                countryName: emission.countryId.countryName
            },
            sector: {
                shortSector: emission.sectorId.shortSector,
                sectorName: emission.sectorId.sectorName
            },
            year: emission.year,
            emissions: emission.emissions
        }));

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/sector', async (req, res) => {
    const { country, year } = req.query;
  
    if (!country || isNaN(parseInt(year))) {
      return res.status(400).json({ error: 'Valid country and year are required' });
    }
  
    try {
      // Find the country ID
      const countryData = await Country.findOne({ shortName: country });
  
      if (!countryData) {
        return res.status(404).json({ error: 'Country not found' });
      }
  
      // Find emissions data for the specified country and year
      const emissions = await Emission.find({ countryId: countryData._id, year: parseInt(year) })
        .populate('sectorId', 'shortSector sectorName');
  
      if (!emissions.length) {
        return res.status(404).json({ error: 'No emissions data found for the specified country and year' });
      }
  
      // Format the response
      const response = emissions.map(emission => ({
        sector: {
          shortSector: emission.sectorId.shortSector,
          sectorName: emission.sectorId.sectorName
        },
        year: emission.year,
        emissions: emission.emissions
      }));
  
      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });


module.exports = router;
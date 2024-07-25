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

router.get('/filter', async (req, res) => {
  try {
    const { country, gas, year } = req.query;

    // Validate the inputs
    if (!country || !gas || !year) {
      return res.status(400).json({ error: 'Country, gas, and year are required parameters.' });
    }

    // Find the country by shortName
    const countryData = await Country.findOne({ shortName: country });

    if (!countryData) {
      return res.status(404).json({ error: 'Country not found.' });
    }

    // Build the query object
    const query = {
      year: parseInt(year, 10),
      countryId: countryData._id
    };

    // Retrieve the filtered emissions with populated sector details
    const emissions = await Emission.find(query)
      .populate('sectorId', 'name sectorName') // Populate sector details
      .select(`sectorId emissions.${gas} -_id`) // Select sectorId and specific gas emission
      .exec();

    res.json(emissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching emissions data.' });
  }
});

router.get('/years', async (req, res) => {
  try {
    const distinctYears = await Emission.distinct('year');
    res.json(distinctYears.sort((a, b) => b - a)); // Sort years in descending order
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/aggregate', async (req, res) => {
  try {
    const { country } = req.query;

    // Validate the input
    if (!country) {
      return res.status(400).json({ error: 'Country is a required parameter.' });
    }

    // Find the country by shortName
    const countryData = await Country.findOne({ shortName: country });

    if (!countryData) {
      return res.status(404).json({ error: 'Country not found.' });
    }

    // Aggregate emissions data by year and sum emissions for each gas
    const aggregatedData = await Emission.aggregate([
      { $match: { countryId: countryData._id } },
      {
        $group: {
          _id: '$year',
          totalCO2: { $sum: '$emissions.CO2' },
          totalFGas: { $sum: '$emissions.FGas' },
          totalN2O: { $sum: '$emissions.N2O' },
          totalCH4: { $sum: '$emissions.CH4' },
        },
      },
      {
        $addFields: {
          totalEmissions: { $sum: ['$totalCO2', '$totalFGas', '$totalN2O', '$totalCH4'] },
          country: countryData.shortName,
        },
      },
      { $sort: { _id: 1 } }, // Sort by year
      {
        $project: {
          _id: 0,
          year: '$_id',
          country: 1,
          totalEmissions: 1,
        },
      },
    ]);
    res.json(aggregatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching emissions data.' });
  }
});

router.get('/aggregateCountry', async (req, res) => {
  try {
    const { countries } = req.query;

    // Validate the input
    if (!countries) {
      return res.status(400).json({ error: 'Countries is a required parameter.' });
    }

    const countryList = countries.split(',');
    const countryData = await Country.find({ shortName: { $in: countryList } });

    if (!countryData.length) {
      return res.status(404).json({ error: 'Countries not found.' });
    }

    const countryIds = countryData.map(country => country._id);

    // Aggregate emissions data by year and sum emissions for each gas
    const aggregatedData = await Emission.aggregate([
      { $match: { countryId: { $in: countryIds } } },
      {
        $group: {
          _id: { year: '$year', countryId: '$countryId' },
          totalCO2: { $sum: '$emissions.CO2' },
          totalFGas: { $sum: '$emissions.FGas' },
          totalN2O: { $sum: '$emissions.N2O' },
          totalCH4: { $sum: '$emissions.CH4' },
        },
      },
      { $sort: { '_id.year': 1 } },
    ]);

    // Map countryId to shortName
    const countryMap = countryData.reduce((acc, country) => {
      acc[country._id] = country.shortName;
      return acc;
    }, {});

    const formattedData = aggregatedData.map(item => ({
      year: item._id.year,
      country: countryMap[item._id.countryId],
      totalEmissions: item.totalCO2 + item.totalFGas + item.totalN2O + item.totalCH4,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching emissions data.' });
  }
});

router.get('/aggregateSectorbyYear', async (req, res) => {
  try {
    const year = parseInt(req.query.year);

    const summary = await Emission.aggregate([
      { $match: { year: year } },
      {
        $group: {
          _id: { country: "$countryId", sector: "$sectorId" },
          totalEmissions: {
            $sum: {
              $add: [
                "$emissions.CO2",
                "$emissions.FGas",
                "$emissions.N2O",
                "$emissions.CH4"
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'countries',
          localField: '_id.country',
          foreignField: '_id',
          as: 'country'
        }
      },
      {
        $lookup: {
          from: 'sectors',
          localField: '_id.sector',
          foreignField: '_id',
          as: 'sector'
        }
      },
      {
        $project: {
          _id: 0,
          country: { $arrayElemAt: ["$country.countryName", 0] },
          sector: { $arrayElemAt: ["$sector.sectorName", 0] },
          totalEmissions: { $round: ["$totalEmissions", 2] }
        }
      },
      {
        $sort: { country: 1, sector: 1 }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/aggregateMap', async (req, res) => {
  try {
    const year = parseInt(req.query.year);

    if (isNaN(year)) {
      return res.status(400).json({ message: 'Invalid year provided' });
    }

    const aggregatedData = await Emission.aggregate([
      { $match: { year: year } },
      {
        $group: {
          _id: "$countryId",
          totalEmissions: {
            $sum: {
              $add: ["$emissions.CO2", "$emissions.FGas", "$emissions.N2O", "$emissions.CH4"]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'countries',
          localField: '_id',
          foreignField: '_id',
          as: 'country'
        }
      },
      {
        $unwind: '$country'
      },
      {
        $project: {
          _id: 0,
          totalEmissions: { $round: ["$totalEmissions", 2] },
          countryName: "$country.countryName",
          shortName: "$country.shortName"
        }
      },
      {
        $sort: { countryName: 1 }
      }
    ]);

    res.json(aggregatedData);
  } catch (error) {
    console.error('Error in /aggregateMap:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/aggregateMapAll', async (req, res) => {
  try {
    const aggregatedData = await Emission.aggregate([
      {
        $group: {
          _id: {
            countryId: "$countryId",
            year: "$year"
          },
          emissions: {
            $sum: {
              $add: ["$emissions.CO2", "$emissions.FGas", "$emissions.N2O", "$emissions.CH4"]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'countries',
          localField: '_id.countryId',
          foreignField: '_id',
          as: 'country'
        }
      },
      {
        $unwind: '$country'
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          emissions: { $round: ["$emissions", 2] },
          shortName: "$country.shortName",
          countryName: "$country.countryName"
        }
      },
      {
        $sort: { countryName: 1, year: 1 }
      }
    ]);

    res.json(aggregatedData);
  } catch (error) {
    console.error('Error in /aggregateMap:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
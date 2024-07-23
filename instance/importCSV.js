// const ObjectId = mongoose.Types.ObjectId;

const Emission = require("../models/Emission")

// const importCSV = async () => {
//   const countriesMap = await Country.find().select('shortName _id').then(countries => {
//     const map = {};
//     countries.forEach(country => {
//       map[country.shortName] = country._id;
//     });
//     return map;
//   });

// //   const agricultureSectorId = await Sector.findOne({ shortSector: 'agriculture' }).select('_id').then(sector => sector._id);
// //   const wasteSectorId = await Sector.findOne({ shortSector: 'waste' }).select('_id').then(sector => sector._id);
//   const industrySectorId = await Sector.findOne({ shortSector: 'industry' }).select('_id').then(sector => sector._id);

//   const results = [];

//   fs.createReadStream('ghg-emissions-industrialProcess.csv')
//     .pipe(csv())
//     .on('data', (data) => {
//       const countryId = countriesMap[data.shortName];
//       if (!countryId) return;

//       Object.keys(data).forEach(key => {
//         if (key !== 'shortName' && key !== 'countryName') {
//           results.push({
//             countryId: new ObjectId(countryId),
//             sectorId: new ObjectId(industrySectorId),
//             year: parseInt(key),
//             emissions: parseFloat(data[key])
//           });
//         }
//       });
//     })
//     .on('end', async () => {
//       try {
//         await Emission.insertMany(results);
//         console.log('Data imported successfully');
//       } catch (error) {
//         console.error('Error inserting data:', error);
//       } finally {
//         mongoose.connection.close();
//       }
//     });
// };

// importCSV();



//// Import CSV Emissions
// async function importCSV(filePath) {
//     // Create mappings for countries and sectors
//     const countriesMap = await Country.find().select('shortName _id').then(countries => {
//       const map = {};
//       countries.forEach(country => {
//         map[country.shortName] = country._id;
//       });
//       return map;
//     });
  
//     const sectorsMap = await Sector.find().select('sectorName _id').then(sectors => {
//       const map = {};
//       sectors.forEach(sector => {
//         map[sector.sectorName] = sector._id;
//       });
//       return map;
//     });
  
//     const results = [];
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => {
//         const countryId = countriesMap[data.shortName];
//         const sectorId = sectorsMap[data.sector];
  
//         if (countryId && sectorId) {
//           results.push({
//             countryId,
//             sectorId,
//             year: Number(data.year),
//             emissions: {
//               CO2: parseFloat(data.CO2) || 0,
//               FGas: parseFloat(data.FGas) || 0,
//               N2O: parseFloat(data.N2O) || 0,
//               CH4: parseFloat(data.CH4) || 0
//             }
//           });
//         }
//       })
//       .on('end', async () => {
//         try {
//           await Emission.insertMany(results);
//           console.log('CSV data successfully imported into MongoDB.');
//         } catch (error) {
//           console.error('Error importing data:', error);
//         }
//       });
//   }
// await importCSV("ghg-emissions-dataset.csv")
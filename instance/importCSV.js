// const ObjectId = mongoose.Types.ObjectId;

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
const express = require('express');
const router = express.Router();
const Sector = require("../models/Sector");

router.get("/", async(req, res) => {
    try {
      const sectors = await Sector.find();
      res.json(sectors);
    } catch (err) {
      console.log(err)
    }
  })

module.exports = router;
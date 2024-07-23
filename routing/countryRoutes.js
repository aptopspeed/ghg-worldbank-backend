const express = require('express');
const router = express.Router();
const Country = require("../models/Country")

router.get("/", async(req, res, next) => {
    try {
      const countries = await Country.find();
      res.json(countries);
    } catch (err) {
      next(err);
    }
  })

module.exports = router;
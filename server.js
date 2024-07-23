const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const connectDB = require("./instance/connectDB");
const errorHandler = require("./errorHandler");

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(express.json());

app.use("/api/sectors", require("./routing/sectorRoutes"));
app.use("/api/countries", require("./routing/countryRoutes"));
app.use("/api/emissions", require("./routing/emissionRoutes"))

app.use(errorHandler);

const PORT = process.env.PORT

app.listen(PORT, async () => {
  try {
    await connectDB()
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
})
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5175",
  ],
  credentials: true,
}));
app.use(express.json());

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { dbName: 'MobileFinancialService' })
  .then(() => console.log("Server is Connected to Database"))
  .catch(err => console.log("Server is NOT connected to Database", err.message));

// Routes
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Mobile Financial Service (MFS) application backend is running");
});

app.listen(port, () => {
  console.log(`Mobile Financial Service (MFS) application running in ${port}`);
});

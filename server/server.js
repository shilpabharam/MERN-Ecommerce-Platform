require('dotenv').config(); // must be first
console.log(process.env.MONGO_URI)
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const app = express();
app.listen(4000, () => console.log("Server running on port 4000"));
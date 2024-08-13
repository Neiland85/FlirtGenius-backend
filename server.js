require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const uri = "mongodb+srv://bookingnadarecords:LTltqZFVhxeCte3b@kazemcluster1-shard-00-01.na4a1.mongodb.net/KAZEMDatabase1?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Successfully connected to MongoDB using Mongoose!");
})
.catch(err => {
  console.error("Error connecting to MongoDB: ", err);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


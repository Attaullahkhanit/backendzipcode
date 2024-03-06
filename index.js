const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

// middle ware plugin 
app.use(express.urlencoded({extended: false}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/savedzipcodedatabase')
.then(() => console.log("MongoDB Connected"))
.catch((error) => console.log("Mongo Error", error))

// Define a schema for the data
const savedZipCodeSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  distance: {
    type: String
  },
  duration: {
    type: String
  },
});
const SavedZipCode = mongoose.model('SavedZipCode', savedZipCodeSchema);

app.use(bodyParser.json());
app.post('/api/save-zip-code', async (req, res) => {
  try {
    const { origin, destination, distance, duration } = req.body;
    const savedZipCode = new SavedZipCode({
      origin,
      destination,
      distance,
      duration,
    });
    await savedZipCode.save();
    console.log('Data saved to the database:', savedZipCode);
    res.status(201).json(savedZipCode);
  } catch (error) {
    console.error('Error saving data to the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/get-saved-zip-codes', async (req, res) => {
  try {
    const savedZipCodes = await SavedZipCode.find();
    res.status(200).json(savedZipCodes);
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


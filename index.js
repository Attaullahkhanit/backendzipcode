const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const PORT = 7000;

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/zipcodedatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define MongoDB Schema and Model
const userSchema = new mongoose.Schema({
  zipCode: String,
  routes: [String],
});

const User = mongoose.model('User', userSchema);

// API routes
app.post('/api/users', async (req, res) => {
  try {
    const { zipCode, routes } = req.body;
    const newUser = new User({ zipCode, routes });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Zip code search route
app.get('/api/zip-codes/search', async (req, res) => {
  const { start, end } = req.query;

  try {
    const result = await User.find({
      zipCode: { $gte: start, $lte: end },
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

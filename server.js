const express = require('express');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Replace with your domain name
const WEBAPP_URL = 'https://www.epochie.com/';

// MongoDB connection (update with your credentials)
mongoose.connect('mongodb+srv://epochieajmv8726:A8*M4*J9*V7*@epochie.cefvi.mongodb.net/?retryWrites=true&w=majority&appName=Epochie')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve all static files from the root folder
app.use(express.static(path.join(__dirname)));

// Define a schema
const contactSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  message: String,
  time: { type: Date, default: Date.now }
});

// Create a model
const Contact = mongoose.model('Contact', contactSchema);

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/Hackathon', (req, res) => {
  res.sendFile(path.join(__dirname, 'hackathon.html'));
});

app.get('/TermsAndConditions', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms.html'));
});

app.get('/Privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get('/NotFound404', (req, res) => {
  res.sendFile(path.join(__dirname, '404.html'));
});

app.get('/*', (req, res) => {
  res.redirect('/NotFound404');
});

// Handle form submission
app.post('/submit-form', (req, res) => {
  const { fullName, email, phone, message } = req.body;

  const newContact = new Contact({
    fullName,
    email,
    phone,
    message,
  });

  newContact.save()
    .then(() => {
      res.redirect('/'); // Redirecting to the homepage after submission
    })
    .catch(err => {
      res.status(400).send('Error: ' + err.message);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Cron job to ping the server every 4 minutes to keep it active
cron.schedule('*/4 * * * *', () => {
  console.log('Pinging the server to keep it active...');
  axios.get(`${WEBAPP_URL}checkHealth`)
    .then(response => {
      console.log("Server is good");
    })
    .catch(err => {
      console.error('Error pinging the server:', err);
    });
});

// Health check endpoint
app.get('/checkHealth', (req, res) => {
  res.status(200).json("All ok!!!");
});

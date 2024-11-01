const express = require('express');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios'); // Import axios
const app = express();
const PORT = 3000;

// Replace with your domain name
const WEBAPP_URL = 'https://www.epochie.com/';

// Serve all static files from the root folder
app.use(express.static(path.join(__dirname)));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Cron job to ping the server every 3 minute to keep it active
cron.schedule('*/3 * * * *', () => {
  console.log('Pinging the server to keep it active...');
  axios.get(`${WEBAPP_URL}checkHealth`)
    .then(response => {
      console.log(`Server response: ${response.data}`);
    })
    .catch(err => {
      console.error('Error pinging the server:', err);
    });
});

// Health check endpoint
app.get('/checkHealth', (req, res) => {
  res.status(200).json("All ok!!!");
});

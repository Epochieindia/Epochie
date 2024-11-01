const express = require('express');
const path = require('path');
const cron = require('node-cron');
const app = express();
const PORT = 3000;

// Serve all static files from the root folder
app.use(express.static(path.join(__dirname)));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Cron job to ping the server every 1 minutes to keep it active
cron.schedule('*/1 * * * *', () => {
  console.log('Pinging the server to keep it active...');
  fetch(`${WEBAPP_URL}checkHealth`,{method: 'GET'})
      .then(res => res.text())
      .then(body => console.log(`Server response: ${body}`))
      .catch(err => console.error('Error pinging the server:', err));
});

app.get('/checkHealth',(req,res)=>{
  res.status(200).json("All ok!!!");
})

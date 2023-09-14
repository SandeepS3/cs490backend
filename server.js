const express = require('express');
const cors = require('cors');
const app = express();
const port = 8383;

const corsOptions = {
    origin: 'http://localhost:5500',
  };
  
  app.use(cors(corsOptions));

// Define a simple route
app.get('/api/hello', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
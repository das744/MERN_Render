const express = require('express');
const path = require('path');
const app = express();

// Middleware to serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

// All other routes will be handled by React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

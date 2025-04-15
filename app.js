const express = require('express');
const app = express();

// Set the port
const port = 8080;

// Simple route to send a message to the browser
app.get('/', (req, res) => {
    res.send('SIT737 - Cloud Native Application Deployment');  // Updated message
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

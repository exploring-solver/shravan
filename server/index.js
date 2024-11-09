const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./config/db');  // Import DB connection
const { setupWebSocket } = require('./config/websocket');  // WebSocket setup
const http = require('http');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);

// Setup WebSocket for real-time communication with pip module
setupWebSocket(server);

// Import routes
const projectRoutes = require('./routes/projectRoutes');
const commandRoutes = require('./routes/commandRoutes');
const courseRoutes = require('./src/course-crafty/routes/courseRoutes');
const translationRoutes = require('./src/course-crafty/routes/translationRoutes');
const osCommandRoutes = require('./routes/osCommandRoutes');
const utilRoutes = require('./routes/utilRoutes');
const authRoutes = require('./routes/authRoutes');

// Main route
app.get('/', (req, res) => {
  res.json("Hello there!! This is Bylexa (G.O.A.T.) The Large Multi-Action Model");
});

// Additional routes
app.use('/api/projects', projectRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/os-commands', osCommandRoutes);
app.use('/api/util', utilRoutes);
app.use('/api/auth', authRoutes);

// Start the server and listen on all network interfaces (0.0.0.0)
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

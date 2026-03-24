const path = require("path");
require('node:dns').setServers(['8.8.8.8', '1.1.1.1']); 
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Make sure this is v4+
const ejsMate = require('ejs-mate');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// EJS setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session store with MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ // Correct way for v4+
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days
  }
}));

// Routes
app.use('/', authRoutes);
app.use('/tasks', taskRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
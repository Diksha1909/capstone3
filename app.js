// app.js
const path = require("path");
require('node:dns').setServers(['8.8.8.8', '1.1.1.1']); 
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const ejsMate = require('ejs-mate');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// ---------- MongoDB Connection ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// ---------- EJS Setup ----------
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Session Setup (FileStore) ----------
app.use(session({
  store: new FileStore({
    path: './sessions',       // folder to store session files
    ttl: 14 * 24 * 60 * 60    // 14 days in seconds
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days in milliseconds
  }
}));

// ---------- Routes ----------
app.use('/', authRoutes);
app.use('/tasks', taskRoutes);

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;     // Use Render port if deployed
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
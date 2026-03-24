const path = require("path");
require('node:dns').setServers(['8.8.8.8', '1.1.1.1']); 

require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsMate = require('ejs-mate');




const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB Connected"))
  .catch(err=>console.log(err));
app.engine('ejs', ejsMate); // use ejs-mate as engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}));

app.use('/', authRoutes);
app.use('/tasks', taskRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
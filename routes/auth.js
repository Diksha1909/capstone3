const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const User = require('../models/User');
router.get('/register',(req,res)=>{
  res.render('register');
});

router.post('/register', async (req,res)=>{
  const {username,password} = req.body;
  const user = new User({username,password});
  await user.save();
  res.redirect('/login');
});

router.get('/',(req,res)=>{
  res.render('login');
});

router.post('/login', async (req,res)=>{
  const {username,password} = req.body;
  const user = await User.findOne({username});

  if(!user) return res.send("User not found");

  const match = await bcrypt.compare(password,user.password);

  if(!match) return res.send("Wrong password");

  req.session.userId = user._id;
  res.redirect('/tasks');
});

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;

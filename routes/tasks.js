const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res)=>{
  const tasks = await Task.find({userId:req.session.userId});
  res.render('dashboard', { 
        tasks: tasks, 
        userId: req.session.userId
    });
});

router.post('/add', auth, async (req,res)=>{
  await Task.create({
    title:req.body.title,
    userId:req.session.userId
  });
  res.redirect('/tasks');
});

router.get('/complete/:id', auth, async (req,res)=>{
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.redirect('/tasks');
});

router.get('/delete/:id', auth, async (req,res)=>{
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/tasks');
});

module.exports = router;
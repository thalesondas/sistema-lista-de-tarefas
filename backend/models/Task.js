const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  cost: { type: Number, required: true }, 
  deadline: { type: Date, required: true },
  order: { type: Number, required: true }
}, {
  timestamps: false
});

const Task = mongoose.model('Task', taskSchema, 'task');

module.exports = Task;
// models/Command.js

const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  parameters: {
    type: [String], // Array of parameter names
    default: []
  }
}, { timestamps: true });

commandSchema.index({ project: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Command', commandSchema);

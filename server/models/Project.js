const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  currentCommand: {
    type: String,
    default: null
  },
  parameters: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

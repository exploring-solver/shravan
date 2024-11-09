const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  voiceover: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  createdAt: { type: Date, default: Date.now }
});

const Lecture = mongoose.model('Lecture', lectureSchema);
module.exports = Lecture;

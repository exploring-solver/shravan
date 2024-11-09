const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  language: String,
  instructorId: mongoose.Schema.Types.ObjectId,
  lessons: [
    {
      title: String,
      content: String,
      translatedContent: String,
      images: [String],
      animations: [String],
      voiceovers: [String],
      lectureNotes: String,
    },
  ],
});

module.exports = mongoose.model('Course', CourseSchema);

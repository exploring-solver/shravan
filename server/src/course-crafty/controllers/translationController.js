const aiService = require('../services/aiService');

exports.translateCourse = async (req, res) => {
  try {
    const { courseId, targetLanguage } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const prompt = `Translate the following course content into ${targetLanguage}: "${course.description}"`;
    const translatedContent = await aiService.translateContent(prompt, targetLanguage);

    course.language = targetLanguage;
    course.description = translatedContent;
    await course.save();

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to translate course' });
  }
};

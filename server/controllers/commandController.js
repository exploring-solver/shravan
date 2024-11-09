const Command = require('../models/Command');
const { getAssistantResponse } = require('../services/aiService');

exports.createCommand = async (req, res) => {
  const { project, name, description, action, parameters } = req.body;
  try {
    const command = new Command({ project, name, description, action, parameters });
    await command.save();
    res.status(201).json(command);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCommandsByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const commands = await Command.find({ project: projectId });
    res.json(commands);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCommand = async (req, res) => {
  const { commandId } = req.params;
  const { name, description, action, parameters } = req.body;
  try {
    const command = await Command.findByIdAndUpdate(
      commandId,
      { name, description, action, parameters },
      { new: true }
    );
    if (!command) {
      return res.status(404).json({ error: 'Command not found' });
    }
    res.json(command);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCommand = async (req, res) => {
  const { commandId } = req.params;
  try {
    const command = await Command.findByIdAndDelete(commandId);
    if (!command) {
      return res.status(404).json({ error: 'Command not found' });
    }
    res.json({ message: 'Command deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.handleAssistantCommand = async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: "Command is required" });
  }

  try {
    const response = await getAssistantResponse(command);
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get assistant response' });
  }
};
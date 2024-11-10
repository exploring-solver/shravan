const Project = require('../models/Project');
const Command = require('../models/Command');
const aiService = require('../services/aiService');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = new Project({ name, description });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
};
exports.parseCode = async (req, res) => {
  const { projectId } = req.params;
  const { code } = req.body;

  try {
    // Updated regex to match functions with various parameter formats and whitespace
    const functionRegex = /(?:void|int|float|double|char|bool)\s+(\w+)\s*\(\s*([^)]+)?\s*\)\s*{/g;
    let match;
    const commands = [];

    // Iterate through all matches found in the code
    while ((match = functionRegex.exec(code)) !== null) {
      const commandName = match[1]; // Function name
      const paramsString = match[2] || ''; // Parameters as a string (can be empty)

      // Split parameters and trim whitespace
      const paramsArray = paramsString
        .split(',')
        .map(param => param.trim())
        .filter(param => param.length > 0); // Filter out empty strings

      commands.push({
        project: projectId,
        name: commandName,
        description: `Executes the ${commandName} function`,
        action: commandName,
        parameters: paramsArray,
      });
    }

    // Save the commands to the database
    await Command.insertMany(commands);

    res.json({ message: 'Commands parsed and saved successfully', commandsCount: commands.length });
  } catch (error) {
    console.error('Error parsing code:', error);
    res.status(500).json({ error: 'Failed to parse code and create commands' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { name, description },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Also delete all commands associated with this project
    await Command.deleteMany({ project: projectId });
    res.json({ message: 'Project and associated commands deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.executeCommand = async (req, res) => {
  const { projectId } = req.params;
  const { command } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const availableCommands = await Command.find({ project: projectId });
    const commandNames = availableCommands.map(cmd => cmd.name);
    
    // Step 1: Interpret the command name
    const interpretedCommandResult = await aiService.interpretCommand(command, commandNames);
    
    if (interpretedCommandResult) {
      const { commandName } = interpretedCommandResult;
      
      // Step 2: Check if the command exists and has parameters
      const matchedCommand = availableCommands.find(cmd => cmd.name === commandName);
      if (matchedCommand) {
        let parameters = [];
        
        if (matchedCommand.parameters && matchedCommand.parameters.length > 0) {
          // Step 3: Get parameter values from AI service
          parameters = await aiService.getParameterValues(command, matchedCommand.parameters);
        }
        
        // Step 4: Update the current command and parameters
        project.currentCommand = matchedCommand.action;
        project.parameters = parameters; // Optionally store parameters in the project
        await project.save();
        
        // Step 5: Prepare the execution payload
        const executionPayload = {
          command: matchedCommand.action,
          parameters: parameters.join(', '), // Adjust as needed
        };
        
        // Step 6: Send the command to the microcontroller
        // await sendToMicrocontroller(executionPayload);
        
        res.json({
          status: 'Command executed',
          action: matchedCommand.action,
          parameters: parameters,
        });
      } else {
        res.status(400).json({ error: 'Interpreted command not found in available commands' });
      }
    } else {
      res.status(400).json({ error: 'Unable to interpret command' });
    }
  } catch (error) {
    console.error('Error executing command:', error);
    res.status(500).json({ error: 'Failed to execute command' });
  }
};

exports.getCurrentCommand = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.currentCommand) {
      res.json({
        command: project.currentCommand,
        parameters: project.parameters || [], // Return parameters or an empty array if none
      });
    } else {
      res.status(400).json({ error: 'No command available' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

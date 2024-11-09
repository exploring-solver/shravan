const { spawn } = require('child_process');

// Function to process OS-level commands via Python subprocess
exports.processOSCommand = async (command) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['scripts/os_interaction.py', JSON.stringify(command)]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
};

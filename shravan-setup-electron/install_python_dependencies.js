const { exec } = require('child_process');
const path = require('path');
const config = require('./config.json');

module.exports = async function installPythonDependencies() {
  return new Promise((resolve, reject) => {
    exec(
      `${config.pythonPath} -m pip install shravan ollama`,
      { cwd: path.resolve(__dirname) },
      (error, stdout, stderr) => {
        if (error) reject(stderr);
        resolve(stdout);
      }
    );
  });
};

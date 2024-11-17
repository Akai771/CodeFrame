const fs = require('fs');
const path = require('path');

function validateInput(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  try {
    fs.accessSync(inputPath, fs.constants.R_OK);
  } catch (error) {
    throw new Error(`Input file is not readable: ${inputPath}`);
  }

  const validInputExtensions = ['.js', '.py', '.java', '.cpp', '.html', '.css', '.rb', '.go', '.rs', '.ts'];
  const validOutputExtensions = ['.png', '.jpg', '.jpeg'];
  
  const inputExt = path.extname(inputPath).toLowerCase();
  const outputExt = path.extname(outputPath).toLowerCase();

  if (!validInputExtensions.includes(inputExt)) {
    throw new Error(`Unsupported input file type: ${inputExt}`);
  }

  if (!validOutputExtensions.includes(outputExt)) {
    throw new Error(`Unsupported output file type: ${outputExt}`);
  }

  const outputDir = path.dirname(outputPath);
  
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    fs.accessSync(outputDir, fs.constants.W_OK);
  } catch (error) {
    throw new Error(`Output directory is not writable: ${outputDir}`);
  }
}

module.exports = { validateInput };
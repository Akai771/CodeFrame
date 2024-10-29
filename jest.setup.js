const fs = require('fs');
const path = require('path');
const treeKill = require('tree-kill');

const testOutputDir = path.join(__dirname, 'test', 'output');

beforeAll(() => {
  // Create test output directory if it doesn't exist
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }
});

afterAll(async () => {
  // Clean up test output directory
  if (fs.existsSync(testOutputDir)) {
    fs.rmSync(testOutputDir, { recursive: true, force: true });
  }
});

// Helper function to kill process and children
global.killProcess = (pid) => {
  return new Promise((resolve, reject) => {
    treeKill(pid, 'SIGKILL', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
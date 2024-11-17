const fs = require('fs');
const path = require('path');
const treeKill = require('tree-kill');

const testOutputDir = path.join(__dirname, 'test', 'output');

beforeAll(() => {
  if (!fs.existsSync(testOutputDir)) {
    fs.mkdirSync(testOutputDir, { recursive: true });
  }
});

afterAll(async () => {
  if (fs.existsSync(testOutputDir)) {
    fs.rmSync(testOutputDir, { recursive: true, force: true });
  }
});

global.killProcess = (pid) => {
  return new Promise((resolve, reject) => {
    treeKill(pid, 'SIGKILL', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
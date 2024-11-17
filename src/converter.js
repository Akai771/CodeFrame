const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { highlightCode } = require('./utils/highlight');
const { validateInput } = require('./utils/validation');
const { generateHTML } = require('./utils/image');

class Converter {
  constructor(options) {
    this.options = options;
    this.browser = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        timeout: 60000
      });
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async convertFile(inputPath, outputPath) {
    try {
      validateInput(inputPath, outputPath);
      
      const code = fs.readFileSync(inputPath, 'utf-8');
      const language = this.options.language || path.extname(inputPath).slice(1);
      
      return await this.convertString(code, outputPath, language);
    } catch (error) {
      throw new Error(`File conversion failed: ${error.message}`);
    }
  }

  async convertString(code, outputPath, language) {
    try {
      await this.initialize();
      
      const highlighted = highlightCode(code, language);
      const html = generateHTML(highlighted, this.options);
      
      const page = await this.browser.newPage();
      await page.setContent(html);
      
      const element = await page.$('.snippet-container');
      await element.screenshot({
        path: outputPath,
        omitBackground: !this.options.background
      });
      
      await page.close();
      return outputPath;
    } catch (error) {
      throw new Error(`String conversion failed: ${error.message}`);
    }
  }
}

module.exports = Converter;
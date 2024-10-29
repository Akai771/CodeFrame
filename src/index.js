const Converter = require('./converter');
const themes = require('./themes');

class Snapcode {
  constructor(options = {}) {
    this.options = {
      theme: options.theme || 'monokai',
      padding: options.padding || 32,
      fontSize: options.fontSize || 14,
      lineNumbers: options.lineNumbers !== false,
      background: options.background || true,
      language: options.language || null,
      ...options
    };

    this.converter = new Converter(this.options);
  }

  async convertFile(inputPath, outputPath) {
    return this.converter.convertFile(inputPath, outputPath);
  }

  async convertString(code, outputPath, language) {
    return this.converter.convertString(code, outputPath, language);
  }

  getThemes() {
    return Object.keys(themes);
  }
}

module.exports = Snapcode;
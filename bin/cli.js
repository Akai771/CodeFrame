#!/usr/bin/env node

// bin/cli.js
const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Codeframe = require('../src/index');
const packageJson = require('../package.json');

// Utility function to handle errors
function handleError(error) {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
}

// Utility function to validate theme
function validateTheme(theme) {
  const codeframe = new Codeframe();
  const availableThemes = codeframe.getThemes();
  
  if (!availableThemes.includes(theme)) {
    throw new Error(
      `Invalid theme: "${theme}". Available themes: ${availableThemes.join(', ')}`
    );
  }
  return theme;
}

// Utility function to validate number inputs
function validateNumber(value, name) {
  const number = parseInt(value, 10);
  if (isNaN(number) || number < 0) {
    throw new Error(`${name} must be a positive number`);
  }
  return number;
}

// Utility function to process a single file
async function processFile(inputPath, options) {
  const codeframe = new Codeframe({
    theme: options.theme,
    padding: options.padding,
    fontSize: options.fontSize,
    lineNumbers: options.lineNumbers,
    background: options.background,
    language: options.language
  });

  const outputPath = options.output || generateOutputPath(inputPath);
  
  console.log(chalk.blue('Processing:'), inputPath);
  console.log(chalk.blue('Output:'), outputPath);
  
  try {
    await codeframe.convertFile(inputPath, outputPath);
    console.log(chalk.green('✓ Success!'));
    return true;
  } catch (error) {
    console.error(chalk.red('✗ Failed:'), error.message);
    return false;
  }
}

// Utility function to generate output path
function generateOutputPath(inputPath) {
  const dir = path.dirname(inputPath);
  const basename = path.basename(inputPath, path.extname(inputPath));
  return path.join(dir, `${basename}.png`);
}

// Setup the CLI program
program
  .name('codeframe')
  .description('Convert code files into beautiful snippets')
  .version(packageJson.version);

// Main convert command
program
  .command('convert')
  .description('Convert a code file to a snippet image')
  .argument('<files...>', 'input file(s) to convert')
  .option('-o, --output <path>', 'output file path (only for single file)')
  .option('-t, --theme <theme>', 'color theme', 'monokai')
  .option('-p, --padding <pixels>', 'padding in pixels', '32')
  .option('-f, --font-size <pixels>', 'font size in pixels', '14')
  .option('-l, --language <lang>', 'force specific language')
  .option('--no-line-numbers', 'hide line numbers')
  .option('--no-background', 'transparent background')
  .action(async (files, options) => {
    try {
      // Validate options
      options.theme = validateTheme(options.theme);
      options.padding = validateNumber(options.padding, 'Padding');
      options.fontSize = validateNumber(options.fontSize, 'Font size');

      // Check if output is specified with multiple files
      if (options.output && files.length > 1) {
        throw new Error('Output path can only be specified when converting a single file');
      }

      // Process all files
      const results = await Promise.all(files.map(file => processFile(file, options)));
      
      // Summary
      const successful = results.filter(Boolean).length;
      const failed = results.length - successful;
      
      console.log('\nSummary:');
      console.log(chalk.green(`✓ ${successful} successful`));
      if (failed > 0) {
        console.log(chalk.red(`✗ ${failed} failed`));
        process.exit(1);
      }
    } catch (error) {
      handleError(error);
    }
  });

// List available themes
program
  .command('themes')
  .description('List available themes')
  .action(() => {
    try {
      const codeframe = new Codeframe();
      const themes = codeframe.getThemes();
      
      console.log('\nAvailable themes:');
      themes.forEach(theme => {
        console.log(chalk.blue('•'), theme);
      });
    } catch (error) {
      handleError(error);
    }
  });

// Watch command for automatic conversion
program
  .command('watch')
  .description('Watch files for changes and convert automatically')
  .argument('<files...>', 'files or directories to watch')
  .option('-t, --theme <theme>', 'color theme', 'monokai')
  .option('-p, --padding <pixels>', 'padding in pixels', '32')
  .option('-f, --font-size <pixels>', 'font size in pixels', '14')
  .option('--no-line-numbers', 'hide line numbers')
  .option('--no-background', 'transparent background')
  .action((files, options) => {
    try {
      // Validate options
      options.theme = validateTheme(options.theme);
      options.padding = validateNumber(options.padding, 'Padding');
      options.fontSize = validateNumber(options.fontSize, 'Font size');

      console.log(chalk.blue('Watching for changes...'));
      
      files.forEach(file => {
        fs.watch(file, async (eventType, filename) => {
          if (eventType === 'change') {
            console.log(chalk.yellow('\nFile changed:'), filename);
            await processFile(file, options);
          }
        });
      });

      // Keep process alive
      process.stdin.resume();
      
      // Handle interruption
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\nStopping watch mode...'));
        process.exit(0);
      });
    } catch (error) {
      handleError(error);
    }
  });

// Batch convert command
program
  .command('batch')
  .description('Convert all code files in a directory')
  .argument('<directory>', 'directory containing code files')
  .option('-r, --recursive', 'include subdirectories')
  .option('-t, --theme <theme>', 'color theme', 'monokai')
  .option('-p, --padding <pixels>', 'padding in pixels', '32')
  .option('-f, --font-size <pixels>', 'font size in pixels', '14')
  .option('--no-line-numbers', 'hide line numbers')
  .option('--no-background', 'transparent background')
  .action(async (directory, options) => {
    try {
      // Validate options
      options.theme = validateTheme(options.theme);
      options.padding = validateNumber(options.padding, 'Padding');
      options.fontSize = validateNumber(options.fontSize, 'Font size');

      const files = [];
      
      // Function to recursively get files
      function getFiles(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && options.recursive) {
            getFiles(fullPath);
          } else if (entry.isFile() && /\.(js|py|java|cpp|rb|go|rs|ts)$/i.test(entry.name)) {
            files.push(fullPath);
          }
        }
      }

      console.log(chalk.blue('Scanning directory:'), directory);
      getFiles(directory);
      
      if (files.length === 0) {
        console.log(chalk.yellow('No compatible files found'));
        return;
      }

      console.log(chalk.blue(`Found ${files.length} files to convert\n`));
      
      // Process all files
      const results = await Promise.all(files.map(file => processFile(file, options)));
      
      // Summary
      const successful = results.filter(Boolean).length;
      const failed = results.length - successful;
      
      console.log('\nBatch Summary:');
      console.log(chalk.green(`✓ ${successful} successful`));
      if (failed > 0) {
        console.log(chalk.red(`✗ ${failed} failed`));
        process.exit(1);
      }
    } catch (error) {
      handleError(error);
    }
  });

// Parse command line arguments
program.parse();
# CodeFrame

CodeFrame is a powerful tool for converting code files into beautifully styled image snippets. It features CLI support, syntax highlighting, and customizable themes.

## Features
- **Syntax Highlighting**: Supports multiple languages using `highlight.js`.
- **Customizable Themes**: Choose from Monokai, GitHub, and Dracula themes.
- **CLI Tool**: Easily convert code files from the command line.
- **Customization Options**: Adjust padding, font size, background, and line numbers.

## Installation

### Install Globally
```bash
npm install -g codeframe-snap
```

### Install Locally
```bash
npm install codeframe-snap
```

## Usage

### CLI Command
Use the `codeframe` command to convert a code file into an image:

```bash
codeframe convert <file> -o <output.png>
```

### Example
```bash
codeframe convert example.js -o example.png
```

### Options
- `-t, --theme <theme>`: Select a theme (`monokai`, `github`, `dracula`). Default is `monokai`.
- `-p, --padding <pixels>`: Set padding (in pixels). Default is `32`.
- `-f, --font-size <pixels>`: Set font size (in pixels). Default is `14`.
- `--no-line-numbers`: Hide line numbers.
- `--no-background`: Use a transparent background.

## Themes
Available themes:
- **Monokai**
- **GitHub**
- **Dracula**
- **OceanWave**
- **Duotone**
- **AyuDark**

## Development

### Running Tests
Run the test suite using:
```bash
npm run test
```

## Contributing
Contributions are welcome! If you have suggestions or find issues, feel free to create an issue or pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Author
Rishabh Shetty

function generateHTML(highlightedCode, options) {
  const theme = require(`../themes/${options.theme}`).colors;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .snippet-container {
            background-color: ${theme.background};
            padding: ${options.padding}px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: ${options.fontSize}px;
            line-height: 1.5;
            display: inline-block;
          }
          .code-content {
            display: flex;
          }
          .code {
            color: ${theme.text};
          }
          .hljs-comment { color: ${theme.comment}; }
          .hljs-keyword { color: ${theme.keyword}; }
          .hljs-string { color: ${theme.string}; }
          .hljs-number { color: ${theme.number}; }
          .hljs-function { color: ${theme.function}; }
          .hljs-class { color: ${theme.class}; }
        </style>
      </head>
      <body style="margin: 0;">
        <div class="snippet-container">
          <div class="code-content">
            ${options.lineNumbers ? `
              <pre class="line-numbers" style="color: ${theme.lineNumber}; margin-right: 16px; text-align: right; user-select: none; min-width: 1.5em;">
                ${generateLineNumbers(highlightedCode)}
              </pre>` : ''}
            <pre class="code">${highlightedCode}</pre>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateLineNumbers(code) {
  const lines = code.split('\n').length;
  return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
}

module.exports = { generateHTML };
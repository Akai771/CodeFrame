const hljs = require('highlight.js');

function highlightCode(code, language) {
  // Handle null, undefined or non-string input
  if (!code) {
    return '';
  }

  // Convert to string if not already
  const codeStr = String(code);

  try {
    // Check if the specified language is loaded and available in hljs
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(codeStr, { language }).value;
    }
    // If no language is specified or it's not supported, auto-detect
    return hljs.highlightAuto(codeStr).value;
  } catch (error) {
    console.error("Highlight.js Error:", error);
    // Fallback to plain text if highlighting fails
    return codeStr;
  }
}

module.exports = { highlightCode };

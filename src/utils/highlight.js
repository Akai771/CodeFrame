const hljs = require('highlight.js');

function highlightCode(code, language) {
  if (!code) {
    return '';
  }

  const codeStr = String(code);

  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(codeStr, { language }).value;
    }
    return hljs.highlightAuto(codeStr).value;
  } catch (error) {
    console.error("Highlight.js Error:", error);
    return codeStr;
  }
}

module.exports = { highlightCode };

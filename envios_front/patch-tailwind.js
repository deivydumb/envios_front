const fs = require('fs');
const path = require('path');

const content = `module.exports = require('tailwindcss');`;
const dirPath = path.join('node_modules', '@tailwindcss', 'postcss');

fs.mkdirSync(dirPath, { recursive: true });
fs.writeFileSync(path.join(dirPath, 'index.js'), content);
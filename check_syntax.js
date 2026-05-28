import fs from 'fs';

const htmlValue = fs.readFileSync('index.html', 'utf8');

// Use regex to locate content of script tags, particularly the large interactive one.
const matches = htmlValue.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);

let count = 0;
for (const match of matches) {
  const scriptContent = match[1];
  count++;
  console.log(`Checking script block #${count}...`);
  try {
    // Attempt parsing by creating a Function
    new Function(scriptContent);
    console.log(`Script block #${count} parsed successfully!`);
  } catch (err) {
    console.error(`Error parsing script block #${count}:`, err);
    // Let's print the line numbers by splitting index.html and estimating the script location
    const scriptStartIdx = htmlValue.indexOf(scriptContent);
    const linesBefore = htmlValue.substring(0, scriptStartIdx).split('\n').length;
    console.log(`Script block starts around line ${linesBefore} of index.html`);
    
    // Let's find exactly which line fails by testing lines incrementally or parsing with eval/VM
    const scriptLines = scriptContent.split('\n');
    for (let testLen = 1; testLen <= scriptLines.length; testLen++) {
      try {
        new Function(scriptLines.slice(0, testLen).join('\n'));
      } catch (subErr) {
        if (!subErr.message.includes('Unexpected end of input') && !subErr.message.includes('missing }') && !subErr.message.includes('is not defined') && !subErr.message.includes('Unexpected token')) {
          // This might be the actual syntax error, or it's just incomplete block.
        }
        // Let's print the error and a few lines around it
        console.log(`Failure at relative line ${testLen} (approx line ${linesBefore + testLen} in index.html): ${subErr.message}`);
        console.log(`Code: ${scriptLines[testLen - 1]}`);
        break;
      }
    }
  }
}

const fs = require('fs');
const path = require('path');

// Define the directories to search
const directories = ['1Genres', '2Countries', '3Other'];

// Function to get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(file));
    }
  });

  return arrayOfFiles;
}

// Function to generate JavaScript arrays
function generateArrays(dirPath, arrayName) {
  const allFiles = getAllFiles(dirPath);
  let jsArray = `${arrayName} = [\n`;

  allFiles.forEach((file, index) => {
    jsArray += `  "${file.replace(dirPath + '/', '')}"`;
    if (index < allFiles.length - 1) {
      jsArray += ',';
    }
    jsArray += '\n';
  });

  jsArray += '];\n';

  return jsArray;
}

// Write the JavaScript file
const outputPath = 'charts.js';

fs.writeFileSync(
  outputPath,
  generateArrays(directories[0], 'chartsGenres') +
    generateArrays(directories[1], 'chartContries') +
    generateArrays(directories[2], 'chartOthers')
);

console.log(`JavaScript file saved to ${outputPath}`);

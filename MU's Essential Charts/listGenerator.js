const fs = require('fs');
const path = require('path');

// Define the root directory where the script is located
const rootDirectory = __dirname;

// Function to get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Function to generate JavaScript arrays for all subfolders
function generateArrays(rootDir) {
  const subfolders = fs.readdirSync(rootDir);
  const jsArrays = [];

  // Create a list of "Lists Created"
  const listsCreated = subfolders.map((subfolder) => `"${subfolder}"`);
  jsArrays.push(`const ListsCreated = [\n  ${listsCreated.join(',\n  ')}\n];`);

  // Generate JavaScript arrays for all subfolders
  subfolders.forEach((subfolder) => {
    const subfolderPath = path.join(rootDir, subfolder);
    if (fs.statSync(subfolderPath).isDirectory()) {
      const allFiles = getAllFiles(subfolderPath);
      const jsArray = [];

      allFiles.forEach((file) => {
        jsArray.push(`"${path.basename(file)}"`);
      });

      jsArrays.push(`${subfolder} = [\n  ${jsArray.join(',\n  ')}\n];`);
    }
  });

  return jsArrays.join('\n\n');
}

// Generate JavaScript arrays for all subfolders in the root directory
const outputFileName = 'lists.js';
const outputPath = path.join(rootDirectory, outputFileName);
const listsContent = generateArrays(rootDirectory);

fs.writeFileSync(outputPath, listsContent);

console.log(`JavaScript lists file saved to ${outputPath}`);

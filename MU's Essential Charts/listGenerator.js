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

// Function to generate a single JavaScript array with subarrays
function generateArrays(rootDir) {
  const subfolders = fs.readdirSync(rootDir);
  const jsArray = [];

  // Loop through subfolders
  subfolders.forEach((subfolder) => {
    const subfolderPath = path.join(rootDir, subfolder);
    if (fs.statSync(subfolderPath).isDirectory()) {
      const allFiles = getAllFiles(subfolderPath);
      const subArray = [];

      // Loop through files in the subfolder
      allFiles.forEach((file) => {
        subArray.push(`"${path.basename(file)}"`);
      });

      jsArray.push(`"${subfolder}" : [\n  ${subArray.join(',\n  ')}\n]`);
    }
  });

  return `{${jsArray.join(',\n')}}`;
}

// Generate the single JavaScript array with subarrays
const outputFileName = 'lists.js';
const outputPath = path.join(rootDirectory, outputFileName);
const listsContent = generateArrays(rootDirectory);

fs.writeFileSync(outputPath, `const ListsCreated = ${listsContent};`);

console.log(`JavaScript lists file saved to ${outputPath}`);

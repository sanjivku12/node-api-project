
console.log("Hello, World!");
console.log("File structure loaded successfully!");

// Basic Node.js application
const fs = require('fs');
const path = require('path');

// Function to display current directory contents
function showFileStructure() {
    try {
        const files = fs.readdirSync('.');
        console.log("\nCurrent directory contents:");
        files.forEach(file => {
            const stats = fs.statSync(file);
            const type = stats.isDirectory() ? '[DIR]' : '[FILE]';
            console.log(`${type} ${file}`);
        });
    } catch (error) {
        console.error("Error reading directory:", error.message);
    }
}

showFileStructure();

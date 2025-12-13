#!/usr/bin/env node

/**
 * Script to convert Kaggle CSV dataset to JSON format
 * Usage: node scripts/convert-dataset.js input.csv output.json
 */

const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = process.argv[3] || path.join(__dirname, '../public/data/fragrances.json');

if (!inputFile) {
  console.error('Usage: node scripts/convert-dataset.js <input.csv> [output.json]');
  process.exit(1);
}

try {
  const csvContent = fs.readFileSync(inputFile, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }
  
  // Detect delimiter - check if semicolon or comma is used
  const firstLine = lines[0];
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ';' : ',';
  
  console.log(`Detected delimiter: ${delimiter === ';' ? 'semicolon' : 'comma'}`);
  
  // Parse headers
  const headerLine = lines[0];
  const headers = [];
  let currentHeader = '';
  let inQuotes = false;
  
  for (let i = 0; i < headerLine.length; i++) {
    const char = headerLine[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      headers.push(currentHeader.trim());
      currentHeader = '';
    } else {
      currentHeader += char;
    }
  }
  if (currentHeader) headers.push(currentHeader.trim());
  
  console.log(`Found ${headers.length} columns: ${headers.slice(0, 5).join(', ')}...`);
  
  const data = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const row = {};
    let currentValue = '';
    let inQuotes = false;
    let headerIndex = 0;
    
    // Parse CSV row handling quoted values
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        if (headerIndex < headers.length) {
          row[headers[headerIndex]] = currentValue.trim();
          headerIndex++;
        }
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    // Add last value
    if (headerIndex < headers.length) {
      row[headers[headerIndex]] = currentValue.trim();
    }
    
    data.push(row);
  }
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`✅ Converted ${data.length} records from ${inputFile} to ${outputFile}`);
} catch (error) {
  console.error('Error converting dataset:', error);
  process.exit(1);
}


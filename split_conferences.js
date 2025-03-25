import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the original YAML file
const originalYaml = fs.readFileSync('./src/data/conferences.yml', 'utf8');

// Parse the YAML into a JavaScript object (array of conferences)
const conferences = yaml.load(originalYaml);

// Create the conferences directory if it doesn't exist
const conferenceDir = './src/data/conferences';
if (!fs.existsSync(conferenceDir)) {
  fs.mkdirSync(conferenceDir, { recursive: true });
}

// Process each conference
conferences.forEach(conference => {
  if (!conference.id) {
    console.warn(`Conference ${conference.title} has no ID, skipping`);
    return;
  }
  
  // Create a file name based on the conference ID
  const fileName = `${conference.id}.yml`;
  const filePath = path.join(conferenceDir, fileName);
  
  // Convert the conference object back to YAML
  const conferenceYaml = yaml.dump(conference, { 
    lineWidth: -1,  // Don't wrap lines
    noRefs: true,   // Don't use reference tags
    quotingType: '"' // Use double quotes for strings
  });
  
  // Write the YAML to a file
  fs.writeFileSync(filePath, conferenceYaml);
  console.log(`Created ${fileName}`);
});

console.log(`Split ${conferences.length} conferences into individual files.`); 
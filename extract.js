import extract from 'extract-zip';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    await extract(path.join(__dirname, 'public/codigo-polycovers.zip'), { dir: path.join(__dirname, 'public/projects') });
    console.log("Extracted successfully!");
  } catch (err) {
    console.error("Error extracting:", err);
  }
}
main();

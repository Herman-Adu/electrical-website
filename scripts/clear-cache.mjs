import fs from 'fs';
import path from 'path';

const dirs = [
  '/vercel/share/v0-project/.next',
  '/vercel/share/v0-project/.turbo',
  '/vercel/share/v0-project/node_modules/.cache'
];

console.log('Clearing build caches...');

for (const dir of dirs) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✓ Cleared ${dir}`);
    }
  } catch (err) {
    console.log(`⚠ Could not clear ${dir}: ${err.message}`);
  }
}

console.log('Build cache cleared. Next.js will rebuild on next request.');

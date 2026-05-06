import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SVG_PATH = 'public/favicon.svg';
const OUTPUT_DIR = 'public';

async function generateIcons() {
    if (!fs.existsSync(SVG_PATH)) {
        console.error('favicon.svg not found in public/');
        return;
    }

    console.log('Generating icons from favicon.svg...');

    // Generate apple-touch-icon.png (180x180)
    await sharp(SVG_PATH)
        .resize(180, 180)
        .png()
        .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png');

    // Generate favicon.png (32x32)
    await sharp(SVG_PATH)
        .resize(32, 32)
        .png()
        .toFile(path.join(OUTPUT_DIR, 'favicon-32.png'));
    console.log('✓ Generated favicon-32.png');

    console.log('Icon generation complete!');
}

generateIcons().catch(console.error);

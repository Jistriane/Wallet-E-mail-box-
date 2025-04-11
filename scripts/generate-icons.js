const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 64, 192, 512];
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(publicDir, 'logo.svg'));
  
  // Gerar favicon.ico
  await sharp(svgBuffer)
    .resize(64, 64)
    .toFile(path.join(publicDir, 'favicon.ico'));
  
  // Gerar logo192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'logo192.png'));
  
  // Gerar logo512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo512.png'));
  
  // Gerar apple-touch-icon.png
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  
  console.log('Ícones gerados com sucesso!');
}

generateIcons().catch(console.error); 
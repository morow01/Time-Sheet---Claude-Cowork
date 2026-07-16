const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'mockups', 'tetra-layout-no-labels.jpg');
const buffer = fs.readFileSync(filePath);

let offset = 2; // skip SOI
while (offset < buffer.length) {
  if (buffer[offset] !== 0xFF) {
    break; // invalid JPEG
  }
  const marker = buffer[offset + 1];
  if (marker === 0xD9 || marker === 0xDA) {
    break; // End of image or Start of scan
  }
  const length = buffer.readUInt16BE(offset + 2);
  
  // SOF0 (Start of Frame, baseline DCT) is 0xC0
  // SOF2 (Start of Frame, progressive DCT) is 0xC2
  if (marker === 0xC0 || marker === 0xC2) {
    const height = buffer.readUInt16BE(offset + 5);
    const width = buffer.readUInt16BE(offset + 7);
    console.log(`Dimensions: ${width}x${height}`);
    process.exit(0);
  }
  offset += 2 + length;
}
console.log('SOF marker not found');

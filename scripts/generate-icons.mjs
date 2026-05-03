import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, '../public/icons/icon.svg');
const svgBuffer = readFileSync(svgPath);

// PWA icons
await sharp(svgBuffer).resize(180, 180).png().toFile(join(__dirname, '../public/icons/icon-180.png'));
console.log('icon-180.png generated');

await sharp(svgBuffer).resize(192, 192).png().toFile(join(__dirname, '../public/icons/icon-192.png'));
console.log('icon-192.png generated');

await sharp(svgBuffer).resize(512, 512).png().toFile(join(__dirname, '../public/icons/icon-512.png'));
console.log('icon-512.png generated');

// favicon.ico (16x16 + 32x32 PNG embedded in ICO container)
const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();

const numImages = 2;
const headerSize = 6;
const entrySize = 16;
const dataOffset = headerSize + entrySize * numImages;
const buf = Buffer.alloc(dataOffset + png16.length + png32.length);

buf.writeUInt16LE(0, 0);
buf.writeUInt16LE(1, 2);
buf.writeUInt16LE(numImages, 4);

// entry: 16x16
buf.writeUInt8(16, 6);
buf.writeUInt8(16, 7);
buf.writeUInt8(0, 8);
buf.writeUInt8(0, 9);
buf.writeUInt16LE(1, 10);
buf.writeUInt16LE(32, 12);
buf.writeUInt32LE(png16.length, 14);
buf.writeUInt32LE(dataOffset, 18);

// entry: 32x32
buf.writeUInt8(32, 22);
buf.writeUInt8(32, 23);
buf.writeUInt8(0, 24);
buf.writeUInt8(0, 25);
buf.writeUInt16LE(1, 26);
buf.writeUInt16LE(32, 28);
buf.writeUInt32LE(png32.length, 30);
buf.writeUInt32LE(dataOffset + png16.length, 34);

png16.copy(buf, dataOffset);
png32.copy(buf, dataOffset + png16.length);

writeFileSync(join(__dirname, '../src/app/favicon.ico'), buf);
console.log('favicon.ico generated');

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const expected = [
  ["images/iphone-wallpaper.png", 1290, 2796],
  ["images/ipad-air-11-wallpaper.png", 1640, 2360],
  ["images/ipad-air-11-wallpaper-landscape.png", 2360, 1640],
  ["images/mac-wallpaper.png", 3456, 2234]
];

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString("hex");
  assert.strictEqual(signature, "89504e470d0a1a0a", `${filePath} is not a PNG`);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

for (const [relativePath, width, height] of expected) {
  const filePath = path.join(__dirname, "..", relativePath);
  assert.ok(fs.existsSync(filePath), `Missing output: ${relativePath}`);
  const size = readPngSize(filePath);
  assert.strictEqual(size.width, width, `Unexpected width for ${relativePath}`);
  assert.strictEqual(size.height, height, `Unexpected height for ${relativePath}`);
}

console.log("All generated wallpapers exist and match expected dimensions.");

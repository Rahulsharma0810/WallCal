const path = require("path");
const { execSync } = require("child_process");
const { createCanvas } = require("canvas");
const macConfig = require("../configs/mac");
const { MONTH_NAMES } = require("../lib/wallpaper-theme");
const { validateWallpaperConfig } = require("../lib/wallpaper-config");
const { createDateState, drawDotCalendarGrid, drawProgressText, ensureDir, fillBackground, writeImage } = require("../lib/wallpaper-renderer");

const CONFIG = validateWallpaperConfig({
  ...macConfig,
  monthNames: MONTH_NAMES
});

const canvas = createCanvas(CONFIG.width, CONFIG.height);
const ctx = canvas.getContext("2d");
const dateState = createDateState();

fillBackground(ctx, CONFIG.width, CONFIG.height, CONFIG.gradientColors);
drawDotCalendarGrid(ctx, CONFIG, dateState);
drawProgressText(ctx, CONFIG, dateState);

const imagesDir = path.join(__dirname, "..", "images");
ensureDir(imagesDir);
const desktopPath = path.join(imagesDir, CONFIG.outputName);
writeImage(canvas, desktopPath);

if (!process.env.CI) {
  execSync(`osascript -e 'tell application "System Events" to set picture of every desktop to ""'`);
  execSync(`osascript -e 'tell application "System Events" to set picture of every desktop to "${desktopPath}"'`);
  console.log("Wallpaper set successfully");
} else {
  console.log("CI environment detected, skipping AppleScript wallpaper setting.");
}

console.log("Wallpaper generated");

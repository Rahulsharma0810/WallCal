const path = require("path");
const { createCanvas } = require("canvas");
const iphoneConfig = require("../configs/iphone");
const { MONTH_NAMES, FONT_FAMILY } = require("../lib/wallpaper-theme");
const { validateWallpaperConfig } = require("../lib/wallpaper-config");
const { createDateState, drawDotCalendarGrid, drawProgressText, fillBackground, writeImage } = require("../lib/wallpaper-renderer");

const CONFIG = validateWallpaperConfig({
  ...iphoneConfig,
  monthNames: MONTH_NAMES,
  fontFamily: FONT_FAMILY
});

const canvas = createCanvas(CONFIG.width, CONFIG.height);
const ctx = canvas.getContext("2d");
const dateState = createDateState();

fillBackground(ctx, CONFIG.width, CONFIG.height, CONFIG.gradientColors);
drawDotCalendarGrid(ctx, CONFIG, dateState);
drawProgressText(ctx, CONFIG, dateState);
writeImage(canvas, path.join(__dirname, "..", "images", CONFIG.outputName));

const path = require("path");
const { createCanvas } = require("canvas");
const ipadLandscapeConfig = require("../configs/ipad-landscape");
const { MONTH_NAMES } = require("../lib/wallpaper-theme");
const { validateWallpaperConfig } = require("../lib/wallpaper-config");
const { createDateState, drawDotCalendarGrid, drawProgressText, fillBackground, writeImage } = require("../lib/wallpaper-renderer");

const CONFIG = validateWallpaperConfig({
  ...ipadLandscapeConfig,
  monthNames: MONTH_NAMES
});

const canvas = createCanvas(CONFIG.width, CONFIG.height);
const ctx = canvas.getContext("2d");
const dateState = createDateState();

fillBackground(ctx, CONFIG.width, CONFIG.height, CONFIG.gradientColors);
drawDotCalendarGrid(ctx, CONFIG, dateState);
drawProgressText(ctx, CONFIG, dateState);
writeImage(canvas, path.join(__dirname, "..", "images", CONFIG.outputName));

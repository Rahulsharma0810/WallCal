// ======================================================
// Rahul MacBook Calendar Wallpaper PRO (Node edition)
// No Unsplash, pure local, super stable
// ======================================================

// ======================================================
// CONFIG PARAMETERS
// ======================================================

const CONFIG = {
  // Screen dimensions - width and height of the wallpaper in pixels (MacBook Pro 14/16 Retina)
  // UPDATED: Set to your specific screen resolution to avoid blur
  WIDTH: 3456,
  HEIGHT: 2234,

  // Background gradient colors - start and end colors for the dark gradient background
  BG_COLOR_START: "#1c1c1e",
  BG_COLOR_END: "#2c2c2e",

  // Font sizes - text sizes for month headers, date numbers, and default text
  MONTH_SIZE: 36,
  DATE_SIZE: 26,
  DEFAULT_TEXT_SIZE: 32,

  // Layout percentages - ratios for positioning content on screen (horizontal start, width, vertical start, height)
  START_X_RATIO: 0.30,        // Start calendar content (centered)
  CONTENT_WIDTH_RATIO: 0.40,   // Reduced from 0.50 to un-stretch
  START_Y_RATIO: 0.35,         // Clear the clock
  MAX_CONTENT_HEIGHT_RATIO: 0.38, // Compressed vertically

  // Header - height allocated for progress bar and events, offset for progress bar positioning
  HEADER_HEIGHT: 80,           // Space for the top progress bar
  PROGRESS_BAR_OFFSET: 40,     // Gap above months
  PROGRESS_BAR_POSITION: 'top',
  BOTTOM_PROGRESS_BAR_OFFSET: 80, 

  // Calendar grid - number of columns and rows, spacing between calendar blocks
  COLS: 4,     // 4 months per row
  ROWS: 3,     // 3 rows of months
  GAP_X: 50,   // Increased horizontal gap
  GAP_Y: 40,   // Vertical gap between calendar blocks
  GRID_STEP_X_RATIO: 1/7.0,    // Horizontal spacing ratio for date grid within each month
  GRID_STEP_Y_RATIO: 1/8.0,    // Vertical spacing ratio for date grid within each month

  // Colors - various text and UI element colors
  TEXT_COLOR_DEFAULT: "#e5e5ea",      // Default text color for general text
  TEXT_COLOR_MONTH: "#f5f5f7",        // Color for month name headers
  TEXT_COLOR_WEEKEND: "#8e8e93",      // Color for weekend date numbers
  TEXT_COLOR_TODAY: "#ffffff",        // Color for today's date number
  TEXT_COLOR_SPENT: "rgba(255,255,255,0.12)", // Color for past months/days
  TODAY_HIGHLIGHT_COLOR: "#ff3b30",   // Background circle color for today's date
  PROGRESS_BAR_COLOR: "#32d74b",      // Fill color for year progress bar
  PROGRESS_TRACK_COLOR: "rgba(255,255,255,0.15)", // Background track color for progress bar
  EVENT_TEXT_COLOR: "#ffcc00",        // Color for calendar event text
  NO_EVENTS_COLOR: "#8e8e93",         // Color for "no events" message
  PROGRESS_TEXT_COLOR: "#aeaeb2",     // Color for progress percentage text

  // Font - default font family for all text rendering
  DEFAULT_FONT: "Arial",

  // Event bullet - symbol used to prefix calendar events
  EVENT_BULLET: "• ",

  // Grid offsets - ratios and sizes for calendar date grid positioning
  GRID_TOTAL_W_RATIO: 6,      // Total width ratio for the 7-day grid (6 intervals)
  HIGHLIGHT_RADIUS: 16,       // Radius of the circle highlighting today's date
  TEXT_SIZE_EVENT: 20,        // Font size for calendar event text
  TEXT_SIZE_PROGRESS: 30,     // Font size for year progress text

  // Feature toggles - enable/disable specific wallpaper features
  SHOW_EVENTS: false,          // Whether to display calendar events in the header
};

const fs = require("fs");
const { execSync } = require("child_process");
const { createCanvas } = require("canvas");





// ======================================================
// CANVAS
// ======================================================

// Retina scale factor
// Set to 1 for 1:1 pixel mapping (Sharpest on "Default" resolution)
// Set to 2 if you want supersampling (can be softer due to OS downscaling)
const SCALE = 1;

// create high-res canvas
const canvas = createCanvas(CONFIG.WIDTH * SCALE, CONFIG.HEIGHT * SCALE);
const ctx = canvas.getContext("2d");

// scale everything automatically
ctx.scale(SCALE, SCALE);

// ======================================================
// BACKGROUND
// ======================================================

const grad = ctx.createLinearGradient(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
grad.addColorStop(0, CONFIG.BG_COLOR_START); // Darker, cleaner
grad.addColorStop(1, CONFIG.BG_COLOR_END);

ctx.fillStyle = grad;
ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);


// ======================================================
// DATE INFO
// ======================================================

const now = new Date();
const CY = now.getFullYear();
const CM = now.getMonth();
const CD = now.getDate();

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];


// ======================================================
// DRAW HELPERS
// ======================================================

function text(str,x,y,size=CONFIG.DEFAULT_TEXT_SIZE,color=CONFIG.TEXT_COLOR_DEFAULT, align="start", font=CONFIG.DEFAULT_FONT, baseline="alphabetic"){
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px "${font}", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(str,x,y);
  ctx.textAlign = "start"; // Reset
  ctx.textBaseline = "alphabetic"; // Reset
}

// ======================================================
// SAVE + SET WALLPAPER
// ======================================================

function setWallpaper(){
  const imagesDir = `${__dirname}/images`;
  if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
  }

  // Common drawing setup
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
  
  drawHeader();
  drawCalendar();

  // Save desktop wallpaper (static name)
  const desktopPath = `${imagesDir}/mac-wallpaper.png`;
  fs.writeFileSync(desktopPath, canvas.toBuffer("image/png"));

  // Set desktop wallpaper (Force refresh by setting to empty first)
  if (!process.env.CI) {
    execSync(`osascript -e 'tell application "System Events" to set picture of every desktop to ""'`);
    execSync(`osascript -e 'tell application "System Events" to set picture of every desktop to "${desktopPath}"'`);
    console.log("Wallpaper set successfully ✅");
  } else {
    console.log("CI environment detected, skipping AppleScript wallpaper setting. ✅");
  }
}

// ======================================================
// CALENDAR GRID
// ======================================================

function drawHeader(){
  const startXGlobal = CONFIG.WIDTH * CONFIG.START_X_RATIO;
  const contentWidth = CONFIG.WIDTH * CONFIG.CONTENT_WIDTH_RATIO;
  const startYGlobal = CONFIG.HEIGHT * CONFIG.START_Y_RATIO;

  const start = new Date(CY,0,1);
  const end = new Date(CY+1,0,1);
  const percent = (now-start)/(end-start);

  // Match calendar width
  const barW = contentWidth;
  const barX = startXGlobal;
  const barY = startYGlobal - 50;
  const textY = barY - 20;

  // Track (Subtle matching line)
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(barX, barY, barW, 6);

  // Fill (Active progress)
  ctx.fillStyle = CONFIG.PROGRESS_BAR_COLOR;
  ctx.fillRect(barX, barY, barW * percent, 6);

  // Text (Centered over the bar)
  const daysLeft = Math.floor((end-now)/(1000*60*60*24));
  const weeksLeft = Math.ceil(daysLeft / 7);
  
  text(
    `${Math.floor(percent*100)}% . ${daysLeft} Days Left . ${weeksLeft} Weeks Left`,
    barX + (barW/2),
    textY,
    18, 
    CONFIG.PROGRESS_TEXT_COLOR,
    "center"
  );
}


// ======================================================
// CALENDAR GRID
// ======================================================

function drawCalendar(){

  // LAYOUT CONFIG - CENTER 40% FOCUS (Horizontal) + VERTICAL CENTERING
  const startXGlobal = CONFIG.WIDTH * CONFIG.START_X_RATIO;
  const contentWidth = CONFIG.WIDTH * CONFIG.CONTENT_WIDTH_RATIO;

  // Vertical Constraints
  const startYGlobal = CONFIG.HEIGHT * CONFIG.START_Y_RATIO;
  const maxContentHeight = CONFIG.HEIGHT * CONFIG.MAX_CONTENT_HEIGHT_RATIO;

  let calendarStartY = startYGlobal + CONFIG.HEADER_HEIGHT;
  let calendarHeight = maxContentHeight - CONFIG.HEADER_HEIGHT;

  const cols = CONFIG.COLS;
  const rows = CONFIG.ROWS;
  const gapX = CONFIG.GAP_X;
  const gapY = CONFIG.GAP_Y;

  // Dimensions
  const blockW = (contentWidth - ((cols-1) * gapX)) / cols;
  const blockH = (calendarHeight - ((rows-1) * gapY)) / rows;

  // Font Sizes
  const MONTH_SIZE = CONFIG.MONTH_SIZE;
  const DATE_SIZE = CONFIG.DATE_SIZE;

  // Grid Spacing within a block
  const gridStepX = blockW * CONFIG.GRID_STEP_X_RATIO;
  const gridStepY = blockH * CONFIG.GRID_STEP_Y_RATIO;

  let monthIndex = 0;

  for(let r=0; r<rows; r++){
    for(let c=0; c<cols; c++){

      const m = monthIndex; // Always Jan-Dec
      const year = CY;

      const startX = startXGlobal + (c * (blockW + gapX));
      const startY = calendarStartY + (r * (blockH + gapY));

      const isSpentMonth = m < CM;

      // 1. Month Label
      const centerX = startX + (blockW/2);
      const monthColor = isSpentMonth ? CONFIG.TEXT_COLOR_SPENT : CONFIG.TEXT_COLOR_MONTH;
      text(months[m], centerX, startY + 25, MONTH_SIZE, monthColor, "center");

      // 2. Dates
      const days = new Date(year,m+1,0).getDate();
      const first = new Date(year,m,1).getDay(); // Sun=0
      const offset = (first+6)%7; // Mon start

      const gridStartY = startY + 65;

      for(let d=1; d<=days; d++){
        const idx = offset + (d-1);
        const rowInMonth = Math.floor(idx/7);
        const colInMonth = idx % 7;

        const gridTotalW = CONFIG.GRID_TOTAL_W_RATIO * gridStepX;
        const gridOffsetX = (blockW - gridTotalW) / 2;

        const x = startX + gridOffsetX + (colInMonth * gridStepX);
        const y = gridStartY + (rowInMonth * gridStepY);

        const dow = new Date(year,m,d).getDay();
        const isWeekend = (dow===0 || dow===6);
        const isSpentDay = isSpentMonth || (m === CM && d < CD);

        // Highlight TODAY
        if(d===CD && m===CM && year===now.getFullYear()){
          ctx.beginPath();
          ctx.arc(x, y, CONFIG.HIGHLIGHT_RADIUS, 0, Math.PI*2);
          ctx.fillStyle = CONFIG.TODAY_HIGHLIGHT_COLOR;
          ctx.fill();
          text(d.toString(), x, y, DATE_SIZE, CONFIG.TEXT_COLOR_TODAY, "center", CONFIG.DEFAULT_FONT, "middle");
        }
        else {
          let color = isWeekend ? CONFIG.TEXT_COLOR_WEEKEND : CONFIG.TEXT_COLOR_MONTH;
          if (isSpentDay) color = CONFIG.TEXT_COLOR_SPENT;
          text(d.toString(), x, y, DATE_SIZE, color, "center", CONFIG.DEFAULT_FONT, "middle");
        }
      }
      monthIndex++;
    }
  }
}




// ======================================================
// MAIN
// ======================================================

setWallpaper();

console.log("Wallpaper generated ✅");

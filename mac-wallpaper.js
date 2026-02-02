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
  MONTH_SIZE: 40,
  DATE_SIZE: 30,
  DEFAULT_TEXT_SIZE: 44,

  // Layout percentages - ratios for positioning content on screen (horizontal start, width, vertical start, height)
  START_X_RATIO: 0.25,        // Start calendar content at 15% from left edge
  CONTENT_WIDTH_RATIO: 0.50,   // Use 70% of screen width for calendar content
  START_Y_RATIO: 0.26,         // Start content at 20% from top
  MAX_CONTENT_HEIGHT_RATIO: 0.53, // Use 45% of screen height for content

  // Header - height allocated for progress bar and events, offset for progress bar positioning
  HEADER_HEIGHT: 50,
  PROGRESS_BAR_OFFSET: 30,
  PROGRESS_BAR_POSITION: 'bottom', // 'top', 'bottom', or 'login_screen' - where to place the progress bar
  BOTTOM_PROGRESS_BAR_OFFSET: 80, // Offset from bottom when progress bar is at bottom

  // Calendar grid - number of columns and rows, spacing between calendar blocks
  COLS: 4,     // 4 months per row
  ROWS: 3,     // 3 rows of months
  GAP_X: 30,   // Horizontal gap between calendar blocks
  GAP_Y: 40,   // Vertical gap between calendar blocks
  GRID_STEP_X_RATIO: 1/7.0,    // Horizontal spacing ratio for date grid within each month
  GRID_STEP_Y_RATIO: 1/8.5,    // Vertical spacing ratio for date grid within each month

  // Colors - various text and UI element colors
  TEXT_COLOR_DEFAULT: "#e5e5ea",      // Default text color for general text
  TEXT_COLOR_MONTH: "#f5f5f7",        // Color for month name headers
  TEXT_COLOR_WEEKEND: "#8e8e93",      // Color for weekend date numbers
  TEXT_COLOR_TODAY: "#ffffff",        // Color for today's date number
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
  HIGHLIGHT_RADIUS: 18,       // Radius of the circle highlighting today's date
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

function text(str,x,y,size=CONFIG.DEFAULT_TEXT_SIZE,color=CONFIG.TEXT_COLOR_DEFAULT, align="start", font=CONFIG.DEFAULT_FONT){
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px "${font}", sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(str,x,y);
  ctx.textAlign = "start"; // Reset
}

// ======================================================
// SAVE + SET WALLPAPER
// ======================================================

function setWallpaper(){
  // Create images directory if it doesn't exist
  const imagesDir = `${__dirname}/images`;
  if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
  }

  // Save desktop wallpaper (progress bar higher up)
  CONFIG.PROGRESS_BAR_POSITION = 'login_screen';
  drawHeader();
  const desktopPath = `${imagesDir}/mac-wallpaper.png`;
  fs.writeFileSync(desktopPath, canvas.toBuffer("image/png"));

  // Set desktop wallpaper
  execSync(`osascript -e 'tell application "System Events" to set picture of every desktop to "${desktopPath}"'`);
  console.log("Desktop wallpaper set successfully ✅");

  // Save lock screen wallpaper (progress bar at bottom)
  // Reset canvas to remove previous progress bar
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,CONFIG.WIDTH,CONFIG.HEIGHT);
  drawCalendar(); // Redraw calendar without progress bar
  CONFIG.PROGRESS_BAR_POSITION = 'bottom';
  drawHeader(); // Draw progress bar in new position
  const lockscreenPath = `${imagesDir}/mac-lockscreenwallpaper.png`;
  fs.writeFileSync(lockscreenPath, canvas.toBuffer("image/png"));

  // Set lock screen wallpaper
  execSync(`osascript -e 'tell application "System Events" to set picture of every desktop to "${lockscreenPath}"' && killall Dock`);
  console.log("Lock screen wallpaper set successfully ✅");
}

// ======================================================
// CALENDAR GRID
// ======================================================

function drawHeader(){

  const startXGlobal = CONFIG.WIDTH * CONFIG.START_X_RATIO;
  const contentWidth = CONFIG.WIDTH * CONFIG.CONTENT_WIDTH_RATIO;

  const start = new Date(CY,0,1);
  const end = new Date(CY+1,0,1);
  const percent = (now-start)/(end-start);

  const barW = contentWidth;
  const barX = startXGlobal;

  let barY, textY;

  // ======================================================
  // POSITION LOGIC
  // ======================================================

  if(CONFIG.PROGRESS_BAR_POSITION === 'bottom'){

    barY = CONFIG.HEIGHT - CONFIG.BOTTOM_PROGRESS_BAR_OFFSET;

  }
  else if(CONFIG.PROGRESS_BAR_POSITION === 'login_screen'){

    // ⭐ Slightly up from bottom (for login screen)
    // Adjust this value to move progress bar higher up
    barY = CONFIG.HEIGHT - (CONFIG.BOTTOM_PROGRESS_BAR_OFFSET * 3);

  }
  else { // top

    barY = CONFIG.HEIGHT * CONFIG.START_Y_RATIO + CONFIG.PROGRESS_BAR_OFFSET;

  }

  textY = barY - 18;


  // ======================================================
  // DRAW BAR
  // ======================================================

  // Track
  ctx.fillStyle = CONFIG.PROGRESS_TRACK_COLOR;
  ctx.fillRect(barX, barY, barW, 8);

  // Fill
  ctx.fillStyle = CONFIG.PROGRESS_BAR_COLOR;
  ctx.fillRect(barX, barY, barW * percent, 8);


  // ======================================================
  // TEXT
  // ======================================================

  const daysLeft = Math.floor((end-now)/(1000*60*60*24));

  text(
    `${CY} Progress: ${Math.floor(percent*100)}%  •  ${daysLeft} days left`,
    barX + (barW/2),
    textY,
    CONFIG.TEXT_SIZE_PROGRESS,
    CONFIG.PROGRESS_TEXT_COLOR,
    "center"
  );


  // ======================================================
  // EVENTS (only for top)
  // ======================================================

  if(CONFIG.SHOW_EVENTS && CONFIG.PROGRESS_BAR_POSITION === 'top'){

    const events = getEvents();

    let evY = textY - 35;

    events.forEach(e=>{
      text(CONFIG.EVENT_BULLET + e, barX + barW, evY, CONFIG.TEXT_SIZE_EVENT, CONFIG.EVENT_TEXT_COLOR, "end");
      evY -= 25;
    });
  }
}


// ======================================================
// CALENDAR GRID
// ======================================================

function drawCalendar(){

  // LAYOUT CONFIG - CENTER 40% FOCUS (Horizontal) + VERTICAL CENTERING
  const startXGlobal = CONFIG.WIDTH * CONFIG.START_X_RATIO;
  const contentWidth = CONFIG.WIDTH * CONFIG.CONTENT_WIDTH_RATIO;

  // Vertical Constraints - adjust based on progress bar position
  const startYGlobal = CONFIG.HEIGHT * CONFIG.START_Y_RATIO;
  const maxContentHeight = CONFIG.HEIGHT * CONFIG.MAX_CONTENT_HEIGHT_RATIO;

  let calendarStartY = startYGlobal;
  let calendarHeight = maxContentHeight;

  // Only push down when progress is at TOP
  if(CONFIG.PROGRESS_BAR_POSITION === 'top'){
    calendarStartY += CONFIG.HEADER_HEIGHT;
    calendarHeight -= CONFIG.HEADER_HEIGHT;
  }

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

      const m = (CM + monthIndex) % 12;
      const year = CY + Math.floor((CM+monthIndex)/12);

      const startX = startXGlobal + (c * (blockW + gapX));
      const startY = calendarStartY + (r * (blockH + gapY));

      // 1. Month Label
      const centerX = startX + (blockW/2);
      text(months[m], centerX, startY + 30, MONTH_SIZE, CONFIG.TEXT_COLOR_MONTH, "center");

      // 2. Dates
      const days = new Date(year,m+1,0).getDate();
      const first = new Date(year,m,1).getDay(); // Sun=0
      const offset = (first+6)%7; // Mon start

      const gridStartY = startY + 80;

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

        // Highlight TODAY
        if(d===CD && m===CM && year===now.getFullYear()){
          ctx.beginPath();
          ctx.arc(x, y - (DATE_SIZE/3), CONFIG.HIGHLIGHT_RADIUS, 0, Math.PI*2);
          ctx.fillStyle = CONFIG.TODAY_HIGHLIGHT_COLOR;
          ctx.fill();
          text(d.toString(), x, y, DATE_SIZE, CONFIG.TEXT_COLOR_TODAY, "center");
        }
        else {
          const color = isWeekend ? CONFIG.TEXT_COLOR_WEEKEND : CONFIG.TEXT_COLOR_MONTH;
          text(d.toString(), x, y, DATE_SIZE, color, "center");
        }
      }
      monthIndex++;
    }
  }
}




// ======================================================
// MAIN
// ======================================================

// Draw calendar once (common to both wallpapers)
drawCalendar();

// Save wallpapers with different progress bar positions
setWallpaper();

console.log("Wallpaper generated ✅");

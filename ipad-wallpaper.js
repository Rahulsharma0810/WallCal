const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

const CONFIG = {
  // iPad Air 11-inch (M2) native resolution in portrait orientation.
  width: 1640,
  height: 2360,

  monthsToShow: 12,
  monthsPerRow: 3,
  monthOffset: 0,
  startFromJanuary: true,

  firstDayOfWeek: 1,
  highlightWeekends: false,

  gradientColors: ["#191919", "#181818", "#181818"],

  grid: {
    topPaddingRatio: 0.305,
    monthGapYRatio: 0.016,
    monthGapXRatio: 0.06,
    monthLabelSizeRatio: 0.03,
    dotSpacingRatio: 0.028,
    dotRadiusRatio: 0.0067
  },

  progress: {
    show: true,
    textSizeRatio: 0.029,
    bottomInsetRatio: 0.12,
    textOffsetAboveBar: 0
  },

  colors: {
    text: "#8b8b90",
    pastDay: "#f2f2f2",
    futureDay: "#49494c",
    weekend: "#4d4d51",
    today: "#ff6a3d",
    stats: "#ff6a3d",
    secondaryText: "#7f7f84",
    pastAlpha: 1
  }
};

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const canvas = createCanvas(CONFIG.width, CONFIG.height);
const ctx = canvas.getContext("2d");

function fillBackground() {
  const gradient = ctx.createLinearGradient(0, 0, CONFIG.width, CONFIG.height);
  gradient.addColorStop(0, CONFIG.gradientColors[0]);
  gradient.addColorStop(0.5, CONFIG.gradientColors[1]);
  gradient.addColorStop(1, CONFIG.gradientColors[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
}

function getDayColor(year, month, day) {
  const isPast =
    year < currentYear ||
    (year === currentYear && (month < currentMonth || (month === currentMonth && day < currentDay)));

  const isToday = year === currentYear && month === currentMonth && day === currentDay;

  if (isToday) {
    return { color: CONFIG.colors.today, alpha: 1 };
  }

  if (isPast) {
    return { color: CONFIG.colors.pastDay, alpha: CONFIG.colors.pastAlpha };
  }

  const dayOfWeek = new Date(year, month, day).getDay();
  const isWeekend = CONFIG.highlightWeekends && (dayOfWeek === 0 || dayOfWeek === 6);

  return {
    color: isWeekend ? CONFIG.colors.weekend : CONFIG.colors.futureDay,
    alpha: 1
  };
}

function drawCalendarGrid() {
  const cols = CONFIG.monthsPerRow;
  const rows = Math.ceil(CONFIG.monthsToShow / cols);
  const topPadding = CONFIG.height * CONFIG.grid.topPaddingRatio;
  const monthGapX = CONFIG.width * CONFIG.grid.monthGapXRatio;
  const monthGapY = CONFIG.height * CONFIG.grid.monthGapYRatio;
  const dotSpacing = CONFIG.width * CONFIG.grid.dotSpacingRatio;
  const dotRadius = CONFIG.width * CONFIG.grid.dotRadiusRatio;
  const monthLabelSize = CONFIG.width * CONFIG.grid.monthLabelSizeRatio;

  const monthBlockWidth = dotSpacing * 6 + dotRadius * 2;
  const totalCalendarWidth = cols * monthBlockWidth + (cols - 1) * monthGapX;
  const startX = (CONFIG.width - totalCalendarWidth) / 2;
  const singleRowHeight = dotSpacing * 6 + monthLabelSize + monthGapY;

  for (let i = 0; i < CONFIG.monthsToShow; i++) {
    const colIndex = i % cols;
    const rowIndex = Math.floor(i / cols);
    const targetMonthIndex = CONFIG.startFromJanuary
      ? i
      : ((currentMonth + i + CONFIG.monthOffset) % 12 + 12) % 12;
    const blockX = startX + colIndex * (monthBlockWidth + monthGapX);
    const blockY = topPadding + rowIndex * singleRowHeight;

    ctx.globalAlpha = 1;
    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = `400 ${monthLabelSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(monthNames[targetMonthIndex], blockX - dotSpacing * 0.08, blockY);

    const daysInMonth = new Date(currentYear, targetMonthIndex + 1, 0).getDate();
    const firstDayWeek = new Date(currentYear, targetMonthIndex, 1).getDay();
    const startOffset = (firstDayWeek - CONFIG.firstDayOfWeek + 7) % 7;
    const dotStartY = blockY + monthLabelSize * 1.35;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = startOffset + day - 1;
      const gridX = dayIndex % 7;
      const gridY = Math.floor(dayIndex / 7);
      const x = blockX + gridX * dotSpacing + dotRadius;
      const y = dotStartY + gridY * dotSpacing + dotRadius;
      const fill = getDayColor(currentYear, targetMonthIndex, day);

      ctx.globalAlpha = fill.alpha;
      ctx.fillStyle = fill.color;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
}

function drawProgressBottom() {
  if (!CONFIG.progress.show) return;

  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear + 1, 0, 1);
  const totalDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24);
  const daysPassed = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, Math.floor(totalDays - daysPassed));
  const percent = Math.max(0, Math.min(1, daysPassed / totalDays));
  const percentText = Math.floor(percent * 100);
  const textSize = CONFIG.width * CONFIG.progress.textSizeRatio;
  const textY = CONFIG.height - CONFIG.height * CONFIG.progress.bottomInsetRatio;
  const leftText = `${daysLeft}d left`;
  const separator = " · ";
  const rightText = `${percentText}%`;

  ctx.font = `400 ${textSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const leftWidth = ctx.measureText(leftText).width;
  const separatorWidth = ctx.measureText(separator).width;
  const rightWidth = ctx.measureText(rightText).width;
  const totalWidth = leftWidth + separatorWidth + rightWidth;
  const startX = (CONFIG.width - totalWidth) / 2;

  ctx.fillStyle = CONFIG.colors.stats;
  ctx.fillText(leftText, startX, textY);

  ctx.fillStyle = CONFIG.colors.secondaryText;
  ctx.fillText(separator, startX + leftWidth, textY);
  ctx.fillText(rightText, startX + leftWidth + separatorWidth, textY);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeOutputs() {
  const output = canvas.toBuffer("image/png");
  const imagesDir = path.join(__dirname, "images");
  const screenshotsDir = path.join(__dirname, "screenshots");

  ensureDir(imagesDir);
  ensureDir(screenshotsDir);

  const imagePath = path.join(imagesDir, "ipad-air-11-wallpaper.png");
  const screenshotPath = path.join(screenshotsDir, "ipad-air-11-wallpaper.png");

  fs.writeFileSync(imagePath, output);
  fs.writeFileSync(screenshotPath, output);

  console.log(`Generated: ${imagePath}`);
  console.log(`Generated: ${screenshotPath}`);
}

function main() {
  fillBackground();
  drawCalendarGrid();
  drawProgressBottom();
  writeOutputs();
}

main();

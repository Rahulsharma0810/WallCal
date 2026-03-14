const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

const CONFIG = {
  width: 1290,
  height: 2796,

  monthsToShow: 12,
  monthsPerRow: 3,
  monthOffset: 0,
  startFromJanuary: true,

  firstDayOfWeek: 1,
  highlightWeekends: false,

  gradientColors: ["#15171b", "#14161a", "#14161a"],

  grid: {
    topPaddingRatio: 0.355,
    sidePaddingRatio: 0.11,
    monthGapYRatio: 0.03,
    monthGapXRatio: 0.088,
    monthLabelSizeRatio: 0.055,
    dotSpacingRatio: 0.0265,
    dotRadiusRatio: 0.0073
  },

  progress: {
    show: true,
    textSizeRatio: 0.05,
    barWidthRatio: 0.58,
    barHeight: 7,
    bottomInset: 230,
    textOffsetAboveBar: 20,
    showBar: false,
    secondaryColor: "#80838a",
    separatorColor: "#80838a"
  },

  colors: {
    text: "#8d9096",
    pastDay: "#e8e8e8",
    futureDay: "#404349",
    weekend: "#4a4d53",
    today: "#ff6a3d",
    stats: "#ff6a3d",
    progressTrack: "rgba(142,142,147,0.35)",
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
  const grad = ctx.createLinearGradient(0, 0, CONFIG.width, CONFIG.height);
  grad.addColorStop(0, CONFIG.gradientColors[0]);
  grad.addColorStop(0.5, CONFIG.gradientColors[1]);
  grad.addColorStop(1, CONFIG.gradientColors[2]);
  ctx.fillStyle = grad;
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
  const baseColor = isWeekend ? CONFIG.colors.weekend : CONFIG.colors.futureDay;

  return {
    color: baseColor,
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

  const monthBlockWidth = (dotSpacing * 6) + (dotRadius * 2);
  const totalCalendarWidth = (cols * monthBlockWidth) + ((cols - 1) * monthGapX);
  const startX = (CONFIG.width - totalCalendarWidth) / 2;

  const singleRowHeight = (dotSpacing * 6) + monthLabelSize + monthGapY;

  for (let i = 0; i < CONFIG.monthsToShow; i++) {
    const gridIndex = i;
    const colIndex = gridIndex % cols;
    const rowIndex = Math.floor(gridIndex / cols);

    const targetMonthIndex = CONFIG.startFromJanuary ? i : ((currentMonth + i + CONFIG.monthOffset) % 12 + 12) % 12;
    const targetYear = currentYear;

    const blockX = startX + colIndex * (monthBlockWidth + monthGapX);
    const blockY = topPadding + rowIndex * singleRowHeight;

    ctx.globalAlpha = 1;
    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = `400 ${monthLabelSize}px -apple-system, BlinkMacSystemFont, Segoe UI, Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(monthNames[targetMonthIndex], blockX - dotSpacing * 0.1, blockY);

    const daysInMonth = new Date(targetYear, targetMonthIndex + 1, 0).getDate();
    const firstDayWeek = new Date(targetYear, targetMonthIndex, 1).getDay();
    const startOffset = (firstDayWeek - CONFIG.firstDayOfWeek + 7) % 7;

    const dotStartY = blockY + monthLabelSize * 1.35;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = startOffset + day - 1;
      const gridX = dayIndex % 7;
      const gridY = Math.floor(dayIndex / 7);

      const x = blockX + gridX * dotSpacing + dotRadius;
      const y = dotStartY + gridY * dotSpacing + dotRadius;

      const fill = getDayColor(targetYear, targetMonthIndex, day);
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

  const barWidth = CONFIG.width * CONFIG.progress.barWidthRatio;
  const barHeight = CONFIG.progress.barHeight;
  const barX = (CONFIG.width - barWidth) / 2;
  const barY = CONFIG.height - CONFIG.progress.bottomInset - barHeight;

  const textSize = CONFIG.width * CONFIG.progress.textSizeRatio;
  const textY = barY - CONFIG.progress.textOffsetAboveBar;

  ctx.globalAlpha = 1;
  ctx.fillStyle = CONFIG.colors.stats;
  ctx.font = `400 ${textSize}px -apple-system, BlinkMacSystemFont, Segoe UI, Arial`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const leftText = `${daysLeft}d left`;
  const sepText = " · ";
  const rightText = `${percentText}%`;

  const leftWidth = ctx.measureText(leftText).width;
  const sepWidth = ctx.measureText(sepText).width;
  const rightWidth = ctx.measureText(rightText).width;
  const totalWidth = leftWidth + sepWidth + rightWidth;
  const startX = (CONFIG.width - totalWidth) / 2;

  ctx.fillStyle = CONFIG.colors.stats;
  ctx.fillText(leftText, startX, textY);

  ctx.fillStyle = CONFIG.progress.separatorColor;
  ctx.fillText(sepText, startX + leftWidth, textY);

  ctx.fillStyle = CONFIG.progress.secondaryColor;
  ctx.fillText(rightText, startX + leftWidth + sepWidth, textY);

  if (CONFIG.progress.showBar) {
    ctx.fillStyle = CONFIG.colors.progressTrack;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, barHeight / 2);
    ctx.fill();

    ctx.fillStyle = CONFIG.colors.stats;
    ctx.beginPath();
    ctx.roundRect(barX, barY, Math.max(barHeight, barWidth * percent), barHeight, barHeight / 2);
    ctx.fill();
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function writeOutputs() {
  const output = canvas.toBuffer("image/png");
  const imagesDir = path.join(__dirname, "images");
  const screenshotsDir = path.join(__dirname, "screenshots");

  ensureDir(imagesDir);
  ensureDir(screenshotsDir);

  const imagePath = path.join(imagesDir, "iphone-wallpaper.png");
  const screenshotPath = path.join(screenshotsDir, "iphone-wallpaper.png");

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

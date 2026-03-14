const fs = require("fs");
const path = require("path");

function createDateState(now = new Date()) {
  return {
    now,
    currentYear: now.getFullYear(),
    currentMonth: now.getMonth(),
    currentDay: now.getDate()
  };
}

function getProgressMetrics(dateState) {
  const startOfYear = new Date(dateState.currentYear, 0, 1);
  const endOfYear = new Date(dateState.currentYear + 1, 0, 1);
  const totalDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24);
  const daysPassed = Math.ceil((dateState.now - startOfYear) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, Math.floor(totalDays - daysPassed));
  const weeksLeft = Math.ceil(daysLeft / 7);
  const percent = Math.max(0, Math.min(1, daysPassed / totalDays));

  return {
    startOfYear,
    endOfYear,
    totalDays,
    daysPassed,
    daysLeft,
    weeksLeft,
    percent,
    percentText: Math.floor(percent * 100)
  };
}

function fillBackground(ctx, width, height, gradientColors) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, gradientColors[0]);
  gradient.addColorStop(0.5, gradientColors[1] ?? gradientColors[0]);
  gradient.addColorStop(1, gradientColors[2] ?? gradientColors[gradientColors.length - 1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function getDotDayFill(dateState, colors, highlightWeekends, year, month, day) {
  const isPast =
    year < dateState.currentYear ||
    (year === dateState.currentYear &&
      (month < dateState.currentMonth || (month === dateState.currentMonth && day < dateState.currentDay)));

  const isToday =
    year === dateState.currentYear &&
    month === dateState.currentMonth &&
    day === dateState.currentDay;

  if (isToday) {
    return { color: colors.today, alpha: 1 };
  }

  if (isPast) {
    return { color: colors.pastDay, alpha: colors.pastAlpha };
  }

  const dayOfWeek = new Date(year, month, day).getDay();
  const isWeekend = highlightWeekends && (dayOfWeek === 0 || dayOfWeek === 6);

  return {
    color: isWeekend ? colors.weekend : colors.futureDay,
    alpha: 1
  };
}

function drawDotCalendarGrid(ctx, config, dateState) {
  const layout = getDotCalendarLayout(config, dateState);
  const { dotSpacing, dotRadius, monthLabelSize, monthBlockWidth, startX, singleRowHeight, topPadding } = layout;
  const cols = config.monthsPerRow;

  for (let i = 0; i < config.monthsToShow; i++) {
    const colIndex = i % cols;
    const rowIndex = Math.floor(i / cols);
    const targetMonthIndex = config.startFromJanuary
      ? i
      : ((dateState.currentMonth + i + config.monthOffset) % 12 + 12) % 12;
    const blockX = startX + colIndex * (monthBlockWidth + layout.monthGapX);
    const blockY = topPadding + rowIndex * singleRowHeight;

    ctx.globalAlpha = 1;
    ctx.fillStyle = config.colors.text;
    ctx.font = `${layout.monthLabelWeight} ${monthLabelSize}px ${config.fontFamily}`;
    ctx.textAlign = layout.monthLabelAlign;
    ctx.textBaseline = "alphabetic";

    const monthLabelX = layout.monthLabelAlign === "center"
      ? blockX + monthBlockWidth / 2 + layout.monthLabelXOffset
      : blockX + layout.monthLabelXOffset;
    ctx.fillText(config.monthNames[targetMonthIndex], monthLabelX, blockY);

    const daysInMonth = new Date(dateState.currentYear, targetMonthIndex + 1, 0).getDate();
    const firstDayWeek = new Date(dateState.currentYear, targetMonthIndex, 1).getDay();
    const startOffset = (firstDayWeek - config.firstDayOfWeek + 7) % 7;
    const dotStartY = blockY + monthLabelSize * layout.monthLabelGapRatio;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = startOffset + day - 1;
      const gridX = dayIndex % 7;
      const gridY = Math.floor(dayIndex / 7);
      const x = blockX + gridX * dotSpacing + dotRadius;
      const y = dotStartY + gridY * dotSpacing + dotRadius;
      const fill = getDotDayFill(dateState, config.colors, config.highlightWeekends, dateState.currentYear, targetMonthIndex, day);

      ctx.globalAlpha = fill.alpha;
      ctx.fillStyle = fill.color;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function getDotCalendarLayout(config, dateState) {
  const cols = config.monthsPerRow;
  const rows = Math.ceil(config.monthsToShow / cols);
  const topPadding = config.height * config.grid.topPaddingRatio;
  const monthGapX = config.width * config.grid.monthGapXRatio;
  const monthGapY = config.height * config.grid.monthGapYRatio;
  const dotSpacing = config.width * config.grid.dotSpacingRatio;
  const dotRadius = config.width * config.grid.dotRadiusRatio;
  const monthLabelSize = config.grid.monthLabelMinPx
    ? Math.max(config.width * config.grid.monthLabelSizeRatio, config.grid.monthLabelMinPx)
    : config.width * config.grid.monthLabelSizeRatio;
  const monthLabelGapRatio = config.grid.monthLabelGapRatio ?? 1.35;
  const monthLabelWeight = config.grid.monthLabelWeight ?? 600;
  const monthLabelAlign = config.grid.monthLabelAlign ?? "center";
  const monthLabelXOffset = config.grid.monthLabelXOffsetRatio ? dotSpacing * config.grid.monthLabelXOffsetRatio : 0;

  const monthBlockWidth = dotSpacing * 6 + dotRadius * 2;
  const totalCalendarWidth = cols * monthBlockWidth + (cols - 1) * monthGapX;
  const startX = ((config.width - totalCalendarWidth) / 2) + (config.width * (config.grid.startXOffsetRatio ?? 0));
  const singleRowHeight = dotSpacing * 6 + monthLabelSize + monthGapY;
  let calendarBottom = topPadding;

  for (let i = 0; i < config.monthsToShow; i++) {
    const rowIndex = Math.floor(i / cols);
    const targetMonthIndex = config.startFromJanuary
      ? i
      : ((dateState.currentMonth + i + config.monthOffset) % 12 + 12) % 12;
    const blockY = topPadding + rowIndex * singleRowHeight;
    const daysInMonth = new Date(dateState.currentYear, targetMonthIndex + 1, 0).getDate();
    const firstDayWeek = new Date(dateState.currentYear, targetMonthIndex, 1).getDay();
    const startOffset = (firstDayWeek - config.firstDayOfWeek + 7) % 7;
    const lastIndex = startOffset + daysInMonth - 1;
    const lastGridRow = Math.floor(lastIndex / 7);
    const dotStartY = blockY + monthLabelSize * monthLabelGapRatio;
    const monthBottom = dotStartY + lastGridRow * dotSpacing + dotRadius * 2;
    calendarBottom = Math.max(calendarBottom, monthBottom);
  }

  return {
    cols,
    rows,
    topPadding,
    monthGapX,
    monthGapY,
    dotSpacing,
    dotRadius,
    monthLabelSize,
    monthLabelGapRatio,
    monthLabelWeight,
    monthLabelAlign,
    monthLabelXOffset,
    monthBlockWidth,
    totalCalendarWidth,
    startX,
    singleRowHeight,
    calendarBottom
  };
}

function drawProgressText(ctx, config, dateState) {
  if (!config.progress.show) return;

  const layout = getProgressLayout(config, dateState);
  const metrics = layout.metrics;
  const textSize = layout.textSize;
  const textY = layout.textY;

  const leftText = `${metrics.daysLeft}d left`;
  const separator = " · ";
  const middleText = `${metrics.weeksLeft}w left`;
  const rightText = `${metrics.percentText}%`;

  ctx.globalAlpha = 1;
  ctx.font = `400 ${textSize}px ${config.fontFamily}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const leftWidth = ctx.measureText(leftText).width;
  const separatorWidth = ctx.measureText(separator).width;
  const middleWidth = ctx.measureText(middleText).width;
  const rightWidth = ctx.measureText(rightText).width;
  const totalWidth = leftWidth + separatorWidth + middleWidth + separatorWidth + rightWidth;
  const startX = layout.progressStartX + ((layout.progressWidth - totalWidth) / 2);

  ctx.fillStyle = config.colors.stats;
  ctx.fillText(leftText, startX, textY);

  ctx.fillStyle = config.progress.separatorColor ?? config.colors.secondaryText;
  ctx.fillText(separator, startX + leftWidth, textY);

  ctx.fillStyle = config.progress.secondaryColor ?? config.colors.secondaryText;
  ctx.fillText(middleText, startX + leftWidth + separatorWidth, textY);
  ctx.fillText(separator, startX + leftWidth + separatorWidth + middleWidth, textY);
  ctx.fillText(rightText, startX + leftWidth + (separatorWidth * 2) + middleWidth, textY);

  if (config.progress.showBar) {
    ctx.fillStyle = config.colors.progressTrack;
    ctx.beginPath();
    ctx.roundRect(layout.barX, layout.barY, layout.barWidth, layout.barHeight, layout.barHeight / 2);
    ctx.fill();

    ctx.fillStyle = config.colors.stats;
    ctx.beginPath();
    ctx.roundRect(
      layout.barX,
      layout.barY,
      Math.max(layout.barHeight, layout.barWidth * metrics.percent),
      layout.barHeight,
      layout.barHeight / 2
    );
    ctx.fill();
  }

  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function getProgressLayout(config, dateState) {
  const metrics = getProgressMetrics(dateState);
  const textSize = config.width * config.progress.textSizeRatio;
  const bottomInset = config.progress.bottomInsetRatio
    ? config.height * config.progress.bottomInsetRatio
    : config.progress.bottomInset;
  const barHeight = config.progress.barHeight ?? 0;
  const progressWidth = config.progress.availableWidthRatio
    ? config.width * config.progress.availableWidthRatio
    : config.width;
  const progressStartX = ((config.width - progressWidth) / 2) + (config.width * (config.progress.startXOffsetRatio ?? 0));
  const barWidth = config.progress.barWidthRatio ? progressWidth * config.progress.barWidthRatio : 0;
  const barX = barWidth ? progressStartX + ((progressWidth - barWidth) / 2) : 0;
  const barY = config.height - bottomInset - barHeight;
  const textY = barHeight
    ? barY - (config.progress.textOffsetAboveBar ?? 0)
    : config.height - bottomInset;

  return {
    metrics,
    textSize,
    bottomInset,
    progressWidth,
    progressStartX,
    barHeight,
    barWidth,
    barX,
    barY,
    textY
  };
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeImage(canvas, imagePath) {
  ensureDir(path.dirname(imagePath));
  fs.writeFileSync(imagePath, canvas.toBuffer("image/png"));
  console.log(`Generated: ${imagePath}`);
}

module.exports = {
  createDateState,
  drawDotCalendarGrid,
  getDotCalendarLayout,
  drawProgressText,
  ensureDir,
  fillBackground,
  getDotDayFill,
  getProgressLayout,
  getProgressMetrics,
  writeImage
};

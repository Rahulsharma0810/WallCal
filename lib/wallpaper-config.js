function assertNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid config: ${label} must be a positive number`);
  }
}

function assertBoolean(value, label) {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid config: ${label} must be a boolean`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid config: ${label} must be a non-empty string`);
  }
}

function validateWallpaperConfig(config) {
  assertNumber(config.width, "width");
  assertNumber(config.height, "height");
  assertNumber(config.monthsToShow, "monthsToShow");
  assertNumber(config.monthsPerRow, "monthsPerRow");
  assertNumber(config.firstDayOfWeek + 1, "firstDayOfWeek");
  assertBoolean(config.startFromJanuary, "startFromJanuary");
  assertBoolean(config.highlightWeekends, "highlightWeekends");
  assertString(config.outputName, "outputName");

  if (!Array.isArray(config.gradientColors) || config.gradientColors.length < 2) {
    throw new Error("Invalid config: gradientColors must contain at least two colors");
  }

  if (!config.colors || typeof config.colors !== "object") {
    throw new Error("Invalid config: colors must be an object");
  }

  if (!config.grid || typeof config.grid !== "object") {
    throw new Error("Invalid config: grid must be an object");
  }

  const gridNumberKeys = [
    "topPaddingRatio",
    "monthGapYRatio",
    "monthGapXRatio",
    "monthLabelSizeRatio",
    "dotSpacingRatio",
    "dotRadiusRatio"
  ];

  for (const key of gridNumberKeys) {
    assertNumber(config.grid[key], `grid.${key}`);
  }

  if (config.grid.monthLabelMinPx != null) {
    assertNumber(config.grid.monthLabelMinPx, "grid.monthLabelMinPx");
  }

  if (config.grid.monthLabelGapRatio != null) {
    assertNumber(config.grid.monthLabelGapRatio, "grid.monthLabelGapRatio");
  }

  if (!config.progress || typeof config.progress !== "object") {
    throw new Error("Invalid config: progress must be an object");
  }

  assertBoolean(config.progress.show, "progress.show");
  assertNumber(config.progress.textSizeRatio, "progress.textSizeRatio");

  if (config.progress.bottomInset != null) {
    assertNumber(config.progress.bottomInset, "progress.bottomInset");
  }

  if (config.progress.bottomInsetRatio != null) {
    assertNumber(config.progress.bottomInsetRatio, "progress.bottomInsetRatio");
  }

  return config;
}

module.exports = {
  validateWallpaperConfig
};

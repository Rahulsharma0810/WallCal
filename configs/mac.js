const { BACKGROUND_GRADIENT, SHARED_COLORS, FONT_FAMILY } = require("../lib/wallpaper-theme");

module.exports = {
  width: 3456,
  height: 2234,
  outputName: "mac-wallpaper.png",
  monthsToShow: 12,
  monthsPerRow: 4,
  startFromJanuary: true,
  monthOffset: 0,
  firstDayOfWeek: 1,
  highlightWeekends: true,
  gradientColors: BACKGROUND_GRADIENT,
  grid: {
    topPaddingRatio: 0.26,
    monthGapYRatio: 0.02,
    monthGapXRatio: 0.05,
    monthLabelSizeRatio: 0.018,
    monthLabelMinPx: 42,
    monthLabelGapRatio: 1.12,
    dotSpacingRatio: 0.0138,
    dotRadiusRatio: 0.0035
  },
  progress: {
    show: true,
    textSizeRatio: 0.018,
    bottomInsetRatio: 0.18
  },
  colors: SHARED_COLORS,
  fontFamily: FONT_FAMILY
};

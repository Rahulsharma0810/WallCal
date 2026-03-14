const { BACKGROUND_GRADIENT, SHARED_COLORS, FONT_FAMILY } = require("../lib/wallpaper-theme");

module.exports = {
  width: 1640,
  height: 2360,
  outputName: "ipad-air-11-wallpaper.png",
  monthsToShow: 12,
  monthsPerRow: 3,
  monthOffset: 0,
  startFromJanuary: true,
  firstDayOfWeek: 1,
  highlightWeekends: true,
  gradientColors: BACKGROUND_GRADIENT,
  grid: {
    topPaddingRatio: 0.23,
    monthGapYRatio: 0.026,
    monthGapXRatio: 0.06,
    monthLabelSizeRatio: 0.029,
    monthLabelMinPx: 42,
    monthLabelGapRatio: 1.18,
    dotSpacingRatio: 0.028,
    dotRadiusRatio: 0.0067
  },
  progress: {
    show: true,
    textSizeRatio: 0.029,
    bottomInsetRatio: 0.091,
    textOffsetAboveBar: 0
  },
  colors: SHARED_COLORS,
  fontFamily: FONT_FAMILY
};

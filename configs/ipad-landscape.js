const { BACKGROUND_GRADIENT, SHARED_COLORS, FONT_FAMILY } = require("../lib/wallpaper-theme");

module.exports = {
  width: 2360,
  height: 1640,
  outputName: "ipad-air-11-wallpaper-landscape.png",
  monthsToShow: 12,
  monthsPerRow: 4,
  monthOffset: 0,
  startFromJanuary: true,
  firstDayOfWeek: 1,
  highlightWeekends: true,
  gradientColors: BACKGROUND_GRADIENT,
  grid: {
    topPaddingRatio: 0.2,
    monthGapYRatio: 0.05,
    monthGapXRatio: 0.055,
    monthLabelSizeRatio: 0.019,
    monthLabelMinPx: 30,
    monthLabelGapRatio: 1.32,
    dotSpacingRatio: 0.018,
    dotRadiusRatio: 0.0046
  },
  progress: {
    show: true,
    textSizeRatio: 0.022,
    bottomInsetRatio: 0.096
  },
  colors: SHARED_COLORS,
  fontFamily: FONT_FAMILY
};

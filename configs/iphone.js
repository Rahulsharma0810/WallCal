const { BACKGROUND_GRADIENT, SHARED_COLORS } = require("../lib/wallpaper-theme");

module.exports = {
  width: 1290,
  height: 2796,
  outputName: "iphone-wallpaper.png",
  monthsToShow: 12,
  monthsPerRow: 3,
  monthOffset: 0,
  startFromJanuary: true,
  firstDayOfWeek: 1,
  highlightWeekends: true,
  gradientColors: BACKGROUND_GRADIENT,
  grid: {
    topPaddingRatio: 0.395,
    sidePaddingRatio: 0.11,
    monthGapYRatio: 0.02,
    monthGapXRatio: 0.088,
    monthLabelSizeRatio: 0.045,
    monthLabelGapRatio: 1.35,
    monthLabelWeight: 400,
    monthLabelAlign: "left",
    monthLabelXOffsetRatio: -0.1,
    dotSpacingRatio: 0.0235,
    dotRadiusRatio: 0.0066
  },
  progress: {
    show: true,
    textSizeRatio: 0.05,
    barWidthRatio: 0.58,
    barHeight: 7,
    bottomInset: 360,
    textOffsetAboveBar: 20,
    showBar: false,
    secondaryColor: SHARED_COLORS.secondaryText,
    separatorColor: SHARED_COLORS.secondaryText
  },
  colors: {
    ...SHARED_COLORS,
    progressTrack: "rgba(142,142,147,0.35)"
  }
};

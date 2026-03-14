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
    topPaddingRatio: 0.355,
    sidePaddingRatio: 0.11,
    monthGapYRatio: 0.03,
    monthGapXRatio: 0.088,
    monthLabelSizeRatio: 0.055,
    monthLabelGapRatio: 1.35,
    monthLabelWeight: 400,
    monthLabelAlign: "left",
    monthLabelXOffsetRatio: -0.1,
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
    secondaryColor: SHARED_COLORS.secondaryText,
    separatorColor: SHARED_COLORS.secondaryText
  },
  colors: {
    ...SHARED_COLORS,
    progressTrack: "rgba(142,142,147,0.35)"
  }
};

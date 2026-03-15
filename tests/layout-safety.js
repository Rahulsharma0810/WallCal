const assert = require("assert");
const iphoneConfig = require("../configs/iphone");
const ipadPortraitConfig = require("../configs/ipad-portrait");
const ipadLandscapeConfig = require("../configs/ipad-landscape");
const { MONTH_NAMES, FONT_FAMILY } = require("../lib/wallpaper-theme");
const { validateWallpaperConfig } = require("../lib/wallpaper-config");
const { createDateState, getDotCalendarLayout, getProgressLayout } = require("../lib/wallpaper-renderer");

const dateState = createDateState();

const cases = [
  {
    name: "iphone",
    config: validateWallpaperConfig({ ...iphoneConfig, monthNames: MONTH_NAMES, fontFamily: FONT_FAMILY }),
    minTopPadding: 0,
    minGapBetweenCalendarAndProgress: 80,
    minBottomSafeArea: 180
  },
  {
    name: "ipad portrait",
    config: validateWallpaperConfig({ ...ipadPortraitConfig, monthNames: MONTH_NAMES }),
    minTopPadding: 0,
    minGapBetweenCalendarAndProgress: 100,
    minBottomSafeArea: 190
  },
  {
    name: "ipad landscape",
    config: validateWallpaperConfig({ ...ipadLandscapeConfig, monthNames: MONTH_NAMES }),
    minTopPadding: 470,
    minGapBetweenCalendarAndProgress: 55,
    minBottomSafeArea: 130
  }
];

for (const testCase of cases) {
  const calendar = getDotCalendarLayout(testCase.config, dateState);
  const progress = getProgressLayout(testCase.config, dateState);

  const progressTop = progress.textY - progress.textSize / 2;
  const progressBottom = progress.textY + progress.textSize / 2;
  const gap = progressTop - calendar.calendarBottom;
  const bottomSafeArea = testCase.config.height - progressBottom;
  const topPadding = calendar.topPadding;

  assert.ok(
    topPadding >= testCase.minTopPadding,
    `${testCase.name}: calendar sits too high for top safe area (topPadding=${topPadding.toFixed(1)})`
  );

  assert.ok(
    gap >= testCase.minGapBetweenCalendarAndProgress,
    `${testCase.name}: progress text overlaps or is too close to calendar (gap=${gap.toFixed(1)})`
  );

  assert.ok(
    bottomSafeArea >= testCase.minBottomSafeArea,
    `${testCase.name}: progress text sits too low for dock-safe space (bottomSafeArea=${bottomSafeArea.toFixed(1)})`
  );
}

console.log("Layout safety checks passed for iPhone and iPad wallpapers.");

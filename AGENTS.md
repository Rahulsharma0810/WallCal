# Wallpaper Safe Areas

This repo generates wallpapers for multiple platforms. Keep device dimensions and lock-screen or login-screen safe areas in mind when changing layout values.

## Device Dimensions

- iPhone wallpaper: `1290x2796`
- iPad Air 11" portrait wallpaper: `1640x2360`
- iPad Air 11" landscape wallpaper: `2360x1640`
- Mac wallpaper: `3456x2234`

## Safe-Area Rules

- iPhone lock screen:
  - Keep the calendar below the widget stack.
  - Keep the status text above the flashlight and camera controls.
- iPad Air 11" portrait:
  - Keep the calendar clear of the dock area.
  - Keep the status text above the dock-safe zone.
- iPad Air 11" landscape:
  - Keep the first calendar row below the large lock-screen clock area.
  - Keep the calendar horizontally centered.
  - Keep the status text above the bottom page indicators and controls.
- Mac login screen:
  - Keep the first calendar row below the centered clock and date.
  - Keep the status text above the user avatar and username area.
  - Avoid placing content where legal or management text may appear in the lower-middle area.

## Test Expectations

`tests/layout-safety.js` guards these layout constraints with minimum top padding, calendar-to-status spacing, and bottom safe area checks.

When tuning layouts:

- Update tests with any new safe-area constraints before pushing.
- Regenerate wallpapers and run `npm test`.
- Compare the rendered image against the real platform UI, not just the raw PNG.

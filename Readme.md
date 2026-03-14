#  MacBook Dynamic Calendar Wallpaper

[![Generate Wallpaper](https://github.com/rahulvsharma/WallPaper/actions/workflows/generate-wallpaper.yml/badge.svg)](https://github.com/rahulvsharma/WallPaper/actions/workflows/generate-wallpaper.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

A high-resolution, minimal dynamic wallpaper for macOS. It features a full-year calendar with automated "spent" date greying, year progress tracking, and optimized layout to clear the macOS lock screen clock and UI.

---

## 🎨 Preview

![MacBook Wallpaper Preview](images/mac-wallpaper.png)

---

## ✨ Features

- **Daily Automation**: GitHub Actions generates the latest wallpaper every night before 00:00 UTC.
- **Smart Calendar**: Automatically highlights today's date and "greys out" past months and days.
- **Year Progress**: A subtle progress bar showing the percentage of the current year completed.
- **Retina Ready**: High-resolution output optimized for MacBook Pro 14/16" screens.
- **Zero Dependencies (Local)**: No external APIs like Unsplash; uses pure `node-canvas` for speed and reliability.
- **Lock Screen Compatible**: Specifically aligned to sit perfectly between the clock and login profile on macOS.

---

## 🚀 Usage

### 1. Manual Generation (Local)
Requires [Node.js](https://nodejs.org/) and `npm`.

```bash
git clone https://github.com/rahulvsharma/WallPaper.git
cd WallPaper
npm install
node mac-wallpaper.js
```

### 2. Automatic Pull (macOS Shortcuts)
You can set up a macOS Shortcut to pull the latest generated image from this repo's raw URL every morning at 00:00:
- **URL**: `https://raw.githubusercontent.com/[USER]/WallPaper/main/images/mac-wallpaper.png`
- **Action**: Get contents of URL → Set Wallpaper

---

## 🛠 Configuration

Edit `mac-wallpaper.js` to customize colors, fonts, or layout:

```javascript
const CONFIG = {
  WIDTH: 3456,
  HEIGHT: 2234,
  BG_COLOR_START: "#1c1c1e",
  BG_COLOR_END: "#2c2c2e",
  // ... more settings
};
```

---

## 📅 Roadmap

- [x] **macOS**: Full-year calendar with year progress.
- [ ] **iPhone**: Vertical layout optimized for iOS widgets/lockscreen.
- [ ] **iPad**: Tablet-optimized landscape/portrait grid.
- [ ] **Custom Themes**: Support for light mode and varied gradients.

---

## 📝 License

MIT © [Rahul Sharma](https://github.com/rahulvsharma)

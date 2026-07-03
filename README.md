# Retro MP4 Player

A lightweight desktop MP4 video player built with **Electron**, featuring a nostalgic early-2000s glossy 3D interface inspired by classic media players.

## Features

* MP4 video playback
* Drag & Drop support
* Open video from file
* Play / Pause / Stop
* Frame-by-frame navigation
* Seek timeline
* Volume & Mute controls
* Fullscreen mode
* Double-click for fullscreen
* Automatic `.srt` subtitle detection
* Subtitle enable/disable
* Subtitle delay adjustment
* Subtitle size, color, and position controls
* Retro 2000s glossy UI

## Folder Structure

```text
retro-player/
├── package.json
├── main.js
├── index.html
├── style.css
├── renderer.js
└── node_modules/
```

## Requirements

* Node.js 18+
* npm

## Installation

```bash
git clone <repository-url>
cd retro-player
npm install
```

## Run

```bash
npm start
```

If Electron shows a sandbox error on Linux:

```bash
sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
npm start
```

## Supported Formats

* Video: `.mp4`
* Subtitles: `.srt`

Place the subtitle file in the same folder as the video with the same filename.

Example:

```text
Movie.mp4
Movie.srt
```

The subtitles will load automatically nor else upload provided
AND ONLY MP4 FILES NO OTHER FILES DRAG AND DROP MP4 FILES or https://frutige-mp4.vercel.app/ but not completely working 

## License

MIT

